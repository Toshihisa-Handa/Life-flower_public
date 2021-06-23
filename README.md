#Life-Flowerの本気の制作をするプロジェクト

##githubに最初pushするまでにしたこと

```
$ npm init -y
$ npm install express
```

app.jsにhello world記述しport3002を設定

#サーバー立ち上げコマンド
```
npx nodemon app.js
```

#db名
lf_db

var moment = require('moment');//この記述はmoment.jsを利用するためのもの

#tableplusnのバグについて
PCを再起動させたり、PCの不具合で強制終了したときなど、再起動するとデータベースへの接続ができない時がある
「Access denied for user 'root'@'localhost' 」←このようなエラーが出る

こういったときはターミナルで

```
mysql.server start
mysql -u root
```
などを実行しmysqlサーバーを立ち上げてサイド確認する。
そうするとしばらくすると使えるようにこれまではなった（確証はない）


#iframeの実装の参考にしたサイト
https://olein-design.com/blog/google-map-iframe-for-responsive

＃update文でformタグに「enctype="multipart/form-data"」を入れるとpostが効かなかった（2020/9/10記述）


＃ルーティングをまとめたことによってcssとimgタグのsrcのパスが通らなくなった。
今まで：href="css/style.css"　→　href="../css/style.css"　に変更
今まで：mages/uploads　→　../images/uploads　変更

これで画像とcssのパスが通った。



1ファイルにまとめるとメンテナンス生を上げる。
小規模であれば不要な場合あり

view 表示（html表示）
con 実行（処理を受けてモデルやviewに渡す役割）
model dbに保存、ファイルに何か書き込む (mysql表示)
routeに処理は書かない（どこにアクセスするかかくのみにする）

fat controller（太ったコントローラー）という言葉がある。
コントローラーのソースがどんどん増えてメンテナンスしづらくなること
こだわりだすと止まらない


      ```
      con.end();
      ```
      でmysqlとの接続を切っている
      なくても最近は切れることがある

MVCで書くと自動テストも書きやすくなる

2020/10/11
```
events.js:292
      throw er; // Unhandled 'error' event
      ^

Error: Connection lost: The server closed the connection.
    at Socket.<anonymous> (/Users/toshi/programing/nodejs/Life-Flower/node_modules/mysql2/lib/connection.js:91:31)
    at Socket.emit (events.js:315:20)
    at TCP.<anonymous> (net.js:674:12)
Emitted 'error' event on Connection instance at:
    at Connection._notifyError (/Users/toshi/programing/nodejs/Life-Flower/node_modules/mysql2/lib/connection.js:225:12)
    at Socket.<anonymous> (/Users/toshi/programing/nodejs/Life-Flower/node_modules/mysql2/lib/connection.js:97:12)
    at Socket.emit (events.js:315:20)
    at TCP.<anonymous> (net.js:674:12) {
  fatal: true,
  code: 'PROTOCOL_CONNECTION_LOST'
}
[nodemon] app crashed - waiting for file changes before starting...

```
このエラーによりサーバーが一定時間で自動的に閉じてしまう
↓
対策として右のURLを適用した（https://github.com/sidorares/node-mysql2/issues/836)
やった内容はmysqlの接続を従来の
const connection = mysql.createConnection(dbConfig);
ではなくpoolを読み込む方法に変えた
↓
//poolを利用したコネクション（接続が一定時間で切れるのを防ぐ。参考：https://github.com/sidorares/node-mysql2/issues/836）
const connection = mysql.createPool(dbConfig);

#mapについて
mapのkeyの記入のないmap-test.ejsをgitで管理する