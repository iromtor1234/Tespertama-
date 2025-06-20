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
      const existingText = keyBox.textContent ? keyBox.textContent + "\n" : "";
      keyBox.textContent = `${existingText}${entryCount}. Password: ${inputPassword}\nGet key: ${matched.key}`;
      keyBox.classList.remove("hidden");
    }, 5000);
  } else {
    keyBox.classList.add("hidden");
    spinner.classList.add("hidden");
    errorBox.classList.remove("hidden");
  }
});
