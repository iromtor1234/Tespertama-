let config = [];
let wrongAttempts = 0;
let isBlocked = false;
let keyVisible = true;

fetch('config.json')
  .then(response => response.json())
  .then(data => {
    config = data;
  })
  .catch(err => {
    console.error('Gagal load config.json, pakai default.', err);
  });

let entryCount = 0;

document.getElementById("generateBtn").addEventListener("click", function () {
  if (isBlocked) return;

  const inputPassword = document.getElementById("passwordInput").value;
  const keyBox = document.getElementById("keyBox");
  const errorBox = document.getElementById("errorBox");
  const spinner = document.getElementById("spinner");
  const copyBtn = document.getElementById("copyBtn");
  const toggleKeyBtn = document.getElementById("toggleKeyBtn");

  keyBox.classList.add("hidden");
  errorBox.classList.add("hidden");
  copyBtn.classList.add("hidden");
  toggleKeyBtn.classList.add("hidden");
  spinner.classList.remove("hidden");

  const matched = config.find(entry => entry.password === inputPassword);

  setTimeout(() => {
    spinner.classList.add("hidden");
    if (matched) {
      wrongAttempts = 0;
      entryCount++;
      const keyText = `${entryCount}. Password: ${inputPassword}\nGet key: ${matched.key}`;
      const existingText = keyBox.dataset.fulltext ? keyBox.dataset.fulltext + "\n" : "";
      keyBox.dataset.fulltext = existingText + keyText;
      keyBox.textContent = keyBox.dataset.fulltext;
      keyBox.classList.remove("hidden");
      copyBtn.classList.remove("hidden");
      toggleKeyBtn.classList.remove("hidden");
      copyBtn.dataset.key = matched.key;
      keyVisible = true;
    } else {
      wrongAttempts++;
      errorBox.textContent = "Password salah!";
      errorBox.classList.remove("hidden");
      if (wrongAttempts >= 3) {
        isBlocked = true;
        errorBox.textContent = "Terlalu banyak percobaan salah! Tunggu 10 detik...";
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

document.getElementById("copyBtn").addEventListener("click", function () {
  const key = this.dataset.key;
  if (key) {
    navigator.clipboard.writeText(key).then(() => {
      showToast("✅ Key berhasil disalin!", true);
    }).catch(() => {
      showToast("❌ Gagal menyalin key!", false);
    });
  }
});

// Toggle password visibility
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

// Toggle key visibility
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

function showToast(message, isSuccess) {
  let toast = document.createElement("div");
  toast.textContent = message;
  toast.className = "toast";
  toast.style.background = isSuccess ? "#28a745" : "#dc3545";
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
    }
