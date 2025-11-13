// ナビゲーション管理
class Navigation {
    constructor() {
        this.currentPage = 'dashboard';
        this.pageHistory = [];
        this.init();
    }

    init() {
        this.setupNavItems();
        this.setupBackButton();
    }

    setupNavItems() {
        const navItems = document.querySelectorAll('.nav-item');
        const pages = document.querySelectorAll('.page');
        const pageTitle = document.querySelector('.page-title');

        const pageTitles = {
            'dashboard': 'ダッシュボード',
            'orders': '受注管理',
            'vehicles': '車両管理',
            'labor': '労務管理',
            'accounting': '経理・経営管理',
            'general': '総務',
            'forecast': '受注予測',
            'weekly-schedule': '週単位配車予定',
            'request-form': '運送依頼書'
        };

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = item.getAttribute('data-page');
                this.navigateToPage(targetPage);
            });
        });
    }

    navigateToPage(pageId, addToHistory = true) {
        const pages = document.querySelectorAll('.page');
        const navItems = document.querySelectorAll('.nav-item');
        const pageTitle = document.querySelector('.page-title');

        const pageTitles = {
            'dashboard': 'ダッシュボード',
            'orders': '受注管理',
            'vehicles': '車両管理',
            'labor': '労務管理',
            'accounting': '経理・経営管理',
            'general': '総務',
            'forecast': '受注予測',
            'weekly-schedule': '週単位配車予定',
            'request-form': '運送依頼書'
        };

        // 履歴に追加
        if (addToHistory && this.currentPage !== pageId) {
            this.pageHistory.push(this.currentPage);
        }

        // アクティブなナビゲーションアイテムを更新
        navItems.forEach(nav => {
            nav.classList.remove('active');
            if (nav.getAttribute('data-page') === pageId) {
                nav.classList.add('active');
            }
        });

        // アクティブなページを更新
        pages.forEach(page => page.classList.remove('active'));
        const targetPageElement = document.getElementById(pageId);
        if (targetPageElement) {
            targetPageElement.classList.add('active');
            this.currentPage = pageId;

            // ページタイトルを更新
            if (pageTitles[pageId]) {
                pageTitle.textContent = pageTitles[pageId];
            }
        }
    }

    goBack() {
        if (this.pageHistory.length > 0) {
            const previousPage = this.pageHistory.pop();
            this.navigateToPage(previousPage, false);
        }
    }

    setupBackButton() {
        // 戻るボタンが存在する場合の処理
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-back') || e.target.closest('.btn-back')) {
                e.preventDefault();
                this.goBack();
            }
        });
    }
}

// グローバルにエクスポート
window.Navigation = Navigation;

