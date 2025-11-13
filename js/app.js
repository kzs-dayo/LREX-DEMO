// アプリケーション初期化
document.addEventListener('DOMContentLoaded', function() {
    // ナビゲーション初期化
    const navigation = new Navigation();
    window.navigation = navigation;

    // ページマネージャー初期化
    const pageManager = new PageManager(navigation);
    window.pageManager = pageManager;

    // 受注予測マネージャー初期化
    const forecastManager = new ForecastManager();
    window.forecastManager = forecastManager;
    forecastManager.init();

    // 配車最適化マネージャー初期化
    const optimizationManager = new OptimizationManager();
    window.optimizationManager = optimizationManager;

    // 週単位配車予定マネージャー初期化
    const weeklyScheduleManager = new WeeklyScheduleManager();
    window.weeklyScheduleManager = weeklyScheduleManager;
    weeklyScheduleManager.init();

    // 会計システム連携マネージャー初期化
    accountingManager = new AccountingManager();
    window.accountingManager = accountingManager;
    accountingManager.init();

    // フォーム送信処理
    document.addEventListener('submit', function(e) {
        e.preventDefault();
        const form = e.target;
        if (form.classList.contains('detail-form')) {
            // フォーム送信の処理（実際の実装ではAPI呼び出しなど）
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            console.log('フォーム送信:', data);
            
            // デモ用：アラート表示
            alert('データを保存しました（デモ）');
            pageManager.closeModal();
            
            // 実際の実装では、ここでAPIを呼び出してデータを保存
            // その後、ページをリロードまたは更新
        }
    });

    // 検索機能
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                console.log('検索:', this.value);
                // 実際の実装では検索処理を実行
            }
        });
    }

    // アラートアイテムの既読機能
    document.addEventListener('click', function(e) {
        const button = e.target.closest('button');
        if (button && button.textContent.includes('既読')) {
            e.preventDefault();
            const alertItem = button.closest('.alert-item');
            if (alertItem) {
                alertItem.style.opacity = '0.6';
                alertItem.style.transition = 'opacity 0.3s';
                button.textContent = '既読済';
                button.disabled = true;
                button.style.cursor = 'not-allowed';
            }
        }
    });

    // 統計カードのアニメーション
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s, transform 0.6s';
        observer.observe(card);
    });

    // 通知ボタン
    const notificationButton = document.querySelector('.btn-icon');
    if (notificationButton && notificationButton.querySelector('svg')) {
        notificationButton.addEventListener('click', function() {
            navigation.navigateToPage('alerts');
        });
    }

    // ユーザーメニュー
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.addEventListener('click', function() {
            // ユーザーメニューの処理（必要に応じて実装）
            console.log('ユーザーメニューを開く');
        });
    }
});

