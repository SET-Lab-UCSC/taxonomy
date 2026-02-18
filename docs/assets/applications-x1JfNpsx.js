import "./modulepreload-polyfill-DaKOjhqt.js";
/* empty css                */
import { b as loadAppsAsJson } from "./csvtojson-CHK6WrLd.js";
document.addEventListener("DOMContentLoaded", async () => {
  const submissions = await loadAppsAsJson();
  const container = document.querySelector(".application-container");
  container.innerHTML = "";
  submissions.forEach((item) => {
    const applicationItem = document.createElement("div");
    applicationItem.classList.add("application-item");
    applicationItem.innerHTML = `<img src="${item.Thumbnail}" alt="${item.Name || "Submission"}" class="application-image" />
        <p class="application-caption">${item.Name || "Untitled"}</p>
      `;
    container.appendChild(applicationItem);
  });
  document.querySelectorAll(".application-image").forEach((img, index) => {
    img.addEventListener("click", () => {
      const submission = submissions[index];
      console.log(submission);
      document.getElementById("modal-gif").src = submission.Thumbnail;
      document.getElementById("modal-meta").innerHTML = `
                    <p><strong>Name:</strong> ${submission.Name}</p>
                    <p><strong>Year:</strong> ${submission.Year || "Unknown"}</p>
                    <p><strong>Description:</strong> ${submission.Description || "No description"}</p>
                    
                `;
      document.getElementById("gif-modal").classList.remove("hidden");
    });
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
//# sourceMappingURL=applications-x1JfNpsx.js.map
