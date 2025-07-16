-- YABOO EC サイト データベーステーブル作成SQL
-- PostgreSQL用

-- データベース接続（必要に応じて実行）
-- \c yaboo_ec;

-- 既存テーブルの削除（必要に応じて実行）
-- DROP TABLE IF EXISTS yaboo.orders CASCADE;
-- DROP TABLE IF EXISTS yaboo.item_stocks CASCADE;
-- DROP TABLE IF EXISTS yaboo.items CASCADE;
-- DROP TABLE IF EXISTS yaboo.customers CASCADE;

-- 顧客テーブル
CREATE TABLE yaboo.customers (
    customerid VARCHAR(10) PRIMARY KEY,
    lastname VARCHAR(50) NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    areacode VARCHAR(5) NOT NULL,
    area VARCHAR(20) NOT NULL,
    birthday DATE NOT NULL,
    age INTEGER NOT NULL,
    sex INTEGER NOT NULL CHECK (sex IN (1, 2)), -- 1:男性, 2:女性
    totalprice DECIMAL(10,0) DEFAULT 0,
    lastorderdate DATE,
    password VARCHAR(255) NOT NULL DEFAULT 'password',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 商品テーブル
CREATE TABLE yaboo.items (
    item VARCHAR(20) PRIMARY KEY,
    itemcate VARCHAR(20) NOT NULL,
    itemprice DECIMAL(10,0) NOT NULL CHECK (itemprice >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 在庫テーブル
CREATE TABLE yaboo.item_stocks (
    item VARCHAR(20) PRIMARY KEY,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item) REFERENCES yaboo.items(item) ON DELETE CASCADE
);

-- 注文テーブル
CREATE TABLE yaboo.orders (
    orderno VARCHAR(20) PRIMARY KEY,
    customerid VARCHAR(10) NOT NULL,
    orderdate DATE NOT NULL,
    itemprice DECIMAL(10,0) NOT NULL CHECK (itemprice >= 0),
    orderitem VARCHAR(20) NOT NULL,
    orderitemcate VARCHAR(20) NOT NULL,
    ordernum INTEGER NOT NULL CHECK (ordernum > 0),
    orderprice DECIMAL(10,0) NOT NULL CHECK (orderprice >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customerid) REFERENCES yaboo.customers(customerid) ON DELETE CASCADE,
    FOREIGN KEY (orderitem) REFERENCES yaboo.items(item) ON DELETE CASCADE
);

-- インデックス作成（パフォーマンス向上）
CREATE INDEX idx_customers_area ON yaboo.customers(area);
CREATE INDEX idx_customers_birthday ON yaboo.customers(birthday);
CREATE INDEX idx_customers_lastorderdate ON yaboo.customers(lastorderdate);

CREATE INDEX idx_items_category ON yaboo.items(itemcate);
CREATE INDEX idx_items_price ON yaboo.items(itemprice);

CREATE INDEX idx_orders_customerid ON yaboo.orders(customerid);
CREATE INDEX idx_orders_orderdate ON yaboo.orders(orderdate);
CREATE INDEX idx_orders_orderitem ON yaboo.orders(orderitem);
CREATE INDEX idx_orders_category ON yaboo.orders(orderitemcate);

-- テーブル一覧確認
-- \dt

-- テーブル構造確認
-- \d customers
-- \d items
-- \d item_stocks
-- \d orders

-- サンプルデータ件数確認（データ投入後）
-- SELECT 'customers' as table_name, COUNT(*) as record_count FROM customers
-- UNION ALL
-- SELECT 'items', COUNT(*) FROM items
-- UNION ALL
-- SELECT 'item_stocks', COUNT(*) FROM item_stocks
-- UNION ALL
-- SELECT 'orders', COUNT(*) FROM orders;

-- データベース統計情報
-- SELECT 
--     schemaname,
--     tablename,
--     attname as column_name,
--     n_distinct,
--     most_common_vals,
--     most_common_freqs
-- FROM pg_stats 
-- WHERE schemaname = 'public' 
-- ORDER BY tablename, attname;