# Hide X Recommended Tab

X (Twitter) のホームタイムラインにある「おすすめ」タブを非表示にする Chrome 拡張です。  
「おすすめ」が選択中のときは自動で「フォロー中」に切り替えます。

## ファイル構成

- `manifest.json`: Chrome 拡張の設定 (Manifest V3)
- `content.js`: タブの判定と非表示処理
- `samples/1.html`: 提供された X の HTML サンプル

## インストール方法（開発者モード）

1. Chrome の拡張管理ページを開く: `chrome://extensions/`
2. 右上の「デベロッパー モード」を ON
3. 「パッケージ化されていない拡張機能を読み込む」を押す
4. このディレクトリ（`manifest.json` がある場所）を選択

## 動作仕様

- `https://x.com/*` と `https://twitter.com/*` で動作
- タブ内テキストが `おすすめ` / `For you` の要素を非表示
- タブ内テキストが `フォロー中` / `Following` の要素がある場合のみ適用
- X の SPA 遷移や再描画に追従するため、DOM 変更を監視して再適用
