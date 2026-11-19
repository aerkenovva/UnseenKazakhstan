// ===== Shared data and localStorage keys =====
const STORAGE = {
  theme: "ukTheme",
  user: "ukUser",
  users: "ukUsers",
  session: "ukSession",
  favorites: "ukFavorites",
  ratings: "ukRatings",
  search: "ukSearchState",
  lastTrip: "ukLastTrip",
  accountCreated: "ukAccountCreated",
  sound: "ukSound"
};

const destinations = [
  { id: "kolsay", name: "Kolsay Lakes", region: "Almaty Region", category: "lakes", image: "images/kolsay-lake.jpg", season: "June–September", description: "A chain of clear alpine lakes surrounded by spruce forest and mountain trails." },
  { id: "bozzhyra", name: "Bozzhyra", region: "Mangystau Region", category: "canyons", image: "images/bozzhyra.jpg", season: "April–June", description: "White limestone cliffs and wide desert horizons that create one of Kazakhstan's most surreal views." },
  { id: "charyn", name: "Charyn Canyon", region: "Almaty Region", category: "canyons", image: "images/charyn-canyon.jpg", season: "April–June", description: "Red sandstone formations, deep valleys and a dramatic landscape shaped by wind and water." },
  { id: "kaindy", name: "Kaindy Lake", region: "Almaty Region", category: "lakes", image: "images/kaindy.jpg", season: "June–September", description: "A mountain lake known for the spruce trunks rising through its cold turquoise water." },
  { id: "bektau", name: "Bektau-Ata", region: "Karaganda Region", category: "mountains", image: "images/bektau-ata.jpg", season: "May–September", description: "A granite mountain oasis that rises unexpectedly from the open Central Kazakhstan steppe." },
  { id: "altyn", name: "Altyn Emel", region: "Jetisu Region", category: "parks", image: "images/altyn-emel.jpg", season: "April–June", description: "A national park of dry valleys, colorful mountains and the famous Singing Dune." },
  { id: "bayanaul", name: "Bayanaul", region: "Pavlodar Region", category: "lakes", image: "images/bayanaul.jpg", season: "June–August", description: "A green mountain-and-lake escape with unusual rock forms and quiet forest routes." },
  { id: "karkaraly", name: "Karkaraly", region: "Karaganda Region", category: "mountains", image: "images/karkaraly.jpg", season: "May–September", description: "Forested mountain country with lakes, granite ridges and peaceful hiking routes." },
  { id: "turgen", name: "Turgen Gorge", region: "Almaty Region", category: "parks", image: "images/turgen.jpg", season: "May–October", description: "A green gorge with river scenery, waterfalls and easy access from Almaty." },
  { id: "akkergeshen", name: "Akkergeshen", region: "Atyrau Region", category: "canyons", image: "images/akkergeshen.jpg", season: "April–June", description: "Ancient chalk formations and open steppe that create a rare white desert landscape." },
  { id: "big-almaty", name: "Big Almaty Lake", region: "Almaty Region", category: "lakes", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Big%20Almaty%20Lake%2C%20Almaty%2C%20Kazakhstan%20%28Unsplash%29.jpg?width=960", fallback: "images/big-almaty-fallback.svg", season: "June–October", description: "A high-altitude turquoise lake framed by the peaks of the Trans-Ili Alatau." },
  { id: "issyk", name: "Issyk Lake", region: "Almaty Region", category: "lakes", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Issyk%20lake.jpg?width=960", fallback: "images/issyk-fallback.svg", season: "May–September", description: "An emerald mountain lake near Almaty with forested slopes and a calm alpine setting." },
  { id: "katon", name: "Katon-Karagay", region: "East Kazakhstan Region", category: "parks", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Katon-Karagay%20National%20Park.jpg?width=960", fallback: "images/katon-fallback.svg", season: "June–September", description: "Wide Altai valleys, rivers and mountain forests in one of Kazakhstan's largest national parks." },
  { id: "sairam", name: "Sairam-Ugam", region: "Turkistan Region", category: "mountains", image: "https://commons.wikimedia.org/wiki/Special:FilePath/%D0%A1%D0%B0%D0%B9%D1%80%D0%B0%D0%BC%20%D1%83%D0%B3%D0%B0%D0%BC.jpg?width=960", fallback: "images/sairam-fallback.svg", season: "May–October", description: "Western Tien Shan scenery with green valleys, rivers and dramatic mountain routes." },
  { id: "ustyurt", name: "Ustyurt Plateau", region: "Mangystau Region", category: "deserts", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Ustjurt-plateau%20%286593022525%29.jpg?width=960", fallback: "images/ustyurt-fallback.svg", season: "April–May", description: "A remote limestone plateau of cliffs, open horizons and stark desert landscapes." }
];

const weatherLocations = {
  almaty: { label: "Almaty", lat: 43.2389, lon: 76.8897 },
  aktau: { label: "Aktau", lat: 43.65, lon: 51.15 },
  karaganda: { label: "Karaganda", lat: 49.806, lon: 73.085 },
  astana: { label: "Astana", lat: 51.1694, lon: 71.4491 },
  shymkent: { label: "Shymkent", lat: 42.3155, lon: 69.5869 },
  oskemen: { label: "Oskemen", lat: 49.9483, lon: 82.6275 }
};

let toastTimer;

// ===== Optional sound feedback =====
function soundEnabled() {
  return localStorage.getItem(STORAGE.sound) !== "off";
}

function playSiteSound(name) {
  if (!soundEnabled()) return;
  const audio = new Audio("sounds/" + name + ".wav");
  audio.volume = 0.16;
  audio.play().catch(function () {});
}

function updateSoundButton() {
  const button = document.getElementById("soundToggleBtn");
  if (!button) return;
  const enabled = soundEnabled();
  button.textContent = enabled ? "♪" : "×";
  button.classList.toggle("is-muted", !enabled);
  button.setAttribute("aria-label", enabled ? "Turn sounds off" : "Turn sounds on");
  button.title = enabled ? "Sounds on" : "Sounds off";
}

function initSound() {
  const button = document.getElementById("soundToggleBtn");
  if (!button) return;
  updateSoundButton();
  button.addEventListener("click", function () {
    const next = soundEnabled() ? "off" : "on";
    localStorage.setItem(STORAGE.sound, next);
    updateSoundButton();
    if (next === "on") playSiteSound("theme");
  });
}

// ===== Safe localStorage helpers =====
function getStoredJSON(key, fallback) {
  const value = localStorage.getItem(key);
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn("Unable to save browser data:", error);
    return false;
  }
}

// Scope user-generated data by signed-in email so accounts do not share favorites, ratings, searches or trips.
function storageScope() {
  const user = getCurrentUser();
  return user && user.email ? user.email.toLowerCase() : "guest";
}

function scopedKey(baseKey) {
  return baseKey + "::" + storageScope();
}

// Migrate legacy unscoped data only after a real user signs in; guest visits must not claim another user's data.
function getScopedJSON(baseKey, fallback) {
  const scope = storageScope();
  const key = baseKey + "::" + scope;
  const stored = getStoredJSON(key, null);
  if (stored !== null) return stored;

  // Keep legacy data intact for guests. It is migrated only after the
  // original user signs in, so an anonymous visit cannot "steal" it.
  const legacy = getStoredJSON(baseKey, null);
  if (legacy !== null && scope !== "guest") {
    saveJSON(key, legacy);
    localStorage.removeItem(baseKey);
    return legacy;
  }
  return fallback;
}

function saveScopedJSON(baseKey, value) {
  return saveJSON(scopedKey(baseKey), value);
}

function normalizePhone(value) {
  let digits = String(value || "").replace(/\D/g, "");
  // Kazakhstan users often type the same number as +7... or 8.... Normalize both formats
  // so duplicate-account checks cannot be bypassed by changing only the prefix.
  if (digits.length === 11 && digits.startsWith("8")) digits = "7" + digits.slice(1);
  return digits;
}

function getUsers() {
  const users = getStoredJSON(STORAGE.users, []);
  if (Array.isArray(users) && users.length) return users;

  const legacyUser = getStoredJSON(STORAGE.user, null);
  if (legacyUser && legacyUser.email) {
    const migrated = [legacyUser];
    saveJSON(STORAGE.users, migrated);
    return migrated;
  }
  return [];
}

function saveUsers(users) {
  saveJSON(STORAGE.users, users);
}

function getCurrentUser() {
  const session = localStorage.getItem(STORAGE.session);
  if (!session) return null;
  return getUsers().find(function (user) {
    return String(user.email || "").toLowerCase() === String(session).toLowerCase();
  }) || null;
}

function upsertUser(user) {
  const users = getUsers();
  const index = users.findIndex(function (item) {
    return String(item.email || "").toLowerCase() === String(user.email || "").toLowerCase();
  });
  if (index === -1) users.push(user);
  else users[index] = user;
  saveUsers(users);
  saveJSON(STORAGE.user, user);
}

// ===== Avatar rendering and compression =====
function setAvatarContent(element, avatar, fallback) {
  if (!element) return;
  element.classList.toggle("has-image", Boolean(avatar));
  element.textContent = "";
  if (avatar) {
    const image = document.createElement("img");
    image.src = avatar;
    image.alt = "Profile photo";
    element.appendChild(image);
  } else {
    element.textContent = fallback || "U";
  }
}

// Resize uploaded avatars in a canvas and convert them to a compact JPEG before storing in localStorage.
function readAvatarFile(file, onSuccess, onError) {
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    onError("Choose an image file.");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    onError("Choose an image smaller than 5 MB.");
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", function () {
    const image = new Image();
    image.addEventListener("load", function () {
      const maxSide = 420;
      const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) {
        onError("The image could not be prepared.");
        return;
      }
      context.drawImage(image, 0, 0, width, height);
      onSuccess(canvas.toDataURL("image/jpeg", 0.82));
    });
    image.addEventListener("error", function () {
      onError("The image could not be loaded.");
    });
    image.src = reader.result;
  });
  reader.addEventListener("error", function () {
    onError("The image could not be loaded.");
  });
  reader.readAsDataURL(file);
}

