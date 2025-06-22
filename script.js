let config = [
  { password: "Rull123", key: "KeyABC" },
  { password: "Rull456", key: "KeyDEF" }
];
let adminPassword = "RullAdmin";
let wrongAttempts = 0, isBlocked = false, keyVisible = true, entryCount = 0;
let deviceInfo = navigator.userAgent;
let userLocation = { lat:null, lon:null, ip:null, city:null, country:null };

fetch("https://ipapi.co/json/").then(r=>r.json()).then(d=>{
  userLocation={lat:d.latitude, lon:d.longitude, ip:d.ip, city:d.city, country:d.country_name};
});

document.getElementById("generateBtn").addEventListener("click", function(){
  if(isBlocked) return;
  const pw = document.getElementById("passwordInput").value.trim();
  const keyBox = document.getElementById("keyBox");
  const errBox = document.getElementById("errorBox");
  const spinner = document.getElementById("spinner");
  const copyBtn = document.getElementById("copyBtn");
  const toggleKeyBtn = document.getElementById("toggleKeyBtn");

  keyBox.style.display="none"; errBox.style.display="none";
  copyBtn.style.display="none"; toggleKeyBtn.style.display="none";
  spinner.style.display="inline-block";

  const matched = config.find(c => c.password === pw);
  setTimeout(() => {
    spinner.style.display="none";
    if(matched){
      wrongAttempts=0; entryCount++;
      const text = `${entryCount}. Password: ${pw}\nGet key: ${matched.key}`;
      keyBox.textContent += (keyBox.textContent ? "\n\n" : "") + text;
      keyBox.style.display="block";
      copyBtn.style.display="inline-block";
      toggleKeyBtn.style.display="inline-block";
      copyBtn.dataset.key = matched.key;
      keyVisible = true;
      toggleKeyBtn.textContent = "🙈 Hide";
      showToast("✅ Key ditemukan!", true);
    } else {
      wrongAttempts++;
      errBox.textContent="❌ Password salah!";
      errBox.style.display="block";
      showToast("❌ Password salah!", false);
      if(wrongAttempts>=3){
        isBlocked=true;
        errBox.textContent="⚠️ Salah 3x! Tunggu 10 detik...";
        this.disabled=true;
        document.getElementById("passwordInput").disabled=true;
        setTimeout(()=>{
          isBlocked=false; wrongAttempts=0;
          errBox.style.display="none";
          this.disabled=false;
          document.getElementById("passwordInput").disabled=false;
        },10000);
      }
    }
  }, matched ? 5000 : 3000);
});

document.getElementById("copyBtn").addEventListener("click", function(){
  navigator.clipboard.writeText(this.dataset.key).then(()=>{
    showToast("✅ Key disalin!", true);
  }).catch(()=>{
    showToast("❌ Gagal salin!", false);
  });
});

document.getElementById("togglePwBtn").addEventListener("click", function(){
  const p = document.getElementById("passwordInput");
  if(p.type==="password"){ p.type="text"; this.textContent="🙈"; }
  else{ p.type="password"; this.textContent="👁"; }
});

document.getElementById("toggleKeyBtn").addEventListener("click", function(){
  const keyBox = document.getElementById("keyBox");
  if(keyVisible){
    keyBox.textContent = keyBox.textContent.replace(/[^\n]/g,"•");
    keyVisible=false; this.textContent="👁 Show";
  } else {
    location.reload();
  }
});

document.getElementById("buyKeyBtn").addEventListener("click",()=>{
  window.open("https://t.me/ARullReal", "_blank");
});

document.getElementById("adminBtn").addEventListener("click",()=>{
  document.getElementById("adminModal").style.display="block";
});
document.getElementById("checkAdminPass").addEventListener("click",()=>{
  if(document.getElementById("adminPassInput").value===adminPassword){
    document.getElementById("adminContent").style.display="block";
    document.getElementById("adminPassInput").style.display="none";
    document.getElementById("checkAdminPass").style.display="none";
    renderTracking();
    showToast("✅ Admin login sukses",true);
  } else {
    showToast("❌ Admin password salah",false);
  }
});
document.getElementById("addKeyBtn").addEventListener("click",()=>{
  const pw = document.getElementById("newPw").value.trim();
  const key = document.getElementById("newKey").value.trim();
  if(pw && key){
    const ex = config.find(c=>c.password===pw);
    if(ex){ ex.key=key; showToast("✅ Key diperbarui",true);}
    else{ config.push({password:pw,key:key}); showToast("✅ Key ditambah",true);}
  } else {
    showToast("❌ Isi password dan key",false);
  }
});
function renderTracking(){
  const t = `Device: ${deviceInfo}\nIP: ${userLocation.ip}\nLoc: ${userLocation.lat},${userLocation.lon}\nCity: ${userLocation.city}\nCountry: ${userLocation.country}`;
  document.getElementById("trackingData").textContent = t;
}
function closeAdmin(){
  document.getElementById("adminModal").style.display="none";
  document.getElementById("adminPassInput").style.display="inline";
  document.getElementById("checkAdminPass").style.display="inline";
  document.getElementById("adminContent").style.display="none";
  document.getElementById("adminPassInput").value="";
}
function showToast(msg,s){
  const t=document.createElement("div");
  t.textContent=msg; t.className="toast";
  t.style.background=s?"#28a745":"#dc3545";
  document.body.appendChild(t);
  setTimeout(()=>{t.style.opacity="1";t.style.transform="translateY(0)";},50);
  setTimeout(()=>{
    t.style.opacity="0";t.style.transform="translateY(20px)";
    setTimeout(()=>t.remove(),300);
  },3000);
}
