const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// データベースファイルのパス
const dbPath = path.resolve(__dirname, 'database.sqlite');

// データベース接続を作成
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('データベース接続エラー:', err.message);
    return;
  }
  console.log('SQLiteデータベースに接続しました');

  // テーブルの作成
  db.run(
    `
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
    (err) => {
      if (err) {
        console.error('テーブル作成エラー:', err.message);
        return;
      }

      // サンプルデータの挿入（テーブルが空の場合のみ）
      db.get('SELECT COUNT(*) as count FROM posts', (err, row) => {
        if (err) {
          console.error('クエリエラー:', err.message);
          return;
        }

        if (row.count === 0) {
          const sampleData = [
            [
              '道路・交通',
              '信号機の設置について',
              '〇〇町の交差点に信号機を設置してほしいです。',
            ],
            [
              '公園・施設',
              '公園の遊具について',
              '△△公園の遊具が壊れているので修理してください。',
            ],
          ];

          const stmt = db.prepare(
            'INSERT INTO posts (category, title, message) VALUES (?, ?, ?)'
          );
          sampleData.forEach((data) => {
            stmt.run(data, (err) => {
              if (err) console.error('サンプルデータ挿入エラー:', err.message);
            });
          });
          stmt.finalize();

          console.log('サンプルデータを挿入しました');
        }
      });
    }
  );
});

// データベースオブジェクトをエクスポート
module.exports = db;
