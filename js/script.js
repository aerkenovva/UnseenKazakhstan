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


// =========================================================
// TASK 5 — CURRENT DATE AND TIME
// =========================================================

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


// =========================================================
// TASK 3 — POPUP SUBSCRIPTION FORM
// =========================================================

function initPopup() {
  const popup = document.getElementById("subscriptionPopup");
  const openBtn = document.getElementById("openPopupBtn");
  const closeBtn = document.getElementById("closePopupBtn");
  const form = document.getElementById("subscriptionForm");
  const emailInput = document.getElementById("subscriberEmail");
  const message = document.getElementById("subscriptionMessage");

  if (!popup || !openBtn || !closeBtn) return;

  const openPopup = () => {
    popup.classList.add("is-open");
    popup.setAttribute("aria-hidden", "false");

    if (emailInput) {
      emailInput.focus();
    }
  };

  const closePopup = () => {
    popup.classList.remove("is-open");
    popup.setAttribute("aria-hidden", "true");
  };

  openBtn.addEventListener("click", openPopup);
  closeBtn.addEventListener("click", closePopup);

  popup.addEventListener("click", (event) => {
    if (event.target === popup) {
      closePopup();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      popup.classList.contains("is-open")
    ) {
      closePopup();
    }
  });

  if (form && emailInput && message) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = emailInput.value.trim();

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const validEmail = emailPattern.test(email);

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
}


// =========================================================
// TASK 2 — ACCORDION
// =========================================================

function initAccordion() {
  document.querySelectorAll(".accordion-question").forEach((button) => {
    button.addEventListener("click", () => {
      const answer = button.nextElementSibling;

      if (!answer) return;

      const isOpen =
        button.getAttribute("aria-expanded") === "true";

      button.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

      answer.classList.toggle(
        "is-open",
        !isOpen
      );
    });
  });
}


// =========================================================
// TASK 4 — CHANGE BACKGROUND COLOR
// =========================================================

function initBackgroundChanger() {
  const button = document.getElementById("changeBgBtn");

  if (!button) return;

  const colors = [
    "#eef6f9",
    "#fff8e7",
    "#f4f0ff",
    "#eefaf2",
    "#f8f9fa"
  ];

  let colorIndex = 0;

  button.addEventListener("click", () => {
    colorIndex = (colorIndex + 1) % colors.length;

    document.body.style.backgroundColor =
      colors[colorIndex];
  });
}


// =========================================================
// TASK 1 — FORM VALIDATION
// =========================================================

function initFormValidation() {
  const form = document.getElementById("tripForm");

  if (!form) return;

  const status = document.getElementById("formStatus");

  const firstName = document.getElementById("firstname");
  const lastName = document.getElementById("lastname");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword =
    document.getElementById("confirmPassword");
  const destination =
    document.getElementById("destination");
  const agreement =
    document.getElementById("agreement");

  if (
    !status ||
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !confirmPassword ||
    !destination ||
    !agreement
  ) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    clearField(firstName, "firstnameError");
    clearField(lastName, "lastnameError");
    clearField(email, "emailError");
    clearField(password, "passwordError");
    clearField(
      confirmPassword,
      "confirmPasswordError"
    );

    destination.classList.remove(
      "input-error",
      "input-success"
    );

    let isValid = true;


    // First name
    if (!firstName.value.trim()) {
      showError(
        firstName,
        "firstnameError",
        "First name is required."
      );

      isValid = false;
    } else {
      showSuccess(firstName);
    }


    // Last name
    if (!lastName.value.trim()) {
      showError(
        lastName,
        "lastnameError",
        "Last name is required."
      );

      isValid = false;
    } else {
      showSuccess(lastName);
    }


    // Email
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.value.trim())) {
      showError(
        email,
        "emailError",
        "Enter a valid email address."
      );

      isValid = false;
    } else {
      showSuccess(email);
    }


    // Password
    if (password.value.length < 6) {
      showError(
        password,
        "passwordError",
        "Password must be at least 6 characters."
      );

      isValid = false;
    } else {
      showSuccess(password);
    }


    // Confirm password
    if (
      !confirmPassword.value ||
      confirmPassword.value !== password.value
    ) {
      showError(
        confirmPassword,
        "confirmPasswordError",
        "Passwords must match."
      );

      isValid = false;
    } else {
      showSuccess(confirmPassword);
    }


    // Destination
    if (!destination.value) {
      destination.classList.add("input-error");
      isValid = false;
    } else {
      destination.classList.add("input-success");
    }


    // Agreement checkbox
    if (!agreement.checked) {
      isValid = false;
    }


    // Final result
    if (isValid) {
      status.textContent =
        "Form submitted successfully. Your trip request is ready!";

      status.className =
        "form-status success";

      form.reset();

      form
        .querySelectorAll(
          ".input-success, .input-error"
        )
        .forEach((element) => {
          element.classList.remove(
            "input-success",
            "input-error"
          );
        });
    } else {
      status.textContent =
        "Please correct the highlighted fields and try again.";

      status.className =
        "form-status error";
    }
  });
}


// =========================================================
// REUSABLE VALIDATION FUNCTIONS
// =========================================================

function showError(input, errorId, message) {
  input.classList.add("input-error");
  input.classList.remove("input-success");

  const error =
    document.getElementById(errorId);

  if (error) {
    error.textContent = message;
  }
}


function showSuccess(input) {
  input.classList.remove("input-error");
  input.classList.add("input-success");
}


function clearField(input, errorId) {
  input.classList.remove(
    "input-error",
    "input-success"
  );

  const error =
    document.getElementById(errorId);

  if (error) {
    error.textContent = "";
  }
}