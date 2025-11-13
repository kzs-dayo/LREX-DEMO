// 週単位配車予定機能（Googleカレンダー形式）
class WeeklyScheduleManager {
    constructor() {
        // 2025年11月9日の週を初期表示
        this.currentWeek = new Date(2025, 10, 9); // 月は0ベースなので10が11月
        this.scheduleData = {};
        this.viewMode = 'week'; // 'week' or 'day'
        this.draggedItem = null;
        this.hoursPerDay = 24;
        this.hourHeight = 60; // 1時間あたりのピクセル数
        this.maxDriverHours = 10; // ドライバーの最大連続稼働時間（時間）
        
        // デモ用のデータ（週全体のサンプルデータ）
        // 2025年11月3日（月）～11月9日（日）の週
        this.scheduleData = {
            '2025-11-03': [
                {
                    id: 'sch-001',
                    orderNo: '2024-0015',
                    vehicle: '12-34',
                    driver: '山田太郎',
                    route: '東京 → 大阪',
                    startTime: '08:00',
                    endTime: '16:00',
                    duration: 8,
                    cargo: { weight: 4500, size: 'large', type: '艦船' },
                    truckSize: '大型トラック',
                    status: 'scheduled'
                },
                {
                    id: 'sch-004',
                    orderNo: '2024-0024',
                    vehicle: '90-12',
                    driver: '鈴木一郎',
                    route: '横浜 → 名古屋',
                    startTime: '14:00',
                    endTime: '20:00',
                    duration: 6,
                    cargo: { weight: 2800, size: 'medium', type: '艦船' },
                    truckSize: '大型トラック',
                    status: 'scheduled'
                }
            ],
            '2025-11-04': [
                {
                    id: 'sch-002',
                    orderNo: '2024-0014',
                    vehicle: '56-78',
                    driver: '佐藤花子',
                    route: '名古屋 → 福岡',
                    startTime: '09:00',
                    endTime: '17:00',
                    duration: 8,
                    cargo: { weight: 3200, size: 'medium', type: '艦船' },
                    truckSize: '中型トラック',
                    status: 'scheduled'
                },
                {
                    id: 'sch-005',
                    orderNo: '2024-0025',
                    vehicle: '12-34',
                    driver: '山田太郎',
                    route: '大阪 → 京都',
                    startTime: '18:00',
                    endTime: '22:00',
                    duration: 4,
                    cargo: { weight: 2000, size: 'medium', type: '艦船' },
                    truckSize: '大型トラック',
                    status: 'scheduled'
                }
            ],
            '2025-11-05': [
                {
                    id: 'sch-006',
                    orderNo: '2024-0026',
                    vehicle: '56-78',
                    driver: '佐藤花子',
                    route: '東京 → 横浜',
                    startTime: '07:00',
                    endTime: '09:00',
                    duration: 2,
                    cargo: { weight: 1500, size: 'small', type: '艦船' },
                    truckSize: '中型トラック',
                    status: 'scheduled'
                },
                {
                    id: 'sch-007',
                    orderNo: '2024-0027',
                    vehicle: '90-12',
                    driver: '鈴木一郎',
                    route: '名古屋 → 大阪',
                    startTime: '10:00',
                    endTime: '16:00',
                    duration: 6,
                    cargo: { weight: 3500, size: 'large', type: '艦船' },
                    truckSize: '大型トラック',
                    status: 'scheduled'
                },
                {
                    id: 'sch-008',
                    orderNo: '2024-0028',
                    vehicle: '12-34',
                    driver: '山田太郎',
                    route: '京都 → 東京',
                    startTime: '17:00',
                    endTime: '23:00',
                    duration: 6,
                    cargo: { weight: 4000, size: 'large', type: '艦船' },
                    truckSize: '大型トラック',
                    status: 'scheduled'
                }
            ],
            '2025-11-06': [
                {
                    id: 'sch-009',
                    orderNo: '2024-0029',
                    vehicle: '56-78',
                    driver: '佐藤花子',
                    route: '福岡 → 名古屋',
                    startTime: '08:00',
                    endTime: '16:00',
                    duration: 8,
                    cargo: { weight: 4200, size: 'large', type: '艦船' },
                    truckSize: '中型トラック',
                    status: 'scheduled'
                },
                {
                    id: 'sch-010',
                    orderNo: '2024-0030',
                    vehicle: '90-12',
                    driver: '鈴木一郎',
                    route: '横浜 → 大阪',
                    startTime: '12:00',
                    endTime: '18:00',
                    duration: 6,
                    cargo: { weight: 3000, size: 'medium', type: '艦船' },
                    truckSize: '大型トラック',
                    status: 'scheduled'
                }
            ],
            '2025-11-07': [
                {
                    id: 'sch-003',
                    orderNo: '2024-0020',
                    vehicle: '12-34',
                    driver: '山田太郎',
                    route: '大阪 → 東京',
                    startTime: '10:00',
                    endTime: '18:00',
                    duration: 8,
                    cargo: { weight: 3800, size: 'large', type: '艦船' },
                    truckSize: '大型トラック',
                    status: 'scheduled'
                },
                {
                    id: 'sch-011',
                    orderNo: '2024-0031',
                    vehicle: '56-78',
                    driver: '佐藤花子',
                    route: '名古屋 → 横浜',
                    startTime: '06:00',
                    endTime: '12:00',
                    duration: 6,
                    cargo: { weight: 2500, size: 'medium', type: '艦船' },
                    truckSize: '中型トラック',
                    status: 'scheduled'
                }
            ],
            '2025-11-08': [
                {
                    id: 'sch-012',
                    orderNo: '2024-0032',
                    vehicle: '12-34',
                    driver: '山田太郎',
                    route: '東京 → 福岡',
                    startTime: '07:00',
                    endTime: '17:00',
                    duration: 10,
                    cargo: { weight: 5000, size: 'large', type: '艦船' },
                    truckSize: '大型トラック',
                    status: 'scheduled'
                }
            ],
            '2025-11-09': [
                {
                    id: 'sch-013',
                    orderNo: '2024-0033',
                    vehicle: '56-78',
                    driver: '佐藤花子',
                    route: '大阪 → 名古屋',
                    startTime: '09:00',
                    endTime: '15:00',
                    duration: 6,
                    cargo: { weight: 3300, size: 'medium', type: '艦船' },
                    truckSize: '中型トラック',
                    status: 'scheduled'
                },
                {
                    id: 'sch-014',
                    orderNo: '2024-0034',
                    vehicle: '90-12',
                    driver: '鈴木一郎',
                    route: '横浜 → 京都',
                    startTime: '16:00',
                    endTime: '22:00',
                    duration: 6,
                    cargo: { weight: 2900, size: 'medium', type: '艦船' },
                    truckSize: '大型トラック',
                    status: 'scheduled'
                }
            ]
        };
    }

