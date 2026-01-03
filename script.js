// داده‌های سایت (شبیه دیتابیس)
let gamesData = {
    "games": [
        {
            "id": 1,
            "title": "GTA V - Grand Theft Auto 5",
            "description": "بازی اکشن-ماجراجویی با جهان باز، سه شخصیت اصلی و داستانی جذاب در شهر لوس سانتوس",
            "size": "95",
            "category": "action",
            "image": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            "downloadLink": "https://example.com/gta5.zip",
            "downloads": 12500,
            "date": "1402/10/15",
            "requirements": "CPU: Intel Core i5, RAM: 8GB, GPU: GTX 1050",
            "version": "1.0.2845"
        },
        {
            "id": 2,
            "title": "FIFA 23",
            "description": "آخرین نسخه از سری محبوب فیفا با گرافیک فوق العاده و تیم‌های به روز",
            "size": "50",
            "category": "sports",
            "image": "https://images.unsplash.com/photo-1576956033066-8edcd83a011c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            "downloadLink": "https://example.com/fifa23.zip",
            "downloads": 8900,
            "date": "1402/11/20",
            "requirements": "CPU: Intel Core i3, RAM: 8GB, GPU: GTX 960",
            "version": "1.0.0"
        },
        {
            "id": 3,
            "title": "Minecraft",
            "description": "بازی سازندگی و بقا در جهان بی‌نهایت با بلوک‌های مختلف",
            "size": "2",
            "category": "adventure",
            "image": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            "downloadLink": "https://example.com/minecraft.zip",
            "downloads": 21500,
            "date": "1402/09/05",
            "requirements": "CPU: Intel Core i3, RAM: 4GB, GPU: Intel HD Graphics",
            "version": "1.20.1"
        }
    ],
    "stats": {
        "totalDownloads": 42900,
        "totalGames": 3,
        "visitors": 56789
    }
};

