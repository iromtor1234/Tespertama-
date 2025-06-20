let config = [];

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
  const inputPassword = document.getElementById("passwordInput").value;
  const keyBox = document.getElementById("keyBox");
  const errorBox = document.getElementById("errorBox");
  const spinner = document.getElementById("spinner");

  const matched = config.find(entry => entry.password === inputPassword);

  if (matched) {
    keyBox.classList.add("hidden");
    errorBox.classList.add("hidden");
    spinner.classList.remove("hidden");

    setTimeout(() => {
      spinner.classList.add("hidden");
      entryCount++;
      const keyText = `${entryCount}. Password: ${inputPassword}\nGet key: ${matched.key}`;
      const existingText = keyBox.textContent ? keyBox.textContent + "\n" : "";
      keyBox.textContent = existingText + keyText;
      keyBox.classList.remove("hidden");

      copyToClipboard(matched.key);
    }, 5000);
  } else {
    keyBox.classList.add("hidden");
    spinner.classList.add("hidden");
    errorBox.classList.remove("hidden");
  }
});

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast("✅ Key berhasil disalin!", true);
  }).catch(err => {
    showToast("❌ Gagal menyalin key!", false);
    console.error('Gagal menyalin key:', err);
  });
}

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
