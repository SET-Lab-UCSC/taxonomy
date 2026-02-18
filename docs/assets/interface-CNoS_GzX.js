import "./modulepreload-polyfill-DaKOjhqt.js";
/* empty css                */
import { l as loadObsAsJson, d as loadFaceAsJson } from "./csvtojson-CHK6WrLd.js";
document.addEventListener("DOMContentLoaded", async () => {
  const obsSubmissions = await loadObsAsJson();
  const faceSumissions = await loadFaceAsJson();
  const submissions = Object.assign({}, obsSubmissions, faceSumissions);
  const list = document.getElementById("csv-list");
  const elements = [];
  faceSumissions.forEach((row) => {
    elements.push(row.Interface_Element);
  });
  const uniqueElements = [...new Set(elements)];
  uniqueElements.forEach((value) => {
    const li = document.createElement("li");
    li.classList.add("interface-element");
    li.textContent = value;
    list.appendChild(li);
  });
  document.querySelectorAll(".interface-element").forEach((element, index) => {
    element.addEventListener("click", () => {
      const submission = submissions[index];
      console.log(submission);
      document.getElementById("modal-meta").innerHTML = `
                        <p><strong>Name:</strong> ${submission.Interface_Element}</p>
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
//# sourceMappingURL=interface-CNoS_GzX.js.map
