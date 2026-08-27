const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector("figcaption");
const lightboxClose = lightbox.querySelector(".lightbox-close");

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.classList.remove("lightbox-open");
}

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    lightboxImage.src = item.dataset.full;
    lightboxImage.alt = item.querySelector("img").alt;
    lightboxCaption.textContent = item.dataset.caption;
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    lightboxClose.focus();
  });
});

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
});

const form = document.querySelector("#contact-form");
const success = document.querySelector("#form-success");
const resetButton = document.querySelector("#form-reset");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  form.hidden = true;
  success.hidden = false;
});

resetButton.addEventListener("click", () => {
  form.reset();
  success.hidden = true;
  form.hidden = false;
  form.querySelector("input").focus();
});
