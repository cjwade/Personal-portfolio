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

const FOCUSABLE_SELECTOR =
	'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const modalOpenTriggers = document.querySelectorAll("[data-modal-open]");
const modalCloseTriggers = document.querySelectorAll("[data-modal-close]");
let activeModal = null;
let lastFocusedElement = null;

modalOpenTriggers.forEach((trigger) => {
	trigger.addEventListener("click", (event) => {
		event.preventDefault();
		openModal(document.getElementById(`modal-${trigger.dataset.modalOpen}`), trigger);
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
	if (!activeModal) return;
	if (event.key === "Escape") {
		closeModal();
		return;
	}
	if (event.key === "Tab") trapFocus(event);
});

function openModal(modal, trigger) {
	if (!modal) return;
	activeModal = modal;
	lastFocusedElement = trigger || document.activeElement;
	modal.classList.add("is-open");
	modal.setAttribute("aria-hidden", "false");
	requestAnimationFrame(() => {
		const focusable = modal.querySelectorAll(FOCUSABLE_SELECTOR);
		if (focusable.length) focusable[0].focus();
	});
}

function closeModal() {
	if (!activeModal) return;
	activeModal.classList.remove("is-open");
	activeModal.setAttribute("aria-hidden", "true");
	activeModal = null;
	if (lastFocusedElement) lastFocusedElement.focus();
	lastFocusedElement = null;
}

function trapFocus(event) {
	const focusable = Array.from(activeModal.querySelectorAll(FOCUSABLE_SELECTOR));
	if (!focusable.length) return;
	const first = focusable[0];
	const last = focusable[focusable.length - 1];

	if (event.shiftKey && document.activeElement === first) {
		event.preventDefault();
		last.focus();
	} else if (!event.shiftKey && document.activeElement === last) {
		event.preventDefault();
		first.focus();
	}
}

const contactForm = document.getElementById("contact-form");
const contactSubmit = document.getElementById("contact-submit");
const formStatus = document.getElementById("form-status");

contactForm.addEventListener("submit", (event) => {
	event.preventDefault();
	contactSubmit.disabled = true;
	formStatus.textContent = "Sending...";
	formStatus.className = "form-status";

	const body = new URLSearchParams(new FormData(contactForm)).toString();

	fetch("/", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body,
	})
		.then((response) => {
			if (!response.ok) throw new Error(`Form submission failed: ${response.status}`);
			formStatus.textContent =
				"Thanks for the message! Looking forward to speaking to you soon.";
			formStatus.className = "form-status success";
			contactForm.reset();
			contactSubmit.disabled = false;
		})
		.catch(() => {
			formStatus.textContent =
				"Something went wrong sending that. Please reach me directly at calvinwade97@gmail.com.";
			formStatus.className = "form-status error";
			contactSubmit.disabled = false;
		});
});