// ===== Password visibility and account navigation =====
function initPasswordToggles() {
  document.querySelectorAll(".password-toggle").forEach(function (button) {
    button.addEventListener("click", function () {
      const input = document.getElementById(button.getAttribute("data-target"));
      if (!input) return;
      const visible = input.type === "text";
      input.type = visible ? "password" : "text";
      button.classList.toggle("is-visible", !visible);
      button.setAttribute("aria-label", visible ? "Show password" : "Hide password");
      button.title = visible ? "Show password" : "Hide password";
    });
  });
}

function showToast(message) {
  let $toast = $("#siteToast");
  if ($toast.length === 0) {
    $toast = $("<div>", { id: "siteToast", class: "site-toast", role: "status", "aria-live": "polite" }).appendTo("body");
  }
  clearTimeout(toastTimer);
  $toast.stop(true, true).text(message).hide().fadeIn(180);
  toastTimer = setTimeout(function () {
    $toast.fadeOut(400);
  }, 1800);
}

function updateThemeButton() {
  const button = document.getElementById("themeToggleBtn");
  if (!button) return;
  const dark = document.documentElement.getAttribute("data-theme") === "dark";
  button.textContent = dark ? "☀" : "☾";
  button.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  button.title = dark ? "Switch to light theme" : "Switch to dark theme";
}