    init() {
        this.setupEventListeners();
        this.loadCurrentWeek();
        this.renderDriverStatus();
    }

    setupEventListeners() {
        // 週セレクター
        const weekSelector = document.getElementById('week-selector');
        if (weekSelector) {
            weekSelector.addEventListener('change', () => {
                this.loadWeekFromSelector();
            });
        }

        // フィルター
        const driverFilter = document.getElementById('driver-filter');
        const vehicleFilter = document.getElementById('vehicle-filter');
        if (driverFilter) {
            driverFilter.addEventListener('change', () => this.filterSchedule());
        }
        if (vehicleFilter) {
            vehicleFilter.addEventListener('change', () => this.filterSchedule());
        }
    }

    getWeekRange(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 月曜日に調整
        const monday = new Date(d.setDate(diff));
        const sunday = new Date(monday);
        sunday.setDate(sunday.getDate() + 6);
        
        return { monday, sunday };
    }

    formatDate(date) {
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    }

    formatDateKey(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    loadCurrentWeek() {
        const { monday, sunday } = this.getWeekRange(this.currentWeek);
        this.updateWeekDisplay(monday, sunday);
        this.renderCalendar(monday);
        this.renderDriverStatus();
    }

    loadWeekFromSelector() {
        const weekSelector = document.getElementById('week-selector');
        if (!weekSelector) return;

        const weekValue = weekSelector.value; // "2024-W51" 形式
        const [year, week] = weekValue.split('-W');
        
        // 週の開始日を計算
        const jan1 = new Date(year, 0, 1);
        const daysToMonday = (8 - jan1.getDay()) % 7;
        const firstMonday = new Date(jan1);
        firstMonday.setDate(jan1.getDate() + daysToMonday);
        
        const weekStart = new Date(firstMonday);
        weekStart.setDate(firstMonday.getDate() + (parseInt(week) - 1) * 7);
        
        this.currentWeek = weekStart;
        this.loadCurrentWeek();
    }

    updateWeekDisplay(monday, sunday) {
        const weekTitle = document.getElementById('week-title');
        if (weekTitle) {
            weekTitle.textContent = `${this.formatDate(monday)} - ${this.formatDate(sunday)}`;
        }

        // 週セレクターを更新
        const weekSelector = document.getElementById('week-selector');
        if (weekSelector) {
            const year = monday.getFullYear();
            const weekNumber = this.getWeekNumber(monday);
            weekSelector.value = `${year}-W${weekNumber.toString().padStart(2, '0')}`;
        }
    }

    getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    renderCalendar(monday) {
        this.renderTimeSlots();
        this.renderDaysHeader(monday);
        this.renderDaysBody(monday);
    }

    renderTimeSlots() {
        const timeSlots = document.getElementById('time-slots');
        if (!timeSlots) return;

        timeSlots.innerHTML = '';
        for (let hour = 0; hour < this.hoursPerDay; hour++) {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.style.height = `${this.hourHeight}px`;
            timeSlot.textContent = `${String(hour).padStart(2, '0')}:00`;
            timeSlots.appendChild(timeSlot);
        }
    }

    renderDaysHeader(monday) {
        const header = document.getElementById('calendar-days-header');
        if (!header) return;

        header.innerHTML = '';
        const dayNames = ['月', '火', '水', '木', '金', '土', '日'];
        
        for (let i = 0; i < 7; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.innerHTML = `
                <div class="day-name">${dayNames[i]}</div>
                <div class="day-number">${day.getDate()}</div>
            `;
            header.appendChild(dayHeader);
        }
    }

    renderDaysBody(monday) {
        const body = document.getElementById('calendar-days-body');
        if (!body) return;

        body.innerHTML = '';
        const totalHeight = this.hoursPerDay * this.hourHeight;

        for (let i = 0; i < 7; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);
            const dayKey = this.formatDateKey(day);
            
            const dayColumn = document.createElement('div');
            dayColumn.className = 'calendar-day-column';
            dayColumn.dataset.date = dayKey;
            dayColumn.style.height = `${totalHeight}px`;

            // 時間スロットを描画
            for (let hour = 0; hour < this.hoursPerDay; hour++) {
                const hourSlot = document.createElement('div');
                hourSlot.className = 'hour-slot';
                hourSlot.style.height = `${this.hourHeight}px`;
                hourSlot.dataset.hour = hour;
                dayColumn.appendChild(hourSlot);
            }

            // その日のスケジュールを描画
            const schedules = this.scheduleData[dayKey] || [];
            schedules.forEach(schedule => {
                const scheduleItem = this.createScheduleItem(schedule, dayKey);
                dayColumn.appendChild(scheduleItem);
            });

            body.appendChild(dayColumn);
        }

        this.setupDragAndDrop();
    }

