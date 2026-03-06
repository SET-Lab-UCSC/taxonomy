import Papa from "papaparse";
import Chart from "chart.js/auto";

let currentChart = null;
let allObservations = [];
let allInputs = [];
let allTasks = [];
let allInterfaceElements = [];
let allFeedback = [];
let techniqueApplications = {}; // Store applications for each technique
let currentFilters = {
    inputs: [],
    tasks: [],
    interfaceElements: [],
    feedback: []
};

/**
 * Load CSV files
 */
async function loadObservationsCSV() {
    const basePath = import.meta.env.BASE_URL || '/';
    const fileName = "Taxonomy Observations - Observations.csv";
    const paths = [`./${fileName}`, `${basePath}${fileName}`, `/${fileName}`];

    for (const path of paths) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                const csvText = await response.text();
                const parsed = Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    transformHeader: (h) => h.trim()
                });
                return parsed.data;
            }
        } catch (e) {
            continue;
        }
    }
    throw new Error("Failed to load observations");
}

/**
 * Extract unique values from a field
 */
function getUniqueValues(data, fieldName) {
    const values = new Set();
    data.forEach(item => {
        if (item[fieldName] && item[fieldName].trim()) {
            const entries = item[fieldName].split(',').map(v => v.trim()).filter(v => v);
            entries.forEach(e => values.add(e));
        }
    });
    return Array.from(values).sort();
}

/**
 * Check if observation matches current filters
 */
function matchesFilters(observation) {
    const hasInputFilter = currentFilters.inputs.length > 0;
    const hasTaskFilter = currentFilters.tasks.length > 0;
    const hasElementFilter = currentFilters.interfaceElements.length > 0;
    const hasFeedbackFilter = currentFilters.feedback.length > 0;

    if (hasInputFilter) {
        const obsInputs = (observation.Input || "").split(',').map(v => v.trim()).filter(v => v);
        if (!currentFilters.inputs.some(f => obsInputs.includes(f))) return false;
    }

    if (hasTaskFilter) {
        const obsTasks = (observation.Task || "").split(',').map(v => v.trim()).filter(v => v);
        if (!currentFilters.tasks.some(f => obsTasks.includes(f))) return false;
    }

    if (hasElementFilter) {
        const obsElements = (observation.Interface_Element || "").split(',').map(v => v.trim()).filter(v => v);
        if (!currentFilters.interfaceElements.some(f => obsElements.includes(f))) return false;
    }

    if (hasFeedbackFilter) {
        const obsFeedback = (observation.Feedback || "").split(',').map(v => v.trim()).filter(v => v);
        if (!currentFilters.feedback.some(f => obsFeedback.includes(f))) return false;
    }

    // If no filters are active, match all
    if (!hasInputFilter && !hasTaskFilter && !hasElementFilter && !hasFeedbackFilter) return true;

    return true;
}

/**
 * Calculate interaction technique frequencies based on current filters
 */
function calculateTechniqueFrequencies() {
    const frequencies = {};
    techniqueApplications = {}; // Reset applications mapping

    allObservations.forEach(obs => {
        if (!matchesFilters(obs)) return;

        const techniques = (obs.Interaction_Technique || "").split(',').map(v => v.trim()).filter(v => v);
        const application = (obs.Application || "").trim();

        techniques.forEach(technique => {
            frequencies[technique] = (frequencies[technique] || 0) + 1;

            // Track applications for each technique
            if (!techniqueApplications[technique]) {
                techniqueApplications[technique] = new Set();
            }
            if (application) {
                techniqueApplications[technique].add(application);
            }
        });
    });

    // Sort by frequency (descending)
    const sorted = Object.entries(frequencies)
        .sort((a, b) => b[1] - a[1])
        .reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});

    return sorted;
}

/**
 * Render/update the bar chart
 */
function renderChart() {
    const frequencies = calculateTechniqueFrequencies();
    const labels = Object.keys(frequencies);
    const data = Object.values(frequencies);

    const ctx = document.getElementById("techniquesChart");
    if (!ctx) return;

    // Destroy previous chart if it exists
    if (currentChart) {
        currentChart.destroy();
    }

    currentChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Frequency",
                    data: data,
                    backgroundColor: "rgba(255, 206, 123, 0.8)",
                    borderColor: "rgba(206, 55, 53, 1)",
                    borderWidth: 2,
                    borderRadius: 4,
                    hoverBackgroundColor: "rgba(206, 55, 53, 0.8)"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const element = elements[0];
                    const technique = currentChart.data.labels[element.index];
                    const frequency = currentChart.data.datasets[0].data[element.index];
                    const applications = techniqueApplications[technique] || new Set();

                    showTechniquesModal(technique, frequency, applications);
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: "top"
                },
                tooltip: {
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 12 },
                    borderColor: "rgba(206, 55, 53, 1)",
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        title: (context) => {
                            return context[0].label;
                        },
                        label: () => {
                            return ""; // Empty label to avoid default "Frequency: X"
                        },
                        afterLabel: (context) => {
                            const technique = context.label;
                            const frequency = context.parsed.y;
                            const applications = techniqueApplications[technique] || new Set();

                            let text = `Frequency: ${frequency}\n\nApplications:\n`;
                            if (applications.size > 0) {
                                text += Array.from(applications).sort().join('\n');
                            } else {
                                text += "No applications found";
                            }

                            return text;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    },
                    title: {
                        display: true,
                        text: "Frequency"
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: "Interaction Techniques"
                    }
                }
            }
        }
    });
}

