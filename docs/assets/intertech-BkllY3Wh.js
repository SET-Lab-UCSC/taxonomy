import "./modulepreload-polyfill-DaKOjhqt.js";
/* empty css                */
import { l as loadObsAsJson, e as loadTechAsJson } from "./csvtojson-CHK6WrLd.js";
document.addEventListener("DOMContentLoaded", async () => {
  const obsSubmissions = await loadObsAsJson();
  const techSubmissions = await loadTechAsJson();
  const submissions = Object.assign({}, obsSubmissions, techSubmissions);
  console.log(typeof obsSubmissions);
  console.log(typeof submissions);
  const list = document.getElementById("csv-list");
  const elements = [];
  techSubmissions.forEach((row) => {
    elements.push(row.Interaction_Technique);
  });
  const uniqueElements = [...new Set(elements)];
  uniqueElements.forEach((value) => {
    const li = document.createElement("li");
    li.classList.add("interaction-element");
    li.textContent = value;
    list.appendChild(li);
  });
  document.querySelectorAll(".interaction-element").forEach((element, index) => {
    element.addEventListener("click", () => {
      const submission = submissions[index];
      console.log(submission);
      document.getElementById("modal-meta").innerHTML = `
                        <p><strong>Name:</strong> ${submission.Interaction_Technique}</p>
                        <p><strong>Description:</strong> ${submission.Description || "No description"}</p>
                    
                        `;
      document.getElementById("gif-modal").classList.remove("hidden");
    });
    document.getElementById("close-modal").addEventListener("click", () => {
      document.getElementById("gif-modal").classList.add("hidden");
    });
    document.getElementById("gif-modal").addEventListener("click", (e) => {
      if (e.target.id === "gif-modal") {
        document.getElementById("gif-modal").classList.add("hidden");
      }
    });
  });
});
//# sourceMappingURL=intertech-BkllY3Wh.js.map
