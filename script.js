function openGallery(images, price) {
    const modal = document.getElementById("galleryModal");
    const container = document.getElementById("modalImages");
    const priceBadge = document.getElementById("popupPrice");
    
    // Show price in the gallery popup
    priceBadge.innerText = "Project Price: " + price;
    
    // Clear old images
    container.innerHTML = "";
    
    // Add new images
    images.forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        img.loading = "lazy";
        container.appendChild(img);
    });
    
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Stop background scrolling
}

function closeGallery() {
    document.getElementById("galleryModal").style.display = "none";
    document.body.style.overflow = "auto";
}

// Close if user clicks outside the image
window.onclick = function(event) {
    if (event.target == document.getElementById("galleryModal")) {
        closeGallery();
    }
}
