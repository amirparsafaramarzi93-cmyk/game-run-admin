// رمز عبور مدیریت - دقیقاً اینجا باید admin123 باشد
const ADMIN_PASSWORD = "admin123";

// افزودن تابع shake animation در بالای فایل
const style = document.createElement('style');
style.innerHTML = `
    @keyframes shake {
        0%, 100% {transform: translateX(0);}
        10%, 30%, 50%, 70%, 90% {transform: translateX(-5px);}
        20%, 40%, 60%, 80% {transform: translateX(5px);}
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function() {
    // در صفحه admin.html
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        console.log('فرم ورود پیدا شد'); // برای دیباگ
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const passwordInput = document.getElementById('password');
            const password = passwordInput ? passwordInput.value.trim() : '';
            const alertBox = document.getElementById('loginAlert');
            
            console.log('رمز وارد شده:', password); // برای دیباگ
            console.log('رمز صحیح:', ADMIN_PASSWORD); // برای دیباگ
            
            if (!alertBox) {
                console.error('کس #loginAlert پیدا نشد!');
                return;
            }
            
            // پاک کردن پیام‌های قبلی
            alertBox.innerHTML = '';
            alertBox.className = 'login-alert';
            
            // چک کردن رمز
            if (password === ADMIN_PASSWORD) {
                // ورود موفق
                alertBox.className = 'login-alert success';
                alertBox.innerHTML = '<i class="fas fa-check-circle"></i> ✅ ورود موفق! در حال انتقال به پنل مدیریت...';
                
                // ذخیره وضعیت ورود
                sessionStorage.setItem('gameRunAdminLoggedIn', 'true');
                sessionStorage.setItem('gameRunAdminLoginTime', new Date().toISOString());
                
                console.log('ورود موفق - redirect به dashboard.html');
                
                // تاخیر و ریدایرکت
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
                
            } else {
                // خطا در ورود
                alertBox.className = 'login-alert error';
                alertBox.innerHTML = '<i class="fas fa-exclamation-circle"></i> ❌ رمز عبور اشتباه است!';
                
                // انیمیشن تکان خوردن
                if (loginForm.style) {
                    loginForm.style.animation = 'shake 0.5s';
                    setTimeout(() => {
                        loginForm.style.animation = '';
                    }, 500);
                }
                
                // پاک کردن فیلد رمز
                if (passwordInput) {
                    passwordInput.value = '';
                    passwordInput.focus();
                }
                
                // لاگ خطا
                console.error('رمز اشتباه وارد شد');
            }
        });
        
        // دکمه نمایش/مخفی رمز
        const toggleBtn = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        
        if (toggleBtn && passwordInput) {
            toggleBtn.addEventListener('click', function() {
                const type = passwordInput.type === 'password' ? 'text' : 'password';
                passwordInput.type = type;
                this.innerHTML = type === 'password' ? 
                    '<i class="fas fa-eye"></i>' : 
                    '<i class="fas fa-eye-slash"></i>';
            });
        }
    }
    
    // در صفحه dashboard.html
    if (window.location.pathname.includes('dashboard.html')) {
        console.log('در صفحه dashboard هستیم');
        
        // چک کردن لاگین
        const isLoggedIn = sessionStorage.getItem('gameRunAdminLoggedIn') === 'true';
        const loginTime = sessionStorage.getItem('gameRunAdminLoginTime');
        
        if (!isLoggedIn) {
            console.log('لاگین نیست - ریدایرکت به admin.html');
            window.location.href = 'admin.html';
            return;
        }
        
        // چک کردن زمان انقضا (۱ ساعت)
        if (loginTime) {
            const loginDate = new Date(loginTime);
            const now = new Date();
            const diffHours = (now - loginDate) / (1000 * 60 * 60);
            
            if (diffHours > 1) { // بیش از ۱ ساعت گذشته
                console.log('سشن منقضی شده - ریدایرکت');
                sessionStorage.removeItem('gameRunAdminLoggedIn');
                sessionStorage.removeItem('gameRunAdminLoginTime');
                window.location.href = 'admin.html';
                return;
            }
        }
        
        // اگر لاگین است
        console.log('لاگین شده - بارگذاری داده‌ها');
        loadAdminGames();
        updateAdminStats();
        
        // تنظیم نام مدیر
        const adminNameEl = document.getElementById('adminName');
        if (adminNameEl) {
            adminNameEl.textContent = 'مدیر Game Run';
        }
        
        // تنظیم رویدادها
        setupEventListeners();
    }
    
    // دکمه خروج
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.removeItem('gameRunAdminLoggedIn');
            sessionStorage.removeItem('gameRunAdminLoginTime');
            console.log('خروج انجام شد');
            window.location.href = 'admin.html';
        });
    }
    
    // دکمه بروزرسانی
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            if (window.location.pathname.includes('dashboard.html')) {
                loadAdminGames();
                updateAdminStats();
                alertMessage('بروزرسانی انجام شد', 'success');
            }
        });
    }
});

// بارگذاری بازی‌ها در پنل
function loadAdminGames() {
    const gamesList = document.getElementById('adminGamesList');
    if (!gamesList) return;
    
    // بارگذاری از localStorage
    loadFromLocalStorage();
    
    if (!gamesData.games || gamesData.games.length === 0) {
        gamesList.innerHTML = `
            <div class="no-games">
                <i class="fas fa-gamepad"></i>
                <p>هیچ بازی‌ای برای نمایش وجود ندارد</p>
                <p>اولین بازی را اضافه کنید!</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    gamesData.games.forEach(game => {
        html += `
            <div class="admin-game-item" data-id="${game.id}">
                <div class="game-item-info">
                    <h4>${game.title}</h4>
                    <div class="game-item-meta">
                        <span><i class="fas fa-hdd"></i> حجم: ${game.size} GB</span>
                        <span><i class="fas fa-download"></i> دانلود: ${game.downloads}</span>
                        <span><i class="fas fa-tag"></i> ${getCategoryName(game.category)}</span>
                    </div>
                    <p class="game-item-desc">${game.description.substring(0, 100)}...</p>
                </div>
                <div class="game-item-actions">
                    <button class="btn-edit" onclick="editGame(${game.id})">
                        <i class="fas fa-edit"></i> ویرایش
                    </button>
                    <button class="btn-delete" onclick="deleteGame(${game.id})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            </div>
        `;
    });
    
    gamesList.innerHTML = html;
}