function initTheme() {
  const button = document.getElementById("themeToggleBtn");
  if (!button) return;
  updateThemeButton();
  button.addEventListener("click", function () {
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    const nextTheme = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem(STORAGE.theme, nextTheme);
    updateThemeButton();
    playSiteSound("theme");
  });
}

function updateAccountNavigation() {
  const link = document.getElementById("accountLink");
  if (!link) return;
  const user = getCurrentUser();
  link.textContent = "";
  if (user) {
    const firstName = user.name.trim().split(" ")[0] || "Profile";
    const avatar = document.createElement("span");
    avatar.className = "nav-account-avatar";
    setAvatarContent(avatar, user.avatar || "", firstName.charAt(0).toUpperCase());
    const name = document.createElement("span");
    name.textContent = firstName;
    link.append(avatar, name);
    link.href = "profile.html";
  } else {
    link.textContent = "Sign in";
    link.href = "login.html";
  }
}

function updateYear() {
  document.querySelectorAll(".current-year").forEach(function (element) {
    element.textContent = new Date().getFullYear();
  });
}

function initAccordion() {
  document.querySelectorAll(".accordion-question").forEach(function (button) {
    button.addEventListener("click", function () {
      const answer = button.nextElementSibling;
      if (!answer) return;
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!open));
      answer.classList.toggle("is-open", !open);
    });
  });
}

function initTripSuggestion() {
  const button = document.getElementById("tripSuggestionBtn");
  const select = document.getElementById("tripMoodSelect");
  const result = document.getElementById("tripSuggestionResult");
  const destinationSelect = document.getElementById("tripDestination");
  if (!button || !select || !result) return;

  // Each travel style has several matching destinations. The previous result
  // is excluded so repeated clicks do not immediately return the same place.
  const suggestionPools = {
    nature: [
      { name: "Kolsay Lakes", reason: "quiet mountain lakes and forest scenery" },
      { name: "Kaindy Lake", reason: "a peaceful alpine lake with its famous submerged forest" },
      { name: "Big Almaty Lake", reason: "high-altitude views close to Almaty" },
      { name: "Issyk Lake", reason: "an easy lake escape surrounded by mountains" },
      { name: "Bayanaul", reason: "lakes, pine forest and relaxed nature trails" }
    ],
    adventure: [
      { name: "Bozzhyra", reason: "remote desert landscapes and dramatic cliffs" },
      { name: "Ustyurt Plateau", reason: "wide-open desert terrain and expedition atmosphere" },
      { name: "Bektau-Ata", reason: "rock formations, hiking and unusual mountain scenery" },
      { name: "Sairam-Ugam", reason: "mountain routes and a more active outdoor trip" },
      { name: "Akkergeshen", reason: "remote chalk landscapes far from typical tourist routes" }
    ],
    photography: [
      { name: "Charyn Canyon", reason: "strong shapes, warm colors and dramatic canyon light" },
      { name: "Bozzhyra", reason: "cinematic cliffs and minimalist desert compositions" },
      { name: "Kaindy Lake", reason: "one of Kazakhstan's most unusual lake scenes" },
      { name: "Altyn Emel", reason: "contrasting dunes, mountains and open landscapes" },
      { name: "Ustyurt Plateau", reason: "huge horizons and striking geological forms" }
    ],
    weekend: [
      { name: "Turgen Gorge", reason: "a convenient nature escape from Almaty" },
      { name: "Issyk Lake", reason: "an easy day or weekend route with mountain views" },
      { name: "Big Almaty Lake", reason: "a short scenic trip near the city" },
      { name: "Bayanaul", reason: "a relaxed weekend with lakes and forest" },
      { name: "Karkaraly", reason: "forest, mountains and manageable weekend routes" }
    ],
    culture: [
      { name: "Bektau-Ata", reason: "a landscape surrounded by local legends and stories" },
      { name: "Karkaraly", reason: "a place combining nature with regional history" },
      { name: "Sairam-Ugam", reason: "southern Kazakhstan landscapes close to historic cultural routes" },
      { name: "Altyn Emel", reason: "natural landmarks connected with history and local heritage" }
    ]
  };

  let lastSuggestion = "";

  button.addEventListener("click", function () {
    const candidates = suggestionPools[select.value] || suggestionPools.nature;
    const available = candidates.filter(function (item) {
      return item.name !== lastSuggestion;
    });
    const pool = available.length ? available : candidates;
    const selected = pool[Math.floor(Math.random() * pool.length)];

    lastSuggestion = selected.name;
    result.textContent = "Recommended: " + selected.name + " — " + selected.reason + ".";
    result.className = "form-message success mt-3";
    if (destinationSelect) destinationSelect.value = selected.name;
    button.textContent = "Suggest another place";
    showToast("Recommendation ready");
    playSiteSound("click");
  });
}

function weatherDescription(code) {
  if (code === 0) return "Clear sky";
  if (code === 1 || code === 2 || code === 3) return "Partly cloudy";
  if (code === 45 || code === 48) return "Foggy";
  if (code >= 51 && code <= 67) return "Rainy";
  if (code >= 71 && code <= 77) return "Snowy";
  if (code >= 80 && code <= 82) return "Rain showers";
  if (code >= 95) return "Thunderstorm";
  return "Mixed conditions";
}

