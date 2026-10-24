const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

function closeNavigation() {
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation");
  navLinks.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navLinks.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});
navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNavigation));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNavigation();
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const menuTabs = [...document.querySelectorAll(".menu-tab")];
const menuFeatureImage = document.getElementById("menu-feature-image");
const menuFeatureTitle = document.getElementById("menu-feature-title");
const menuFeatures = {
  "tab-starters": {
    src: "images/dish-1.jpg",
    alt: "Bruschetta topped with tomatoes and fresh herbs",
    title: "Bruschetta al Pomodoro",
  },
  "tab-mains": {
    src: "images/dish-3.jpg",
    alt: "A spiral of summer vegetables baked in a green ceramic dish",
    title: "Summer Vegetable Tian",
  },
  "tab-desserts": {
    src: "images/dessert-1.jpg",
    alt: "Ricotta cheesecake served with fresh berries",
    title: "Ricotta Cheesecake",
  },
  "tab-drinks": {
    src: "images/story-1.jpg",
    alt: "The softly lit dining room at Little Mama",
    title: "Settle in for the evening",
  },
};
function activateTab(tab, moveFocus = false) {
  menuTabs.forEach((item) => {
    const selected = item === tab;
    item.classList.toggle("is-active", selected);
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute("aria-controls")).hidden = !selected;
  });
  const feature = menuFeatures[tab.id];
  menuFeatureImage.src = feature.src;
  menuFeatureImage.alt = feature.alt;
  menuFeatureTitle.textContent = feature.title;
  if (moveFocus) tab.focus();
}
menuTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateTab(tab));
  tab.addEventListener("keydown", (event) => {
    let nextIndex;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % menuTabs.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + menuTabs.length) % menuTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = menuTabs.length - 1;
    if (nextIndex !== undefined) {
      event.preventDefault();
      activateTab(menuTabs[nextIndex], true);
    }
  });
});

const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
document.querySelectorAll("[data-lightbox]").forEach((item) => {
  item.addEventListener("click", () => {
    lightboxImage.src = item.dataset.lightbox;
    lightboxImage.alt = item.dataset.alt;
    lightbox.showModal();
  });
});
lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener("close", () => {
  lightboxImage.removeAttribute("src");
  lightboxImage.alt = "";
});

const slides = [...document.querySelectorAll(".quote-slide")];
const carouselDots = [...document.querySelectorAll(".carousel-dot")];
let activeSlide = 0;
function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    const selected = slideIndex === activeSlide;
    slide.hidden = !selected;
    slide.setAttribute("aria-hidden", String(!selected));
  });
  carouselDots.forEach((dot, dotIndex) => {
    const selected = dotIndex === activeSlide;
    dot.classList.toggle("is-active", selected);
    dot.setAttribute("aria-current", String(selected));
  });
}
document.querySelectorAll(".carousel-arrow").forEach((button) => {
  button.addEventListener("click", () => showSlide(activeSlide + Number(button.dataset.direction)));
});
carouselDots.forEach((dot, index) => dot.addEventListener("click", () => showSlide(index)));

const dateInput = document.querySelector('input[name="date"]');
const today = new Date();
dateInput.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
document.getElementById("year").textContent = String(today.getFullYear());

const reservationForm = document.getElementById("reservation-form");
const formFeedback = document.getElementById("form-feedback");
reservationForm.addEventListener("input", () => {
  formFeedback.textContent = "";
});
reservationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!reservationForm.reportValidity()) return;
  const formData = new FormData(reservationForm);
  const firstName = String(formData.get("name")).trim().split(/\s+/)[0];
  formFeedback.textContent = `Thank you, ${firstName}. Your table request is ready — please call us to confirm.`;
  reservationForm.reset();
  dateInput.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
});
