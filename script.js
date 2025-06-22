let config = [
  { password: "Rull123", key: "KEY-RULL-123" },
  { password: "Rull456", key: "KEY-RULL-456" }
];

let wrongAttempts = 0, isBlocked = false, keyVisible = true, entryCount = 0;
let trackingData = "Loading...";

fetch("https://ipapi.co/json/")
  .then(r => r.json())
  .then(data => {
    const pulau = mapPulau(data.region_code, data.country_name);
    trackingData = 
`IP: ${data.ip}
Negara: ${data.country_name}
Pulau: ${pulau}
Device: ${navigator.userAgent}`;
  });

document.getElementById("generateBtn").addEventListener("click", function(){
  if(isBlocked) return;
  const pw = document.getElementById("passwordInput").value.trim();
  const keyBox = document.getElementById("keyBox");
  const errBox = document.getElementById("errorBox");
  const spinner = document.getElementById("spinner");
  const copyBtn = document.getElementById("copyBtn");
  const toggleKeyBtn = document.getElementById("toggleKeyBtn");

  keyBox.style.display = "none";
  errBox.style.display = "none";
  copyBtn.style.display = "none";
  toggleKeyBtn.style.display = "none";
  spinner.style.display = "inline";

  const match = config.find(c => c.password === pw);
  setTimeout(() => {
    spinner.style.display = "none";
    if(match){
      wrongAttempts = 0; entryCount++;
      keyBox.textContent = `${entryCount}. Password: ${pw}\nGet Key: ${match.key}`;
      keyBox.style.display = "block";
      copyBtn.style.display = "inline";
      toggleKeyBtn.style.display = "inline";
      copyBtn.dataset.key = match.key;
      keyVisible = true;
      toggleKeyBtn.textContent = "🙈 Hide";
      showToast("✅ Key ditemukan!", true);
    } else {
      wrongAttempts++;
      errBox.textContent = "❌ Password salah!";
      errBox.style.display = "block";
      showToast("❌ Password salah!", false);
      if(wrongAttempts >= 3){
        isBlocked = true;
        errBox.textContent = "⚠️ Salah 3x! Tunggu 10 detik...";
        this.disabled = true;
        document.getElementById("passwordInput").disabled = true;
        setTimeout(() => {
          isBlocked = false; wrongAttempts = 0;
          errBox.style.display = "none";
          this.disabled = false;
          document.getElementById("passwordInput").disabled = false;
        }, 10000);
      }
    }
  }, match ? 5000 : 3000);
});

document.getElementById("togglePwBtn").addEventListener("click", function(){
  const p = document.getElementById("passwordInput");
  if(p.type === "password"){ p.type = "text"; this.textContent = "🙈"; }
  else { p.type = "password"; this.textContent = "👁"; }
});

document.getElementById("toggleKeyBtn").addEventListener("click", function(){
  const keyBox = document.getElementById("keyBox");
  if(keyVisible){
    keyBox.textContent = keyBox.textContent.replace(/[^\n]/g,"•");
    keyVisible = false;
    this.textContent = "👁 Show";
  } else {
    location.reload();
  }
});

document.getElementById("copyBtn").addEventListener("click", function(){
  navigator.clipboard.writeText(this.dataset.key).then(() => {
    showToast("✅ Key disalin!", true);
  }).catch(() => {
    showToast("❌ Gagal salin!", false);
  });
});

document.getElementById("buyKeyBtn").addEventListener("click", function(){
  window.open("https://t.me/ARullReal", "_blank");
});

document.getElementById("whoSeeBtn").addEventListener("click", function(){
  document.getElementById("whoSeeModal").style.display = "block";
  document.getElementById("trackingInfo").textContent = trackingData;
});

function closeWhoSee(){
  document.getElementById("whoSeeModal").style.display = "none";
}

function mapPulau(region, country){
  if(country !== "Indonesia") return "-";
  if(["JK","BT","JB","BE","BA","YO","KI"].includes(region)) return "Jawa";
  if(["KR","SS","ST","SG"].includes(region)) return "Sulawesi";
  if(["RI","PB","PA"].includes(region)) return "Papua";
  if(["LA","SB","AC","SU"].includes(region)) return "Sumatera";
  if(["KS","KT","KI"].includes(region)) return "Kalimantan";
  return "-";
}

function showToast(msg, success){
  const t = document.createElement("div");
  t.textContent = msg;
  t.className = "toast";
  t.style.background = success ? "#28a745" : "#dc3545";
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = "1"; t.style.transform = "translateY(0)"; }, 50);
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transform = "translateY(20px)";
    setTimeout(() => t.remove(), 300);
  }, 3000);
}
