// 会計システム連携管理
class AccountingManager {
    constructor() {
        this.integrations = {
            freee: {
                connected: true,
                connectedAt: '2024/11/15 10:30',
                lastSync: '2024/11/20 09:15',
                syncItems: ['請求書', '経費', '仕訳']
            },
            rakuraku: {
                connected: false
            },
            moneyforward: {
                connected: false
            }
        };
    }

    init() {
        this.setupEventListeners();
        this.updateIntegrationStatus();
    }

    setupEventListeners() {
        // 自動同期設定の変更
        const autoSyncEnabled = document.getElementById('auto-sync-enabled');
        const syncFrequency = document.getElementById('sync-frequency');
        const syncInvoices = document.getElementById('sync-invoices');
        const syncExpenses = document.getElementById('sync-expenses');
        const syncJournals = document.getElementById('sync-journals');

        if (autoSyncEnabled) {
            autoSyncEnabled.addEventListener('change', (e) => {
                this.saveSyncSettings();
            });
        }

        if (syncFrequency) {
            syncFrequency.addEventListener('change', () => {
                this.saveSyncSettings();
            });
        }

        if (syncInvoices) {
            syncInvoices.addEventListener('change', () => {
                this.saveSyncSettings();
            });
        }

        if (syncExpenses) {
            syncExpenses.addEventListener('change', () => {
                this.saveSyncSettings();
            });
        }

        if (syncJournals) {
            syncJournals.addEventListener('change', () => {
                this.saveSyncSettings();
            });
        }
    }

    updateIntegrationStatus() {
        Object.keys(this.integrations).forEach(service => {
            const integration = this.integrations[service];
            const statusElement = document.getElementById(`${service}-status`);
            const cardElement = document.getElementById(`${service}-integration`);

            if (statusElement) {
                if (integration.connected) {
                    statusElement.textContent = '連携済み';
                    statusElement.className = 'badge success';
                } else {
                    statusElement.textContent = '未連携';
                    statusElement.className = 'badge warning';
                }
            }
        });
    }

    connect(service) {
        const serviceNames = {
            freee: 'freee',
            rakuraku: '楽々会計',
            moneyforward: 'マネーフォワード クラウド'
        };

        const serviceName = serviceNames[service] || service;

        // OAuth認証のシミュレーション
        const modal = this.createAuthModal(serviceName, () => {
            // 認証成功時の処理
            this.integrations[service].connected = true;
            this.integrations[service].connectedAt = new Date().toLocaleString('ja-JP');
            this.integrations[service].lastSync = null;
            this.integrations[service].syncItems = [];

            this.updateIntegrationUI(service);
            this.showMessage(`${serviceName}との連携が完了しました。`, 'success');
        });

        this.showModal(modal);
    }

    disconnect(service) {
        const serviceNames = {
            freee: 'freee',
            rakuraku: '楽々会計',
            moneyforward: 'マネーフォワード クラウド'
        };

        const serviceName = serviceNames[service] || service;

        if (confirm(`${serviceName}との連携を解除しますか？`)) {
            this.integrations[service].connected = false;
            this.integrations[service].connectedAt = null;
            this.integrations[service].lastSync = null;

            this.updateIntegrationUI(service);
            this.showMessage(`${serviceName}との連携を解除しました。`, 'info');
        }
    }

