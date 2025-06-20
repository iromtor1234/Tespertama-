let config = [];
let wrongAttempts = 0;
let isBlocked = false;

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

  keyBox.classList.add("hidden");
  errorBox.classList.add("hidden");
  copyBtn.classList.add("hidden");
  spinner.classList.remove("hidden");

  const matched = config.find(entry => entry.password === inputPassword);

  setTimeout(() => {
    spinner.classList.add("hidden");
    if (matched) {
      wrongAttempts = 0;
      entryCount++;
      const keyText = `${entryCount}. Password: ${inputPassword}\nGet key: ${matched.key}`;
      const existingText = keyBox.textContent ? keyBox.textContent + "\n" : "";
      keyBox.textContent = existingText + keyText;
      keyBox.classList.remove("hidden");
      copyBtn.classList.remove("hidden");
      copyBtn.dataset.key = matched.key;
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
