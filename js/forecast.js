// 受注予測機能
class ForecastManager {
    constructor() {
        this.currentPeriod = 'week';
        this.chart = null;
    }

    init() {
        this.setupEventListeners();
        this.loadForecastData();
        this.loadDetailForecastData();
    }

    setupEventListeners() {
        // 期間切り替えボタン
        document.addEventListener('click', (e) => {
            if (e.target.dataset.period) {
                this.currentPeriod = e.target.dataset.period;
                this.updatePeriodButtons();
                this.loadForecastData();
                this.loadDetailForecastData();
            }
        });

        // 期間セレクト
        const periodSelect = document.getElementById('forecast-period');
        if (periodSelect) {
            periodSelect.addEventListener('change', (e) => {
                this.currentPeriod = e.target.value;
                this.loadForecastData();
                this.loadDetailForecastData();
            });
        }

        // フィルター
        const routeFilter = document.getElementById('forecast-route-filter');
        const cargoFilter = document.getElementById('forecast-cargo-filter');
        const customerFilter = document.getElementById('forecast-customer-filter');
        
        if (routeFilter) {
            routeFilter.addEventListener('change', () => this.loadDetailForecastData());
        }
        if (cargoFilter) {
            cargoFilter.addEventListener('change', () => this.loadDetailForecastData());
        }
        if (customerFilter) {
            customerFilter.addEventListener('change', () => this.loadDetailForecastData());
        }
    }

    updatePeriodButtons() {
        document.querySelectorAll('[data-period]').forEach(btn => {
            if (btn.dataset.period === this.currentPeriod) {
                btn.classList.add('active');
                btn.classList.remove('btn-secondary');
                btn.classList.add('btn-primary');
            } else {
                btn.classList.remove('active');
                btn.classList.add('btn-secondary');
                btn.classList.remove('btn-primary');
            }
        });
    }

    loadForecastData() {
        // デモ用のデータ
        const weekData = {
            count: 28,
            revenue: 14200000,
            change: '+15%',
            revenueChange: '+12%'
        };

        const monthData = {
            count: 120,
            revenue: 58000000,
            change: '+8%',
            revenueChange: '+10%'
        };

        const data = this.currentPeriod === 'week' ? weekData : monthData;

        // 統計を更新
        const countEl = document.getElementById('forecast-count');
        const revenueEl = document.getElementById('forecast-revenue');
        const changeEl = document.getElementById('forecast-change');
        const revenueChangeEl = document.getElementById('forecast-revenue-change');

        if (countEl) countEl.textContent = `${data.count}件`;
        if (revenueEl) revenueEl.textContent = `¥${data.revenue.toLocaleString()}`;
        if (changeEl) {
            changeEl.textContent = data.change;
            changeEl.className = 'stat-change ' + (data.change.startsWith('+') ? 'positive' : 'negative');
        }
        if (revenueChangeEl) {
            revenueChangeEl.textContent = data.revenueChange;
            revenueChangeEl.className = 'stat-change ' + (data.revenueChange.startsWith('+') ? 'positive' : 'negative');
        }

        // チャートを描画（簡易版）
        this.drawChart();
    }

