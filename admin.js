// رمز عبور مدیریت
const ADMIN_PASSWORD = "admin123";

// چک کردن لاگین
function checkLogin() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    
    // اگر در صفحه dashboard هستیم و لاگین نشده‌ایم
    if (window.location.pathname.includes('dashboard.html') && !isLoggedIn) {
        window.location.href = 'admin.html';
        return false;
    }
    
    return isLoggedIn;
}

// فرم ورود
document.addEventListener('DOMContentLoaded', function() {
    // اگر در صفحه ورود هستیم
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const password = document.getElementById('password').value;
            const alertBox = document.getElementById('loginAlert');
            
            if (password === ADMIN_PASSWORD) {
                // ورود موفق
                sessionStorage.setItem('adminLoggedIn', 'true');
                alertBox.className = 'login-alert success';
                alertBox.innerHTML = '<i class="fas fa-check-circle"></i> ورود موفق! در حال انتقال به پنل مدیریت...';
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                // خطا
                alertBox.className = 'login-alert error';
                alertBox.innerHTML = '<i class="fas fa-exclamation-circle"></i> رمز عبور اشتباه است!';
                
                // انیمیشن تکان خوردن
                loginForm.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    loginForm.style.animation = '';
                }, 500);
            }
        });
        
        // دکمه نمایش/مخفی کردن رمز
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
    
    // اگر در دشبورد هستیم
    if (window.location.pathname.includes('dashboard.html')) {
        if (!checkLogin()) return;
        
        loadAdminGames();
        updateAdminStats();
        setupEventListeners();
    }
    
    // دکمه خروج
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.removeItem('adminLoggedIn');
            window.location.href = 'admin.html';
        });
    }
});

// بارگذاری بازی‌ها در پنل مدیریت
function loadAdminGames() {
    const gamesList = document.getElementById('adminGamesList');
    if (!gamesList) return;
    
    if (!gamesData.games || gamesData.games.length === 0) {
        gamesList.innerHTML = '<div class="no-games">هیچ بازی‌ای برای نمایش وجود ندارد</div>';
        return;
    }
    
    let html = '';
    
    gamesData.games.forEach(game => {
        html += `
            <div class="admin-game-item" data-id="${game.id}">
                <div class="game-item-info">
                    <h4>${game.title}</h4>
                    <div class="game-item-meta">
                        <span>حجم: ${game.size} GB</span>
                        <span>دانلودها: ${game.downloads}</span>
                        <span>دسته: ${getCategoryName(game.category)}</span>
                    </div>
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

// آپدیت آمار در پنل
function updateAdminStats() {
    const totalGamesEl = document.getElementById('totalGamesAdmin');
    const totalDownloadsEl = document.getElementById('totalDownloadsAdmin');
    const totalViewsEl = document.getElementById('totalViews');
    
    if (totalGamesEl) totalGamesEl.textContent = gamesData.games.length;
    if (totalDownloadsEl) totalDownloadsEl.textContent = gamesData.stats.totalDownloads.toLocaleString();
    if (totalViewsEl