// بارگذاری بازی‌ها در صفحه اصلی
function loadGames() {
    const gamesGrid = document.getElementById('gamesGrid');
    if (!gamesGrid) return;
    
    if (!gamesData.games || gamesData.games.length === 0) {
        gamesGrid.innerHTML = '<div class="no-games">هیچ بازی‌ای یافت نشد</div>';
        return;
    }
    
    let gamesHTML = '';
    
    gamesData.games.forEach(game => {
        gamesHTML += `
            <div class="game-card" data-id="${game.id}">
                <img src="${game.image}" alt="${game.title}" class="game-image">
                <div class="game-content">
                    <h3 class="game-title">${game.title}</h3>
                    <div class="game-meta">
                        <span class="game-size">${game.size} GB</span>
                        <span class="game-category">${getCategoryName(game.category)}</span>
                        <span class="game-downloads">${game.downloads} دانلود</span>
                    </div>
                    <p class="game-description">${game.description}</p>
                    <div class="game-actions">
                        <a href="game-details.html?id=${game.id}" class="btn-details">
                            <i class="fas fa-info-circle"></i> ادامه توضیحات
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
    
    gamesGrid.innerHTML = gamesHTML;
    updateStats();
}

// آپدیت آمار
function updateStats() {
    // آپدیت بازی‌ها
    const totalGamesEl = document.getElementById('totalGames');
    const totalDownloadsEl = document.getElementById('totalDownloads');
    const visitorsEl = document.getElementById('visitors');
    
    if (totalGamesEl) totalGamesEl.textContent = gamesData.games.length;
    if (totalDownloadsEl) totalDownloadsEl.textContent = gamesData.stats.totalDownloads.toLocaleString();
    if (visitorsEl) visitorsEl.textContent = gamesData.stats.visitors.toLocaleString();
}

// تبدیل کد دسته‌بندی به نام فارسی
function getCategoryName(category) {
    const categories = {
        'action': 'اکشن',
        'adventure': 'ماجراجویی',
        'sports': 'ورزشی',
        'strategy': 'استراتژی',
        'racing': 'مسابقه‌ای',
        'rpg': 'نقش‌آفرینی'
    };
    return categories[category] || 'متفرقه';
}

// مدیریت URL پارامترها
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// افزایش شمارنده دانلود
function incrementDownloadCount(gameId) {
    const game = gamesData.games.find(g => g.id == gameId);
    if (game) {
        game.downloads++;
        gamesData.stats.totalDownloads++;
        saveToLocalStorage();
    }
}

// ذخیره در localStorage
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

function saveToLocalStorage() {
    try {
        localStorage.setItem('gameRunData', JSON.stringify(gamesData));
    } catch (e) {
        console.error('خطا در ذخیره داده‌ها:', e);
    }
}

// بارگذاری داده‌های بازی در صفحه توضیحات
function loadGameDetails(gameId) {
    const game = gamesData.games.find(g => g.id == gameId);
    if (!game) {
        window.location.href = 'index.html';
        return;
    }
    
    // پر کردن اطلاعات صفحه
    document.getElementById('gameTitleBreadcrumb').textContent = game.title;
    document.getElementById('gameDetailTitle').textContent = game.title;
    document.getElementById('gameDetailDescription').textContent = game.description;
    document.getElementById('gameDetailImage').src = game.image;
    
    // اطلاعات
    document.getElementById('gameCategoryBadge').textContent = getCategoryName(game.category);
    document.getElementById('gameSizeBadge').textContent = game.size + ' GB';
    document.getElementById('gameDownloadsCount').textContent = game.downloads.toLocaleString();
    
    // مشخصات فنی
    document.getElementById('specSize').textContent = game.size + ' گیگابایت';
    document.getElementById('specRequirements').textContent = game.requirements;
    document.getElementById('specDate').textContent = game.date;
    document.getElementById('specVersion').textContent = game.version;
    
    // دکمه دانلود
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.dataset.url = game.downloadLink;
    
    // تغییر عنوان صفحه
    document.title = `${game.title} - Game Run`;
}

// بارگذاری بازی‌های مشابه
function updateSimilarGames(currentGameId) {
    const similarContainer = document.getElementById('similarGames');
    if (!similarContainer) return;
    
    const currentGame = gamesData.games.find(g => g.id == currentGameId);
    if (!currentGame) return;
    
    // بازی‌های هم‌دسته
    const similarGames = gamesData.games
        .filter(g => g.id != currentGameId && g.category === currentGame.category)
        .slice(0, 3);
    
    if (similarGames.length === 0) {
        similarContainer.innerHTML = '<p>بازی مشابه دیگری یافت نشد</p>';
        return;
    }
    
    let html = '';
    similarGames.forEach(game => {
        html += `
            <div class="game-card">
                <img src="${game.image}" alt="${game.title}" class="game-image">
                <div class="game-content">
                    <h3 class="game-title">${game.title}</h3>
                    <div class="game-meta">
                        <span class="game-size">${game.size} GB</span>
                        <span class="game-category">${getCategoryName(game.category)}</span>
                    </div>
                    <a href="game-details.html?id=${game.id}" class="btn-details">
                        <i class="fas fa-info-circle"></i> مشاهده جزئیات
                    </a>
                </div>
            </div>
        `;
    });
    
    similarContainer.innerHTML = html;
}

// وقتی صفحه لود شد
document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    
    // چک کردن صفحه فعلی
    const path = window.location.pathname;
    
    if (path.includes('index.html') || path === '/') {
        loadGames();
    } else if (path.includes('game-details.html')) {
        const gameId = getQueryParam('id');
        if (gameId) {
            loadGameDetails(parseInt(gameId));
            updateSimilarGames(parseInt(gameId));
        } else {
            window.location.href = 'index.html';
        }
    }
    
    // مدیریت منوی موبایل
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuBtn.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }
});

// ذخیره آمار بازدید
window.addEventListener('load', function() {
    let visitors = parseInt(localStorage.getItem('gameRunVisitors') || '0');
    visitors++;
    localStorage.setItem('gameRunVisitors', visitors.toString());
    gamesData.stats.visitors = visitors;
    saveToLocalStorage();
});