    drawChart() {
        const canvas = document.getElementById('forecast-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // クリア
        ctx.clearRect(0, 0, width, height);

        // 背景
        ctx.fillStyle = '#F5F5F5';
        ctx.fillRect(0, 0, width, height);

        // デモ用のデータ
        const data = this.currentPeriod === 'week' 
            ? [20, 24, 22, 26, 28, 25, 30]
            : [100, 110, 105, 115, 120, 118, 125, 130, 128, 135, 140, 145];

        const maxValue = Math.max(...data);
        const barWidth = width / (data.length + 1);
        const barHeight = height - 40;

        // バーを描画
        data.forEach((value, index) => {
            const x = (index + 1) * barWidth;
            const barHeightValue = (value / maxValue) * barHeight;
            const y = height - barHeightValue - 20;

            // グラデーション
            const gradient = ctx.createLinearGradient(0, y, 0, height - 20);
            gradient.addColorStop(0, '#CC1414');
            gradient.addColorStop(1, '#E02020');

            ctx.fillStyle = gradient;
            ctx.fillRect(x - barWidth * 0.4, y, barWidth * 0.8, barHeightValue);

            // 値のラベル
            ctx.fillStyle = '#212121';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(value, x, y - 5);
        });
    }

    refreshForecast() {
        console.log('予測データを更新中...');
        this.loadForecastData();
        this.loadDetailForecastData();
        alert('予測データを更新しました（デモ）');
    }

    updateForecast() {
        const startDate = document.getElementById('forecast-start-date')?.value;
        const period = document.getElementById('forecast-period')?.value;
        
        console.log('予測実行:', { startDate, period });
        this.loadForecastData();
        this.loadDetailForecastData();
        alert('予測を実行しました（デモ）');
    }

    loadDetailForecastData() {
        const tbody = document.getElementById('forecast-detail-table-body');
        if (!tbody) return;

        // フィルター取得
        const routeFilter = document.getElementById('forecast-route-filter')?.value || '';
        const cargoFilter = document.getElementById('forecast-cargo-filter')?.value || '';
        const customerFilter = document.getElementById('forecast-customer-filter')?.value || '';

        // デモ用の詳細予測データ（得意先80%、スポット20%、積荷は全て艦船）
        const detailData = [
            { date: '2024/12/23', from: '東京', to: '大阪', cargo: '艦船', weight: '4,500kg', customerType: '得意先', count: 3, confidence: '高' },
            { date: '2024/12/23', from: '名古屋', to: '福岡', cargo: '艦船', weight: '3,200kg', customerType: '得意先', count: 2, confidence: '高' },
            { date: '2024/12/24', from: '大阪', to: '東京', cargo: '艦船', weight: '3,800kg', customerType: '得意先', count: 2, confidence: '高' },
            { date: '2024/12/24', from: '東京', to: '名古屋', cargo: '艦船', weight: '2,500kg', customerType: 'スポット', count: 1, confidence: '中' },
            { date: '2024/12/25', from: '横浜', to: '京都', cargo: '艦船', weight: '5,000kg', customerType: '得意先', count: 1, confidence: '高' },
            { date: '2024/12/25', from: '福岡', to: '名古屋', cargo: '艦船', weight: '2,800kg', customerType: 'スポット', count: 1, confidence: '中' },
            { date: '2024/12/26', from: '東京', to: '大阪', cargo: '艦船', weight: '4,200kg', customerType: '得意先', count: 3, confidence: '高' },
            { date: '2024/12/26', from: '名古屋', to: '東京', cargo: '艦船', weight: '3,000kg', customerType: '得意先', count: 2, confidence: '高' },
            { date: '2024/12/27', from: '大阪', to: '福岡', cargo: '艦船', weight: '3,500kg', customerType: '得意先', count: 2, confidence: '高' },
            { date: '2024/12/27', from: '東京', to: '横浜', cargo: '艦船', weight: '1,500kg', customerType: 'スポット', count: 1, confidence: '低' },
            { date: '2024/12/28', from: '名古屋', to: '大阪', cargo: '艦船', weight: '3,600kg', customerType: '得意先', count: 2, confidence: '高' },
            { date: '2024/12/28', from: '福岡', to: '東京', cargo: '艦船', weight: '4,000kg', customerType: '得意先', count: 2, confidence: '高' },
            { date: '2024/12/29', from: '東京', to: '名古屋', cargo: '艦船', weight: '3,200kg', customerType: '得意先', count: 2, confidence: '高' },
            { date: '2024/12/29', from: '大阪', to: '横浜', cargo: '艦船', weight: '2,800kg', customerType: 'スポット', count: 1, confidence: '中' }
        ];

        // フィルター適用
        let filteredData = detailData;
        if (routeFilter) {
            filteredData = filteredData.filter(item => 
                item.from.includes(routeFilter) || item.to.includes(routeFilter)
            );
        }
        if (cargoFilter) {
            filteredData = filteredData.filter(item => item.cargo === cargoFilter);
        }
        if (customerFilter) {
            filteredData = filteredData.filter(item => item.customerType === customerFilter);
        }

        // テーブルを生成
        tbody.innerHTML = filteredData.map(item => {
            const confidenceBadge = item.confidence === '高' 
                ? '<span class="badge success">高</span>'
                : item.confidence === '中'
                ? '<span class="badge warning">中</span>'
                : '<span class="badge danger">低</span>';
            
            const customerBadge = item.customerType === '得意先'
                ? '<span class="badge success">得意先</span>'
                : '<span class="badge info">スポット</span>';

            return `
                <tr>
                    <td>${item.date}</td>
                    <td>${item.from}</td>
                    <td>${item.to}</td>
                    <td>${item.cargo}</td>
                    <td>${item.weight}</td>
                    <td>${customerBadge}</td>
                    <td>${item.count}件</td>
                    <td>${confidenceBadge}</td>
                </tr>
            `;
        }).join('');

        // データがない場合
        if (filteredData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">該当する予測データがありません</td></tr>';
        }
    }
}

// グローバルにエクスポート
window.ForecastManager = ForecastManager;

