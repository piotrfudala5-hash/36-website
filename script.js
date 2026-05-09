const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);
const revealElements = Array.from(document.querySelectorAll(".reveal"));

function showAllRevealElements() {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
  showAllRevealElements();
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 },
  );

  revealElements.forEach((element) => observer.observe(element));
}

const siteHeader = document.querySelector(".site-header");
const navToggle = document.querySelector("[data-nav-toggle]");
const topNav = document.getElementById("site-nav");

if (siteHeader && navToggle && topNav) {
  const navLinks = Array.from(topNav.querySelectorAll("a"));

  const closeNav = () => {
    siteHeader.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Otwórz menu");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute(
      "aria-label",
      isOpen ? "Zamknij menu" : "Otwórz menu",
    );
  });

  navLinks.forEach((link) => link.addEventListener("click", closeNav));

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      closeNav();
    }
  });

  document.addEventListener("click", (event) => {
    if (!siteHeader.contains(event.target)) {
      closeNav();
    }
  });
}

const gallery = document.querySelector("[data-gallery]");

function createLightbox() {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Powiększony podgląd ekranu aplikacji");
  lightbox.innerHTML = `
    <div class="lightbox-inner">
      <button class="lightbox-close" type="button" aria-label="Zamknij podgląd">x</button>
      <img src="" alt="" />
      <div class="caption"></div>
    </div>
  `;
  document.body.appendChild(lightbox);
  return lightbox;
}

const lightbox = createLightbox();
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector(".caption");
const lightboxClose = lightbox.querySelector(".lightbox-close");
let lastFocusedElement = null;

function openLightbox(src, alt, caption) {
  lastFocusedElement = document.activeElement;
  lightboxImage.src = src;
  lightboxImage.alt = alt || "";
  lightboxCaption.textContent = caption || "";
  lightbox.classList.add("is-open");
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightboxImage.src = "";
  lightboxCaption.textContent = "";
  document.body.style.overflow = "";

  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }
}

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

lightboxClose.addEventListener("click", closeLightbox);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
    closeLightbox();
  }
});

if (gallery) {
  const stageImage = gallery.querySelector("[data-gallery-stage]");
  const stageCaption = gallery.querySelector("[data-gallery-caption]");
  const stageZoom = gallery.querySelector("[data-gallery-zoom]");
  const tag = gallery.querySelector("[data-gallery-tag]");
  const title = gallery.querySelector("[data-gallery-title]");
  const summary = gallery.querySelector("[data-gallery-summary]");
  const pointsList = gallery.querySelector("[data-gallery-points]");
  const thumbs = Array.from(gallery.querySelectorAll(".gallery-thumb"));

  const buildPoints = (value) => {
    if (!pointsList) {
      return;
    }

    pointsList.innerHTML = "";

    value
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        pointsList.appendChild(li);
      });
  };

  const activateThumb = (thumb, options = {}) => {
    const { focus = false } = options;

    thumbs.forEach((item) => {
      const isActive = item === thumb;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
      item.tabIndex = isActive ? 0 : -1;
    });

    if (stageImage) {
      stageImage.src = thumb.dataset.image || "";
      stageImage.alt = thumb.dataset.alt || "";
    }

    if (stageCaption) {
      stageCaption.textContent = thumb.dataset.caption || "";
    }

    if (tag) {
      tag.textContent = thumb.dataset.tag || "";
    }

    if (title) {
      title.textContent = thumb.dataset.title || "";
    }

    if (summary) {
      summary.textContent = thumb.dataset.summary || "";
    }

    buildPoints(thumb.dataset.points || "");

    if (focus) {
      thumb.focus();
    }
  };

  const focusThumbByOffset = (currentThumb, offset) => {
    const currentIndex = thumbs.indexOf(currentThumb);
    if (currentIndex === -1) {
      return;
    }

    const nextIndex = (currentIndex + offset + thumbs.length) % thumbs.length;
    activateThumb(thumbs[nextIndex], { focus: true });
  };

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => activateThumb(thumb));

    thumb.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          focusThumbByOffset(thumb, 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          focusThumbByOffset(thumb, -1);
          break;
        case "Home":
          event.preventDefault();
          activateThumb(thumbs[0], { focus: true });
          break;
        case "End":
          event.preventDefault();
          activateThumb(thumbs[thumbs.length - 1], { focus: true });
          break;
        case " ":
        case "Enter":
          event.preventDefault();
          activateThumb(thumb, { focus: true });
          break;
        default:
          break;
      }
    });
  });

  const openCurrentStage = () => {
    if (!stageImage) {
      return;
    }

    openLightbox(
      stageImage.src,
      stageImage.alt,
      stageCaption ? stageCaption.textContent : "",
    );
  };

  if (stageImage) {
    stageImage.style.cursor = "zoom-in";
    stageImage.addEventListener("click", openCurrentStage);
  }

  if (stageZoom) {
    stageZoom.addEventListener("click", openCurrentStage);
  }

  if (thumbs.length > 0) {
    activateThumb(thumbs[0]);
  }
}