// ===== External weather API: loading, timeout, success and error states =====
async function loadWeather() {
  const select = document.getElementById("weatherCity");
  const button = document.getElementById("weatherBtn");
  const result = document.getElementById("weatherResult");
  if (!select || !button || !result) return;

  const place = weatherLocations[select.value];
  if (!place) return;

  const originalText = button.textContent;
  playSiteSound("click");
  button.disabled = true;
  button.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Loading...';
  result.innerHTML = '<div class="form-message">Loading current weather...</div>';

  let timeout;
  try {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=" + place.lat + "&longitude=" + place.lon + "&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto";
    const controller = new AbortController();
    timeout = setTimeout(function () { controller.abort(); }, 8000);
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error("Weather request failed");
    const data = await response.json();
    const current = data.current;
    if (!current) throw new Error("Weather data missing");
    const updated = current.time ? current.time.replace("T", " ") : "now";
    result.innerHTML = '<div class="weather-main"><div><div class="destination-meta">' + place.label + '</div><div class="weather-temp">' + Math.round(current.temperature_2m) + '°C</div></div><span class="tag">' + weatherDescription(current.weather_code) + '</span></div><div class="weather-meta"><div><strong>Feels like</strong><br>' + Math.round(current.apparent_temperature) + '°C</div><div><strong>Wind</strong><br>' + Math.round(current.wind_speed_10m) + ' km/h</div></div><div class="destination-meta mt-3">Updated ' + updated + ' · Open-Meteo public API</div>';
  } catch (error) {
    result.innerHTML = '<div class="form-message error">Weather data is unavailable right now. Please try again.</div>';
    playSiteSound("error");
  } finally {
    if (timeout) clearTimeout(timeout);
    button.disabled = false;
    button.textContent = originalText;
  }
}

function initWeather() {
  const button = document.getElementById("weatherBtn");
  if (button) button.addEventListener("click", loadWeather);
}

function clearFieldState(input, errorId) {
  if (!input) return;
  input.classList.remove("input-error", "input-success");
  input.removeAttribute("aria-invalid");
  const error = document.getElementById(errorId);
  if (error) {
    error.textContent = "";
    error.removeAttribute("role");
  }
}

function focusFirstInvalid(form) {
  const first = form ? form.querySelector(".input-error") : null;
  if (first) first.focus();
}

function markInvalid(input, errorId, message) {
  if (input) {
    input.classList.remove("input-success");
    input.classList.add("input-error");
    input.setAttribute("aria-invalid", "true");
  }
  const error = document.getElementById(errorId);
  if (error) {
    error.textContent = message;
    error.setAttribute("role", "alert");
  }
}

function markValid(input) {
  if (!input) return;
  input.classList.remove("input-error");
  input.classList.add("input-success");
  input.setAttribute("aria-invalid", "false");
}

// ===== Shared form-validation helpers =====
function validName(value) {
  const cleaned = value.trim();
  return cleaned.length >= 2 && /\p{L}/u.test(cleaned);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function validPhone(value) {
  const cleaned = value.trim();
  if (!/^\+?[0-9()\s-]+$/.test(cleaned)) return false;
  const digits = normalizePhone(cleaned);
  return digits.length >= 10 && digits.length <= 15;
}

function validPassword(value) {
  return value.length >= 8 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value);
}

function initPasswordStrength() {
  const input = document.getElementById("signupPassword");
  const meter = document.getElementById("passwordStrengthBar");
  const label = document.getElementById("passwordStrengthText");
  if (!input || !meter || !label) return;

  function update() {
    const value = input.value;
    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[a-z]/.test(value)) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[0-9]/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;
    const labels = ["Start typing", "Weak", "Fair", "Good", "Strong", "Excellent"];
    meter.style.width = (score * 20) + "%";
    meter.dataset.score = String(score);
    label.textContent = labels[score];
  }

  input.addEventListener("input", update);
  update();
}

function runLoadingButton(button, message, onDone) {
  if (!button) {
    onDone();
    return;
  }
  const $button = $(button);
  const original = $button.html();
  $button.prop("disabled", true).html('<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> ' + message);
  setTimeout(function () {
    $button.prop("disabled", false).html(original);
    onDone();
  }, 700);
}

