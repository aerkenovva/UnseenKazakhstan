// =========================================================
// UNSEEN KAZAKHSTAN — ASSIGNMENT 4 JAVASCRIPT
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  updateDateTime();
  setInterval(updateDateTime, 1000);

  initPopup();
  initAccordion();
  initBackgroundChanger();
  initFormValidation();
});

// Task 5 — Current date and time
function updateDateTime() {
  const now = new Date();
  const formatted = now.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  });

  document.querySelectorAll(".current-datetime").forEach((element) => {
    element.textContent = formatted;
  });
}

// Task 3 — Popup subscription form
function initPopup() {
  const popup = document.getElementById("subscriptionPopup");
  const openBtn = document.getElementById("openPopupBtn");
  const closeBtn = document.getElementById("closePopupBtn");
  const form = document.getElementById("subscriptionForm");
  const message = document.getElementById("subscriptionMessage");

  if (!popup || !openBtn || !closeBtn) return;

  const openPopup = () => {
    popup.classList.add("is-open");
    popup.setAttribute("aria-hidden", "false");
    document.getElementById("subscriberEmail")?.focus();
  };

  const closePopup = () => {
    popup.classList.remove("is-open");
    popup.setAttribute("aria-hidden", "true");
  };

  openBtn.addEventListener("click", openPopup);
  closeBtn.addEventListener("click", closePopup);

  popup.addEventListener("click", (event) => {
    if (event.target === popup) closePopup();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && popup.classList.contains("is-open")) closePopup();
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("subscriberEmail").value.trim();
    const validEmail = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);

    if (!validEmail) {
      message.textContent = "Please enter a valid email address.";
      message.className = "small mb-3 text-danger";
      return;
    }

    message.textContent = "Thank you! You are subscribed.";
    message.className = "small mb-3 text-success";
    form.reset();
  });
}

// Task 2 — Accordion
function initAccordion() {
  document.querySelectorAll(".accordion-question").forEach((button) => {
    button.addEventListener("click", () => {
      const answer = button.nextElementSibling;
      const isOpen = button.getAttribute("aria-expanded") === "true";

      button.setAttribute("aria-expanded", String(!isOpen));
      answer.classList.toggle("is-open", !isOpen);
    });
  });
}

// Task 4 — Change background color
function initBackgroundChanger() {
  const button = document.getElementById("changeBgBtn");
  if (!button) return;

  const colors = ["#eef6f9", "#fff8e7", "#f4f0ff", "#eefaf2", "#f8f9fa"];
  let colorIndex = 0;

  button.addEventListener("click", () => {
    colorIndex = (colorIndex + 1) % colors.length;
    document.body.style.backgroundColor = colors[colorIndex];
  });
}

// Task 1 — Form validation
function initFormValidation() {
  const form = document.getElementById("tripForm");
  if (!form) return;

  const status = document.getElementById("formStatus");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const firstName = document.getElementById("firstname");
    const lastName = document.getElementById("lastname");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const destination = document.getElementById("destination");
    const agreement = document.getElementById("agreement");

    clearField(firstName, "firstnameError");
    clearField(lastName, "lastnameError");
    clearField(email, "emailError");
    clearField(password, "passwordError");
    clearField(confirmPassword, "confirmPasswordError");

    let isValid = true;

    if (!firstName.value.trim()) {
      showError(firstName, "firstnameError", "First name is required.");
      isValid = false;
    }

    if (!lastName.value.trim()) {
      showError(lastName, "lastnameError", "Last name is required.");
      isValid = false;
    }

    const emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
      showError(email, "emailError", "Enter a valid email address.");
      isValid = false;
    }

    if (password.value.length < 6) {
      showError(password, "passwordError", "Password must be at least 6 characters.");
      isValid = false;
    }

    if (confirmPassword.value !== password.value || !confirmPassword.value) {
      showError(confirmPassword, "confirmPasswordError", "Passwords must match.");
      isValid = false;
    }

    if (!destination.value) isValid = false;
    if (!agreement.checked) isValid = false;

    if (isValid) {
      status.textContent = "Form submitted successfully. Your trip request is ready!";
      status.className = "form-status success";
      form.reset();
      form.querySelectorAll(".input-success").forEach((el) => el.classList.remove("input-success"));
    } else {
      status.textContent = "Please correct the highlighted fields and try again.";
      status.className = "form-status error";
    }
  });
}

function showError(input, errorId, message) {
  input.classList.add("input-error");
  input.classList.remove("input-success");
  const error = document.getElementById(errorId);
  if (error) error.textContent = message;
}

function clearField(input, errorId) {
  input.classList.remove("input-error");
  input.classList.add("input-success");
  const error = document.getElementById(errorId);
  if (error) error.textContent = "";
}


