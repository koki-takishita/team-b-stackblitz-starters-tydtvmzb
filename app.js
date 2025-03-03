const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database'); // SQLiteデータベース接続をインポート

const app = express();
const port = 3000;

// ミドルウェア設定
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 一覧ページ表示
app.get('/', (req, res) => {
  console.log('test');
  // 投稿一覧を取得
  db.all('SELECT * FROM posts ORDER BY created_at DESC', (err, posts) => {
    if (err) {
      console.error('クエリエラー:', err.message);
      return res.status(500).send('データベースエラー');
    }
    res.render('list', { posts });
  });
});

// 投稿ページ表示
app.get('/post', (req, res) => {
  res.render('post');
});

// 投稿処理
app.post('/post', (req, res) => {
  const { category, title, message } = req.body;

  // 簡易的なバリデーション
  if (!category || !title || !message) {
    return res.status(400).send('すべての項目を入力してください');
  }

  // データベースに保存
  const query = 'INSERT INTO posts (category, title, message) VALUES (?, ?, ?)';
  db.run(query, [category, title, message], function (err) {
    if (err) {
      console.error('保存エラー:', err.message);
      return res.status(500).send('保存中にエラーが発生しました');
    }
    // 保存成功したら一覧ページにリダイレクト
    res.redirect('/');
  });
});

// サーバー起動
app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動しました`);
});

// プロセス終了時にデータベース接続を閉じる
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('データベース切断エラー:', err.message);
    }
    console.log('データベース接続を閉じました');
    process.exit(0);
  });
});