function bindLiveFieldReset(form) {
  if (!form) return;

  function clearLiveError(event) {
    const input = event.target;
    if (!input || !input.classList) return;
    input.classList.remove("input-error");
    input.removeAttribute("aria-invalid");

    const describedBy = (input.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
    describedBy.forEach(function (id) {
      const error = document.getElementById(id);
      if (error && error.classList.contains("field-error")) {
        error.textContent = "";
        error.removeAttribute("role");
      }
    });
  }

  form.addEventListener("input", clearLiveError);
  form.addEventListener("change", clearLiveError);
}

// ===== Sign Up / Sign In / Profile authentication simulation =====
function initSignup() {
  const form = document.getElementById("signupForm");
  if (!form) return;
  const name = document.getElementById("signupName");
  const phone = document.getElementById("signupPhone");
  const email = document.getElementById("signupEmail");
  const password = document.getElementById("signupPassword");
  const confirm = document.getElementById("signupConfirm");
  const message = document.getElementById("signupMessage");
  const button = document.getElementById("signupSubmitBtn");
  const avatarInput = document.getElementById("signupAvatarInput");
  const avatarPreview = document.getElementById("signupAvatarPreview");
  const avatarRemove = document.getElementById("signupAvatarRemove");
  const avatarError = document.getElementById("signupAvatarError");
  let avatarData = "";
  bindLiveFieldReset(form);

  if (avatarInput) {
    avatarInput.addEventListener("change", function () {
      const file = avatarInput.files[0];
      if (!file) return;
      readAvatarFile(file, function (value) {
        avatarData = value;
        setAvatarContent(avatarPreview, avatarData, "U");
        avatarRemove.hidden = false;
        avatarError.textContent = "";
      }, function (error) {
        avatarInput.value = "";
        avatarError.textContent = error;
        playSiteSound("error");
      });
    });
  }

  if (avatarRemove) {
    avatarRemove.addEventListener("click", function () {
      avatarData = "";
      avatarInput.value = "";
      avatarRemove.hidden = true;
      avatarError.textContent = "";
      setAvatarContent(avatarPreview, "", "U");
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearFieldState(name, "signupNameError");
    clearFieldState(phone, "signupPhoneError");
    clearFieldState(email, "signupEmailError");
    clearFieldState(password, "signupPasswordError");
    clearFieldState(confirm, "signupConfirmError");
    let ok = true;

    if (!validName(name.value)) {
      markInvalid(name, "signupNameError", "Enter your full name (at least 2 characters).");
      ok = false;
    } else markValid(name);

    if (!validPhone(phone.value.trim())) {
      markInvalid(phone, "signupPhoneError", "Enter a valid phone number.");
      ok = false;
    } else markValid(phone);

    if (!validEmail(email.value.trim())) {
      markInvalid(email, "signupEmailError", "Enter a valid email address.");
      ok = false;
    } else markValid(email);

    if (!validPassword(password.value)) {
      markInvalid(password, "signupPasswordError", "Use 8+ characters with upper, lower and a number.");
      ok = false;
    } else markValid(password);

    if (!confirm.value || confirm.value !== password.value) {
      markInvalid(confirm, "signupConfirmError", "Passwords must match.");
      ok = false;
    } else markValid(confirm);

    if (!ok) {
      message.textContent = "Please correct the highlighted fields.";
      message.className = "form-message error";
      playSiteSound("error");
      focusFirstInvalid(form);
      return;
    }

    const normalizedEmail = email.value.trim().toLowerCase();
    const normalizedPhone = normalizePhone(phone.value);
    const users = getUsers();
    const emailExists = users.some(function (user) { return String(user.email || "").toLowerCase() === normalizedEmail; });
    const phoneExists = users.some(function (user) { return normalizePhone(user.phone) === normalizedPhone; });

    if (emailExists || phoneExists) {
      if (emailExists) markInvalid(email, "signupEmailError", "An account with this email already exists.");
      if (phoneExists) markInvalid(phone, "signupPhoneError", "An account with this phone number already exists.");
      message.textContent = "This account already exists. Please sign in instead.";
      message.className = "form-message error";
      playSiteSound("error");
      return;
    }

    const user = { name: name.value.trim(), phone: phone.value.trim(), email: normalizedEmail, password: password.value, avatar: avatarData };
    runLoadingButton(button, "Creating...", function () {
      upsertUser(user);
      localStorage.setItem(STORAGE.accountCreated, "yes");
      message.textContent = "Account created. Redirecting to Sign In...";
      message.className = "form-message success";
      playSiteSound("success");
      setTimeout(function () {
        window.location.href = "login.html";
      }, 500);
    });
  });
}

function initLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;
  const email = document.getElementById("loginEmail");
  const password = document.getElementById("loginPassword");
  const message = document.getElementById("loginMessage");
  const button = document.getElementById("loginSubmitBtn");
  bindLiveFieldReset(form);

  if (localStorage.getItem(STORAGE.accountCreated) === "yes") {
    message.textContent = "Account created successfully. Sign in with your new details.";
    message.className = "form-message success mt-3";
    localStorage.removeItem(STORAGE.accountCreated);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearFieldState(email, "loginEmailError");
    clearFieldState(password, "loginPasswordError");
    let ok = true;

    if (!validEmail(email.value.trim())) {
      markInvalid(email, "loginEmailError", "Enter a valid email address.");
      ok = false;
    } else markValid(email);

    if (!validPassword(password.value)) {
      markInvalid(password, "loginPasswordError", "Enter your 8+ character password with upper, lower and number.");
      ok = false;
    } else markValid(password);

    if (!ok) {
      message.textContent = "Please correct the highlighted fields.";
      message.className = "form-message error mt-3";
      playSiteSound("error");
      focusFirstInvalid(form);
      return;
    }

    const normalizedEmail = email.value.trim().toLowerCase();
    const user = getUsers().find(function (item) {
      return String(item.email || "").toLowerCase() === normalizedEmail && item.password === password.value;
    }) || null;
    runLoadingButton(button, "Signing in...", function () {
      if (!user) {
        message.textContent = "Email or password is incorrect. Create an account first if needed.";
        message.className = "form-message error mt-3";
        playSiteSound("error");
        return;
      }
      localStorage.setItem(STORAGE.session, user.email);
      upsertUser(user);
      message.textContent = "Signed in successfully. Opening your profile...";
      message.className = "form-message success mt-3";
      playSiteSound("success");
      setTimeout(function () {
        window.location.href = "profile.html";
      }, 450);
    });
  });
}

