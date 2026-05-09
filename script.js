const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const gallery = document.querySelector("[data-gallery]");

if (gallery) {
  const stageImage = gallery.querySelector("[data-gallery-stage]");
  const stageCaption = gallery.querySelector("[data-gallery-caption]");
  const thumbs = Array.from(gallery.querySelectorAll(".gallery-thumb"));

  const activateThumb = (thumb) => {
    thumbs.forEach((item) => item.classList.toggle("is-active", item === thumb));
    stageImage.src = thumb.dataset.image;
    stageImage.alt = thumb.dataset.alt;
    stageCaption.textContent = thumb.dataset.caption;
  };

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => activateThumb(thumb));
  });
}
