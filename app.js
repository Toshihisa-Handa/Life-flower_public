const express = require('express');
const connection = require('./mysqlConnection');//外部ファイルにてdb接続を定義している。それを読み取り。
// const port = 3002// ローカルではこのポートでOK
var port = process.env.PORT || 5000;// herokuではポートはこれを使う
const path = require('path')
const moment = require('moment');//日付取得用パッケージ読み込み
var session = require('express-session'); //セッションを使用する為の記述
var setUser = require('./setUser'); //セッションを使用する為に必要なsetUser.jsの読み取り
const app = express()

//stripe用======================================================================
const stripe = require('stripe')('**');
const YOUR_DOMAIN = 'https://lf-css.herokuapp.com';
let flower_c = require('./controllers/flower')//コントローラーフォルダのflowerファイルを読み取る
app.post('/create-session/:id', async (req, res) => {
  console.log(flower_c.stresult.price)
  let stprice = flower_c.stresult.price
  let stname = flower_c.stresult.name
  let stimage = flower_c.stresult.image
  let stid = flower_c.stresult.id
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'jpy',//usドルの意味,jpy：日本円
          product_data: {
            name: stname,//名前
            images: [stimage],//画像
          },
          unit_amount: stprice,//値段
        },
        quantity: 1,//数量
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/f_success`,//成功時の遷移画面
    cancel_url: `${YOUR_DOMAIN}/flower/${stid}`,//失敗時の遷移画面
  });

  res.json({ id: session.id });
});

//stripe用ここまで====================================================


//heroku用
var serveStatic = require('serve-static');
app.use(serveStatic(__dirname + "/dist"));


/////////////////////////////
//////////useの定義//////////////////////////////////

//publicフォルダ内のcssや画像フォルダの読み取りを可能にする
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: false}));//formからpostされた内容を取得可能にする（定型文）CRUDで使う部分

app.use(session({//セッションの為の記述
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

/////////////////////////////
//////////ルーティング定義//////////////////////////////////

//routeフォルダにルーティングを設定
var mainRouter = require('./routes/main');//ルーティングをまとめるファイル
var d_insertRouter = require('./routes/d_insert');//コントローラー化できていないファイル（やり方模索中）
var f_insertRouter = require('./routes/f_insert');//コントローラー化できていないファイル（やり方模索中）
var map_insertRouter = require('./routes/map_insert');//コントローラー化できていないファイル（やり方模索中)
var myprofile_imgRouter = require('./routes/myprofile_img');//コントローラー化できていないファイル（やり方模索中）
var myprofile_img2Router = require('./routes/myprofile_img2');//コントローラー化できていないファイル（やり方模索中）
var myprofile_img3Router = require('./routes/myprofile_img3');//コントローラー化できていないファイル（やり方模索中）
var myprofile_img4Router = require('./routes/myprofile_img4');//コントローラー化できていないファイル（やり方模索中）







app.use('/', setUser, mainRouter);//ルーティングをまとめるファイル(セッションを使用するページにはルーティングの前にsetUserを読み込ませる)
app.use('/d_insert', d_insertRouter);//コントローラー化できていないファイル（やり方模索中）
app.use('/f_insert', f_insertRouter);//コントローラー化できていないファイル（やり方模索中）
app.use('/map_insert', map_insertRouter);//コントローラー化できていないファイル（やり方模索中）
app.use('/myprofile_img', myprofile_imgRouter);//コントローラー化できていないファイル（やり方模索中）
app.use('/myprofile_img2', myprofile_img2Router);//コントローラー化できていないファイル（やり方模索中）
app.use('/myprofile_img3', myprofile_img3Router);//コントローラー化できていないファイル（やり方模索中）
app.use('/myprofile_img4', myprofile_img4Router);//コントローラー化できていないファイル（やり方模索中）

//失敗した再接続のコード＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// function handleDisconnect() {
//   console.log('INFO.CONNECTION_DB: ');
  
//   //connection取得
//   connection.connect(function(err) {
//       if (err) {
//           console.log('ERROR.CONNECTION_DB: ', err);
//           setTimeout(handleDisconnect, 1000);
//       }
//   });
  
//   //error('PROTOCOL_CONNECTION_LOST')時に再接続
//   connection.on('error', function(err) {
//       console.log('ERROR.DB: ', err);
//       if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//           console.log('ERROR.CONNECTION_LOST: ', err);
//           handleDisconnect();
//       } else {
//           throw err;
//       }
//   });
// }

// handleDisconnect();
//==================================================================



//3002番ポートを読み込み
app.listen(port, () => console.log(`Example app listening on port ${port}!`))