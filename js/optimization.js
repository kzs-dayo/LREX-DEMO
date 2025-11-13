// 配車最適化機能
class OptimizationManager {
    constructor() {
        this.optimizations = [];
    }

    runOptimization() {
        console.log('配車最適化を実行中...');
        
        // デモ用：最適化結果を表示
        const resultsContainer = document.getElementById('optimization-results');
        if (resultsContainer) {
            // 既存の結果をクリア（最初の実行時のみ）
            // 実際の実装では、APIから新しい結果を取得して表示
            
            // ローディング表示
            const loadingMsg = document.createElement('div');
            loadingMsg.className = 'info-text';
            loadingMsg.textContent = '最適化を実行中...';
            resultsContainer.insertBefore(loadingMsg, resultsContainer.firstChild);
            
            setTimeout(() => {
                loadingMsg.remove();
                alert('最適化が完了しました。結果を確認してください。');
            }, 1500);
        }
    }

    applyOptimization(proposalId) {
        console.log('最適化提案を適用:', proposalId);
        
        // デモ用：確認ダイアログ
        if (confirm(`提案 ${proposalId} を適用しますか？`)) {
            // 実際の実装では、APIを呼び出して配車を更新
            alert('最適化提案を適用しました（デモ）');
            
            // 配車予定ページに遷移
            if (window.navigation) {
                window.navigation.navigateToPage('weekly-schedule');
            }
        }
    }

    getOptimizationSettings() {
        return {
            period: document.getElementById('optimization-period')?.value || 'week',
            minLoadImprovement: parseInt(document.getElementById('min-load-improvement')?.value || 20),
            maxDistanceIncrease: parseInt(document.getElementById('max-distance-increase')?.value || 50)
        };
    }
}

// グローバルにエクスポート
window.OptimizationManager = OptimizationManager;

