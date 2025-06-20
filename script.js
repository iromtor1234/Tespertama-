let config = {
  passwords: ["Rull"],
  keyLength: 20,
  keyPrefix: "",
  keySuffix: ""
};

// Ambil config dari config.json
fetch('config.json')
  .then(response => response.json())
  .then(data => {
    config = data;
  })
  .catch(err => {
    console.error('Gagal load config.json, pakai default.', err);
  });

document.getElementById("generateBtn").addEventListener("click", function () {
  const inputPassword = document.getElementById("passwordInput").value;
  const keyBox = document.getElementById("keyBox");
  const errorBox = document.getElementById("errorBox");

  // Cek apakah password termasuk salah satu yang valid
  if (config.passwords.includes(inputPassword)) {
    keyBox.classList.add("hidden");
    errorBox.classList.add("hidden");
    keyBox.textContent = "Processing... Please wait";
    keyBox.classList.remove("hidden");
    keyBox.classList.add("loading");

    setTimeout(() => {
      const randomPart = generateKey(config.keyLength);
      const finalKey = `${config.keyPrefix}${randomPart}${config.keySuffix}`;
      keyBox.classList.remove("loading");
      keyBox.textContent = finalKey;
    }, 5000);
  } else {
    keyBox.classList.add("hidden");
    errorBox.classList.remove("hidden");
  }
});

function generateKey(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
      }
