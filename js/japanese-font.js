// 日本語フォント対応
// jsPDFで日本語を表示するためのフォント設定

(function() {
    'use strict';
    
    // jsPDFが読み込まれるまで待機
    if (typeof window.jspdf === 'undefined') {
        console.warn('jsPDFが読み込まれていません');
        return;
    }

    const { jsPDF } = window.jspdf;
    
    // 日本語フォントの設定
    // 注意: 実際の実装では、日本語フォントファイル（TTF）をBase64エンコードして追加する必要があります
    // ここでは、フォント設定のためのヘルパー関数を提供します
    
    // 日本語フォントを追加する関数（フォントファイルが必要）
    window.addJapaneseFont = function(doc, fontName, fontData) {
        try {
            // フォントを仮想ファイルシステムに追加
            doc.addFileToVFS(fontName + '.ttf', fontData);
            // フォントを定義
            doc.addFont(fontName + '.ttf', fontName, 'normal');
            doc.addFont(fontName + '.ttf', fontName, 'bold');
            return true;
        } catch (e) {
            console.error('日本語フォントの追加に失敗しました:', e);
            return false;
        }
    };
    
    // 日本語フォントを使用する関数
    window.setJapaneseFont = function(doc, fontName) {
        try {
            doc.setFont(fontName);
            return true;
        } catch (e) {
            console.warn('日本語フォントの設定に失敗しました。デフォルトフォントを使用します:', e);
            doc.setFont('helvetica');
            return false;
        }
    };
    
    console.log('日本語フォントヘルパーが読み込まれました');
})();
