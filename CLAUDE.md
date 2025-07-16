# YABOO EC サイトアプリケーション

ECサイトアプリケーションのモノレポプロジェクト。顧客向けのオンラインショップ機能と管理者向けの管理機能を提供します。

## 技術スタック

### フロントエンド
- プレーンHTML + TypeScript
- LIT Web Components
- Linter & Formatter設定済み
- 自動テスト対応

### バックエンド
- Java (最新版)
- Spring Boot (最新版)
- Gradle (ビルドツール)
- Tomcat (最新版)
- Linter & Formatter設定済み
- 自動テスト対応

### データベース
- PostgreSQL (最新版)

## プロジェクト構成

```
yaboo-demo-ec-alpha/
├── backend/           # Spring Boot アプリケーション
├── frontend/          # HTML/TypeScript + LIT
├── sample-data/       # CSVサンプルデータ
└── docs/             # ドキュメント
```

## 主要機能

### 顧客向け機能
- 認証（ログイン/ログアウト）
- 商品検索・閲覧
- ワンクリック注文
- 注文履歴確認

### 管理者向け機能
- 商品管理（登録/編集/削除）
- 在庫管理
- 注文管理
- 顧客情報確認

## データモデル
- 顧客データ (`sample-data/cust.csv`)
- 注文データ (`sample-data/order.csv`)
- 在庫データ (`sample-data/itemstock.csv`)
- アイテムデータ (`sample-data/item.csv`)

## 開発用コマンド

### バックエンド
```bash
cd backend
./gradlew build          # ビルド
./gradlew test           # テスト実行
./gradlew bootRun        # アプリケーション起動
./gradlew check          # Linter & テスト実行
```

### フロントエンド
```bash
cd frontend
npm install              # 依存関係インストール
npm run build            # ビルド
npm run test             # テスト実行
npm run lint             # Linter実行
npm run format           # フォーマット実行
npm run dev              # 開発サーバー起動
```

### データベース
```bash
# PostgreSQL起動（Docker使用時）
docker run -d \
  --name yaboo-postgres \
  -e POSTGRES_DB=yaboo_ec \
  -e POSTGRES_USER=yaboo \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:latest
```

## セットアップ手順

1. PostgreSQLデータベースを起動
2. バックエンドアプリケーションを起動（サンプルデータ自動投入）
3. フロントエンドアプリケーションを起動
4. ブラウザで http://localhost:3000 にアクセス

## テストアカウント
サンプルデータから生成されるテストアカウント情報は `sample-data/cust.csv` を参照してください。