// 運送依頼書管理
class RequestFormManager {
    constructor() {
        this.init();
    }

    init() {
        // 依頼日のデフォルト値を今日に設定
        const today = new Date().toISOString().split('T')[0];
        const requestDateInput = document.getElementById('requestDate');
        if (requestDateInput && !requestDateInput.value) {
            requestDateInput.value = today;
        }
    }

    // フォームをクリア
    clearForm() {
        if (confirm('フォームの内容をクリアしますか？')) {
            document.getElementById('request-form-form').reset();
            this.init(); // 依頼日を再設定
        }
    }

    // フォームデータを取得
    getFormData() {
        return {
            requestDate: document.getElementById('requestDate').value,
            requestNumber: document.getElementById('requestNumber').value,
            requester: document.getElementById('requester').value,
            dispatcher: document.getElementById('dispatcher').value,
            loadingName: document.getElementById('loadingName').value,
            loadingAddress: document.getElementById('loadingAddress').value,
            loadingContact: document.getElementById('loadingContact').value,
            loadingDateTime: document.getElementById('loadingDateTime').value,
            loadingConditions: document.getElementById('loadingConditions').value,
            unloadingName: document.getElementById('unloadingName').value,
            unloadingAddress: document.getElementById('unloadingAddress').value,
            unloadingContact: document.getElementById('unloadingContact').value,
            unloadingDateTime: document.getElementById('unloadingDateTime').value,
            unloadingConditions: document.getElementById('unloadingConditions').value,
            cargoContent: document.getElementById('cargoContent').value,
            cargoQuantity: document.getElementById('cargoQuantity').value,
            cargoWeight: document.getElementById('cargoWeight').value,
            loadingMethod: document.getElementById('loadingMethod').value,
            cargoShape: document.getElementById('cargoShape').value,
            cargoNotes: document.getElementById('cargoNotes').value,
            fare: document.getElementById('fare').value,
            paymentCondition: document.getElementById('paymentCondition').value,
            billingInfo: document.getElementById('billingInfo').value,
            notes: document.getElementById('notes').value,
            requesterSeal: document.getElementById('requesterSeal').value,
            companySeal: document.getElementById('companySeal').value
        };
    }

    // 日時フォーマット
    formatDateTime(dateTimeString) {
        if (!dateTimeString) return '';
        const date = new Date(dateTimeString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}年${month}月${day}日 ${hours}:${minutes}`;
    }

    // 日付フォーマット
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}年${month}月${day}日`;
    }

    // PDF生成
    generatePDF(data) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        let yPos = 20;
        const margin = 20;
        const pageWidth = 210;
        const lineHeight = 7;
        const sectionSpacing = 5;

        // 日本語テキストを安全に処理する関数
        const safeText = (text) => {
            if (!text) return '';
            return String(text);
        };

        // 日本語フォントの設定
        // jsPDFはデフォルトで日本語フォントをサポートしていないため、
        // 日本語フォントが追加されていない場合はデフォルトフォントを使用
        // 注意: 完全な日本語サポートには、日本語フォントファイル（TTF）を
        // Base64エンコードして追加する必要があります
        try {
            doc.setFont('helvetica');
        } catch (e) {
            console.warn('フォント設定エラー:', e);
        }
        
        // 日本語文字を正しく表示するための設定
        // PDFの文字エンコーディングを設定
        // 注意: jsPDFは日本語を直接サポートしていないため、
        // 実際の実装では日本語フォントファイルを追加する必要があります

        // タイトル
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text(safeText('運送依頼書'), pageWidth / 2, yPos, { align: 'center' });
        yPos += 10;

