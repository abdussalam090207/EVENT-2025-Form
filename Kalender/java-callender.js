// Toggle Sidebar
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const overlay = document.getElementById('overlay');

hamburger.addEventListener('click', function () {
    sidebar.classList.toggle('collapsed');
    hamburger.querySelector('i').classList.toggle('fa-chevron-left');
    hamburger.querySelector('i').classList.toggle('fa-chevron-right');
});

// Mobile menu toggle
mobileMenuBtn.addEventListener('click', function () {
    sidebar.classList.add('mobile-open');
    overlay.classList.add('active');
});

overlay.addEventListener('click', function () {
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
});

// Typing Text Effect
const typingText = document.getElementById('typingText');
const texts = [
    "EVENT AKHIR TAHUN",
    "EXPO ELC GROUP",
    "BURUAN DAFTAR"
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;
let pauseTime = 1500;

function type() {
    const currentText = texts[textIndex];

    if (isDeleting) {
        // Menghapus teks
        charIndex--;
        typingText.innerHTML = currentText.substring(0, charIndex) + '<span class="cursor"></span>';
        typingSpeed = 50;
    } else {
        // Mengetik teks
        charIndex++;
        typingText.innerHTML = currentText.substring(0, charIndex) + '<span class="cursor"></span>';
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
        // Jeda setelah selesai mengetik
        typingSpeed = pauseTime;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        // Pindah ke teks berikutnya setelah menghapus
        isDeleting = false;
        textIndex++;
        if (textIndex === texts.length) {
            textIndex = 0;
        }
    }

    setTimeout(type, typingSpeed);
}

// Start typing effect
setTimeout(type, 1000);

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

themeToggle.addEventListener('click', function () {
    document.body.classList.toggle('dark-theme');
    if (document.body.classList.contains('dark-theme')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
});

// Responsive behavior for mobile
window.addEventListener('resize', function () {
    if (window.innerWidth > 992) {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
    }
});