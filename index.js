const EMAILJS_PUBLIC_KEY = "8jgBetSyojQcI78XA";
const EMAILJS_SERVICE_ID = "service_zt3ijnl";
const EMAILJS_TEMPLATE_ID = "template_ghfzl7d";

emailjs.init(EMAILJS_PUBLIC_KEY);

document.getElementById("year").textContent = new Date().getFullYear();

const THEME_KEY = "theme";
const themeToggle = document.getElementById("theme-toggle");
const preferredTheme =
	localStorage.getItem(THEME_KEY) ||
	(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

applyTheme(preferredTheme);

themeToggle.addEventListener("click", () => {
	const next = document.body.dataset.theme === "dark" ? "light" : "dark";
	applyTheme(next);
	localStorage.setItem(THEME_KEY, next);
});

function applyTheme(theme) {
	document.body.dataset.theme = theme;
	themeToggle.setAttribute("aria-pressed", theme === "dark");
}

const modalOpenTriggers = document.querySelectorAll("[data-modal-open]");
const modalCloseTriggers = document.querySelectorAll("[data-modal-close]");
let activeModal = null;

modalOpenTriggers.forEach((trigger) => {
	trigger.addEventListener("click", (event) => {
		event.preventDefault();
		openModal(document.getElementById(`modal-${trigger.dataset.modalOpen}`));
	});
});

modalCloseTriggers.forEach((trigger) => {
	trigger.addEventListener("click", () => closeModal());
});

document.querySelectorAll(".modal-overlay").forEach((overlay) => {
	overlay.addEventListener("click", (event) => {
		if (event.target === overlay) closeModal();
	});
});

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") closeModal();
});

function openModal(modal) {
	if (!modal) return;
	activeModal = modal;
	modal.classList.add("is-open");
	modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
	if (!activeModal) return;
	activeModal.classList.remove("is-open");
	activeModal.setAttribute("aria-hidden", "true");
	activeModal = null;
}

const contactForm = document.getElementById("contact-form");
const contactSubmit = document.getElementById("contact-submit");
const formStatus = document.getElementById("form-status");

contactForm.addEventListener("submit", (event) => {
	event.preventDefault();
	contactSubmit.disabled = true;
	formStatus.textContent = "Sending...";
	formStatus.className = "form-status";

	emailjs
		.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, event.target)
		.then(() => {
			formStatus.textContent =
				"Thanks for the message! Looking forward to speaking to you soon.";
			formStatus.className = "form-status success";
			contactForm.reset();
			contactSubmit.disabled = false;
		})
		.catch(() => {
			formStatus.textContent =
				"The email service is temporarily unavailable. Please reach me directly at calvinwade97@gmail.com.";
			formStatus.className = "form-status error";
			contactSubmit.disabled = false;
		});
});
