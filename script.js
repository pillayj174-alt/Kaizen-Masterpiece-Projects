const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".navigation");
const navLinks = document.querySelectorAll(".navigation a");

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  nav.classList.toggle("open", !isOpen);
});

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    menuButton?.setAttribute("aria-expanded", "false");
    nav?.classList.remove("open");
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

const progress = document.querySelector(".scroll-progress");
function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  if (progress) progress.style.width = `${percent}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Demo contact buttons use direct phone, WhatsApp and email links.
// A full enquiry form/backend can be added in a later build phase.
