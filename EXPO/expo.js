// ============================================
// DARK MODE TOGGLE
// ============================================
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;
const body = document.body;

// Check saved theme preference or system preference
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        updateThemeIcon(true);
    } else if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        updateThemeIcon(false);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.classList.add('dark-theme');
        updateThemeIcon(true);
    }
}

function updateThemeIcon(isDark) {
    const icon = themeToggle.querySelector('i');
    if (isDark) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

themeToggle.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark-theme');
    updateThemeIcon(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Initialize theme on page load
initializeTheme();

// ============================================
// COUNTDOWN TIMER - Target: 12 Desember 2025 23:59
// ============================================
const target = new Date(2025, 11, 12, 23, 59, 0);

// Check if time is up and redirect
const timer = setInterval(() => {
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
        window.location.replace('../index-waktuhabis.html');
        return;
    }

}, 1000);

function updateCountdown() {
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
        document.getElementById('days').textContent = "00";
        document.getElementById('hours').textContent = "00";
        document.getElementById('minutes').textContent = "00";
        document.getElementById('seconds').textContent = "00";
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hrs).padStart(2, '0');
    document.getElementById('minutes').textContent = String(mins).padStart(2, '0');
    document.getElementById('seconds').textContent = String(secs).padStart(2, '0');
}

updateCountdown();
const countdownInterval = setInterval(updateCountdown, 1000);

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function showNotification(type, title, message, duration = 5000) {
    const container = document.getElementById('notificationContainer');
    const notificationId = 'notification-' + Date.now();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.id = notificationId;

    let icon;
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle notification-icon"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle notification-icon"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle notification-icon"></i>';
            break;
        case 'info':
            icon = '<i class="fas fa-info-circle notification-icon"></i>';
            break;
    }

    notification.innerHTML = `
        ${icon}
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="closeNotification('${notificationId}')">
            <i class="fas fa-times"></i>
        </button>
        <div class="notification-progress"></div>
    `;

    container.appendChild(notification);

    setTimeout(() => {
        closeNotification(notificationId);
    }, duration);
}

function closeNotification(id) {
    const notification = document.getElementById(id);
    if (notification) {
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// ============================================
// MODAL FUNCTIONS
// ============================================
function showLoadingModal() {
    document.getElementById('loadingModal').classList.add('active');
}

function hideLoadingModal() {
    document.getElementById('loadingModal').classList.remove('active');
}

function showSuccessModal() {
    document.getElementById('successModal').classList.add('active');
}

function hideSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
}

// ============================================
// FILE UPLOAD HANDLING
// ============================================
const fileInput = document.getElementById('foto');
const preview = document.getElementById('preview');
const fileNameEl = document.getElementById('fileName');
const uploadBox = document.getElementById('uploadBox');
const previewContainer = document.getElementById('previewContainer');
const fileInputButton = document.getElementById('fileInputButton');

fileInputButton.addEventListener('click', function (e) {
    e.stopPropagation();
    fileInput.click();
});

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadBox.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    uploadBox.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    uploadBox.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
    uploadBox.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-purple');
    uploadBox.style.background = 'rgba(124,58,237,0.08)';
    uploadBox.classList.add('active');
}

function unhighlight(e) {
    uploadBox.style.borderColor = '';
    uploadBox.style.background = '';
    uploadBox.classList.remove('active');
}

if (uploadBox) {
    uploadBox.addEventListener('drop', handleDrop, false);
    uploadBox.addEventListener('click', function () {
        fileInput.click();
    });
    uploadBox.setAttribute('tabindex', '0');
    uploadBox.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInput.click();
        }
    });
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleFiles(files) {
    if (files.length) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            fileNameEl.textContent = file.name;
            const url = URL.createObjectURL(file);
            preview.src = url;
            preview.style.display = 'block';
            previewContainer.classList.add('show');
            fileInputButton.textContent = 'Ganti File';
        } else {
            showNotification('warning', 'Format Tidak Didukung', 'Harap pilih file gambar (JPG, PNG).', 4000);
        }
    }
}

fileInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) {
        preview.style.display = 'none';
        previewContainer.classList.remove('show');
        fileNameEl.textContent = 'Klik untuk memilih file atau drag & drop';
        fileInputButton.textContent = 'Pilih File';
        return;
    }
    handleFiles(this.files);
});

// ============================================
// FORM SUBMISSION
// ============================================
const form = document.getElementById('expoForm');
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Basic validation
    const nama = document.getElementById('nama').value.trim();
    const wa = document.getElementById('wa').value.trim();
    const sekolah = document.getElementById('sekolah').value.trim();
    const karya = document.getElementById('karya').value.trim();
    const fotoPribadi = fileInput.files.length;

    if (!nama || !wa || !sekolah || !karya || !fotoPribadi) {
        showNotification('warning', 'Data Tidak Lengkap', 'Lengkapi semua field yang diperlukan.', 4000);
        return;
    }

    // Check file size (max 5MB)
    const file = fileInput.files[0];
    if (file.size > 5 * 1024 * 1024) {
        showNotification('warning', 'File Terlalu Besar', 'Ukuran foto maksimal 5MB.', 4000);
        return;
    }

    // Show loading modal
    showLoadingModal();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Mengirim...';
    submitBtn.disabled = true;

    try {
        // Convert foto to base64
        let fotoBase64 = '';
        if (file) {
            fotoBase64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }

        // Prepare form data
        const formData = new URLSearchParams();
        formData.append('source', 'expo');
        formData.append('nama', nama);
        formData.append('wa', wa);
        formData.append('sekolah', sekolah);
        formData.append('karya', karya);
        formData.append('fotoBase64', fotoBase64);
        formData.append('fileName', file.name);
        formData.append('fileType', file.type);
        formData.append('timestamp', new Date().toISOString());

        // --- START GOOGLE APPS SCRIPT INTEGRATION ---
        const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwo1803N_U1cTjAFaonqyk7z7apxoWQy-KX-9tesC0Cg2vrc0fWtVjbnsEz4cDMIZYmvg/exec'; // GANTI DENGAN URL DEPLOYMENT APPS SCRIPT ANDA

        if (APPS_SCRIPT_URL === 'PASTE_URL_APPS_SCRIPT_ANDA_DI_SINI') {
            throw new Error('URL Apps Script belum diatur. Harap ganti placeholder URL.');
        }

        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            body: formData,
            // Penting: Jangan set Content-Type untuk form-urlencoded saat menggunakan URLSearchParams
            // Browser akan otomatis set Content-Type yang benar (application/x-www-form-urlencoded)
            // headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const result = await response.json();

        if (result.status === 'success') {
            hideLoadingModal();
            showSuccessModal();

            // Reset form
            form.reset();
            preview.src = '';
            preview.style.display = 'none';
            previewContainer.classList.remove('show');
            fileNameEl.textContent = 'Klik untuk memilih file atau drag & drop';
            fileInputButton.textContent = 'Pilih File';

            console.log('✅ Pendaftaran berhasil:', result.data);
        } else {
            throw new Error(result.message || 'Terjadi kesalahan saat menyimpan data.');
        }
        // --- END GOOGLE APPS SCRIPT INTEGRATION ---
    } catch (error) {
        console.error('Error:', error);
        hideLoadingModal();
        showNotification('error', 'Gagal Mengirim', 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.', 5000);
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// Close success modal
document.getElementById('closeSuccessModal').addEventListener('click', function () {
    hideSuccessModal();
});

// Add CSS animation for slide out
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(400px);
        }
    }
`;
document.head.appendChild(style);