/**
 * Initialize filter buttons
 */
function initializeFilters() {
    const filterContainer = document.getElementById("filterContainer");
    if (!filterContainer) return;

    // Create filter sections
    const filterSections = [
        {
            name: "Inputs",
            key: "inputs",
            values: allInputs
        },
        {
            name: "Tasks",
            key: "tasks",
            values: allTasks
        },
        {
            name: "Interface Elements",
            key: "interfaceElements",
            values: allInterfaceElements
        },
        {
            name: "Feedback",
            key: "feedback",
            values: allFeedback
        }
    ];

    filterContainer.innerHTML = "Filter:";

    filterSections.forEach(section => {
        const dropdownDiv = document.createElement("div");
        dropdownDiv.className = "filter-dropdown";

        // Create dropdown button
        const button = document.createElement("button");
        button.className = "dropdown-btn";
        button.textContent = section.name;
        button.setAttribute("aria-expanded", "false");

        // Create dropdown menu
        const menu = document.createElement("div");
        menu.className = "dropdown-menu";
        menu.style.display = "none";

        section.values.forEach(value => {
            const option = document.createElement("label");
            option.className = "dropdown-option";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = value;
            checkbox.addEventListener("change", () => {
                toggleFilter(section.key, value, checkbox);
            });

            const label = document.createElement("span");
            label.textContent = value;

            option.appendChild(checkbox);
            option.appendChild(label);
            menu.appendChild(option);
        });

        // Toggle menu on button click
        button.addEventListener("click", (e) => {
            e.stopPropagation();
            const isOpen = menu.style.display !== "none";
            menu.style.display = isOpen ? "none" : "block";
            button.setAttribute("aria-expanded", !isOpen);
        });

        dropdownDiv.appendChild(button);
        dropdownDiv.appendChild(menu);
        filterContainer.appendChild(dropdownDiv);
    });

    // Close dropdowns when clicking outside
    document.addEventListener("click", () => {
        document.querySelectorAll(".dropdown-menu").forEach(menu => {
            menu.style.display = "none";
        });
        document.querySelectorAll(".dropdown-btn").forEach(btn => {
            btn.setAttribute("aria-expanded", "false");
        });
    });
}

/**
 * Toggle filter selection
 */
function toggleFilter(filterKey, value, checkboxElement) {
    const filterArray = currentFilters[filterKey];
    const index = filterArray.indexOf(value);

    if (index > -1) {
        filterArray.splice(index, 1);
        checkboxElement.checked = false;
    } else {
        filterArray.push(value);
        checkboxElement.checked = true;
    }

    renderChart();
}

/**
 * Display the techniques modal
 */
function showTechniquesModal(technique, frequency, applications) {
    const modal = document.getElementById("techniquesModal");
    if (!modal) return;

    document.getElementById("modalTechniqueName").textContent = technique;
    document.getElementById("modalFrequency").textContent = `Frequency: ${frequency}`;

    const appsList = document.getElementById("modalApplicationsList");
    appsList.innerHTML = "<h3>Applications:</h3>";

    if (applications.size > 0) {
        const ul = document.createElement("ul");
        Array.from(applications)
            .sort()
            .forEach(app => {
                const li = document.createElement("li");
                li.textContent = app;
                ul.appendChild(li);
            });
        appsList.appendChild(ul);
    } else {
        const p = document.createElement("p");
        p.textContent = "No applications found";
        appsList.appendChild(p);
    }

    modal.classList.remove("hidden");
}

/**
 * Initialize modal close handlers
 */
function initializeModalHandlers() {
    const modal = document.getElementById("techniquesModal");
    const closeBtn = document.getElementById("closeTechniquesModal");

    if (!modal || !closeBtn) return;

    closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    // Close modal when clicking outside the modal content
    modal.addEventListener("click", (e) => {
        if (e.target.id === "techniquesModal") {
            modal.classList.add("hidden");
        }
    });
}

/**
 * Initialize the chart with data
 */
export async function initInteractionTechniquesChart() {
    try {
        console.log("Loading interaction techniques data...");

        allObservations = await loadObservationsCSV();
        allInputs = getUniqueValues(allObservations, "Input");
        allTasks = getUniqueValues(allObservations, "Task");
        allInterfaceElements = getUniqueValues(allObservations, "Interface_Element");
        allFeedback = getUniqueValues(allObservations, "Feedback");

        console.log("✓ Data loaded");
        console.log("Inputs:", allInputs);
        console.log("Tasks:", allTasks);
        console.log("Interface Elements:", allInterfaceElements);
        console.log("Feedback:", allFeedback);

        initializeFilters();
        initializeModalHandlers();
        renderChart();
    } catch (error) {
        console.error("Error initializing chart:", error);
        const container = document.getElementById("chartContainer");
        if (container) {
            container.innerHTML = `<div style="color: #dc2626; padding: 2rem; text-align: center;">
                <p>Error loading data. Check console for details.</p>
            </div>`;
        }
    }
}
