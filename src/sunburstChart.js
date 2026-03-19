import Papa from "papaparse";

const FIELD_ORDER = [
  { key: "Input", label: "Input" },
  { key: "Feedback", label: "Feedback" },
  { key: "Application", label: "Application" },
  { key: "Task", label: "Task" },
  { key: "Interface_Element", label: "Interface Element" },
  { key: "Interaction_Technique", label: "Interaction Technique" },
];

const BASE_COLORS = [
  "#FFCE7B",
  "#E98708",
  "#CD3735",
  "#F59E0B",
  "#DC2626",
  "#B91C1C",
  "#FB923C",
  "#FBBF24",
];

function splitValues(value) {
  if (!value || !value.trim()) return ["Unspecified"];
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function createNode(name, levelKey = "") {
  return {
    name,
    levelKey,
    count: 0,
    childrenMap: new Map(),
    children: [],
  };
}

function addPath(root, valuesByLevel) {
  let currentNode = root;
  currentNode.count += 1;

  valuesByLevel.forEach((item) => {
    const nodeKey = `${item.levelKey}::${item.value}`;
    if (!currentNode.childrenMap.has(nodeKey)) {
      currentNode.childrenMap.set(
        nodeKey,
        createNode(item.value, item.levelKey),
      );
    }

    currentNode = currentNode.childrenMap.get(nodeKey);
    currentNode.count += 1;
  });
}

function finalizeTree(node) {
  node.children = Array.from(node.childrenMap.values()).sort(
    (leftNode, rightNode) => rightNode.count - leftNode.count,
  );
  node.children.forEach(finalizeTree);
  delete node.childrenMap;
  return node;
}

function buildHierarchy(observations) {
  const root = createNode("Observations", "Root");

  observations.forEach((observation) => {
    const levelValues = FIELD_ORDER.map((field) => {
      const values = splitValues(observation[field.key]);
      return values.map((value) => ({ levelKey: field.label, value }));
    });

    const combinations = levelValues.reduce(
      (accumulator, currentLevel) => {
        const nextPaths = [];
        accumulator.forEach((currentPath) => {
          currentLevel.forEach((entry) => {
            nextPaths.push([...currentPath, entry]);
          });
        });
        return nextPaths;
      },
      [[]],
    );

    combinations.forEach((path) => addPath(root, path));
  });

  return finalizeTree(root);
}

async function loadObservationsCSV() {
  const basePath = import.meta.env.BASE_URL || "/";
  const fileName = "Taxonomy Observations - Observations.csv";
  const paths = [`./${fileName}`, `${basePath}${fileName}`, `/${fileName}`];

  for (const path of paths) {
    try {
      const response = await fetch(path);
      if (!response.ok) continue;

      const csvText = await response.text();
      const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
      });

      return parsed.data;
    } catch (_error) {
      continue;
    }
  }

  throw new Error("Failed to load observations CSV for sunburst chart.");
}

function hexToRgb(hexColor) {
  const hex = hexColor.replace("#", "");
  const parsed = parseInt(hex, 16);
  return {
    red: (parsed >> 16) & 255,
    green: (parsed >> 8) & 255,
    blue: parsed & 255,
  };
}

