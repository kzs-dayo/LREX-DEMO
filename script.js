// ページ遷移機能
document.addEventListener('DOMContentLoaded', function() {
    // ナビゲーションアイテムのクリックイベント
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const pageTitle = document.querySelector('.page-title');

    // ページタイトルのマッピング
    const pageTitles = {
        'dashboard': 'ダッシュボード',
        'orders': '受注管理',
        'dispatch': '配車・運行管理',
        'vehicles': '車両管理',
        'labor': '労務管理',
        'accounting': '経理・経営管理',
        'general': '総務',
        'alerts': 'アラート'
    };

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetPage = this.getAttribute('data-page');
            
            // アクティブなナビゲーションアイテムを更新
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // アクティブなページを更新
            pages.forEach(page => page.classList.remove('active'));
            const targetPageElement = document.getElementById(targetPage);
            if (targetPageElement) {
                targetPageElement.classList.add('active');
                
                // ページタイトルを更新
                if (pageTitles[targetPage]) {
                    pageTitle.textContent = pageTitles[targetPage];
                }
            }
        });
    });

    // ボタンのクリックイベント（デモ用）
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // リンクボタン以外はデフォルトの動作を防ぐ
            if (!this.classList.contains('btn-link')) {
                e.preventDefault();
            }
            
            // デモ用のアラート（実際の実装では削除）
            const buttonText = this.textContent.trim();
            if (buttonText && !buttonText.includes('詳細') && !buttonText.includes('編集') && !buttonText.includes('連絡')) {
                // 重要なアクションのみアラートを表示
                if (buttonText.includes('登録') || buttonText.includes('作成') || buttonText.includes('発行')) {
                    console.log(`「${buttonText}」ボタンがクリックされました`);
                }
            }
        });
    });

    // テーブルの行ホバーエフェクト
    const tableRows = document.querySelectorAll('.data-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transition = 'background-color 0.2s';
        });
    });

    // アラートアイテムの既読機能（デモ用）
    const alertReadButtons = document.querySelectorAll('.alert-item .btn-secondary');
    alertReadButtons.forEach(button => {
        if (button.textContent.includes('既読')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const alertItem = this.closest('.alert-item');
                if (alertItem) {
                    alertItem.style.opacity = '0.6';
                    alertItem.style.transition = 'opacity 0.3s';
                    this.textContent = '既読済';
                    this.disabled = true;
                    this.style.cursor = 'not-allowed';
                }
            });
        }
    });

    // 検索機能のデモ（実際の実装ではAPI呼び出しなど）
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                console.log('検索:', this.value);
                // 実際の実装では検索処理を実行
            }
        });
    }

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

    // モバイルメニューのトグル（必要に応じて）
    const createMobileMenuToggle = () => {
        if (window.innerWidth <= 768) {
            // モバイル用のメニュートグルを追加する場合はここに実装
        }
    };

    window.addEventListener('resize', createMobileMenuToggle);
    createMobileMenuToggle();
});

// ダッシュボードのリアルタイム更新シミュレーション（デモ用）
function simulateRealTimeUpdates() {
    // 実際の実装ではWebSocketやAPIポーリングを使用
    setInterval(() => {
        const statValues = document.querySelectorAll('.stat-value');
        // デモ用の更新（実際の実装ではAPIから取得）
        console.log('ダッシュボードデータを更新中...');
    }, 30000); // 30秒ごと
}

// ページ読み込み時に実行
window.addEventListener('load', function() {
    // 初期ページをダッシュボードに設定
    const dashboardPage = document.getElementById('dashboard');
    if (dashboardPage) {
        dashboardPage.classList.add('active');
    }
    
    // リアルタイム更新を開始（デモ用）
    // simulateRealTimeUpdates();
});

