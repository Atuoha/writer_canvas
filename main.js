const seeds = Array.from({ length: 100 }, (_, i) => `gospel-bg-${i+1}`);

let selectedImageUrl = `https://picsum.photos/seed/${seeds[0]}/900/1200`;

const grid = document.getElementById('imageGrid');
const previewSection = document.getElementById('previewSection');
const bgImageElement = document.getElementById('bgImage');
const canvasLoader = document.getElementById('canvasLoader');

seeds.forEach((seed, i) => {
  const thumbUrl = `https://picsum.photos/seed/${seed}/200/200`;
  const highResUrl = `https://picsum.photos/seed/${seed}/900/1200`;

  const img = document.createElement('img');
  img.src = thumbUrl;
  img.className = (i === 0) ? 'thumb active' : 'thumb';

  img.onclick = () => {
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    img.classList.add('active');
    selectedImageUrl = highResUrl;
    if (previewSection.classList.contains('visible')) {
      updateCanvasImage(selectedImageUrl);
    }
  };

  grid.appendChild(img);
});

function updateCanvasImage(url) {
  canvasLoader.classList.add('active');
  bgImageElement.src = url;
  bgImageElement.onload = () => {
    canvasLoader.classList.remove('active');
  };
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'custom-toast';
  toast.innerHTML = `<span class="toast-icon">✨</span> ${message}`;
  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500);
  }, 3500);
}

function handleUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    selectedImageUrl = event.target.result;
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    if (previewSection.classList.contains('visible')) {
      updateCanvasImage(selectedImageUrl);
    }
  };
  reader.readAsDataURL(file);
}

function generateCanvas() {
  const textVal = document.getElementById('inputText').value;
  const authorVal = document.getElementById('inputAuthor').value;
  const opacityVal = document.getElementById('opacityRange').value;
  const btn = document.getElementById('generateBtn');

  if (!textVal.trim()) {
    alert("Please write a reflection message first.");
    return;
  }

  const originalBtnText = btn.innerText;
  btn.disabled = true;
  btn.innerHTML = `<div class="lds-dual-ring spinner-btn"></div> Generating...`;

  setTimeout(() => {
    const finalTxt = document.getElementById('finalText');
    const finalSig = document.getElementById('finalSignature');
    const overlay = document.getElementById('whiteOverlay');

    finalTxt.textContent = textVal;
    updateCanvasImage(selectedImageUrl);
    overlay.style.opacity = opacityVal / 100;
    document.getElementById('rangeValue').textContent = opacityVal + '%';

    if (authorVal.trim()) {
      finalSig.innerHTML = `with ❤️ from ${authorVal}`;
      finalSig.style.display = 'block';
    } else {
      finalSig.style.display = 'none';
    }

    const len = textVal.length;
    let size = '2.2rem';
    if (len > 50) size = '1.8rem';
    if (len > 150) size = '1.5rem';
    if (len > 300) size = '1.2rem';
    if (len > 500) size = '1rem';
    finalTxt.style.fontSize = size;

    previewSection.classList.add('visible');
    btn.disabled = false;
    btn.innerText = originalBtnText;

    if (window.innerWidth < 992) {
      setTimeout(() => {
        previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, 800);
}

function resetCanvas() {
  document.getElementById('inputText').value = "";
  document.getElementById('inputAuthor').value = "";
  document.getElementById('fileUpload').value = "";
  document.getElementById('opacityRange').value = 40;
  document.getElementById('rangeValue').textContent = "40%";
  document.getElementById('whiteOverlay').style.opacity = 0.4;

  const thumbs = document.querySelectorAll('.thumb');
  thumbs.forEach(t => t.classList.remove('active'));
  if (thumbs.length > 0) {
    thumbs[0].classList.add('active');
    selectedImageUrl = `https://picsum.photos/seed/${seeds[0]}/900/1200`;
  }

  previewSection.classList.remove('visible');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function downloadImage() {
  const canvasArea = document.getElementById('canvasArea');
  const btn = document.getElementById('dlBtn');
  const originalText = btn.innerText;
  btn.innerHTML = `<div class="lds-dual-ring spinner-btn"></div> Processing...`;

  html2canvas(canvasArea, {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff'
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = `Gospel-Canvas-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    btn.innerText = originalText;
    showToast("Download started successfully!");
  }).catch(err => {
    console.error("Canvas Error:", err);
    alert("There was an issue saving the image. Please try a different background.");
    btn.innerText = originalText;
  });
}

document.getElementById('opacityRange').addEventListener('input', function(e) {
  if (previewSection.classList.contains('visible')) {
    document.getElementById('whiteOverlay').style.opacity = e.target.value / 100;
    document.getElementById('rangeValue').textContent = e.target.value + '%';
  }
});
