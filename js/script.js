let siteSoundEnabled = true;
let toastTimer;

const siteSounds = {
  favorite: new Audio("sounds/favorite.wav"),
  rating: new Audio("sounds/rating.wav"),
  success: new Audio("sounds/success.wav"),
  click: new Audio("sounds/click.wav")
};

siteSounds.favorite.volume = 0.2;
siteSounds.rating.volume = 0.2;
siteSounds.success.volume = 0.2;
siteSounds.click.volume = 0.2;

document.addEventListener("DOMContentLoaded", function () {
  updateDateTime();
  setInterval(updateDateTime, 1000);
  initSoundSettings();
  initTheme();
  initKeyboardNavigation();
  initPopup();
  initAccordion();
  initFormValidation();
  initTripSuggestion();
  initDestinationExplorer();
});

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

  document.querySelectorAll(".current-datetime").forEach(function (element) {
    element.textContent = formatted;
  });
}

function initSoundSettings() {
  const button = document.getElementById("soundToggleBtn");
  if (!button) return;

  updateSoundButton(button);

  button.addEventListener("click", function () {
    siteSoundEnabled = !siteSoundEnabled;
    updateSoundButton(button);

    if (siteSoundEnabled) {
      playSiteSound("click");
    }
  });
}

function updateSoundButton(button) {
  if (siteSoundEnabled) {
    button.textContent = "🔊";
    button.setAttribute("aria-pressed", "true");
    button.setAttribute("aria-label", "Turn site sounds off");
  } else {
    button.textContent = "🔇";
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", "Turn site sounds on");
  }
}

function stopAllSounds() {
  siteSounds.favorite.pause();
  siteSounds.rating.pause();
  siteSounds.success.pause();
  siteSounds.click.pause();

  siteSounds.favorite.currentTime = 0;
  siteSounds.rating.currentTime = 0;
  siteSounds.success.currentTime = 0;
  siteSounds.click.currentTime = 0;
}

function playSiteSound(name) {
  if (!siteSoundEnabled) return;

  let sound = null;

  switch (name) {
    case "favorite":
      sound = siteSounds.favorite;
      break;
    case "rating":
      sound = siteSounds.rating;
      break;
    case "success":
      sound = siteSounds.success;
      break;
    case "click":
      sound = siteSounds.click;
      break;
  }

  if (!sound) return;

  stopAllSounds();
  sound.play();
}

function showToast(message) {
  let toast = document.getElementById("siteToast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "siteToast";
    toast.className = "site-toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("is-visible");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove("is-visible");
  }, 2200);
}

function initTheme() {
  const button = document.getElementById("themeToggleBtn");
  if (!button) return;

  updateThemeButton(button);

  button.addEventListener("click", function () {
    document.body.classList.toggle("night-theme");
    updateThemeButton(button);
    playSiteSound("click");
  });
}

function updateThemeButton(button) {
  const nightMode = document.body.classList.contains("night-theme");

  if (nightMode) {
    button.textContent = "☀";
    button.setAttribute("aria-pressed", "true");
    button.setAttribute("aria-label", "Switch to light theme");
    button.title = "Switch to light theme";
  } else {
    button.textContent = "☾";
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", "Switch to dark theme");
    button.title = "Switch to dark theme";
  }
}

function initKeyboardNavigation() {
  const links = document.querySelectorAll(".navbar .nav-link");
  if (links.length === 0) return;

  document.addEventListener("keydown", function (event) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;

    let currentIndex = -1;

    for (let i = 0; i < links.length; i++) {
      if (links[i] === document.activeElement) {
        currentIndex = i;
      }
    }

    if (currentIndex === -1) return;

    event.preventDefault();

    if (event.key === "ArrowRight") {
      currentIndex++;
      if (currentIndex === links.length) currentIndex = 0;
    } else {
      currentIndex--;
      if (currentIndex < 0) currentIndex = links.length - 1;
    }

    links[currentIndex].focus();
  });
}

