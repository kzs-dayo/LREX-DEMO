// ページ管理と詳細ページ表示
class PageManager {
    constructor(navigation) {
        this.navigation = navigation;
        this.modalContainer = null;
        this.init();
    }

    init() {
        this.createModalContainer();
        this.setupButtonHandlers();
    }

    createModalContainer() {
        this.modalContainer = document.createElement('div');
        this.modalContainer.id = 'modal-container';
        this.modalContainer.className = 'modal-container';
        document.body.appendChild(this.modalContainer);
    }

    setupButtonHandlers() {
        // 詳細ボタン
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const buttonText = button.textContent.trim();
            const row = button.closest('tr');
            const card = button.closest('.dispatch-card, .alert-item');

            // 受注詳細
            if (buttonText === '詳細' && row) {
                const orderNo = row.querySelector('td:first-child')?.textContent.trim();
                if (orderNo) {
                    this.showOrderDetail(orderNo);
                }
            }

            // 車両詳細
            if (buttonText === '詳細' && row && row.querySelector('td:nth-child(2)')?.textContent.includes('トラック')) {
                const vehicleNo = row.querySelector('td:first-child')?.textContent.trim();
                if (vehicleNo) {
                    this.showVehicleDetail(vehicleNo);
                }
            }

            // 従業員詳細
            if (buttonText === '詳細' && row && this.navigation.currentPage === 'labor') {
                const employeeName = row.querySelector('td:first-child')?.textContent.trim();
                if (employeeName) {
                    this.showEmployeeDetail(employeeName);
                }
            }

            // 配車詳細
            if (buttonText === '詳細' && card && card.classList.contains('dispatch-card')) {
                const vehicleNo = card.querySelector('.vehicle-number')?.textContent.replace('車両: ', '').trim();
                if (vehicleNo) {
                    this.showDispatchDetail(vehicleNo);
                }
            }

            // 請求書詳細
            if (buttonText === '詳細' && row && this.navigation.currentPage === 'accounting') {
                const invoiceNo = row.querySelector('td:first-child')?.textContent.trim();
                if (invoiceNo) {
                    this.showInvoiceDetail(invoiceNo);
                }
            }

            // 編集ボタン
            if (buttonText === '編集') {
                const orderNo = row?.querySelector('td:first-child')?.textContent.trim();
                if (orderNo && this.navigation.currentPage === 'orders') {
                    this.showOrderForm(orderNo);
                } else if (orderNo && this.navigation.currentPage === 'vehicles') {
                    const vehicleNo = orderNo;
                    this.showVehicleForm(vehicleNo);
                } else if (this.navigation.currentPage === 'labor') {
                    const employeeName = row?.querySelector('td:first-child')?.textContent.trim();
                    if (employeeName) {
                        this.showEmployeeForm(employeeName);
                    }
                }
            }

            // 新規登録ボタン
            if (buttonText.includes('新規') && buttonText.includes('登録')) {
                if (buttonText.includes('受注')) {
                    this.showOrderForm();
                } else if (buttonText.includes('車両')) {
                    this.showVehicleForm();
                } else if (buttonText.includes('従業員')) {
                    this.showEmployeeForm();
                }
            }

            // その他の機能ボタン
            if (buttonText === '配車') {
                const card = button.closest('.dispatch-card');
                const orderNo = card?.querySelector('p')?.textContent.replace('受注No.: ', '').trim();
                if (orderNo) {
                    this.showDispatchForm(orderNo);
                }
            }

            if (buttonText === '連絡') {
                const card = button.closest('.dispatch-card');
                const vehicleNo = card?.querySelector('.vehicle-number')?.textContent.replace('車両: ', '').trim();
                if (vehicleNo) {
                    this.showContactForm(vehicleNo);
                }
            }

            if (buttonText === '対応') {
                const alertItem = button.closest('.alert-item');
                if (alertItem) {
                    const alertText = alertItem.querySelector('strong')?.textContent;
                    this.handleAlertAction(alertText);
                }
            }

            // 各種作成・発行ボタン
            if (buttonText.includes('作成') || buttonText.includes('発行') || buttonText.includes('計算') || buttonText.includes('管理') || buttonText.includes('報告')) {
                this.handleActionButton(buttonText);
            }
        });
    }

    showOrderDetail(orderNo) {
        const modal = this.createModal('受注詳細', this.getOrderDetailHTML(orderNo));
        this.showModal(modal);
    }

    showVehicleDetail(vehicleNo) {
        const modal = this.createModal('車両詳細', this.getVehicleDetailHTML(vehicleNo));
        this.showModal(modal);
    }

    showEmployeeDetail(employeeName) {
        const modal = this.createModal('従業員詳細', this.getEmployeeDetailHTML(employeeName));
        this.showModal(modal);
    }

    showDispatchDetail(vehicleNo) {
        const modal = this.createModal('配車詳細', this.getDispatchDetailHTML(vehicleNo));
        this.showModal(modal);
    }

    showInvoiceDetail(invoiceNo) {
        const modal = this.createModal('請求書詳細', this.getInvoiceDetailHTML(invoiceNo));
        this.showModal(modal);
    }

    showOrderForm(orderNo = null) {
        const title = orderNo ? '受注編集' : '新規受注登録';
        const modal = this.createModal(title, this.getOrderFormHTML(orderNo));
        this.showModal(modal);
    }

    showVehicleForm(vehicleNo = null) {
        const title = vehicleNo ? '車両編集' : '新規車両登録';
        const modal = this.createModal(title, this.getVehicleFormHTML(vehicleNo));
        this.showModal(modal);
    }

    showEmployeeForm(employeeName = null) {
        const title = employeeName ? '従業員編集' : '新規従業員登録';
        const modal = this.createModal(title, this.getEmployeeFormHTML(employeeName));
        this.showModal(modal);
    }

    showDispatchForm(orderNo) {
        const modal = this.createModal('配車登録', this.getDispatchFormHTML(orderNo));
        this.showModal(modal);
    }

    handleAlertAction(alertText) {
        if (alertText.includes('配車未確定')) {
            this.navigation.navigateToPage('dispatch');
        } else if (alertText.includes('受領書未回収')) {
            this.navigation.navigateToPage('orders');
        } else if (alertText.includes('点呼簿')) {
            this.navigation.navigateToPage('dispatch');
        } else {
            this.navigation.navigateToPage('alerts');
        }
    }

    handleActionButton(buttonText) {
        if (buttonText.includes('運行表作成')) {
            this.showModal(this.createModal('運行表作成', this.getDispatchScheduleFormHTML()));
        } else if (buttonText.includes('配車計画作成')) {
            this.showModal(this.createModal('配車計画作成', this.getDispatchPlanFormHTML()));
        } else if (buttonText.includes('点呼簿作成')) {
            this.showModal(this.createModal('点呼簿作成', this.getAttendanceFormHTML()));
        } else if (buttonText.includes('請求書発行')) {
            this.showModal(this.createModal('請求書発行', this.getInvoiceFormHTML()));
        } else if (buttonText.includes('給与計算')) {
            this.showModal(this.createModal('給与計算', this.getSalaryFormHTML()));
        } else if (buttonText.includes('保険管理')) {
            this.navigation.navigateToPage('vehicles');
        } else if (buttonText.includes('ETC管理')) {
            this.showModal(this.createModal('ETC管理', this.getETCFormHTML()));
        } else if (buttonText.includes('事故報告')) {
            this.showModal(this.createModal('事故報告', this.getAccidentFormHTML()));
        } else if (buttonText.includes('日計表作成')) {
            this.showModal(this.createModal('日計表作成', this.getDailyReportFormHTML()));
        } else if (buttonText.includes('車両別収益表')) {
            this.showModal(this.createModal('車両別収益表', this.getVehicleRevenueFormHTML()));
        }
    }

    showContactForm(vehicleNo) {
        const modal = this.createModal('運転手連絡', this.getContactFormHTML(vehicleNo));
        this.showModal(modal);
    }

    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        return modal;
    }

    showModal(modal) {
        this.modalContainer.innerHTML = '';
        this.modalContainer.appendChild(modal);
        this.modalContainer.style.display = 'flex';
        
        // 閉じるボタンのイベント
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        // 背景クリックで閉じる
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // ESCキーで閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    closeModal() {
        this.modalContainer.style.display = 'none';
        this.modalContainer.innerHTML = '';
    }

    // 詳細ページのHTML生成メソッド
    getOrderDetailHTML(orderNo) {
        return `
            <div class="detail-section">
                <h3>基本情報</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>受注No.</label>
                        <p>${orderNo}</p>
                    </div>
                    <div class="detail-item">
                        <label>受注日</label>
                        <p>2024/12/18</p>
                    </div>
                    <div class="detail-item">
                        <label>取引先</label>
                        <p>株式会社ABC</p>
                    </div>
                    <div class="detail-item">
                        <label>ステータス</label>
                        <p><span class="badge success">配車済</span></p>
                    </div>
                </div>
            </div>
            <div class="detail-section">
                <h3>配送情報</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>出発地</label>
                        <p>東京</p>
                    </div>
                    <div class="detail-item">
                        <label>到着地</label>
                        <p>大阪</p>
                    </div>
                    <div class="detail-item">
                        <label>納期</label>
                        <p>2024/12/20</p>
                    </div>
                    <div class="detail-item">
                        <label>配送料金</label>
                        <p>¥450,000</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="pageManager.closeModal()">閉じる</button>
                <button class="btn-primary" onclick="pageManager.showOrderForm('${orderNo}'); pageManager.closeModal();">編集</button>
            </div>
        `;
    }

    getVehicleDetailHTML(vehicleNo) {
        return `
            <div class="detail-section">
                <h3>基本情報</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>車両番号</label>
                        <p>${vehicleNo}</p>
                    </div>
                    <div class="detail-item">
                        <label>車種</label>
                        <p>大型トラック</p>
                    </div>
                    <div class="detail-item">
                        <label>運転手</label>
                        <p>山田太郎</p>
                    </div>
                    <div class="detail-item">
                        <label>状態</label>
                        <p><span class="badge success">運行中</span></p>
                    </div>
                </div>
            </div>
            <div class="detail-section">
                <h3>メンテナンス情報</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>最終点検日</label>
                        <p>2024/11/15</p>
                    </div>
                    <div class="detail-item">
                        <label>次回点検予定日</label>
                        <p>2025/02/15</p>
                    </div>
                    <div class="detail-item">
                        <label>保険期限</label>
                        <p>2025/06/30</p>
                    </div>
                    <div class="detail-item">
                        <label>車検期限</label>
                        <p>2025/08/20</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="pageManager.closeModal()">閉じる</button>
                <button class="btn-primary" onclick="pageManager.showVehicleForm('${vehicleNo}'); pageManager.closeModal();">編集</button>
            </div>
        `;
    }

    getEmployeeDetailHTML(employeeName) {
        return `
            <div class="detail-section">
                <h3>基本情報</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>氏名</label>
                        <p>${employeeName}</p>
                    </div>
                    <div class="detail-item">
                        <label>所属</label>
                        <p>第一営業所</p>
                    </div>
                    <div class="detail-item">
                        <label>健康診断期限</label>
                        <p>2025/03/31</p>
                    </div>
                    <div class="detail-item">
                        <label>免許証期限</label>
                        <p>2026/05/15</p>
                    </div>
                </div>
            </div>
            <div class="detail-section">
                <h3>運行情報</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>今月の運行時間</label>
                        <p>180時間</p>
                    </div>
                    <div class="detail-item">
                        <label>今月の運行距離</label>
                        <p>5,200km</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="pageManager.closeModal()">閉じる</button>
                <button class="btn-primary" onclick="pageManager.showEmployeeForm('${employeeName}'); pageManager.closeModal();">編集</button>
            </div>
        `;
    }

    getDispatchDetailHTML(vehicleNo) {
        return `
            <div class="detail-section">
                <h3>配車情報</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>車両番号</label>
                        <p>${vehicleNo}</p>
                    </div>
                    <div class="detail-item">
                        <label>運転手</label>
                        <p>山田太郎</p>
                    </div>
                    <div class="detail-item">
                        <label>受注No.</label>
                        <p>2024-0015</p>
                    </div>
                    <div class="detail-item">
                        <label>ステータス</label>
                        <p><span class="badge success">運行中</span></p>
                    </div>
                </div>
            </div>
            <div class="detail-section">
                <h3>ルート情報</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>出発地</label>
                        <p>東京</p>
                    </div>
                    <div class="detail-item">
                        <label>到着地</label>
                        <p>大阪</p>
                    </div>
                    <div class="detail-item">
                        <label>予定到着</label>
                        <p>2024/12/20 14:00</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="pageManager.closeModal()">閉じる</button>
                <button class="btn-primary">連絡</button>
            </div>
        `;
    }

    getInvoiceDetailHTML(invoiceNo) {
        return `
            <div class="detail-section">
                <h3>請求書情報</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>請求書No.</label>
                        <p>${invoiceNo}</p>
                    </div>
                    <div class="detail-item">
                        <label>取引先</label>
                        <p>株式会社ABC</p>
                    </div>
                    <div class="detail-item">
                        <label>金額</label>
                        <p>¥450,000</p>
                    </div>
                    <div class="detail-item">
                        <label>ステータス</label>
                        <p><span class="badge warning">未入金</span></p>
                    </div>
                </div>
            </div>
            <div class="detail-section">
                <h3>支払情報</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>請求日</label>
                        <p>2024/12/01</p>
                    </div>
                    <div class="detail-item">
                        <label>支払期限</label>
                        <p>2024/12/31</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="pageManager.closeModal()">閉じる</button>
                <button class="btn-primary">PDF出力</button>
            </div>
        `;
    }

    // フォームのHTML生成メソッド（簡易版）
    getOrderFormHTML(orderNo = null) {
        const isEdit = orderNo !== null;
        return `
            <form class="detail-form">
                <div class="form-group">
                    <label>受注No.</label>
                    <input type="text" value="${orderNo || ''}" ${isEdit ? 'readonly' : ''} required>
                </div>
                <div class="form-group">
                    <label>取引先</label>
                    <input type="text" value="${isEdit ? '株式会社ABC' : ''}" required>
                </div>
                <div class="form-group">
                    <label>出発地</label>
                    <input type="text" value="${isEdit ? '東京' : ''}" required>
                </div>
                <div class="form-group">
                    <label>到着地</label>
                    <input type="text" value="${isEdit ? '大阪' : ''}" required>
                </div>
                <div class="form-group">
                    <label>納期</label>
                    <input type="date" value="${isEdit ? '2024-12-20' : ''}" required>
                </div>
                <div class="form-group">
                    <label>配送料金</label>
                    <input type="number" value="${isEdit ? '450000' : ''}" required>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" onclick="pageManager.closeModal()">キャンセル</button>
                    <button type="submit" class="btn-primary">${isEdit ? '更新' : '登録'}</button>
                </div>
            </form>
        `;
    }

    getVehicleFormHTML(vehicleNo = null) {
        const isEdit = vehicleNo !== null;
        return `
            <form class="detail-form">
                <div class="form-group">
                    <label>車両番号</label>
                    <input type="text" value="${vehicleNo || ''}" ${isEdit ? 'readonly' : ''} required>
                </div>
                <div class="form-group">
                    <label>車種</label>
                    <select required>
                        <option value="">選択してください</option>
                        <option value="large" ${isEdit ? 'selected' : ''}>大型トラック</option>
                        <option value="medium">中型トラック</option>
                        <option value="small">小型トラック</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>運転手</label>
                    <input type="text" value="${isEdit ? '山田太郎' : ''}">
                </div>
                <div class="form-group">
                    <label>保険期限</label>
                    <input type="date" value="${isEdit ? '2025-06-30' : ''}" required>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" onclick="pageManager.closeModal()">キャンセル</button>
                    <button type="submit" class="btn-primary">${isEdit ? '更新' : '登録'}</button>
                </div>
            </form>
        `;
    }

    getEmployeeFormHTML(employeeName = null) {
        const isEdit = employeeName !== null;
        return `
            <form class="detail-form">
                <div class="form-group">
                    <label>氏名</label>
                    <input type="text" value="${employeeName || ''}" required>
                </div>
                <div class="form-group">
                    <label>所属</label>
                    <input type="text" value="${isEdit ? '第一営業所' : ''}" required>
                </div>
                <div class="form-group">
                    <label>健康診断期限</label>
                    <input type="date" value="${isEdit ? '2025-03-31' : ''}" required>
                </div>
                <div class="form-group">
                    <label>免許証期限</label>
                    <input type="date" value="${isEdit ? '2026-05-15' : ''}" required>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" onclick="pageManager.closeModal()">キャンセル</button>
                    <button type="submit" class="btn-primary">${isEdit ? '更新' : '登録'}</button>
                </div>
            </form>
        `;
    }

    getDispatchFormHTML(orderNo) {
        return `
            <form class="detail-form">
                <div class="form-group">
                    <label>受注No.</label>
                    <input type="text" value="${orderNo}" readonly>
                </div>
                <div class="form-group">
                    <label>車両番号</label>
                    <select required>
                        <option value="">選択してください</option>
                        <option value="12-34">12-34</option>
                        <option value="56-78">56-78</option>
                        <option value="90-12">90-12</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>運転手</label>
                    <select required>
                        <option value="">選択してください</option>
                        <option value="山田太郎">山田太郎</option>
                        <option value="佐藤花子">佐藤花子</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>出発予定日時</label>
                    <input type="datetime-local" required>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" onclick="pageManager.closeModal()">キャンセル</button>
                    <button type="submit" class="btn-primary">配車確定</button>
                </div>
            </form>
        `;
    }

    getDispatchScheduleFormHTML() {
        return `
            <form class="detail-form">
                <div class="form-group">
                    <label>運行表作成日</label>
                    <input type="date" required>
                </div>
                <div class="form-group">
                    <label>対象期間</label>
                    <select required>
                        <option value="day">1日</option>
                        <option value="week">1週間</option>
                        <option value="month">1ヶ月</option>
                    </select>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" onclick="pageManager.closeModal()">キャンセル</button>
                    <button type="submit" class="btn-primary">作成</button>
                </div>
            </form>
        `;
    }

    getDispatchPlanFormHTML() {
        return `
            <form class="detail-form">
                <div class="form-group">
                    <label>配車計画日</label>
                    <input type="date" required>
                </div>
                <div class="form-group">
                    <label>対象受注</label>
                    <select multiple size="5" required>
                        <option value="2024-0015">2024-0015 - 株式会社ABC</option>
                        <option value="2024-0014">2024-0014 - XYZ物流</option>
                        <option value="2024-0013">2024-0013 - DEF商事</option>
                    </select>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" onclick="pageManager.closeModal()">キャンセル</button>
                    <button type="submit" class="btn-primary">作成</button>
                </div>
            </form>
        `;
    }

    getAttendanceFormHTML() {
        return `
            <form class="detail-form">
                <div class="form-group">
                    <label>点呼簿作成日</label>
                    <input type="date" required>
                </div>
                <div class="form-group">
                    <label>対象車両</label>
                    <select multiple size="5" required>
                        <option value="12-34">12-34 - 山田太郎</option>
                        <option value="56-78">56-78 - 佐藤花子</option>
                    </select>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" onclick="pageManager.closeModal()">キャンセル</button>
                    <button type="submit" class="btn-primary">作成</button>
                </div>
            </form>
        `;
    }

    getInvoiceFormHTML() {
        return `
            <form class="detail-form">
                <div class="form-group">
                    <label>取引先</label>
                    <select required>
                        <option value="">選択してください</option>
                        <option value="abc">株式会社ABC</option>
                        <option value="xyz">XYZ物流</option>
                        <option value="def">DEF商事</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>請求金額</label>
                    <input type="number" required>
                </div>
                <div class="form-group">
                    <label>請求日</label>
                    <input type="date" required>
                </div>
                <div class="form-group">
                    <label>支払期限</label>
                    <input type="date" required>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" onclick="pageManager.closeModal()">キャンセル</button>
                    <button type="submit" class="btn-primary">発行</button>
                </div>
            </form>
        `;
    }

    getSalaryFormHTML() {
        return `
            <form class="detail-form">
                <div class="form-group">
                    <label>給与計算月</label>
                    <input type="month" required>
                </div>
                <div class="form-group">
                    <label>対象従業員</label>
                    <select multiple size="5" required>
                        <option value="yamada">山田太郎</option>
                        <option value="sato">佐藤花子</option>
                    </select>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" onclick="pageManager.closeModal()">キャンセル</button>
                    <button type="submit" class="btn-primary">計算実行</button>
                </div>
            </form>
        `;
    }

    getETCFormHTML() {
        return `
            <form class="detail-form">
                <div class="form-group">
                    <label>車両番号</label>
                    <select required>
                        <option value="">選択してください</option>
                        <option value="12-34">12-34</option>
                        <option value="56-78">56-78</option>
                        <option value="90-12">90-12</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>ETCカード番号</label>
                    <input type="text" placeholder="新規発行の場合は空欄">
                </div>
                <div class="form-group">
                    <label>発行依頼日</label>
                    <input type="date" required>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" onclick="pageManager.closeModal()">キャンセル</button>
                    <button type="submit" class="btn-primary">登録</button>
                </div>
            </form>
        `;
    }

    getAccidentFormHTML() {
        return `
            <form class="detail-form">
                <div class="form-group">
                    <label>事故発生日時</label>
                    <input type="datetime-local" required>
                </div>
                <div class="form-group">
                    <label>車両番号</label>
                    <select required>
                        <option value="">選択してください</option>
                        <option value="12-34">12-34</option>
                        <option value="56-78">56-78</option>
                        <option value="90-12">90-12</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>運転手</label>
                    <input type="text" required>
                </div>
                <div class="form-group">
                    <label>事故内容</label>
                    <textarea rows="5" required></textarea>
                </div>
                <div class="form-group">
                    <label>損害状況</label>
                    <textarea rows="3"></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" onclick="pageManager.closeModal()">キャンセル</button>
                    <button type="submit" class="btn-primary">登録</button>
                </div>
            </form>
        `;
    }

    getContactFormHTML(vehicleNo) {
        return `
            <form class="detail-form">
                <div class="form-group">
                    <label>車両番号</label>
                    <input type="text" value="${vehicleNo}" readonly>
                </div>
                <div class="form-group">
                    <label>連絡先</label>
                    <input type="text" value="運転手の連絡先" readonly>
                </div>
                <div class="form-group">
                    <label>連絡方法</label>
                    <select required>
                        <option value="">選択してください</option>
                        <option value="phone">電話</option>
                        <option value="message">メッセージ</option>
                        <option value="email">メール</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>連絡内容</label>
                    <textarea rows="5" placeholder="連絡内容を入力してください" required></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" onclick="pageManager.closeModal()">キャンセル</button>
                    <button type="submit" class="btn-primary">送信</button>
                </div>
            </form>
        `;
    }

    getDailyReportFormHTML() {
        return `
            <form class="detail-form">
                <div class="form-group">
                    <label>日計表作成日</label>
                    <input type="date" required>
                </div>
                <div class="form-group">
                    <label>対象取引先</label>
                    <select multiple size="5">
                        <option value="all">すべて</option>
                        <option value="abc">株式会社ABC</option>
                        <option value="xyz">XYZ物流</option>
                        <option value="def">DEF商事</option>
                    </select>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" onclick="pageManager.closeModal()">キャンセル</button>
                    <button type="submit" class="btn-primary">作成</button>
                </div>
            </form>
        `;
    }

    getVehicleRevenueFormHTML() {
        return `
            <form class="detail-form">
                <div class="form-group">
                    <label>対象期間（開始）</label>
                    <input type="date" required>
                </div>
                <div class="form-group">
                    <label>対象期間（終了）</label>
                    <input type="date" required>
                </div>
                <div class="form-group">
                    <label>対象車両</label>
                    <select multiple size="5">
                        <option value="all">すべて</option>
                        <option value="12-34">12-34</option>
                        <option value="56-78">56-78</option>
                        <option value="90-12">90-12</option>
                    </select>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" onclick="pageManager.closeModal()">キャンセル</button>
                    <button type="submit" class="btn-primary">作成</button>
                </div>
            </form>
        `;
    }

    // 受注予測関連メソッド
    refreshForecast() {
        if (window.forecastManager) {
            window.forecastManager.refreshForecast();
        }
    }

    updateForecast() {
        if (window.forecastManager) {
            window.forecastManager.updateForecast();
        }
    }

    // 配車最適化関連メソッド
    runOptimization() {
        if (window.optimizationManager) {
            window.optimizationManager.runOptimization();
        }
    }

    applyOptimization(proposalId) {
        if (window.optimizationManager) {
            window.optimizationManager.applyOptimization(proposalId);
        }
    }

    // 週単位配車予定関連メソッド
    prevWeek() {
        if (window.weeklyScheduleManager) {
            window.weeklyScheduleManager.prevWeek();
        }
    }

    nextWeek() {
        if (window.weeklyScheduleManager) {
            window.weeklyScheduleManager.nextWeek();
        }
    }

    loadWeekSchedule() {
        if (window.weeklyScheduleManager) {
            window.weeklyScheduleManager.loadWeekSchedule();
        }
    }

    createWeeklySchedule() {
        if (window.weeklyScheduleManager) {
            window.weeklyScheduleManager.createWeeklySchedule();
        }
    }

    addToSchedule(orderNo) {
        if (window.weeklyScheduleManager) {
            window.weeklyScheduleManager.addToSchedule(orderNo);
        }
    }

    toggleView() {
        if (window.weeklyScheduleManager) {
            window.weeklyScheduleManager.toggleView();
        }
    }
}

// グローバルにエクスポート
window.PageManager = PageManager;

