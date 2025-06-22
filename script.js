let config = [
  { "password": "Rull123", "key": "KeyABC" },
  { "password": "Rull456", "key": "KeyDEF" }
];
let wrongAttempts = 0;
let isBlocked = false;
let keyVisible = true;
let entryCount = 0;
let deviceInfo = navigator.userAgent;

let userLocation = { lat: null, lon: null, ip: null, city: null, country: null };

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      userLocation.lat = pos.coords.latitude;
      userLocation.lon = pos.coords.longitude;
    }, () => getIPLocation(), { enableHighAccuracy: true });
  } else {
    getIPLocation();
  }
}

function getIPLocation() {
  fetch("https://ipapi.co/json/")
    .then(res => res.json())
    .then(data => {
      userLocation = { ...userLocation, ...{
        ip: data.ip,
        city: data.city,
        country: data.country_name,
        lat: data.latitude,
        lon: data.longitude
      }};
    });
}

getLocation();

document.getElementById("generateBtn").addEventListener("click", function () {
  if (isBlocked) return;

  const pwInput = document.getElementById("passwordInput");
  const keyBox = document.getElementById("keyBox");
  const errorBox = document.getElementById("errorBox");
  const spinner = document.getElementById("spinner");
  const copyBtn = document.getElementById("copyBtn");
  const toggleKeyBtn = document.getElementById("toggleKeyBtn");

  keyBox.style.display = "none";
  errorBox.style.display = "none";
  copyBtn.style.display = "none";
  toggleKeyBtn.style.display = "none";
  spinner.style.display = "inline-block";

  const matched = config.find(entry => entry.password === pwInput.value.trim());

  setTimeout(() => {
    spinner.style.display = "none";
    if (matched) {
      wrongAttempts = 0;
      entryCount++;
      const keyText = `${entryCount}. Password: ${pwInput.value}\nGet key: ${matched.key}\nDevice: ${deviceInfo}\nLoc: ${userLocation.lat},${userLocation.lon} IP:${userLocation.ip}`;
      keyBox.textContent += (keyBox.textContent ? "\n\n" : "") + keyText;
      keyBox.style.display = "block";
      copyBtn.style.display = "inline-block";
      toggleKeyBtn.style.display = "inline-block";
      copyBtn.dataset.key = matched.key;
      keyVisible = true;
      toggleKeyBtn.textContent = "🙈 Hide";
      showToast("✅ Key ditemukan!", true);
    } else {
      wrongAttempts++;
      errorBox.textContent = "❌ Password salah!";
      errorBox.style.color = "red";
      errorBox.style.display = "block";
      showToast("❌ Password salah!", false);
      if (wrongAttempts >= 3) {
        isBlocked = true;
        errorBox.textContent = "⚠️ Salah 3x! Tunggu 10 detik...";
        this.disabled = true;
        pwInput.disabled = true;
        setTimeout(() => {
          isBlocked = false;
          wrongAttempts = 0;
          errorBox.style.display = "none";
          this.disabled = false;
          pwInput.disabled = false;
        }, 10000);
      }
    }
  }, matched ? 5000 : 3000);
});

document.getElementById("copyBtn").addEventListener("click", function () {
  navigator.clipboard.writeText(this.dataset.key).then(() => {
    showToast("✅ Key disalin!", true);
  }).catch(() => {
    showToast("❌ Gagal salin!", false);
  });
});

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

document.getElementById("toggleKeyBtn").addEventListener("click", function () {
  const keyBox = document.getElementById("keyBox");
  if (keyVisible) {
    keyBox.textContent = keyBox.textContent.replace(/[^\n]/g, "•");
    keyVisible = false;
    this.textContent = "👁 Show";
  } else {
    // Restore not safe, simplenya pakai reload
    showToast("⚠️ Reload untuk lihat key penuh", false);
  }
});

function showToast(message, isSuccess) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.background = isSuccess ? "#28a745" : "#dc3545";
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.padding = "10px 15px";
  toast.style.color = "#fff";
  toast.style.borderRadius = "5px";
  toast.style.opacity = "0";
  toast.style.transition = "all 0.3s ease";
  toast.style.transform = "translateY(20px)";
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  }, 50);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