function initPopup() {
  const popup = document.getElementById("subscriptionPopup");
  const openBtn = document.getElementById("openPopupBtn");
  const closeBtn = document.getElementById("closePopupBtn");
  const form = document.getElementById("subscriptionForm");
  const emailInput = document.getElementById("subscriberEmail");
  const message = document.getElementById("subscriptionMessage");

  if (!popup || !openBtn || !closeBtn) return;

  function openPopup() {
    popup.classList.add("is-open");
    popup.setAttribute("aria-hidden", "false");

    if (emailInput) {
      emailInput.focus();
    }
  }

  function closePopup() {
    popup.classList.remove("is-open");
    popup.setAttribute("aria-hidden", "true");
  }

  openBtn.addEventListener("click", openPopup);
  closeBtn.addEventListener("click", closePopup);

  popup.addEventListener("click", function (event) {
    if (event.target === popup) {
      closePopup();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && popup.classList.contains("is-open")) {
      closePopup();
    }
  });

  if (form && emailInput && message) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = emailInput.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        message.textContent = "Please enter a valid email address.";
        message.className = "small mb-3 text-danger";
        return;
      }

      message.textContent = "Thank you! You are subscribed.";
      message.className = "small mb-3 text-success";
      playSiteSound("success");
      showToast("Subscription confirmed");
      form.reset();
    });
  }
}

function initAccordion() {
  const questions = document.querySelectorAll(".accordion-question");

  questions.forEach(function (button) {
    button.addEventListener("click", function () {
      const answer = button.nextElementSibling;
      if (!answer) return;

      const isOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isOpen));
      answer.classList.toggle("is-open", !isOpen);
    });
  });
}

function initFormValidation() {
  const form = document.getElementById("tripForm");
  if (!form) return;

  const status = document.getElementById("formStatus");
  const firstName = document.getElementById("firstname");
  const lastName = document.getElementById("lastname");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const destination = document.getElementById("destination");
  const people = document.getElementById("people");
  const agreement = document.getElementById("agreement");
  const agreementBox = document.getElementById("agreementBox");
  const agreementError = document.getElementById("agreementError");
  const resetButton = form.querySelector('button[type="reset"]');

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    clearField(firstName, "firstnameError");
    clearField(lastName, "lastnameError");
    clearField(email, "emailError");
    clearField(password, "passwordError");
    clearField(confirmPassword, "confirmPasswordError");
    clearField(people, "peopleError");
    clearField(destination, "destinationError");
    agreementBox.classList.remove("agreement-invalid");
    agreementError.textContent = "";

    let isValid = true;

    if (!firstName.value.trim()) {
      showError(firstName, "firstnameError", "First name is required.");
      isValid = false;
    } else {
      showSuccess(firstName);
    }

    if (!lastName.value.trim()) {
      showError(lastName, "lastnameError", "Last name is required.");
      isValid = false;
    } else {
      showSuccess(lastName);
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.value.trim())) {
      showError(email, "emailError", "Enter a valid email address.");
      isValid = false;
    } else {
      showSuccess(email);
    }

    if (password.value.length < 6) {
      showError(password, "passwordError", "Password must be at least 6 characters.");
      isValid = false;
    } else {
      showSuccess(password);
    }

    if (!confirmPassword.value || confirmPassword.value !== password.value) {
      showError(confirmPassword, "confirmPasswordError", "Passwords must match.");
      isValid = false;
    } else {
      showSuccess(confirmPassword);
    }

    const peopleCount = Number(people.value);

    if (!people.value || peopleCount < 1 || peopleCount > 50) {
      showError(people, "peopleError", "Enter a number from 1 to 50.");
      isValid = false;
    } else {
      showSuccess(people);
    }

    if (!destination.value) {
      showError(destination, "destinationError", "Please choose a destination.");
      isValid = false;
    } else {
      showSuccess(destination);
    }

    if (!agreement.checked) {
      agreementBox.classList.add("agreement-invalid");
      agreementError.textContent = "Please confirm this before submitting.";
      isValid = false;
    }

    if (isValid) {
      status.textContent = "Your trip request is ready. We will contact you with the next steps.";
      status.className = "form-status success";
      playSiteSound("success");
      showToast("Trip request submitted successfully");
      form.reset();
      clearFormStyles(form, agreementBox, agreementError, false);
    } else {
      status.textContent = "Please correct the highlighted fields and try again.";
      status.className = "form-status error";
    }
  });

  if (resetButton) {
    resetButton.addEventListener("click", function () {
      setTimeout(function () {
        clearFormStyles(form, agreementBox, agreementError, true);
      }, 0);
    });
  }

  agreement.addEventListener("change", function () {
    if (agreement.checked) {
      agreementBox.classList.remove("agreement-invalid");
      agreementError.textContent = "";
    }
  });
}

