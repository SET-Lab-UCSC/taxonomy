import "./modulepreload-polyfill-DaKOjhqt.js";
/* empty css                */
import { l as loadObsAsJson, c as loadFeedAsJson } from "./csvtojson-CHK6WrLd.js";
document.addEventListener("DOMContentLoaded", async () => {
  const obsSubmissions = await loadObsAsJson();
  const feedSubmissions = await loadFeedAsJson();
  const submissions = Object.assign({}, obsSubmissions, feedSubmissions);
  const list = document.getElementById("csv-list");
  const elements = [];
  feedSubmissions.forEach((row) => {
    elements.push(row.Feedback);
  });
  const uniqueElements = [...new Set(elements)];
  uniqueElements.forEach((value) => {
    const li = document.createElement("li");
    li.classList.add("feedback-element");
    li.textContent = value;
    list.appendChild(li);
  });
  document.querySelectorAll(".feedback-element").forEach((element, index) => {
    element.addEventListener("click", () => {
      const submission = submissions[index];
      console.log(submission);
      document.getElementById("modal-meta").innerHTML = `
                        <p><strong>Name:</strong> ${submission.Feedback}</p>
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
//# sourceMappingURL=feedback-Y_CrZRqV.js.map
