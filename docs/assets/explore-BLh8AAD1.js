import "./modulepreload-polyfill-DaKOjhqt.js";
/* empty css                */
import { l as loadObsAsJson } from "./csvtojson-CHK6WrLd.js";
document.addEventListener("DOMContentLoaded", async () => {
  const submissions = await loadObsAsJson();
  submissions.reverse();
  const container = document.querySelector(".carousel-container");
  container.innerHTML = "";
  submissions.forEach((item) => {
    const carouselItem = document.createElement("div");
    carouselItem.classList.add("carousel-item");
    carouselItem.innerHTML = `
        <img src="${item.URL}" alt="${item.Title || "Submission"}" class="carousel-image" />
        <p class="carousel-caption">${item.Title || "Untitled"}</p>
      `;
    container.appendChild(carouselItem);
  });
  const btnLeft = document.querySelector(".carousel-nav-left");
  const btnRight = document.querySelector(".carousel-nav-right");
  btnLeft.addEventListener("click", () => {
    container.scrollBy({ left: -container.clientWidth * 0.9, behavior: "smooth" });
  });
  btnRight.addEventListener("click", () => {
    container.scrollBy({ left: container.clientWidth * 0.9, behavior: "smooth" });
  });
  document.querySelectorAll(".carousel-image").forEach((img, index) => {
    img.addEventListener("click", () => {
      const submission = submissions[index];
      document.getElementById("modal-gif").src = submission.URL;
      document.getElementById("modal-meta").innerHTML = `
                    <p><strong>Application:</strong> ${submission.Application}</p>
                    <p><strong>Task:</strong> ${submission.Task || "Unknown"}</p>
                    <p><strong>Input:</strong> ${submission.Input || "No description"}</p>
                    <p><strong>Feedback:</strong> ${submission.Feedback || "No Feedback"}</p>
                    <p><strong>Interface Elements:</strong> ${submission.Interface_Elements || "No Interface Elements"}</p>
                    <p><strong>Interaction Technique:</strong> ${submission.Interaction_Technique || "No Interaction Techniques"}</p>
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
//# sourceMappingURL=explore-BLh8AAD1.js.map