function initProfile() {
  const title = document.getElementById("profileTitle");
  if (!title) return;
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const favorites = getFavorites();
  const trip = getScopedJSON(STORAGE.lastTrip, null);
  const firstName = user.name.trim().split(" ")[0] || "Traveler";

  const profileAvatar = document.getElementById("profileAvatar");
  const profileAvatarInput = document.getElementById("profileAvatarInput");
  const removeAvatarBtn = document.getElementById("removeAvatarBtn");
  const profileAvatarError = document.getElementById("profileAvatarError");
  setAvatarContent(profileAvatar, user.avatar || "", firstName.charAt(0).toUpperCase());
  if (removeAvatarBtn) removeAvatarBtn.hidden = !user.avatar;
  title.textContent = "Welcome, " + firstName;
  document.getElementById("profileName").textContent = user.name;
  document.getElementById("profileEmail").textContent = user.email;
  document.getElementById("profilePhone").textContent = user.phone;
  document.getElementById("profileFavorites").textContent = favorites.length;
  document.getElementById("profileTripDestination").textContent = trip ? trip.destination : "No trip yet";
  document.getElementById("profileTripPeople").textContent = trip ? trip.people : "—";

  const savedPreview = document.getElementById("profileSavedPreview");
  if (savedPreview) {
    if (!favorites.length) {
      savedPreview.innerHTML = '<span class="destination-meta">No saved places yet.</span>';
    } else {
      const savedNames = favorites.map(function (id) {
        const place = destinations.find(function (destination) { return destination.id === id; });
        return place ? place.name : null;
      }).filter(Boolean).slice(0, 4);
      savedPreview.innerHTML = '<div class="destination-meta mb-2">Recently saved</div><div class="saved-chip-row">' + savedNames.map(function (name) {
        return '<span class="saved-chip">' + name + '</span>';
      }).join("") + '</div>';
    }
  }

  if (profileAvatarInput) {
    profileAvatarInput.addEventListener("change", function () {
      const file = profileAvatarInput.files[0];
      if (!file) return;
      readAvatarFile(file, function (value) {
        user.avatar = value;
        upsertUser(user);
        setAvatarContent(profileAvatar, value, firstName.charAt(0).toUpperCase());
        if (removeAvatarBtn) removeAvatarBtn.hidden = false;
        profileAvatarError.textContent = "";
        updateAccountNavigation();
        playSiteSound("success");
        showToast("Profile photo updated");
      }, function (error) {
        profileAvatarInput.value = "";
        profileAvatarError.textContent = error;
        playSiteSound("error");
      });
    });
  }

  if (removeAvatarBtn) {
    removeAvatarBtn.addEventListener("click", function () {
      user.avatar = "";
      upsertUser(user);
      profileAvatarInput.value = "";
      removeAvatarBtn.hidden = true;
      profileAvatarError.textContent = "";
      setAvatarContent(profileAvatar, "", firstName.charAt(0).toUpperCase());
      updateAccountNavigation();
      playSiteSound("click");
      showToast("Profile photo removed");
    });
  }

  document.getElementById("logoutBtn").addEventListener("click", function () {
    playSiteSound("click");
    localStorage.removeItem(STORAGE.session);
    window.location.href = "index.html";
  });
}

function prefillTripForm() {
  const form = document.getElementById("tripForm");
  if (!form) return;
  const user = getCurrentUser();
  if (!user) return;
  document.getElementById("tripName").value = user.name;
  document.getElementById("tripPhone").value = user.phone;
  document.getElementById("tripEmail").value = user.email;
}

// ===== Trip Planner validation and per-account saved trip =====
function initTripForm() {
  const form = document.getElementById("tripForm");
  if (!form) return;
  prefillTripForm();
  const requestedDestination = new URLSearchParams(window.location.search).get("destination");
  const name = document.getElementById("tripName");
  const phone = document.getElementById("tripPhone");
  const email = document.getElementById("tripEmail");
  const destination = document.getElementById("tripDestination");
  const people = document.getElementById("tripPeople");
  const agreement = document.getElementById("tripAgreement");
  const notes = document.getElementById("tripNotes");
  const message = document.getElementById("tripFormMessage");
  const button = document.getElementById("tripSubmitBtn");
  bindLiveFieldReset(form);

  if (requestedDestination && destination) {
    const optionExists = Array.from(destination.options).some(function (option) {
      return option.value === requestedDestination;
    });
    if (optionExists) {
      destination.value = requestedDestination;
      const suggestionResult = document.getElementById("tripSuggestionResult");
      if (suggestionResult) {
        suggestionResult.textContent = "Selected from Hidden Gems: " + requestedDestination + ".";
        suggestionResult.className = "form-message success mt-3";
      }
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearFieldState(name, "tripNameError");
    clearFieldState(phone, "tripPhoneError");
    clearFieldState(email, "tripEmailError");
    clearFieldState(destination, "tripDestinationError");
    clearFieldState(people, "tripPeopleError");
    clearFieldState(agreement, "tripAgreementError");
    let ok = true;

    if (!validName(name.value)) {
      markInvalid(name, "tripNameError", "Enter your name (at least 2 characters).");
      ok = false;
    } else markValid(name);

    if (!validPhone(phone.value.trim())) {
      markInvalid(phone, "tripPhoneError", "Enter a valid phone number.");
      ok = false;
    } else markValid(phone);

    if (!validEmail(email.value.trim())) {
      markInvalid(email, "tripEmailError", "Enter a valid email address.");
      ok = false;
    } else markValid(email);

    if (!destination.value) {
      markInvalid(destination, "tripDestinationError", "Choose a destination.");
      ok = false;
    } else markValid(destination);

    const peopleNumber = Number(people.value);
    if (!Number.isInteger(peopleNumber) || peopleNumber < 1 || peopleNumber > 50) {
      markInvalid(people, "tripPeopleError", "Enter a whole number from 1 to 50.");
      ok = false;
    } else markValid(people);

    if (!agreement.checked) {
      markInvalid(agreement, "tripAgreementError", "Confirm the information before submitting.");
      ok = false;
    } else markValid(agreement);

    if (!ok) {
      message.textContent = "Please correct the highlighted fields.";
      message.className = "form-message error";
      playSiteSound("error");
      focusFirstInvalid(form);
      return;
    }

    const trip = { name: name.value.trim(), phone: phone.value.trim(), email: email.value.trim(), destination: destination.value, people: peopleNumber, notes: notes.value.trim() };
    runLoadingButton(button, "Please wait...", function () {
      saveScopedJSON(STORAGE.lastTrip, trip);
      message.textContent = "Your trip request is ready and saved in this browser.";
      message.className = "form-message success";
      showToast("Trip request submitted successfully");
      playSiteSound("success");
    });
  });

  form.addEventListener("reset", function () {
    setTimeout(function () {
      [name, phone, email, destination, people, agreement].forEach(function (input) {
        input.classList.remove("input-error", "input-success");
        input.removeAttribute("aria-invalid");
      });
      ["tripNameError", "tripPhoneError", "tripEmailError", "tripDestinationError", "tripPeopleError", "tripAgreementError"].forEach(function (id) {
        document.getElementById(id).textContent = "";
      });
      message.textContent = "Complete the fields and submit when ready.";
      message.className = "form-message";
      prefillTripForm();
    }, 0);
  });
}

