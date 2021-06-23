const express = require('express');
const router = express.Router();
const connection = require('../mysqlConnection');
const multer = require('multer');//画像取得ようパッケージ（multer）読み込み
const moment = require('moment');//日付取得用パッケージ読み込み
//const uploadを作るまでの準備＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9)+file.originalname)
    }
  })
//   const upload = multer({ dest: './public/images/uploads' })//ファイルの保存先指定
const upload = multer({ storage: storage })
//ここまで＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// const path = require('path')
let diary_c = require('../controllers/diary')//コントローラーフォルダの指定ファイルを読み取る
//cloudinaryを使用する準備＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'second-cube',
  api_key: '***',
  api_secret: '**'
});
//＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

router.get('/',diary_c.d_insert)	;

router.post('/', upload.single('image'), function (req, res, next) {
// router.post('/', function (req, res) {
  var title = req.body.title;
  var userId = req.session.user_id? req.session.user_id: 0; 
  var tag = req.body.tag;
  var text = req.body.text;
  var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  var path = req.file.path;
  cloudinary.uploader.upload(path, function(result) {
    var imagePath = result.url;
    var sql='INSERT INTO diary (user_id, title, image, tag, text, created_at) VALUES(?,?,?,?,?,?)';
    connection.query(sql, [userId, title, imagePath, tag, text, createdAt],(error,result)=>{//diaryMOdelに処理を投げる（コントローラーとモデルの処理を分ける）
      res.redirect('/drege')
      console.log(req.files)
      console.log(req.file)
    })
  })

  })




  module.exports = router;