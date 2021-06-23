//npmでインストールしたmysqlが使えるようになります
const mysql = require('mysql2');

//db接続の定義(local用)
// const dbConfig ={
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'lf_db'
// };
//db接続の定義(heroku用)



// //lf-cssのdb==========================
// mysql://
// b0346d39a7ba2a
// :
// d3f61c57
// @
// us-cdbr-east-02.cleardb.com
// /
// heroku_1286e451eb281d2
// ?reconnect=true
//=========================================


//lf-ggapreのdb＝＝＝＝＝＝＝＝＝＝＝＝
// mysql://
// bc8c18757a81a7
// :
// 02c713ef
// @
// us-cdbr-east-02.cleardb.com
// /
// heroku_11fe2e32e57b827
// ?reconnect=true
//===============================
const dbConfig ={
    host: 'us-cdbr-east-02.cleardb.com',
    user: 'bc8c18757a81a7',
    password: '02c713ef',
    database: 'heroku_11fe2e32e57b827'
};



//データベースの情報をオブジェクトにして引数に渡し、その返り値をconnectionという変数に代入
// const connection = mysql.createConnection(dbConfig);

//poolを利用したコネクション（接続が一定時間で切れるのを防ぐ。参考：https://github.com/sidorares/node-mysql2/issues/836）
const connection = mysql.createPool(dbConfig);



// これは
// //DBの接続準備
// const connection =
//    mysql.createConnection({
//       host:'localhost',
//       user:'root',//mampではroot
//       password:'',//mampでは空でOK
//       database:'node_test_db'//任意のDB名
//    });
// と同じ
//db

//外部からrequireできる形にします
module.exports = connection;