function clearFormStyles(form, agreementBox, agreementError, clearStatus) {
  form.querySelectorAll(".input-success, .input-error").forEach(function (element) {
    element.classList.remove("input-success", "input-error");
  });

  form.querySelectorAll(".field-error").forEach(function (error) {
    error.textContent = "";
  });

  agreementBox.classList.remove("agreement-invalid");
  agreementError.textContent = "";

  if (clearStatus) {
    const status = document.getElementById("formStatus");
    status.textContent = "";
    status.className = "form-status";
  }
}

function showError(input, errorId, message) {
  input.classList.add("input-error");
  input.classList.remove("input-success");

  const error = document.getElementById(errorId);
  if (error) {
    error.textContent = message;
  }
}

function showSuccess(input) {
  input.classList.remove("input-error");
  input.classList.add("input-success");
}

function clearField(input, errorId) {
  input.classList.remove("input-error", "input-success");

  const error = document.getElementById(errorId);
  if (error) {
    error.textContent = "";
  }
}

function initTripSuggestion() {
  const select = document.getElementById("tripMoodSelect");
  const button = document.getElementById("tripSuggestionBtn");
  const result = document.getElementById("tripSuggestionResult");

  if (!select || !button || !result) return;

  button.addEventListener("click", function () {
    let suggestion = "";

    switch (select.value) {
      case "nature":
        suggestion = "Kolsay Lakes — alpine scenery, pine forests and a calm atmosphere.";
        break;
      case "adventure":
        suggestion = "Bozzhyra — a remote Mangystau landscape made for a real expedition.";
        break;
      case "photography":
        suggestion = "Charyn Canyon — dramatic rock formations and strong sunset views.";
        break;
      case "weekend":
        suggestion = "Bektau-Ata — a memorable Central Kazakhstan escape with unusual rock scenery.";
        break;
      case "culture":
        suggestion = "Tamgaly — an archaeological landscape with ancient petroglyphs and open steppe scenery.";
        break;
      case "wildlife":
        suggestion = "Aksu-Zhabagly — a protected Western Tien Shan landscape for nature-focused travel.";
        break;
      default:
        suggestion = "Explore our Hidden Gems page to compare destinations.";
    }

    result.textContent = suggestion;
    playSiteSound("click");
  });
}

