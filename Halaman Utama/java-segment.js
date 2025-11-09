// Sidebar Toggle Functionality
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const overlay = document.getElementById('overlay');

// Toggle sidebar collapse/expand (DESKTOP)
hamburger.addEventListener('click', function(e) {
    e.stopPropagation();
    if (window.innerWidth > 992) {
        sidebar.classList.toggle('collapsed');
        
        // Rotate hamburger icon
        const icon = hamburger.querySelector('i');
        if (sidebar.classList.contains('collapsed')) {
            icon.classList.remove('fa-chevron-left');
            icon.classList.add('fa-chevron-right');
        } else {
            icon.classList.remove('fa-chevron-right');
            icon.classList.add('fa-chevron-left');
        }
    }
});

// Mobile menu toggle (MOBILE)
mobileMenuBtn.addEventListener('click', function() {
    sidebar.classList.add('mobile-open');
    overlay.classList.add('active');
    mobileMenuBtn.style.display = 'none'; // Sembunyikan hamburger saat sidebar terbuka
});

// Close sidebar when clicking overlay atau tombol panah
overlay.addEventListener('click', closeSidebar);
hamburger.addEventListener('click', function(e) {
    if (window.innerWidth <= 992) {
        closeSidebar();
    }
});

// Fungsi untuk menutup sidebar
function closeSidebar() {
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
    mobileMenuBtn.style.display = 'block'; // Tampilkan kembali hamburger
}

// Close sidebar when clicking on links in mobile
document.querySelectorAll('.sidebar-menu a').forEach(link => {
    link.addEventListener('click', function() {
        if (window.innerWidth <= 992) {
            closeSidebar();
        }
    });
});

// Handle window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 992) {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
        mobileMenuBtn.style.display = 'none';
        // Reset hamburger icon di desktop
        const icon = hamburger.querySelector('i');
        if (sidebar.classList.contains('collapsed')) {
            icon.classList.remove('fa-chevron-left');
            icon.classList.add('fa-chevron-right');
        } else {
            icon.classList.remove('fa-chevron-right');
            icon.classList.add('fa-chevron-left');
        }
    } else {
        mobileMenuBtn.style.display = 'block';
        // Reset hamburger icon di mobile
        const icon = hamburger.querySelector('i');
        icon.classList.remove('fa-chevron-right', 'fa-chevron-left');
        icon.classList.add('fa-bars');
    }
});

// Pastikan mobile menu button hidden di desktop saat pertama load
if (window.innerWidth > 992) {
    mobileMenuBtn.style.display = 'none';
}

// Typing Text Effect (1 baris bergantian)
const typingText = document.getElementById('typingText');
const texts = [
    "EVENT AKHIR TAHUN",
    "EXPO ELC GROUP 2025", 
    "BURUAN DAFTAR!!!"
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

// Mobile menu functionality
if (mobileMenuBtn && overlay) {
    mobileMenuBtn.addEventListener('click', function() {
        sidebar.classList.add('mobile-open');
        overlay.classList.add('active');
    });
    
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
    });
}

// Close sidebar when clicking on links in mobile
const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
sidebarLinks.forEach(link => {
    link.addEventListener('click', function() {
        if (window.innerWidth <= 992) {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
        }
    });
});