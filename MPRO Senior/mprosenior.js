        // Countdown target: 20 Nov 2025 23:59 local time
        const target = new Date(2025, 10, 20, 23, 59, 0); // month index: 10 = November

        function formatDays(days) {
            if (days <= 0) return '';
            return days + ' hari ';
        }

        function updateCountdown() {
            const now = new Date();
            const diff = target - now;
            const el = document.getElementById('countdown');
            if (diff <= 0) {
                // Redirect to expired page and prevent access
                window.location.replace('../index-waktuhabis.html');
                return;
            }
            const days = Math.floor(diff / (1000*60*60*24));
            const hrs = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
            const mins = Math.floor((diff % (1000*60*60)) / (1000*60));
            const secs = Math.floor((diff % (1000*60)) / 1000);
            const text = formatDays(days) + String(hrs).padStart(2,'0') + ':' + String(mins).padStart(2,'0') + ':' + String(secs).padStart(2,'0');
            // animate briefly on update to show dynamism
            el.textContent = text;
            el.classList.remove('pulse');
            void el.offsetWidth; // trigger reflow
            el.classList.add('pulse');
        }

        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000);

        // Payment options handling (styled toggles + custom file input)
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

        // Custom file label triggers file input; show filename and preview
    const uploadBox = document.querySelector('.upload-box');
    const previewContainer = document.querySelector('.preview-container');

        // Handle drag & drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadBox.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults (e) {
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

            // Make the upload box clickable (trigger hidden file input)
            uploadBox.addEventListener('click', function() {
                if (fileInput) fileInput.click();
            });

            // Allow keyboard activation (Enter / Space)
            uploadBox.setAttribute('tabindex', '0');
            uploadBox.addEventListener('keydown', function(e) {
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

        fileInput.addEventListener('change', function(e){
            const file = e.target.files[0];
            if (!file) {
                preview.style.display = 'none';
                previewContainer.style.display = 'none';
                fileNameEl.textContent = 'Klik untuk memilih file atau drag & drop';
                return;
            }
            handleFiles(this.files);
        });

        // Simple form validation and handling
        const form = document.getElementById('mproForm');
        form.addEventListener('submit', function(e){
            e.preventDefault();
            // Basic required checks
            const nama = document.getElementById('nama').value.trim();
            const sekolah = document.getElementById('sekolah').value.trim();
            const tel = document.getElementById('tel').value.trim();
            // Determine selected method from toggle buttons
            const activeToggle = document.querySelector('.toggle-btn.active');
            const method = activeToggle ? activeToggle.dataset.value : 'menyusul';
            if (!nama || !sekolah || !tel) {
                alert('Lengkapi semua field yang diperlukan.');
                return;
            }
            if (method === 'upload' && fileInput.files.length === 0) {
                alert('Silakan unggah bukti pembayaran atau pilih "Menyusul".');
                return;
            }

            // Placeholder: here you would send data to server via fetch/XHR
            alert('Pendaftaran berhasil dikirim. Terima kasih!');
            form.reset();
            uploadArea.style.display = 'none';
            preview.style.display = 'none';
        });

        // Theme toggle (simple, similar behavior as main js but safe if elements are missing)
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', function(){
                document.body.classList.toggle('dark-theme');
                const icon = themeToggle.querySelector('i');
                if (document.body.classList.contains('dark-theme')) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
                else { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
            });
        }