function getFavorites() {
  return getScopedJSON(STORAGE.favorites, []);
}

function getRatings() {
  return getScopedJSON(STORAGE.ratings, {});
}

function saveSearchState() {
  const search = document.getElementById("destinationSearch");
  const category = document.getElementById("destinationCategory");
  const sort = document.getElementById("destinationSort");
  const favoritesOnly = document.getElementById("favoritesOnly");
  if (!search || !category || !sort || !favoritesOnly) return;
  saveScopedJSON(STORAGE.search, { query: search.value, category: category.value, sort: sort.value, favoritesOnly: favoritesOnly.checked });
}

// ===== Destination Explorer: search, filters, favorites, ratings and clipboard =====
function restoreSearchState() {
  const state = getScopedJSON(STORAGE.search, null);
  if (!state) return;
  const search = document.getElementById("destinationSearch");
  const category = document.getElementById("destinationCategory");
  const sort = document.getElementById("destinationSort");
  const favoritesOnly = document.getElementById("favoritesOnly");
  if (search) search.value = state.query || "";
  if (category) category.value = state.category || "all";
  if (sort) sort.value = state.sort || "featured";
  if (favoritesOnly) favoritesOnly.checked = Boolean(state.favoritesOnly);
}

function placeholderImage() {
  return "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applySearchHighlight() {
  const query = $("#destinationSearch").val();
  if (!query) return;
  const pattern = new RegExp("(" + escapeRegExp(query) + ")", "gi");
  $(".destination-title, .destination-region").each(function () {
    const text = $(this).text();
    $(this).html(text.replace(pattern, "<mark>$1</mark>"));
  });
}

function renderDestinations() {
  const grid = document.getElementById("destinationGrid");
  if (!grid) return;
  const query = document.getElementById("destinationSearch").value.trim().toLowerCase();
  const category = document.getElementById("destinationCategory").value;
  const sort = document.getElementById("destinationSort").value;
  const favoritesOnly = document.getElementById("favoritesOnly").checked;
  const favorites = getFavorites();
  const ratings = getRatings();

  let list = destinations.filter(function (destination) {
    const matchesText = destination.name.toLowerCase().includes(query) || destination.region.toLowerCase().includes(query);
    const matchesCategory = category === "all" || destination.category === category;
    const matchesFavorite = !favoritesOnly || favorites.includes(destination.id);
    return matchesText && matchesCategory && matchesFavorite;
  });

  if (sort === "name") list.sort(function (a, b) { return a.name.localeCompare(b.name); });
  if (sort === "rating") list.sort(function (a, b) { return (ratings[b.id] || 0) - (ratings[a.id] || 0); });

  grid.innerHTML = list.map(function (destination) {
    const saved = favorites.includes(destination.id);
    const rating = ratings[destination.id] || 0;
    const stars = [1, 2, 3, 4, 5].map(function (value) {
      return '<button class="rating-star ' + (value <= rating ? 'is-active' : '') + '" type="button" data-id="' + destination.id + '" data-rating="' + value + '" aria-pressed="' + (value === rating ? 'true' : 'false') + '" aria-label="Rate ' + destination.name + ' ' + value + ' stars">★</button>';
    }).join("");
    const fallback = destination.fallback || destination.image;
    const isLocalImage = destination.image.startsWith("images/");
    const imageClass = isLocalImage ? "destination-image is-loaded" : "destination-image lazy-image";
    const imageSource = isLocalImage ? destination.image : placeholderImage();
    const lazySource = isLocalImage ? "" : ' data-src="' + destination.image + '"';
    return '<div class="col-sm-12 col-md-6 col-lg-4"><article class="destination-card"><div class="destination-image-wrap"><img class="' + imageClass + '" src="' + imageSource + '"' + lazySource + ' data-fallback="' + fallback + '" alt="' + destination.name + '" loading="lazy" decoding="async"><button class="favorite-btn ' + (saved ? 'is-saved' : '') + '" type="button" data-id="' + destination.id + '" aria-pressed="' + (saved ? 'true' : 'false') + '" aria-label="' + (saved ? 'Remove ' + destination.name + ' from saved places' : 'Save ' + destination.name) + '">♥</button></div><div class="destination-body"><div class="d-flex justify-content-between align-items-center gap-2 mb-2"><span class="tag">' + destination.category + '</span><span class="destination-meta">' + destination.season + '</span></div><h3 class="destination-title mb-1">' + destination.name + '</h3><div class="destination-meta destination-region mb-3">' + destination.region + '</div><p class="destination-description">' + destination.description + '</p><div class="destination-actions"><a class="plan-place-link" href="planner.html?destination=' + encodeURIComponent(destination.name) + '">Plan this trip <span aria-hidden="true">→</span></a></div><div class="rating-row"><div><div class="destination-meta mb-1">Your rating</div><div class="rating-stars">' + stars + '</div></div><div class="card-actions"><span class="destination-meta">' + (saved ? 'Saved' : 'Save for later') + '</span><button class="copy-place-btn" type="button" data-copy-text="' + destination.name + ' — ' + destination.region + '" title="Copy destination" aria-label="Copy ' + destination.name + '">⧉</button></div></div></div></article></div>';
  }).join("");

  document.getElementById("destinationCount").textContent = list.length + " of " + destinations.length + " places shown";
  document.getElementById("noDestinations").hidden = list.length !== 0;
  applySearchHighlight();
  attachImageFallbacks(grid);
  loadVisibleImages();
  saveSearchState();
}

function updateSearchSuggestions() {
  const query = $("#destinationSearch").val().trim().toLowerCase();
  const $box = $("#searchSuggestions");
  if (!query) {
    $box.prop("hidden", true).empty();
    return;
  }
  const matches = destinations.filter(function (destination) {
    return destination.name.toLowerCase().includes(query) || destination.region.toLowerCase().includes(query);
  }).slice(0, 5);
  $box.empty();
  matches.forEach(function (destination) {
    $("<button>", { type: "button", class: "search-suggestion", "data-value": destination.name })
      .append($("<strong>").text(destination.name), $("<span>").text(destination.region))
      .appendTo($box);
  });
  $box.prop("hidden", matches.length === 0);
}

