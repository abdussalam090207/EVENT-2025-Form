// Notification System
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

    // Auto remove after duration
    setTimeout(() => {
        closeNotification(notificationId);
    }, duration);
}

function closeNotification(id) {
    const notification = document.getElementById(id);
    if (notification) {
        notification.classList.add('hiding');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Modal Functions
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

// Countdown target: 20 Nov 2025 23:59 local time
const target = new Date(2025, 10, 22, 23, 59, 0);

function formatDays(days) {
    if (days <= 0) return '';
    return days + ' hari ';
}

function updateCountdown() {
    const now = new Date();
    const diff = target - now;
    const el = document.getElementById('countdown');
    if (diff <= 0) {
        window.location.replace('../index-waktuhabis.html');
        return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    const text = formatDays(days) + String(hrs).padStart(2, '0') + ':' + String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
    el.textContent = text;
    el.classList.remove('pulse');
    void el.offsetWidth;
    el.classList.add('pulse');
}

updateCountdown();
const countdownInterval = setInterval(updateCountdown, 1000);

// Payment options handling
const toggleBtns = document.querySelectorAll('.toggle-btn');
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('buktiFile');
const preview = document.getElementById('preview');
const fileNameEl = document.getElementById('fileName');

function setMethod(value) {
    toggleBtns.forEach(b => b.classList.toggle('active', b.dataset.value === value));
    if (value === 'upload') {
        uploadArea.style.display = 'block';
    } else {
        uploadArea.style.display = 'none';
        fileInput.value = '';
        preview.style.display = 'none';
        fileNameEl.textContent = 'Belum ada file yang dipilih';
    }
}

toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => setMethod(btn.dataset.value));
});

// File upload handling
const uploadBox = document.querySelector('.upload-box');
const previewContainer = document.querySelector('.preview-container');

// Drag & drop functions
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
    uploadBox.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-blue');
    uploadBox.style.background = 'rgba(26,115,232,0.08)';
}

function unhighlight(e) {
    uploadBox.style.borderColor = '';
    uploadBox.style.background = '';
}

if (uploadBox) {
    uploadBox.addEventListener('drop', handleDrop, false);
    uploadBox.addEventListener('click', function () {
        if (fileInput) fileInput.click();
    });
    uploadBox.setAttribute('tabindex', '0');
    uploadBox.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (fileInput) fileInput.click();
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
            previewContainer.style.display = 'block';
        }
    }
}

fileInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) {
        preview.style.display = 'none';
        previewContainer.style.display = 'none';
        fileNameEl.textContent = 'Klik untuk memilih file atau drag & drop';
        return;
    }
    handleFiles(this.files);
});

// Google Apps Script URL - GANTI DENGAN URL ANDA
// Google Apps Script URL - PASTIKAN INI URL DEPLOYMENT TERBARU
const scriptURL = 'https://script.google.com/macros/s/AKfycbz2ZQnKVxZiQjsiOBEb6aCF3CrtpXKgUptw2FZqnUuADbJW3N_DE4ngb0PkoK-WH4VbOg/exec';

// Form submission - DENGAN KONVERSI BASE64 UNTUK FILE
const form = document.getElementById('mproForm');
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Basic validation
    const nama = document.getElementById('nama').value.trim();
    const sekolah = document.getElementById('sekolah').value.trim();
    const tel = document.getElementById('tel').value.trim();
    const activeToggle = document.querySelector('.toggle-btn.active');
    const method = activeToggle ? activeToggle.dataset.value : 'menyusul';

    if (!nama || !sekolah || !tel) {
        showNotification('warning', 'Data Tidak Lengkap', 'Lengkapi semua field yang diperlukan.', 4000);
        return;
    }

    if (method === 'upload' && fileInput.files.length === 0) {
        showNotification('warning', 'Bukti Pembayaran', 'Silakan unggah bukti pembayaran atau pilih "Menyusul".', 4000);
        return;
    }

    // Show loading modal
    showLoadingModal();

    // Show loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Mengirim...';
    submitBtn.disabled = true;

    try {
        // Create FormData
        const formData = new FormData();
        formData.append('nama', nama);
        formData.append('sekolah', sekolah);
        formData.append('tel', tel);
        formData.append('kategori', 'Junior');
        formData.append('metodePembayaran', method);
        formData.append('timestamp', new Date().toISOString());

        // Convert file to base64 if upload method
        if (method === 'upload' && fileInput.files.length > 0) {
            submitBtn.textContent = 'Mengupload foto...';
            const file = fileInput.files[0];
            const base64 = await convertFileToBase64(file);
            formData.append('buktiBase64', base64);
            formData.append('fileName', file.name);
            formData.append('fileType', file.type);
        }

        // Send data
        submitBtn.textContent = 'Menyimpan data...';
        const response = await fetch(scriptURL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Success:', result);

        if (result.status === 'success') {
            // Hide loading modal and show success modal
            hideLoadingModal();
            showSuccessModal();

            // Reset form
            form.reset();
            uploadArea.style.display = 'none';
            preview.style.display = 'none';
            previewContainer.style.display = 'none';
            fileNameEl.textContent = 'Klik untuk memilih file atau drag & drop';
            setMethod('menyusul');
        } else {
            throw new Error(result.message || 'Unknown error');
        }
    } catch (error) {
        console.error('Error:', error);
        hideLoadingModal();
        showNotification('error', 'Gagal Mengirim', 'Terjadi kesalahan: ' + error.message, 5000);
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// Function to convert file to base64
function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', function () {
        document.body.classList.toggle('dark-theme');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
}

// Close success modal when close button is clicked
document.getElementById('closeSuccessModal').addEventListener('click', function () {
    hideSuccessModal();
});