    updateIntegrationUI(service) {
        const integration = this.integrations[service];
        const cardElement = document.getElementById(`${service}-integration`);
        const statusElement = document.getElementById(`${service}-status`);

        if (!cardElement) return;

        if (integration.connected) {
            // 連携済みのUI
            const bodyHTML = `
                <div class="integration-body">
                    <div class="integration-info">
                        <p><strong>連携日時:</strong> ${integration.connectedAt || '未設定'}</p>
                        <p><strong>最終同期:</strong> ${integration.lastSync || '未同期'}</p>
                        <p><strong>同期項目:</strong> ${integration.syncItems ? integration.syncItems.join('、') : '未設定'}</p>
                    </div>
                    <div class="integration-actions">
                        <button class="btn-primary btn-small" onclick="accountingManager.syncNow('${service}')">今すぐ同期</button>
                        <button class="btn-secondary btn-small" onclick="accountingManager.showSettings('${service}')">設定</button>
                        <button class="btn-danger btn-small" onclick="accountingManager.disconnect('${service}')">連携解除</button>
                    </div>
                </div>
            `;

            const bodyContainer = cardElement.querySelector('.integration-body');
            if (bodyContainer) {
                bodyContainer.outerHTML = bodyHTML;
            }

            if (statusElement) {
                statusElement.textContent = '連携済み';
                statusElement.className = 'badge success';
            }
        } else {
            // 未連携のUI
            const serviceNames = {
                freee: 'freee',
                rakuraku: '楽々会計',
                moneyforward: 'マネーフォワード クラウド'
            };
            const serviceName = serviceNames[service] || service;

            const bodyHTML = `
                <div class="integration-body">
                    <div class="integration-info">
                        <p>${serviceName}と連携して、請求書や経費データを自動同期できます。</p>
                    </div>
                    <div class="integration-actions">
                        <button class="btn-primary" onclick="accountingManager.connect('${service}')">連携を開始</button>
                    </div>
                </div>
            `;

            const bodyContainer = cardElement.querySelector('.integration-body');
            if (bodyContainer) {
                bodyContainer.outerHTML = bodyHTML;
            }

            if (statusElement) {
                statusElement.textContent = '未連携';
                statusElement.className = 'badge warning';
            }
        }
    }

    syncNow(service) {
        const serviceNames = {
            freee: 'freee',
            rakuraku: '楽々会計',
            moneyforward: 'マネーフォワード クラウド'
        };

        const serviceName = serviceNames[service] || service;

        // 同期中の表示
        const button = event.target;
        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = '同期中...';

        // 同期処理のシミュレーション
        setTimeout(() => {
            this.integrations[service].lastSync = new Date().toLocaleString('ja-JP');
            this.updateIntegrationUI(service);
            this.showMessage(`${serviceName}との同期が完了しました。`, 'success');
            button.disabled = false;
            button.textContent = originalText;
        }, 2000);
    }

    showSettings(service) {
        const serviceNames = {
            freee: 'freee',
            rakuraku: '楽々会計',
            moneyforward: 'マネーフォワード クラウド'
        };

        const serviceName = serviceNames[service] || service;
        const integration = this.integrations[service];

        const settingsHTML = `
            <div class="integration-settings">
                <h4>${serviceName} 連携設定</h4>
                <div class="form-group">
                    <label>同期項目</label>
                    <div class="checkbox-group">
                        <label><input type="checkbox" ${integration.syncItems && integration.syncItems.includes('請求書') ? 'checked' : ''} data-item="請求書"> 請求書</label>
                        <label><input type="checkbox" ${integration.syncItems && integration.syncItems.includes('経費') ? 'checked' : ''} data-item="経費"> 経費</label>
                        <label><input type="checkbox" ${integration.syncItems && integration.syncItems.includes('仕訳') ? 'checked' : ''} data-item="仕訳"> 仕訳</label>
                    </div>
                </div>
                <div class="form-group">
                    <label>同期方向</label>
                    <select class="filter-select">
                        <option>双方向</option>
                        <option>LREX → ${serviceName}</option>
                        <option>${serviceName} → LREX</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>同期頻度</label>
                    <select class="filter-select">
                        <option>リアルタイム</option>
                        <option>1時間ごと</option>
                        <option>1日ごと</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button class="btn-primary" onclick="accountingManager.saveSettings('${service}')">保存</button>
                    <button class="btn-secondary" onclick="this.closest('.modal').remove()">キャンセル</button>
                </div>
            </div>
        `;

        const modal = this.createModal(`${serviceName} 連携設定`, settingsHTML);
        this.showModal(modal);
    }