function rgba(hexColor, alpha) {
  const { red, green, blue } = hexToRgb(hexColor);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function polarToCartesian(centerX, centerY, radius, angle) {
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
}

function describeArcPath(
  centerX,
  centerY,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
) {
  const startOuter = polarToCartesian(
    centerX,
    centerY,
    outerRadius,
    startAngle,
  );
  const endOuter = polarToCartesian(centerX, centerY, outerRadius, endAngle);
  const startInner = polarToCartesian(
    centerX,
    centerY,
    innerRadius,
    startAngle,
  );
  const endInner = polarToCartesian(centerX, centerY, innerRadius, endAngle);

  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}`,
    "Z",
  ].join(" ");
}

function assignAngles(
  node,
  startAngle,
  endAngle,
  depth,
  segments,
  parentColor,
) {
  if (depth > 0) {
    segments.push({
      node,
      depth,
      startAngle,
      endAngle,
      parentColor,
    });
  }

  if (!node.children || !node.children.length || node.count === 0) return;

  let runningAngle = startAngle;
  node.children.forEach((childNode, index) => {
    const ratio = childNode.count / node.count;
    const angleSpan = (endAngle - startAngle) * ratio;
    const childStart = runningAngle;
    const childEnd = runningAngle + angleSpan;

    const topColor =
      depth === 0 ? BASE_COLORS[index % BASE_COLORS.length] : parentColor;
    assignAngles(
      childNode,
      childStart,
      childEnd,
      depth + 1,
      segments,
      topColor,
    );

    runningAngle = childEnd;
  });
}

function buildBreadcrumb(segment) {
  const ancestors = [];
  let current = segment.node;

  while (current && current.parent) {
    ancestors.push(`${current.levelKey}: ${current.name}`);
    current = current.parent;
  }

  return ancestors.reverse().join(" → ");
}

function attachParents(node, parent = null) {
  node.parent = parent;
  if (node.children) {
    node.children.forEach((childNode) => attachParents(childNode, node));
  }
}

function createSunburstTooltip(svgElement) {
  const wrapper = svgElement.parentElement;
  if (!wrapper) return null;

  const tooltip = document.createElement("div");
  tooltip.className = "sunburst-tooltip";
  wrapper.appendChild(tooltip);
  return tooltip;
}

function positionTooltip(tooltip, svgElement, event) {
  const wrapperRect = svgElement.parentElement.getBoundingClientRect();
  const offsetX = event.clientX - wrapperRect.left + 12;
  const offsetY = event.clientY - wrapperRect.top + 12;

  tooltip.style.left = `${offsetX}px`;
  tooltip.style.top = `${offsetY}px`;
}

function renderSunburst(svgElement, rootNode) {
  const width = 760;
  const height = 760;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxDepth = FIELD_ORDER.length;
  const innerBaseRadius = 70;
  const maxRadius = 350;
  const ringWidth = (maxRadius - innerBaseRadius) / maxDepth;

  svgElement.innerHTML = "";
  svgElement.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svgElement.setAttribute("role", "img");
  svgElement.setAttribute(
    "aria-label",
    "Sunburst chart of XR taxonomy observations",
  );

  const existingTooltip = svgElement.parentElement?.querySelector(".sunburst-tooltip");
  if (existingTooltip) existingTooltip.remove();
  const tooltip = createSunburstTooltip(svgElement);

  attachParents(rootNode, null);

  const segments = [];
  assignAngles(
    rootNode,
    -Math.PI / 2,
    Math.PI * 1.5,
    0,
    segments,
    BASE_COLORS[0],
  );

  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgElement.appendChild(group);

  segments.forEach((segment) => {
    const innerRadius = innerBaseRadius + (segment.depth - 1) * ringWidth;
    const outerRadius = innerRadius + ringWidth;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const alpha = Math.max(0.35, 0.9 - (segment.depth - 1) * 0.1);
    const fillColor = rgba(segment.parentColor, alpha);

    path.setAttribute(
      "d",
      describeArcPath(
        centerX,
        centerY,
        innerRadius,
        outerRadius,
        segment.startAngle,
        segment.endAngle,
      ),
    );
    path.setAttribute("fill", fillColor);
    path.setAttribute("stroke", "#ffffff");
    path.setAttribute("stroke-width", "1");
    path.style.cursor = "pointer";

    path.addEventListener("mouseenter", (event) => {
      path.setAttribute("opacity", "1");
      path.setAttribute("stroke-width", "2");

      if (!tooltip) return;
      tooltip.style.display = "block";
      tooltip.textContent = `${buildBreadcrumb(segment)} — Count: ${segment.node.count}`;
      positionTooltip(tooltip, svgElement, event);
    });

    path.addEventListener("mousemove", (event) => {
      if (!tooltip) return;
      positionTooltip(tooltip, svgElement, event);
    });

    path.addEventListener("mouseleave", () => {
      path.setAttribute("opacity", "0.95");
      path.setAttribute("stroke-width", "1");
      if (tooltip) tooltip.style.display = "none";
    });

    path.setAttribute("opacity", "0.95");
    group.appendChild(path);
  });

  const centerCircle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );
  centerCircle.setAttribute("cx", String(centerX));
  centerCircle.setAttribute("cy", String(centerY));
  centerCircle.setAttribute("r", String(innerBaseRadius - 2));
  centerCircle.setAttribute("fill", "#ffffff");
  centerCircle.setAttribute("stroke", "#e5e7eb");
  centerCircle.setAttribute("stroke-width", "2");
  group.appendChild(centerCircle);

  const centerLabel = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text",
  );
  centerLabel.setAttribute("x", String(centerX));
  centerLabel.setAttribute("y", String(centerY - 5));
  centerLabel.setAttribute("text-anchor", "middle");
  centerLabel.setAttribute("font-size", "16");
  centerLabel.setAttribute("font-weight", "700");
  centerLabel.setAttribute("fill", "#374151");
  centerLabel.textContent = "Input";
  group.appendChild(centerLabel);

  const subLabel = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text",
  );
  subLabel.setAttribute("x", String(centerX));
  subLabel.setAttribute("y", String(centerY + 16));
  subLabel.setAttribute("text-anchor", "middle");
  subLabel.setAttribute("font-size", "12");
  subLabel.setAttribute("fill", "#6b7280");
  subLabel.textContent = `Observations: ${rootNode.count}`;
  group.appendChild(subLabel);
}

export async function initInputSunburstChart() {
  const chartContainer = document.getElementById("sunburstChart");
  const loadingContainer = document.getElementById("sunburstLoading");

  if (!chartContainer || !loadingContainer) return;

  try {
    loadingContainer.textContent = "Loading sunburst data...";
    const observations = await loadObservationsCSV();
    const hierarchy = buildHierarchy(observations);

    renderSunburst(chartContainer, hierarchy);
    loadingContainer.textContent = "";
  } catch (error) {
    console.error("Failed to initialize sunburst chart:", error);
    loadingContainer.textContent =
      "Error loading sunburst chart data. Check console for details.";
  }
}
