const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalCaption = document.getElementById("modalCaption");
const thumbnailContainer = document.getElementById("thumbnailContainer");
const body = document.body;

let currentIndex = 0;
let zoom = 1;
let images = [];
let slideshowInterval = null;


window.onload = () => {
    images = Array.from(document.querySelectorAll(".gallery img"));
    images.forEach((img, index) => {
        const thumb = img.cloneNode(true);
        thumb.onclick = () => showImage(index);
        thumbnailContainer.appendChild(thumb);
    });
};

function openModal(imgElement) {
    currentIndex = images.indexOf(imgElement);
    showImage(currentIndex);
    modal.style.display = "flex";
    zoom = 1;
}

function showImage(index) {
    currentIndex = index;
    modalImg.src = images[index].src;
    modalCaption.innerText = images[index].alt;
    modalImg.style.transform = `scale(1)`;
    updateThumbnails();
}

function updateThumbnails() {
    const thumbs = thumbnailContainer.querySelectorAll("img");
    thumbs.forEach((thumb, i) => {
        thumb.classList.toggle("active", i === currentIndex);
    });
}

function closeModal() {
    modal.style.display = "none";
    clearInterval(slideshowInterval);

}

function downloadImage() {
    const link = document.createElement("a");
    link.href = modalImg.src;
    link.download = "downloaded-image.jpg";
    link.click();
}

function shareImage() {
    if (navigator.share) {
        navigator.share({
            title: "Check out this image",
            text: modalCaption.innerText,
            url: modalImg.src
        }).catch(console.error);
    } else {
        alert("Sharing is not supported on this device.");
    }
}

function toggleSlideshow() {
      if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
      } else {
        slideshowInterval = setInterval(() => {
          currentIndex = (currentIndex + 1) % images.length;
          showImage(currentIndex);
        }, 3000);
      }
}

modalImg.addEventListener("wheel", (e) => {
    e.preventDefault();
    zoom += e.deltaY < 0 ? 0.1 : -0.1;
    zoom = Math.max(0.5, Math.min(zoom, 5));
    modalImg.style.transform = `scale(${zoom})`;
});

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrevious();
});

let startX = 0;
modal.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
});

modal.addEventListener("touchend", (e) => {
    let endX = e.changedTouches[0].clientX;
    if (endX - startX > 50) showPrevious();
    if (startX - endX > 50) showNext();
});

function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
}

function showPrevious() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
}