function copyText(value) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(value);
  }
  return new Promise(function (resolve, reject) {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      const copied = document.execCommand("copy");
      document.body.removeChild(textarea);
      copied ? resolve() : reject(new Error("Copy failed"));
    } catch (error) {
      document.body.removeChild(textarea);
      reject(error);
    }
  });
}

function initDestinationExplorer() {
  if (!document.getElementById("destinationGrid")) return;
  restoreSearchState();
  renderDestinations();

  $("#destinationSearch").on("keyup search", function (event) {
    if (event && event.key === "Escape") {
      $("#searchSuggestions").prop("hidden", true).empty();
      return;
    }
    renderDestinations();
    updateSearchSuggestions();
  });

  $("#destinationCategory, #destinationSort, #favoritesOnly").on("change", function () {
    playSiteSound("filter");
    renderDestinations();
  });

  $("#searchSuggestions").on("click", ".search-suggestion", function () {
    $("#destinationSearch").val($(this).attr("data-value"));
    $("#searchSuggestions").prop("hidden", true).empty();
    renderDestinations();
  });

  $("#clearDestinationFilters").on("click", function () {
    $("#destinationSearch").val("");
    $("#destinationCategory").val("all");
    $("#destinationSort").val("featured");
    $("#favoritesOnly").prop("checked", false);
    $("#searchSuggestions").prop("hidden", true).empty();
    playSiteSound("filter");
    renderDestinations();
  });

  $("#destinationGrid").on("click", ".favorite-btn", function () {
    const id = $(this).attr("data-id");
    const favorites = getFavorites();
    const index = favorites.indexOf(id);
    if (index === -1) {
      favorites.push(id);
      showToast("Destination saved");
    } else {
      favorites.splice(index, 1);
      showToast("Destination removed from saved places");
    }
    saveScopedJSON(STORAGE.favorites, favorites);
    playSiteSound("favorite");
    renderDestinations();
    updateAccountNavigation();
  });

  $("#destinationGrid").on("click", ".rating-star", function () {
    const id = $(this).attr("data-id");
    const value = Number($(this).attr("data-rating"));
    const ratings = getRatings();
    ratings[id] = value;
    saveScopedJSON(STORAGE.ratings, ratings);
    renderDestinations();
    playSiteSound("rating");
    showToast("Rating saved: " + value + " out of 5");
  });

  $("#destinationGrid").on("click", ".copy-place-btn", function () {
    const button = $(this);
    const value = button.attr("data-copy-text");
    copyText(value).then(function () {
      const original = button.text();
      button.text("✓").addClass("is-copied");
      playSiteSound("copy");
      showToast("Copied to clipboard");
      setTimeout(function () {
        button.text(original).removeClass("is-copied");
      }, 1200);
    }).catch(function () {
      showToast("Copy is unavailable in this browser");
      playSiteSound("error");
    });
  });
}

// Lazy-load destination images only near the viewport; swap to a local fallback if a remote image fails.
function loadVisibleImages() {
  const viewportBottom = $(window).scrollTop() + $(window).height() + 180;
  $("img.lazy-image[data-src]").each(function () {
    const $image = $(this);
    if ($image.offset().top <= viewportBottom) {
      const realSource = $image.attr("data-src");
      const fallback = $image.attr("data-fallback");
      $image.one("error", function () {
        if (fallback && $image.attr("src") !== fallback) {
          $image.attr("src", fallback);
        }
      });
      $image.attr("src", realSource).removeAttr("data-src").addClass("is-loaded");
    }
  });
}

function attachImageFallbacks(root) {
  const scope = root || document;
  scope.querySelectorAll("img[data-fallback]:not(.lazy-image)").forEach(function (image) {
    function useFallback() {
      const fallback = image.getAttribute("data-fallback");
      if (fallback && image.getAttribute("src") !== fallback) image.setAttribute("src", fallback);
    }

    image.addEventListener("error", useFallback, { once: true });
    // If an image failed before the handler was attached, repair it immediately.
    if (image.complete && image.naturalWidth === 0) useFallback();
  });
}

function initStaticImageFallbacks() {
  attachImageFallbacks(document);
}

function initLazyLoading() {
  $(window).on("scroll resize", loadVisibleImages);
  loadVisibleImages();
}

// ===== Shared jQuery UI effects: progress, counters and startup =====
function initScrollProgress() {
  function update() {
    const scrollable = $(document).height() - $(window).height();
    const percent = scrollable > 0 ? ($(window).scrollTop() / scrollable) * 100 : 0;
    $("#scrollProgress span").css("width", percent + "%");
  }
  $(window).on("scroll resize", update);
  update();
}

function initCounters() {
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  $(".jquery-counter").each(function () {
    const $counter = $(this);
    const target = Number($counter.attr("data-target"));
    if (reduceMotion) {
      $counter.text(target);
      return;
    }
    $({ value: 0 }).animate({ value: target }, {
      duration: 1100,
      step: function () {
        $counter.text(Math.floor(this.value));
      },
      complete: function () {
        $counter.text(target);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initTheme();
  initSound();
  initPasswordToggles();
  initPasswordStrength();
  updateAccountNavigation();
  updateYear();
  initAccordion();
  initTripSuggestion();
  initWeather();
  initSignup();
  initLogin();
  initProfile();
  initTripForm();
  initDestinationExplorer();
});

$(document).ready(function () {
  initScrollProgress();
  initCounters();
  initStaticImageFallbacks();
  initLazyLoading();
});