    saveSettings(service) {
        const modal = document.querySelector('.modal');
        const checkboxes = modal.querySelectorAll('input[type="checkbox"][data-item]');
        const syncItems = [];

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                syncItems.push(checkbox.dataset.item);
            }
        });

        this.integrations[service].syncItems = syncItems;
        this.updateIntegrationUI(service);
        this.showMessage('設定を保存しました。', 'success');
        modal.remove();
    }

    saveSyncSettings() {
        const settings = {
            autoSyncEnabled: document.getElementById('auto-sync-enabled')?.checked || false,
            syncFrequency: document.getElementById('sync-frequency')?.value || 'daily',
            syncInvoices: document.getElementById('sync-invoices')?.checked || false,
            syncExpenses: document.getElementById('sync-expenses')?.checked || false,
            syncJournals: document.getElementById('sync-journals')?.checked || false
        };

        // 設定を保存（実際の実装ではサーバーに送信）
        console.log('同期設定を保存:', settings);
        this.showMessage('同期設定を保存しました。', 'success');
    }

    showSyncHistory() {
        const historyData = [
            { date: '2024/11/20 09:15', service: 'freee', type: '自動同期', items: '請求書 3件、経費 5件', status: '成功' },
            { date: '2024/11/19 09:10', service: 'freee', type: '自動同期', items: '請求書 2件、経費 3件', status: '成功' },
            { date: '2024/11/18 15:30', service: 'freee', type: '手動同期', items: '請求書 1件', status: '成功' },
            { date: '2024/11/17 09:05', service: 'freee', type: '自動同期', items: '請求書 4件、経費 8件', status: '成功' },
            { date: '2024/11/16 09:00', service: 'freee', type: '自動同期', items: '請求書 2件', status: '失敗' }
        ];

        const historyHTML = `
            <div class="sync-history">
                <h4>同期履歴</h4>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>日時</th>
                            <th>サービス</th>
                            <th>種類</th>
                            <th>同期項目</th>
                            <th>ステータス</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${historyData.map(item => `
                            <tr>
                                <td>${item.date}</td>
                                <td>${item.service}</td>
                                <td>${item.type}</td>
                                <td>${item.items}</td>
                                <td><span class="badge ${item.status === '成功' ? 'success' : 'danger'}">${item.status}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        const modal = this.createModal('同期履歴', historyHTML);
        this.showModal(modal);
    }

    createAuthModal(serviceName, onSuccess) {
        const modalId = `auth-modal-${Date.now()}`;
        const authHTML = `
            <div class="auth-modal">
                <div class="auth-content">
                    <h4>${serviceName} 認証</h4>
                    <p>${serviceName}のアカウントでログインして、連携を許可してください。</p>
                    <div class="auth-steps">
                        <div class="auth-step">
                            <span class="step-number">1</span>
                            <span class="step-text">${serviceName}のログインページに移動します</span>
                        </div>
                        <div class="auth-step">
                            <span class="step-number">2</span>
                            <span class="step-text">アカウントでログインします</span>
                        </div>
                        <div class="auth-step">
                            <span class="step-number">3</span>
                            <span class="step-text">連携を許可します</span>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button class="btn-primary" data-modal-id="${modalId}" onclick="accountingManager.startAuth('${serviceName}', '${modalId}')">認証を開始</button>
                        <button class="btn-secondary" onclick="this.closest('.modal').remove()">キャンセル</button>
                    </div>
                </div>
            </div>
        `;

        const modal = this.createModal(`${serviceName} 認証`, authHTML);
        modal.dataset.modalId = modalId;
        modal.dataset.onSuccess = 'true';
        
        // モーダルにonSuccessコールバックを保存
        if (onSuccess) {
            modal.dataset.callback = 'true';
            window[`authCallback_${modalId}`] = onSuccess;
        }
        
        return modal;
    }

    startAuth(serviceName, modalId) {
        // OAuth認証のシミュレーション
        const button = event.target;
        button.disabled = true;
        button.textContent = '認証中...';

        setTimeout(() => {
            const modal = document.querySelector(`[data-modal-id="${modalId}"]`)?.closest('.modal') || document.querySelector('.modal');
            if (modal && modal.dataset.callback === 'true') {
                const callback = window[`authCallback_${modalId}`];
                if (callback && typeof callback === 'function') {
                    callback();
                }
            }
            if (modal) {
                modal.remove();
            }
        }, 2000);
    }

    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        return modal;
    }

    showModal(modal) {
        document.body.appendChild(modal);
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.classList.add('show');
        }, 10);

        setTimeout(() => {
            messageDiv.classList.remove('show');
            setTimeout(() => {
                messageDiv.remove();
            }, 300);
        }, 3000);
    }
}

// グローバルインスタンス
let accountingManager;