// تابع کمکی برای پیام‌ها
function alertMessage(message, type = 'info') {
    const alertBox = document.getElementById('loginAlert') || 
                    document.getElementById('formAlert') || 
                    document.createElement('div');
    
    alertBox.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 
                          type === 'error' ? 'exclamation-circle' : 
                          'info-circle'}"></i> 
        ${message}
    `;
    alertBox.className = `login-alert ${type}`;
    
    if (type === 'success') {
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 3000);
    }
    
    return alertBox;
}

// بارگذاری از localStorage
function loadFromLocalStorage() {
    const saved = localStorage.getItem('gameRunData');
    if (saved) {
        try {
            gamesData = JSON.parse(saved);
        } catch (e) {
            console.error('خطا در بارگذاری داده‌ها:', e);
        }
    }
}

// آپدیت آمار
function updateAdminStats() {
    const totalGamesEl = document.getElementById('totalGamesAdmin');
    const totalDownloadsEl = document.getElementById('totalDownloadsAdmin');
    const totalViewsEl = document.getElementById('totalViews');
    
    if (totalGamesEl) totalGamesEl.textContent = gamesData.games.length;
    if (totalDownloadsEl) totalDownloadsEl.textContent = gamesData.stats.totalDownloads.toLocaleString();
    if (totalViewsEl) {
        let visitors = parseInt(localStorage.getItem('gameRunVisitors') || '0');
        totalViewsEl.textContent = visitors.toLocaleString();
    }
}
