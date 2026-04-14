// Mobile Menu Toggle logic
const menuToggle = document.getElementById('menuToggle');
const navbar = document.getElementById('navbar');

menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
    
    // Icon change (Bars to X)
    const icon = menuToggle.querySelector('i');
    if (navbar.classList.contains('active')) {
        icon.classList.replace('fa-bars', 'fa-times');
    } else {
        icon.classList.replace('fa-times', 'fa-bars');
    }
});

// Menu item click karne par menu close ho jaye
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
        menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
    });
});

// Function to open gallery in modal
function openGallery(images) {
    const modal = document.getElementById("galleryModal");
    const container = document.getElementById("modalImages");
    container.innerHTML = "";
    
    images.forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = "Project Detail";
        img.loading = "lazy";
        container.appendChild(img);
    });
    
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeGallery() {
    document.getElementById("galleryModal").style.display = "none";
    document.body.style.overflow = "auto";
}

window.onclick = function(event) {
    if (event.target == document.getElementById("galleryModal")) {
        closeGallery();
    }
}