        // 基本情報
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(safeText('基本情報'), margin, yPos);
        yPos += lineHeight;
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);

        if (data.requestDate) {
            doc.text(safeText(`依頼日: ${this.formatDate(data.requestDate)}`), margin, yPos);
            yPos += lineHeight;
        }
        if (data.requestNumber) {
            doc.text(safeText(`依頼番号: ${data.requestNumber}`), margin, yPos);
            yPos += lineHeight;
        }
        if (data.requester) {
            const requesterText = safeText(`依頼者: ${data.requester}`);
            const requesterLines = doc.splitTextToSize(requesterText, pageWidth - margin * 2);
            doc.text(requesterLines, margin, yPos);
            yPos += lineHeight * requesterLines.length;
        }
        if (data.dispatcher) {
            doc.text(safeText(`配車担当者: ${data.dispatcher}`), margin, yPos);
            yPos += lineHeight;
        }
        yPos += sectionSpacing;

        // 積地情報
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(safeText('積地（積込先）情報'), margin, yPos);
        yPos += lineHeight;
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);

        if (data.loadingName) {
            doc.text(safeText(`積地名: ${data.loadingName}`), margin, yPos);
            yPos += lineHeight;
        }
        if (data.loadingAddress) {
            const addressText = safeText(`積地住所: ${data.loadingAddress}`);
            const addressLines = doc.splitTextToSize(addressText, pageWidth - margin * 2);
            doc.text(addressLines, margin, yPos);
            yPos += lineHeight * addressLines.length;
        }
        if (data.loadingContact) {
            const contactText = safeText(`担当者・連絡先: ${data.loadingContact}`);
            const contactLines = doc.splitTextToSize(contactText, pageWidth - margin * 2);
            doc.text(contactLines, margin, yPos);
            yPos += lineHeight * contactLines.length;
        }
        if (data.loadingDateTime) {
            doc.text(safeText(`積込日時: ${this.formatDateTime(data.loadingDateTime)}`), margin, yPos);
            yPos += lineHeight;
        }
        if (data.loadingConditions) {
            const conditionText = safeText(`積込条件: ${data.loadingConditions}`);
            const conditionLines = doc.splitTextToSize(conditionText, pageWidth - margin * 2);
            doc.text(conditionLines, margin, yPos);
            yPos += lineHeight * conditionLines.length;
        }
        yPos += sectionSpacing;

        // 降地情報
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(safeText('降地（荷卸先）情報'), margin, yPos);
        yPos += lineHeight;
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);

        if (data.unloadingName) {
            doc.text(safeText(`降地名: ${data.unloadingName}`), margin, yPos);
            yPos += lineHeight;
        }
        if (data.unloadingAddress) {
            const addressText = safeText(`降地住所: ${data.unloadingAddress}`);
            const addressLines = doc.splitTextToSize(addressText, pageWidth - margin * 2);
            doc.text(addressLines, margin, yPos);
            yPos += lineHeight * addressLines.length;
        }
        if (data.unloadingContact) {
            const contactText = safeText(`担当者・連絡先: ${data.unloadingContact}`);
            const contactLines = doc.splitTextToSize(contactText, pageWidth - margin * 2);
            doc.text(contactLines, margin, yPos);
            yPos += lineHeight * contactLines.length;
        }
        if (data.unloadingDateTime) {
            doc.text(safeText(`降ろし日時: ${this.formatDateTime(data.unloadingDateTime)}`), margin, yPos);
            yPos += lineHeight;
        }
        if (data.unloadingConditions) {
            const conditionText = safeText(`降ろし条件: ${data.unloadingConditions}`);
            const conditionLines = doc.splitTextToSize(conditionText, pageWidth - margin * 2);
            doc.text(conditionLines, margin, yPos);
            yPos += lineHeight * conditionLines.length;
        }
        yPos += sectionSpacing;

        // 荷物情報
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(safeText('荷物情報'), margin, yPos);
        yPos += lineHeight;
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);

        if (data.cargoContent) {
            const contentText = safeText(`荷物の内容: ${data.cargoContent}`);
            const contentLines = doc.splitTextToSize(contentText, pageWidth - margin * 2);
            doc.text(contentLines, margin, yPos);
            yPos += lineHeight * contentLines.length;
        }
        if (data.cargoQuantity) {
            doc.text(safeText(`数量: ${data.cargoQuantity}`), margin, yPos);
            yPos += lineHeight;
        }
        if (data.cargoWeight) {
            doc.text(safeText(`重量・容積: ${data.cargoWeight}`), margin, yPos);
            yPos += lineHeight;
        }
        if (data.loadingMethod) {
            doc.text(safeText(`積載方法: ${data.loadingMethod}`), margin, yPos);
            yPos += lineHeight;
        }
        if (data.cargoShape) {
            doc.text(safeText(`荷姿: ${data.cargoShape}`), margin, yPos);
            yPos += lineHeight;
        }
        if (data.cargoNotes) {
            const notesText = safeText(`特記事項: ${data.cargoNotes}`);
            const notesLines = doc.splitTextToSize(notesText, pageWidth - margin * 2);
            doc.text(notesLines, margin, yPos);
            yPos += lineHeight * notesLines.length;
        }
        yPos += sectionSpacing;

        // 請求・運賃情報
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(safeText('請求・運賃情報'), margin, yPos);
        yPos += lineHeight;
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);

        if (data.fare) {
            const fareText = safeText(`運賃: ${data.fare}`);
            const fareLines = doc.splitTextToSize(fareText, pageWidth - margin * 2);
            doc.text(fareLines, margin, yPos);
            yPos += lineHeight * fareLines.length;
        }
        if (data.paymentCondition) {
            doc.text(safeText(`支払条件: ${data.paymentCondition}`), margin, yPos);
            yPos += lineHeight;
        }
        if (data.billingInfo) {
            const billingText = safeText(`請求先情報: ${data.billingInfo}`);
            const billingLines = doc.splitTextToSize(billingText, pageWidth - margin * 2);
            doc.text(billingLines, margin, yPos);
            yPos += lineHeight * billingLines.length;
        }
        yPos += sectionSpacing;

        // その他
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(safeText('その他'), margin, yPos);
        yPos += lineHeight;
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);

        if (data.notes) {
            const notesText = safeText(`備考: ${data.notes}`);
            const notesLines = doc.splitTextToSize(notesText, pageWidth - margin * 2);
            doc.text(notesLines, margin, yPos);
            yPos += lineHeight * notesLines.length;
        }
        if (data.requesterSeal) {
            doc.text(safeText(`依頼者印: ${data.requesterSeal}`), margin, yPos);
            yPos += lineHeight;
        }
        if (data.companySeal) {
            doc.text(safeText(`受託会社印: ${data.companySeal}`), margin, yPos);
            yPos += lineHeight;
        }

        return doc;
    }

    // PDF出力
    exportPDF() {
        const form = document.getElementById('request-form-form');
        if (!form.checkValidity()) {
            alert('必須項目を入力してください。');
            form.reportValidity();
            return;
        }

        const data = this.getFormData();
        const doc = this.generatePDF(data);

        // ファイル名を生成
        const fileName = data.requestNumber 
            ? `運送依頼書_${data.requestNumber}.pdf`
            : `運送依頼書_${new Date().toISOString().split('T')[0]}.pdf`;

        doc.save(fileName);
    }

    // PDFプレビュー
    previewPDF() {
        const form = document.getElementById('request-form-form');
        if (!form.checkValidity()) {
            alert('必須項目を入力してください。');
            form.reportValidity();
            return;
        }

        // 日本語フォントの問題を回避するため、HTMLを画像化してPDFに埋め込む方法を使用
        this.generatePDFWithHTML();
    }

    // HTMLを画像化してPDFに埋め込む方法（日本語対応）
    async generatePDFWithHTML() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // フォームの内容をHTMLとして取得
        const formElement = document.getElementById('request-form-form');
        const formData = this.getFormData();
        
        // HTMLコンテンツを生成
        const htmlContent = this.generateHTMLContent(formData);
        
        // HTMLを一時的に表示
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>運送依頼書</title>
                <style>
                    @media print {
                        @page { size: A4; margin: 0; }
                    }
                    body { 
                        font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif; 
                        padding: 20px;
                        font-size: 12px;
                        line-height: 1.6;
                        color: #000;
                    }
                    .document-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 20px;
                    }
                    .document-date {
                        text-align: right;
                        font-size: 11px;
                    }
                    .document-date-item {
                        margin-bottom: 5px;
                    }
                    h1 { 
                        text-align: center; 
                        font-size: 28px; 
                        font-weight: bold;
                        margin: 20px 0 30px 0;
                        letter-spacing: 2px;
                    }
                    .company-info {
                        margin-bottom: 20px;
                        padding: 10px 0;
                    }
                    .greeting {
                        margin: 20px 0;
                        font-size: 13px;
                    }
                    .section {
                        margin: 15px 0;
                        border: 1px solid #000;
                        padding: 10px;
                    }
                    .section-title {
                        font-size: 14px;
                        font-weight: bold;
                        border-bottom: 1px solid #000;
                        padding-bottom: 5px;
                        margin-bottom: 10px;
                        background-color: rgba(229, 229, 229, 0.5);
                        padding: 5px 10px;
                        margin: -10px -10px 10px -10px;
                    }
                    .field-row {
                        display: flex;
                        margin-bottom: 8px;
                        border-bottom: 0.5px solid #ccc;
                        padding-bottom: 5px;
                    }
                    .field-label {
                        font-weight: bold;
                        width: 120px;
                        flex-shrink: 0;
                    }
                    .field-value {
                        flex: 1;
                        padding-left: 10px;
                    }
                    .two-column {
                        display: flex;
                        gap: 20px;
                        margin-bottom: 15px;
                    }
                    .two-column .field-row {
                        flex: 1;
                    }
                    .footer-section {
                        margin-top: 30px;
                        display: flex;
                        gap: 20px;
                    }
                    .stamp-box {
                        width: 150px;
                        height: 100px;
                        border: 1px solid #000;
                        background-color: #f9f9f9;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 11px;
                        color: #666;
                    }
                    .notes-box {
                        flex: 1;
                        border: 1px solid #000;
                        min-height: 100px;
                        padding: 10px;
                    }
                </style>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
        `);
            printWindow.document.close();
            // タイトルを明示的に設定
            printWindow.document.title = '運送依頼書';
            
            // 印刷ダイアログを表示（ユーザーがPDFとして保存可能）
            setTimeout(() => {
                printWindow.print();
            }, 500);
        }
    }

    // HTMLコンテンツを生成
    generateHTMLContent(data) {
        let html = '';
        
        // ヘッダー部分（日付と番号）
        html += '<div class="document-header">';
        html += '<div></div>'; // 左側は空
        html += '<div class="document-date">';
        if (data.requestDate) {
            html += `<div class="document-date-item">依頼日: ${this.formatDate(data.requestDate)}</div>`;
        }
        if (data.requestNumber) {
            html += `<div class="document-date-item">依頼番号: ${data.requestNumber}</div>`;
        }
        html += '</div>';
        html += '</div>';
        
        // タイトル
        html += '<h1>運送依頼書</h1>';
        
        // 会社情報（依頼者と配車担当者をまとめて表示）
        html += '<div class="company-info">';
        if (data.requester || data.dispatcher) {
            html += '<div>';
            if (data.requester) {
                html += `<div><strong>依頼者:</strong> ${data.requester.replace(/\n/g, '<br>')}</div>`;
            }
            if (data.dispatcher) {
                html += `<div style="margin-top: 10px;"><strong>配車担当者:</strong> ${data.dispatcher}</div>`;
            }
            html += '</div>';
        }
        html += '</div>';
        
        // 挨拶文
        html += '<div class="greeting">';
        html += '平素は大変お世話になっております。<br>';
        html += '以下の通り、運送依頼を申し上げます。';
        html += '</div>';
        
        // 積地情報
        html += '<div class="section">';
        html += '<div class="section-title">積地（積込先）情報</div>';
        if (data.loadingName) html += `<div class="field-row"><div class="field-label">積地名:</div><div class="field-value">${data.loadingName}</div></div>`;
        if (data.loadingAddress) html += `<div class="field-row"><div class="field-label">積地住所:</div><div class="field-value">${data.loadingAddress.replace(/\n/g, '<br>')}</div></div>`;
        if (data.loadingContact) html += `<div class="field-row"><div class="field-label">担当者・連絡先:</div><div class="field-value">${data.loadingContact.replace(/\n/g, '<br>')}</div></div>`;
        if (data.loadingDateTime) html += `<div class="field-row"><div class="field-label">積込日時:</div><div class="field-value">${this.formatDateTime(data.loadingDateTime)}</div></div>`;
        if (data.loadingConditions) html += `<div class="field-row"><div class="field-label">積込条件:</div><div class="field-value">${data.loadingConditions.replace(/\n/g, '<br>')}</div></div>`;
        html += '</div>';
        
        // 降地情報
        html += '<div class="section">';
        html += '<div class="section-title">降地（荷卸先）情報</div>';
        if (data.unloadingName) html += `<div class="field-row"><div class="field-label">降地名:</div><div class="field-value">${data.unloadingName}</div></div>`;
        if (data.unloadingAddress) html += `<div class="field-row"><div class="field-label">降地住所:</div><div class="field-value">${data.unloadingAddress.replace(/\n/g, '<br>')}</div></div>`;
        if (data.unloadingContact) html += `<div class="field-row"><div class="field-label">担当者・連絡先:</div><div class="field-value">${data.unloadingContact.replace(/\n/g, '<br>')}</div></div>`;
        if (data.unloadingDateTime) html += `<div class="field-row"><div class="field-label">降ろし日時:</div><div class="field-value">${this.formatDateTime(data.unloadingDateTime)}</div></div>`;
        if (data.unloadingConditions) html += `<div class="field-row"><div class="field-label">降ろし条件:</div><div class="field-value">${data.unloadingConditions.replace(/\n/g, '<br>')}</div></div>`;
        html += '</div>';
        

        // 改ページ
        html += '<div style="page-break-after: always;"></div>';

        // 荷物情報
        html += '<div class="section">';
        html += '<div class="section-title">荷物情報</div>';
        if (data.cargoContent) html += `<div class="field-row"><div class="field-label">荷物の内容:</div><div class="field-value">${data.cargoContent.replace(/\n/g, '<br>')}</div></div>`;
        html += '<div class="two-column">';
        if (data.cargoQuantity) html += `<div class="field-row"><div class="field-label">数量:</div><div class="field-value">${data.cargoQuantity}</div></div>`;
        if (data.cargoWeight) html += `<div class="field-row"><div class="field-label">重量・容積:</div><div class="field-value">${data.cargoWeight}</div></div>`;
        html += '</div>';
        html += '<div class="two-column">';
        if (data.loadingMethod) html += `<div class="field-row"><div class="field-label">積載方法:</div><div class="field-value">${data.loadingMethod}</div></div>`;
        if (data.cargoShape) html += `<div class="field-row"><div class="field-label">荷姿:</div><div class="field-value">${data.cargoShape}</div></div>`;
        html += '</div>';
        if (data.cargoNotes) html += `<div class="field-row"><div class="field-label">特記事項:</div><div class="field-value">${data.cargoNotes.replace(/\n/g, '<br>')}</div></div>`;
        html += '</div>';
        
        // 請求・運賃情報
        html += '<div class="section">';
        html += '<div class="section-title">請求・運賃情報</div>';
        html += '<div class="two-column">';
        if (data.paymentCondition) html += `<div class="field-row"><div class="field-label">支払条件:</div><div class="field-value">${data.paymentCondition}</div></div>`;
        html += '<div class="field-row"><div class="field-label">運賃:</div><div class="field-value">';
        if (data.fare) {
            html += data.fare.replace(/\n/g, '<br>');
        }
        html += '</div></div>';
        html += '</div>';
        if (data.billingInfo) html += `<div class="field-row"><div class="field-label">請求先情報:</div><div class="field-value">${data.billingInfo.replace(/\n/g, '<br>')}</div></div>`;
        html += '</div>';
        
        // フッター（印鑑と備考）
        html += '<div class="footer-section">';
        html += '<div class="stamp-box">';
        html += '印鑑欄<br>';
        if (data.requesterSeal || data.companySeal) {
            if (data.requesterSeal) html += `依頼者: ${data.requesterSeal}<br>`;
            if (data.companySeal) html += `受託会社: ${data.companySeal}`;
        }
        html += '</div>';
        html += '<div class="notes-box">';
        html += '<strong>備考:</strong><br>';
        if (data.notes) {
            html += data.notes.replace(/\n/g, '<br>');
        }
        html += '</div>';
        html += '</div>';
        
        return html;
    }
}

// グローバルにエクスポート
window.RequestFormManager = RequestFormManager;

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    const requestFormManager = new RequestFormManager();
    window.requestFormManager = requestFormManager;
});

