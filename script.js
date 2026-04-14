// Function to open gallery in modal
function openGallery(images) {
    const modal = document.getElementById("galleryModal");
    const container = document.getElementById("modalImages");
    
    // Clear previous images
    container.innerHTML = "";
    
    // Add images to the container
    images.forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = "Portfolio Project Detail";
        img.loading = "lazy";
        container.appendChild(img);
    });
    
    // Display the modal
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Disable scroll
}

// Function to close gallery
function closeGallery() {
    const modal = document.getElementById("galleryModal");
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Re-enable scroll
}

// Close modal when clicking outside the content
window.onclick = function(event) {
    const modal = document.getElementById("galleryModal");
    if (event.target == modal) {
        closeGallery();
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
