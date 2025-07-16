# YABOO EC サイトアプリケーション

ECサイトアプリケーションのモノレポプロジェクト。顧客向けのオンラインショップ機能と管理者向けの管理機能を提供します。

## 技術スタック

### フロントエンド
- プレーンHTML + TypeScript
- LIT Web Components
- Vite (開発サーバー・ビルドツール)
- ESLint + Prettier (コード品質管理)
- Jest (テストフレームワーク)

### バックエンド
- Java 21
- Spring Boot 3.2.1
- Spring Data JPA
- Spring Security
- PostgreSQL
- Gradle 8.5 (ビルドツール)
- Checkstyle + Spotless (コード品質管理)
- JUnit 5 (テストフレームワーク)

### データベース
- PostgreSQL (最新版)  

## プロジェクト構成

```
yaboo-demo-ec-alpha/
├── backend/                 # Spring Boot アプリケーション
│   ├── src/main/java/      # メインソースコード
│   ├── src/test/java/      # テストコード
│   ├── src/main/resources/ # 設定ファイル
│   ├── build.gradle        # Gradle設定
│   └── gradlew            # Gradle Wrapper
├── frontend/               # HTML/TypeScript + LIT
│   ├── src/               # ソースコード
│   │   ├── components/    # Web Components
│   │   ├── services/      # API サービス
│   │   ├── types/         # TypeScript型定義
│   │   └── main.ts        # メインエントリーポイント
│   ├── package.json       # npm設定
│   └── vite.config.ts     # Vite設定
├── sample-data/           # CSVサンプルデータ
│   ├── cust.csv          # 顧客データ
│   ├── item.csv          # 商品データ
│   ├── itemstock.csv     # 在庫データ
│   └── order.csv         # 注文データ
└── docs/                 # ドキュメント
```

## 主要機能

### 顧客向け機能
- 🔐 認証（ログイン/ログアウト）
- 🛍️ 商品検索・閲覧
- ⚡ ワンクリック注文
- 📋 注文履歴確認

### 管理者向け機能
- 📦 商品管理（登録/編集/削除）
- 📊 在庫管理
- 📝 注文管理
- 👥 顧客情報確認

## セットアップ手順

### 1. 前提条件
- Java 21以上
- Node.js 18以上
- PostgreSQL 15以上

### 2. データベースセットアップ

PostgreSQLを起動し、データベースを作成します：

```bash
$ brew search postgresql
$ brew install postgresql@17
$ brew services start postgresql@17
$ psql -h localhost -p 5432 -U yaboo -d postgres
postgres=# CREATE DATABASE yaboo_ec;
postgres=# \l
postgres=# \c yaboo_ec
postgres=# CREATE USER yaboo WITH PASSWORD '*********';
postgres=# \du
postgres=# GRANT ALL PRIVILEGES ON DATABASE yaboo_ec TO yaboo;
postgres=# CREATE SCHEMA IF NOT EXISTS yaboo AUTHORIZATION yaboo;
postgres=# CREATE SCHEMA yaboo;
postgres=# GRANT ALL PRIVILEGES ON SCHEMA yaboo TO yaboo;
```

```bash
# Docker使用時
docker run -d \
  --name yaboo-postgres \
  -e POSTGRES_DB=yaboo_ec \
  -e POSTGRES_USER=yaboo \
  -e POSTGRES_PASSWORD=******* \
  -p 5432:5432 \
  postgres:latest

# または、ローカルのPostgreSQLを使用
createdb yaboo_ec
```

### 3. バックエンドセットアップ

```bash
cd backend

# 依存関係のインストールとビルド
./gradlew build

# アプリケーション起動（サンプルデータ自動投入）
./gradlew bootRun
```

バックエンドは http://localhost:8080 で起動します。

### 4. フロントエンドセットアップ

```bash
cd frontend

# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

フロントエンドは http://localhost:3000 で起動します。

### 5. アクセス

ブラウザで http://localhost:3000 にアクセスしてアプリケーションを使用できます。

## 開発用コマンド

### バックエンド

```bash
cd backend

# ビルド
./gradlew build

# テスト実行
./gradlew test

# アプリケーション起動
./gradlew bootRun

# コード品質チェック（Linter + テスト）
./gradlew check

# コードフォーマット
./gradlew spotlessApply
```

### フロントエンド

```bash
cd frontend

# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# ビルド結果のプレビュー
npm run preview

# テスト実行
npm run test

# テスト（ウォッチモード）
npm run test:watch

# Linter実行
npm run lint

# Linter（自動修正）
npm run lint:fix

# コードフォーマット
npm run format
```

## テストアカウント

サンプルデータから以下のテストアカウントが利用できます：

| 顧客ID | パスワード | 氏名 | 地域 |
|--------|------------|------|------|
| D1000163 | password | マケテ テモ | 滋賀県 |
| B1000289 | password | ネネ ニセ | 長野県 |
| E1000363 | password | ホヒセテ スノネ | 高知県 |
| V1000455 | password | カイ ネセムコ | 大阪府 |

※全ての顧客のパスワードは「password」です。

## API エンドポイント

### 認証
- `POST /api/auth/login` - ログイン

### 商品
- `GET /api/items` - 商品一覧取得
- `GET /api/items/search` - 商品検索
- `GET /api/items/{itemCode}` - 商品詳細取得

### 注文
- `GET /api/orders` - 全注文取得（管理者用）
- `GET /api/orders/customer/{customerId}` - 顧客別注文履歴取得
- `POST /api/orders` - 注文作成

### 顧客
- `GET /api/customers` - 全顧客取得（管理者用）
- `GET /api/customers/{customerId}` - 顧客詳細取得

## データモデル

### 顧客（Customer）
- customerid: 顧客ID (PK)
- lastname: 苗字
- firstname: 名前
- areacode: 都道府県判別用コード
- area: 都道府県
- birthday: 生年月日
- age: 年齢
- sex: 性別
- totalprice: 注文合計金額
- lastorderdate: 最終注文日
- password: パスワード

### 商品（Item）
- item: 商品コード (PK)
- itemcate: 商品カテゴリ
- itemprice: 商品価格

### 在庫（ItemStock）
- item: 商品コード (PK)
- stock: 在庫数

### 注文（Order）
- orderno: 注文番号 (PK)
- customerid: 顧客ID
- orderdate: 注文日
- itemprice: 商品価格
- orderitem: 商品コード
- orderitemcate: 商品カテゴリ
- ordernum: 注文数
- orderprice: 合計注文金額

## 開発ガイドライン

### コード品質
- バックエンド：Checkstyle + Spotless によるコード品質管理
- フロントエンド：ESLint + Prettier によるコード品質管理
- 両方とも自動テストの実装を必須とする

### Git ワークフロー
1. feature ブランチを作成
2. 開発・テスト
3. コード品質チェック通過
4. Pull Request 作成
5. レビュー後マージ

## トラブルシューティング

### データベース接続エラー
- PostgreSQLが起動していることを確認
- application.yml の接続設定を確認

### ポート競合エラー
- 8080（バックエンド）、3000（フロントエンド）ポートが使用可能か確認

### CORS エラー
- バックエンドの CORS 設定を確認
- フロントエンドのAPI_BASE_URLを確認

## ライセンス

このプロジェクトは学習・デモ目的で作成されています。