function initDestinationExplorer() {
  const grid = document.getElementById("destinationGrid");
  const search = document.getElementById("destinationSearch");
  const category = document.getElementById("destinationCategory");
  const sort = document.getElementById("destinationSort");
  const favoritesOnly = document.getElementById("favoritesOnly");
  const clearFilters = document.getElementById("clearDestinationFilters");
  const count = document.getElementById("destinationCount");
  const emptyState = document.getElementById("noDestinations");

  if (!grid || !search || !category || !sort || !favoritesOnly || !clearFilters || !count || !emptyState) return;

  const favorites = [];
  const ratings = {};

  const destinationHelper = {
    getMeta: function (destination) {
      return destination.region + " · " + categoryName(destination.category);
    }
  };
  const destinations = [
    {
      id: "bektau",
      name: "Bektau-Ata",
      region: "Karaganda Region",
      category: "mountains",
      image: "images/Bektau-Ata.jpeg",
      short: "A granite mountain oasis rising unexpectedly from the Central Kazakhstan steppe.",
      details: "Explore sculpted rock formations, quiet valleys and the famous sacred cave with a freshwater spring."
    },
    {
      id: "bozzhyra",
      name: "Bozzhyra",
      region: "Mangystau Region",
      category: "canyons",
      image: "images/Bozzhyra.jpg",
      short: "White limestone cliffs and enormous open landscapes on the Ustyurt Plateau.",
      details: "Bozzhyra is best suited to prepared road trips, wide-angle photography and travelers who enjoy truly remote scenery."
    },
    {
      id: "akkergeshen",
      name: "Akkergeshen",
      region: "Atyrau Region",
      category: "canyons",
      image: "images/Akkergeshen.jpg",
      short: "Snow-white chalk formations shaped by an ancient sea and millions of years of erosion.",
      details: "The plateau is known for unusual limestone shapes, fossils and a bright, almost otherworldly landscape."
    },
    {
      id: "charyn",
      name: "Charyn Canyon",
      region: "Almaty Region",
      category: "canyons",
      image: "images/Charyn Canyon.jpeg",
      short: "A dramatic canyon system with red sandstone walls and the Valley of Castles.",
      details: "Walking routes reveal layered rock formations, open viewpoints and one of Kazakhstan's most recognizable natural landscapes."
    },
    {
      id: "kolsay",
      name: "Kolsay Lakes",
      region: "Almaty Region",
      category: "lakes",
      image: "images/Kolsay_Lake.jpeg",
      short: "Three alpine lakes surrounded by spruce forests in the northern Tien Shan.",
      details: "The area is popular for hiking, horse riding and slow nature trips between mountain villages and clear blue water."
    },
    {
      id: "altyn-emel",
      name: "Altyn Emel",
      region: "Jetisu Region",
      category: "parks",
      image: "images/altyn emel.jpg",
      short: "A vast national park of desert plains, colorful mountains and the Singing Dune.",
      details: "Its landscapes combine archaeology, wildlife, desert routes and the famous dune that can produce a deep humming sound."
    },
    {
      id: "bayanaul",
      name: "Bayanaul",
      region: "Pavlodar Region",
      category: "lakes",
      image: "images/bayanauyl.jpg",
      short: "Forested mountains and clear lakes forming a green oasis in the steppe.",
      details: "Bayanaul works well for relaxed hiking, lake weekends and travelers looking for nature without a long expedition."
    },
    {
      id: "karkaraly",
      name: "Karkaraly",
      region: "Karaganda Region",
      category: "mountains",
      image: "images/karkaraly.jpg",
      short: "Pine-covered mountains, lakes and hiking routes in Central Kazakhstan.",
      details: "Karkaraly combines forest trails, rock viewpoints and quiet natural areas that are especially pleasant in warm weather."
    },
    {
      id: "turgen",
      name: "Turgen Gorge",
      region: "Almaty Region",
      category: "parks",
      image: "images/Turgen.jpg",
      short: "A green mountain valley with waterfalls, forests and highland routes.",
      details: "The gorge is a flexible day-trip or weekend option with waterfalls, picnic areas and access to deeper mountain routes."
    },
    {
      id: "kaindy",
      name: "Kaindy Lake",
      region: "Almaty Region",
      category: "lakes",
      image: "images/Kaindy.jpg",
      short: "A turquoise mountain lake famous for spruce trunks rising directly from the water.",
      details: "Created after an earthquake, Kaindy has one of the country's most unusual lake landscapes and is often paired with Kolsay."
    },
    {
      id: "burabay",
      name: "Burabay",
      region: "Akmola Region",
      category: "lakes",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/View%20of%20the%20Burabay%20lake.jpg?width=1280",
      short: "Blue lakes, pine forests and granite hills make Burabay one of northern Kazakhstan's classic nature escapes.",
      details: "The area combines lakeside walks, forest viewpoints and distinctive rock formations, making it an easy choice for a scenic weekend trip."
    },
    {
      id: "big-almaty",
      name: "Big Almaty Lake",
      region: "Almaty",
      category: "lakes",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Big%20Almaty%20Lake.jpg?width=1280",
      short: "A bright turquoise alpine reservoir framed by the high peaks of the Trans-Ili Alatau.",
      details: "Its mountain setting and changing water color make it one of the most recognizable landscapes near Almaty."
    },
    {
      id: "katon-karagay",
      name: "Katon-Karagay",
      region: "East Kazakhstan Region",
      category: "mountains",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Katon-Karagay%20National%20Park.jpg?width=1280",
      short: "Remote Altai landscapes with forests, rivers, alpine meadows and snow-capped mountains.",
      details: "Katon-Karagay is a strong choice for travelers who want long nature routes, mountain scenery and a more remote expedition feel."
    },
    {
      id: "tamgaly",
      name: "Tamgaly",
      region: "Almaty Region",
      category: "heritage",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Petroglyphs%20in%20Tamgaly%2C%20Kazakhstan%2001.jpg?width=1280",
      short: "An archaeological landscape known for ancient rock carvings set among dry hills and stone outcrops.",
      details: "Tamgaly adds a cultural and historical route to the site, giving travelers an option beyond lakes, mountains and canyons."
    },
    {
      id: "aksu-zhabagly",
      name: "Aksu-Zhabagly",
      region: "Turkistan Region",
      category: "parks",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Aksu-Zhabagly.jpg?width=1280",
      short: "A mountain nature reserve of deep gorges, wildflower slopes and Western Tien Shan scenery.",
      details: "Aksu-Zhabagly is ideal for nature-focused routes, hiking and travelers who want a protected landscape far from city crowds."
    },
    {
      id: "assy",
      name: "Assy Plateau",
      region: "Almaty Region",
      category: "parks",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Asy%20Plateau%202016%2008%20east.jpg?width=1280",
      short: "A high-altitude plateau of summer pastures, open valleys and distant mountain ridges.",
      details: "Assy is best for a scenic road trip with wide landscapes, seasonal green meadows and a strong sense of open space."
    },
    {
      id: "markakol",
      name: "Lake Markakol",
      region: "East Kazakhstan Region",
      category: "lakes",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Markakol%201.jpg?width=1280",
      short: "A remote mountain lake framed by the southern Altai and broad natural shoreline.",
      details: "Markakol suits travelers who value quiet landscapes and are ready for a longer route into one of eastern Kazakhstan's remote lake regions."
    },
    {
      id: "sherkala",
      name: "Sherkala Mountain",
      region: "Mangystau Region",
      category: "mountains",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Sherkala%2C%20Mangistau%2C%20Kazakhstan.jpg?width=1280",
      short: "A solitary limestone mountain rising above the desert landscapes of Mangystau.",
      details: "Sherkala is a memorable stop on a Mangystau road trip, especially for geology, photography and wide desert panoramas."
    }
  ];

  function categoryName(value) {
    switch (value) {
      case "mountains":
        return "Mountains";
      case "lakes":
        return "Lakes";
      case "canyons":
        return "Canyons & cliffs";
      case "parks":
        return "Parks & valleys";
      case "heritage":
        return "Heritage";
      default:
        return "Kazakhstan";
    }
  }

  function isFavorite(id) {
    return favorites.indexOf(id) !== -1;
  }

  function getFilteredDestinations() {
    const query = search.value.trim().toLowerCase();
    const selectedCategory = category.value;

    const filtered = destinations.filter(function (destination) {
      const matchesSearch =
        destination.name.toLowerCase().indexOf(query) !== -1 ||
        destination.region.toLowerCase().indexOf(query) !== -1;

      const matchesCategory =
        selectedCategory === "all" || destination.category === selectedCategory;

      const matchesFavorites =
        !favoritesOnly.checked || isFavorite(destination.id);

      return matchesSearch && matchesCategory && matchesFavorites;
    });

    if (sort.value === "name") {
      filtered.sort(function (a, b) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
    } else if (sort.value === "rating") {
      filtered.sort(function (a, b) {
        return Number(ratings[b.id] || 0) - Number(ratings[a.id] || 0);
      });
    } else if (sort.value === "favorites") {
      filtered.sort(function (a, b) {
        if (isFavorite(a.id) === isFavorite(b.id)) return 0;
        if (isFavorite(a.id)) return -1;
        return 1;
      });
    }

    return filtered;
  }

  function renderDestinations() {
    const filtered = getFilteredDestinations();
    grid.innerHTML = "";

    filtered.forEach(function (destination) {
      const column = document.createElement("div");
      column.className = "col-sm-12 col-md-6 col-lg-4";

      const card = document.createElement("article");
      card.className = "card destination-card destination-explorer-card h-100";

      const saved = isFavorite(destination.id);

      card.innerHTML = `
        <img src="${destination.image}" class="destination-img" alt="${destination.name}" loading="lazy">
        <div class="card-body d-flex flex-column p-4">
          <div class="d-flex justify-content-between gap-3 align-items-start">
            <div>
              <p class="destination-meta mb-1">${destinationHelper.getMeta(destination)}</p>
              <h3 class="card-title">${destination.name}</h3>
            </div>
            <button class="favorite-btn ${saved ? "is-saved" : ""}"
                    type="button"
                    data-favorite="${destination.id}"
                    aria-pressed="${saved ? "true" : "false"}"
                    aria-label="${saved ? "Remove from favorites" : "Save to favorites"}">
              ${saved ? "♥" : "♡"}
            </button>
          </div>
          <p class="card-text">${destination.short}</p>
          <p class="destination-more" data-details="${destination.id}">${destination.details}</p>
          <div class="destination-rating mb-3" data-rating="${destination.id}" aria-label="Rate ${destination.name}"></div>
          <div class="d-flex gap-2 mt-auto">
            <button class="btn btn-outline-primary flex-grow-1 read-more-btn"
                    type="button"
                    data-read-more="${destination.id}"
                    aria-expanded="false">Read more</button>
            <a href="planner.html" class="btn btn-primary flex-grow-1">Plan trip</a>
          </div>
        </div>
      `;

      column.appendChild(card);
      grid.appendChild(column);

      const ratingWrap = card.querySelector('[data-rating="' + destination.id + '"]');
      const currentRating = Number(ratings[destination.id] || 0);

      for (let i = 1; i <= 5; i++) {
        const star = document.createElement("button");
        star.type = "button";
        star.className = "rating-star";
        star.textContent = "★";
        star.setAttribute("aria-label", "Rate " + i + " out of 5");

        if (i <= currentRating) {
          star.classList.add("is-active");
        }

        star.addEventListener("click", function () {
          setRating(destination.id, i, ratingWrap);
        });

        ratingWrap.appendChild(star);
      }
    });

    let placeWord = "places";
    if (filtered.length === 1) placeWord = "place";

    count.textContent = filtered.length + " " + placeWord + " found · " + favorites.length + " saved";

    emptyState.hidden = filtered.length !== 0;

    grid.querySelectorAll(".read-more-btn").forEach(function (button) {
      button.addEventListener("click", handleReadMore);
    });

    grid.querySelectorAll(".favorite-btn").forEach(function (button) {
      button.addEventListener("click", handleFavoriteClick);
    });
  }

  function handleReadMore(event) {
    const button = event.currentTarget;
    const id = button.getAttribute("data-read-more");
    const details = grid.querySelector('[data-details="' + id + '"]');
    const isOpen = button.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      details.style.display = "none";
      button.setAttribute("aria-expanded", "false");
      button.textContent = "Read more";
    } else {
      details.style.display = "block";
      button.setAttribute("aria-expanded", "true");
      button.textContent = "Show less";
    }

    playSiteSound("click");
  }

  function handleFavoriteClick(event) {
    const button = event.currentTarget;
    const id = button.getAttribute("data-favorite");
    const index = favorites.indexOf(id);

    if (index !== -1) {
      favorites.splice(index, 1);
      button.textContent = "♡";
      button.classList.remove("is-saved");
      button.setAttribute("aria-pressed", "false");
      button.setAttribute("aria-label", "Save to favorites");
      playSiteSound("click");
      showToast("Removed from saved places");
    } else {
      favorites.push(id);
      button.textContent = "♥";
      button.classList.add("is-saved");
      button.setAttribute("aria-pressed", "true");
      button.setAttribute("aria-label", "Remove from favorites");
      playSiteSound("favorite");
      showToast("Saved to your favorites");
    }

    button.classList.add("saved-animation");

    setTimeout(function () {
      button.classList.remove("saved-animation");

      if (favoritesOnly.checked || sort.value === "favorites") {
        renderDestinations();
      } else {
        updateDestinationCount();
      }
    }, 450);
  }

  function updateDestinationCount() {
    const filtered = getFilteredDestinations();
    let placeWord = "places";
    if (filtered.length === 1) placeWord = "place";

    count.textContent = filtered.length + " " + placeWord + " found · " + favorites.length + " saved";
  }

  function setRating(id, value, container) {
    ratings[id] = value;

    const stars = container.querySelectorAll(".rating-star");

    stars.forEach(function (star, index) {
      if (index < value) {
        star.classList.add("is-active");
      } else {
        star.classList.remove("is-active");
      }
    });

    playSiteSound("rating");
    showToast("Rating saved: " + value + " out of 5");

    if (sort.value === "rating") {
      renderDestinations();
    }
  }

  search.addEventListener("input", renderDestinations);
  category.addEventListener("change", renderDestinations);
  sort.addEventListener("change", renderDestinations);
  favoritesOnly.addEventListener("change", renderDestinations);

  clearFilters.addEventListener("click", function () {
    search.value = "";
    category.value = "all";
    sort.value = "featured";
    favoritesOnly.checked = false;
    renderDestinations();
    playSiteSound("click");
  });

  renderDestinations();
}