    createScheduleItem(schedule, dateKey) {
        const item = document.createElement('div');
        item.className = 'calendar-schedule-item';
        item.draggable = true;
        item.dataset.scheduleId = schedule.id;
        item.dataset.date = dateKey;
        
        const [startHour, startMin] = schedule.startTime.split(':').map(Number);
        const [endHour, endMin] = schedule.endTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        const durationMinutes = endMinutes - startMinutes;
        
        const top = (startMinutes / 60) * this.hourHeight;
        const height = (durationMinutes / 60) * this.hourHeight;

        item.style.top = `${top}px`;
        item.style.height = `${height}px`;
        item.style.minHeight = '40px';

        // ドライバーの稼働時間チェック
        const driverHours = this.getDriverWorkingHours(schedule.driver, dateKey);
        if (driverHours + schedule.duration > this.maxDriverHours) {
            item.classList.add('warning');
        }

        item.innerHTML = `
            <div class="schedule-item-header">
                <span class="vehicle-badge">${schedule.vehicle}</span>
                <span class="order-badge">${schedule.orderNo}</span>
            </div>
            <div class="schedule-item-body">
                <div class="route-text">${schedule.route}</div>
                <div class="time-text">${schedule.startTime} - ${schedule.endTime}</div>
                <div class="driver-text">運転手: ${schedule.driver}</div>
            </div>
            <div class="schedule-item-footer">
                <span class="cargo-info">${schedule.cargo.weight}kg / ${schedule.cargo.size === 'large' ? '大型' : schedule.cargo.size === 'medium' ? '中型' : '小型'}</span>
                <span class="truck-size">${schedule.truckSize}</span>
            </div>
        `;

        // クリックで詳細表示
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showScheduleDetail(schedule);
        });

        return item;
    }

    setupDragAndDrop() {
        const scheduleItems = document.querySelectorAll('.calendar-schedule-item');
        const dayColumns = document.querySelectorAll('.calendar-day-column');

        scheduleItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                this.draggedItem = {
                    id: item.dataset.scheduleId,
                    date: item.dataset.date,
                    element: item
                };
                item.style.opacity = '0.5';
            });

            item.addEventListener('dragend', () => {
                if (this.draggedItem) {
                    this.draggedItem.element.style.opacity = '1';
                }
                this.draggedItem = null;
            });
        });

        dayColumns.forEach(column => {
            column.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (this.draggedItem) {
                    const rect = column.getBoundingClientRect();
                    const y = e.clientY - rect.top;
                    const hour = Math.floor(y / this.hourHeight);
                    const minutes = Math.floor((y % this.hourHeight) / this.hourHeight * 60);
                    
                    // ドロップ位置の視覚的フィードバック
                    column.style.backgroundColor = 'rgba(204, 20, 20, 0.1)';
                }
            });

            column.addEventListener('dragleave', () => {
                column.style.backgroundColor = '';
            });

            column.addEventListener('drop', (e) => {
                e.preventDefault();
                column.style.backgroundColor = '';
                
                if (this.draggedItem) {
                    const rect = column.getBoundingClientRect();
                    const y = e.clientY - rect.top;
                    const hour = Math.max(0, Math.min(23, Math.floor(y / this.hourHeight)));
                    const minutes = Math.floor((y % this.hourHeight) / this.hourHeight * 60);
                    
                    const newDate = column.dataset.date;
                    this.moveSchedule(this.draggedItem.id, this.draggedItem.date, newDate, hour, minutes);
                }
            });
        });
    }

    moveSchedule(scheduleId, oldDate, newDate, hour, minutes) {
        const schedule = this.scheduleData[oldDate]?.find(s => s.id === scheduleId);
        if (!schedule) return;

        // ドライバーの稼働時間チェック
        const driverHours = this.getDriverWorkingHours(schedule.driver, newDate);
        if (driverHours + schedule.duration > this.maxDriverHours) {
            if (!confirm(`警告: ${schedule.driver}の連続稼働時間が${this.maxDriverHours}時間を超えます。続行しますか？`)) {
                return;
            }
        }

        // スケジュールを移動
        this.scheduleData[oldDate] = this.scheduleData[oldDate].filter(s => s.id !== scheduleId);
        if (!this.scheduleData[newDate]) {
            this.scheduleData[newDate] = [];
        }

        const newStartTime = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        const endMinutes = hour * 60 + minutes + schedule.duration * 60;
        const endHour = Math.floor(endMinutes / 60) % 24;
        const endMin = endMinutes % 60;
        const newEndTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

        schedule.startTime = newStartTime;
        schedule.endTime = newEndTime;

        this.scheduleData[newDate].push(schedule);
        this.loadCurrentWeek();
    }

    getDriverWorkingHours(driver, dateKey) {
        const schedules = this.scheduleData[dateKey] || [];
        const driverSchedules = schedules.filter(s => s.driver === driver);
        
        if (driverSchedules.length === 0) return 0;
        
        // 連続稼働時間を計算（簡易版：その日の合計時間）
        return driverSchedules.reduce((total, s) => total + s.duration, 0);
    }

    showScheduleDetail(schedule) {
        if (window.pageManager) {
            const detailHTML = `
                <div class="detail-section">
                    <h3>配車情報</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>受注No.</label>
                            <p>${schedule.orderNo}</p>
                        </div>
                        <div class="detail-item">
                            <label>車両番号</label>
                            <p>${schedule.vehicle}</p>
                        </div>
                        <div class="detail-item">
                            <label>運転手</label>
                            <p>${schedule.driver}</p>
                        </div>
                        <div class="detail-item">
                            <label>ルート</label>
                            <p>${schedule.route}</p>
                        </div>
                    </div>
                </div>
                <div class="detail-section">
                    <h3>時間情報</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>出発時刻</label>
                            <p>${schedule.startTime}</p>
                        </div>
                        <div class="detail-item">
                            <label>到着時刻</label>
                            <p>${schedule.endTime}</p>
                        </div>
                        <div class="detail-item">
                            <label>所要時間</label>
                            <p>${schedule.duration}時間</p>
                        </div>
                    </div>
                </div>
                <div class="detail-section">
                    <h3>積荷情報</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>重量</label>
                            <p>${schedule.cargo.weight}kg</p>
                        </div>
                        <div class="detail-item">
                            <label>サイズ</label>
                            <p>${schedule.cargo.size === 'large' ? '大型' : schedule.cargo.size === 'medium' ? '中型' : '小型'}</p>
                        </div>
                        <div class="detail-item">
                            <label>種類</label>
                            <p>${schedule.cargo.type}</p>
                        </div>
                        <div class="detail-item">
                            <label>必要車両</label>
                            <p>${schedule.truckSize}</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="pageManager.closeModal()">閉じる</button>
                    <button class="btn-primary" onclick="weeklyScheduleManager.editSchedule('${schedule.id}'); pageManager.closeModal();">編集</button>
                </div>
            `;
            window.pageManager.showModal(window.pageManager.createModal('配車詳細', detailHTML));
        }
    }

    renderDriverStatus() {
        const grid = document.getElementById('driver-status-grid');
        if (!grid) return;

        const drivers = ['山田太郎', '佐藤花子', '鈴木一郎'];
        const { monday } = this.getWeekRange(this.currentWeek);

        grid.innerHTML = '';
        drivers.forEach(driver => {
            const driverCard = document.createElement('div');
            driverCard.className = 'driver-status-card';

            let totalHours = 0;
            let statusItems = [];

            for (let i = 0; i < 7; i++) {
                const day = new Date(monday);
                day.setDate(monday.getDate() + i);
                const dayKey = this.formatDateKey(day);
                const schedules = this.scheduleData[dayKey] || [];
                const driverSchedules = schedules.filter(s => s.driver === driver);
                const dayHours = driverSchedules.reduce((sum, s) => sum + s.duration, 0);
                totalHours += dayHours;

                if (dayHours > 0) {
                    statusItems.push({
                        date: day,
                        hours: dayHours,
                        schedules: driverSchedules
                    });
                }
            }

            const statusClass = totalHours > this.maxDriverHours * 7 ? 'warning' : totalHours > this.maxDriverHours * 5 ? 'info' : 'success';

            driverCard.innerHTML = `
                <div class="driver-status-header">
                    <h4>${driver}</h4>
                    <span class="badge ${statusClass}">週合計: ${totalHours}時間</span>
                </div>
                <div class="driver-status-body">
                    ${statusItems.map(item => `
                        <div class="driver-day-status">
                            <span class="day-label">${item.date.getDate()}日</span>
                            <span class="hours-label">${item.hours}時間</span>
                            ${item.hours > this.maxDriverHours ? '<span class="warning-badge">超過</span>' : ''}
                        </div>
                    `).join('')}
                </div>
            `;

            grid.appendChild(driverCard);
        });
    }

    filterSchedule() {
        // フィルター機能（簡易実装）
        this.loadCurrentWeek();
    }

    prevWeek() {
        this.currentWeek.setDate(this.currentWeek.getDate() - 7);
        this.loadCurrentWeek();
    }

    nextWeek() {
        this.currentWeek.setDate(this.currentWeek.getDate() + 7);
        this.loadCurrentWeek();
    }

    loadWeekSchedule() {
        this.loadWeekFromSelector();
    }

    createWeeklySchedule() {
        console.log('配車計画を保存中...', this.scheduleData);
        alert('配車計画を保存しました（デモ）');
    }

    addToSchedule(orderNo) {
        const row = document.querySelector(`tr[data-order="${orderNo}"]`);
        if (!row) return;

        const orderData = {
            orderNo: orderNo,
            route: row.dataset.route,
            weight: parseInt(row.dataset.weight),
            size: row.dataset.size,
            duration: parseInt(row.dataset.duration)
        };

        // モーダルで配車情報を入力
        if (window.pageManager) {
            const formHTML = this.getAddScheduleFormHTML(orderData);
            const modal = window.pageManager.createModal('配車追加', formHTML);
            window.pageManager.showModal(modal);
        }
    }

    getAddScheduleFormHTML(orderData) {
        return `
            <form class="detail-form" onsubmit="weeklyScheduleManager.submitSchedule(event, '${orderData.orderNo}'); return false;">
                <div class="form-group">
                    <label>受注No.</label>
                    <input type="text" value="${orderData.orderNo}" readonly>
                </div>
                <div class="form-group">
                    <label>車両番号</label>
                    <select name="vehicle" required>
                        <option value="">選択してください</option>
                        <option value="12-34">12-34 (大型トラック)</option>
                        <option value="56-78">56-78 (中型トラック)</option>
                        <option value="90-12">90-12 (大型トラック)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>運転手</label>
                    <select name="driver" required>
                        <option value="">選択してください</option>
                        <option value="山田太郎">山田太郎</option>
                        <option value="佐藤花子">佐藤花子</option>
                        <option value="鈴木一郎">鈴木一郎</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>配車日</label>
                    <input type="date" name="date" required>
                </div>
                <div class="form-group">
                    <label>出発時刻</label>
                    <input type="time" name="startTime" required>
                </div>
                <div class="form-group">
                    <label>積荷情報</label>
                    <input type="text" value="重量: ${orderData.weight}kg, サイズ: ${orderData.size}" readonly>
                </div>
                <div class="form-group">
                    <label>配送時間</label>
                    <input type="text" value="約${orderData.duration}時間" readonly>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" onclick="pageManager.closeModal()">キャンセル</button>
                    <button type="submit" class="btn-primary">追加</button>
                </div>
            </form>
        `;
    }

    submitSchedule(event, orderNo) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        
        const date = formData.get('date');
        const [year, month, day] = date.split('-');
        const dateKey = `${year}-${month}-${day}`;
        
        const startTime = formData.get('startTime');
        const [startHour, startMin] = startTime.split(':').map(Number);
        const duration = parseInt(document.querySelector(`tr[data-order="${orderNo}"]`).dataset.duration);
        const endHour = (startHour + duration) % 24;
        const endTime = `${String(endHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`;

        const schedule = {
            id: `sch-${Date.now()}`,
            orderNo: orderNo,
            vehicle: formData.get('vehicle'),
            driver: formData.get('driver'),
            route: document.querySelector(`tr[data-order="${orderNo}"]`).dataset.route.replace('→', '→'),
            startTime: startTime,
            endTime: endTime,
            duration: duration,
            cargo: {
                weight: parseInt(document.querySelector(`tr[data-order="${orderNo}"]`).dataset.weight),
                size: document.querySelector(`tr[data-order="${orderNo}"]`).dataset.size,
                type: '艦船'
            },
            truckSize: formData.get('vehicle').includes('12-34') || formData.get('vehicle').includes('90-12') ? '大型トラック' : '中型トラック',
            status: 'scheduled'
        };

        if (!this.scheduleData[dateKey]) {
            this.scheduleData[dateKey] = [];
        }
        this.scheduleData[dateKey].push(schedule);

        window.pageManager.closeModal();
        this.loadCurrentWeek();
        this.renderDriverStatus();
    }

    toggleView() {
        this.viewMode = this.viewMode === 'week' ? 'day' : 'week';
        const toggleBtn = document.getElementById('view-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = this.viewMode === 'week' ? '日表示' : '週表示';
        }
        // 日表示の実装は省略（必要に応じて追加）
        this.loadCurrentWeek();
    }

    editSchedule(scheduleId) {
        // 編集機能（簡易実装）
        console.log('編集:', scheduleId);
    }
}

// グローバルにエクスポート
window.WeeklyScheduleManager = WeeklyScheduleManager;
