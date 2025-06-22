let config = [
  { "password": "Rull123", "key": "KeyABC" },
  { "password": "Rull456", "key": "KeyDEF" }
];
let wrongAttempts = 0;
let isBlocked = false;
let keyVisible = true;
let entryCount = 0;
let deviceInfo = navigator.userAgent;

// ==== Ambil lokasi ====
let userLocation = {
  lat: null,
  lon: null,
  ip: null,
  city: null,
  country: null
};

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      userLocation.lat = pos.coords.latitude;
      userLocation.lon = pos.coords.longitude;
      console.log("GPS:", userLocation.lat, userLocation.lon);
    }, (err) => {
      console.warn("GPS gagal, fallback IP");
      getIPLocation();
    }, { enableHighAccuracy: true });
  } else {
    console.warn("Browser tidak support geolocation");
    getIPLocation();
  }
}

function getIPLocation() {
  fetch("https://ipapi.co/json/")
    .then(res => res.json())
    .then(data => {
      userLocation.ip = data.ip;
      userLocation.city = data.city;
      userLocation.country = data.country_name;
      userLocation.lat = data.latitude;
      userLocation.lon = data.longitude;
      console.log("IP Loc:", data);
    })
    .catch(() => console.error("IP location gagal"));
}

getLocation();

// ==== Event Get Key ====
document.getElementById("generateBtn").addEventListener("click", function () {
  if (isBlocked) return;

  const inputPassword = document.getElementById("passwordInput").value.trim();
  const keyBox = document.getElementById("keyBox");
  const errorBox = document.getElementById("errorBox");
  const spinner = document.getElementById("spinner");
  const copyBtn = document.getElementById("copyBtn");
  const toggleKeyBtn = document.getElementById("toggleKeyBtn");

  keyBox.classList.add("hidden");
  errorBox.classList.add("hidden");
  copyBtn.classList.add("hidden");
  toggleKeyBtn.classList.add("hidden");
  spinner.style.display = "inline-block";

  const matched = config.find(entry => entry.password === inputPassword);

  setTimeout(() => {
    spinner.style.display = "none";
    if (matched) {
      wrongAttempts = 0;
      entryCount++;
      const keyText = `${entryCount}. Password: ${inputPassword}\nGet key: ${matched.key}\nDevice: ${deviceInfo}\nLokasi: ${userLocation.lat}, ${userLocation.lon}\nIP: ${userLocation.ip}`;
      const existingText = keyBox.dataset.fulltext ? keyBox.dataset.fulltext + "\n\n" : "";
      keyBox.dataset.fulltext = existingText + keyText;
      keyBox.textContent = keyBox.dataset.fulltext;
      keyBox.classList.remove("hidden");
      copyBtn.classList.remove("hidden");
      toggleKeyBtn.classList.remove("hidden");
      copyBtn.dataset.key = matched.key;
      keyVisible = true;
      toggleKeyBtn.textContent = "🙈 Hide";
      showToast("✅ Key ditemukan!", true);
    } else {
      wrongAttempts++;
      errorBox.textContent = "❌ Password salah!";
      errorBox.classList.remove("hidden");
      showToast("❌ Password salah!", false);
      if (wrongAttempts >= 3) {
        isBlocked = true;
        errorBox.textContent = "⚠️ Terlalu banyak salah! Tunggu 10 detik...";
        document.getElementById("generateBtn").disabled = true;
        document.getElementById("passwordInput").disabled = true;
        setTimeout(() => {
          isBlocked = false;
          wrongAttempts = 0;
          errorBox.classList.add("hidden");
          document.getElementById("generateBtn").disabled = false;
          document.getElementById("passwordInput").disabled = false;
        }, 10000);
      }
    }
  }, matched ? 5000 : 3000);
});

// ==== Salin Key ====
document.getElementById("copyBtn").addEventListener("click", function () {
  const key = this.dataset.key;
  if (key) {
    navigator.clipboard.writeText(key).then(() => {
      showToast("✅ Key disalin!", true);
    }).catch(() => {
      showToast("❌ Gagal salin key!", false);
    });
  }
});

// ==== Toggle password visibility ====
document.getElementById("togglePwBtn").addEventListener("click", function () {
  const pwInput = document.getElementById("passwordInput");
  if (pwInput.type === "password") {
    pwInput.type = "text";
    this.textContent = "🙈";
  } else {
    pwInput.type = "password";
    this.textContent = "👁";
  }
});

// ==== Toggle key visibility ====
document.getElementById("toggleKeyBtn").addEventListener("click", function () {
  const keyBox = document.getElementById("keyBox");
  if (keyVisible) {
    keyBox.textContent = keyBox.textContent.replace(/[^\n]/g, "•");
    keyVisible = false;
    this.textContent = "👁 Show";
  } else {
    keyBox.textContent = keyBox.dataset.fulltext;
    keyVisible = true;
    this.textContent = "🙈 Hide";
  }
});

// ==== Toast ====
function showToast(message, isSuccess) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toast.style.background = isSuccess ? "#28a745" : "#dc3545";
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.color = "#fff";
  toast.style.padding = "10px 15px";
  toast.style.borderRadius = "5px";
  toast.style.opacity = "0";
  toast.style.transition = "all 0.3s ease";
  toast.style.transform = "translateY(20px)";
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  }, 100);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
                                                        }
