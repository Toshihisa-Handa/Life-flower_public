const express = require('express');
const router = express.Router();
const connection = require('../mysqlConnection');
const multer = require('multer');//画像取得ようパッケージ（multer）読み込み
const moment = require('moment');//日付取得用パッケージ読み込み

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

const path = require('path')


let flower_c = require('../controllers/flower')//コントローラーフォルダの指定ファイルを読み取る
//cloudinaryを使用する準備＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'second-cube',
  api_key: '**',
  api_secret: '**'
});
//＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝


router.get('/', flower_c.f_insert);

router.post('/', upload.single('file'), function (req, res, next) {
  console.log(req.file);
  console.log(req.file.filename);
  
  var name = req.body.name;
  var price = req.body.price;
  var feature = req.body.feature;
  var userId = req.session.user_id? req.session.user_id: 0; 
  var tag = req.body.tag;
  var text = req.body.text;
  var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  var sql='INSERT INTO flower (user_id, name, image, price, feature, tag, text, created_at) VALUES(?,?,?,?,?,?,?,?)';
  var path = req.file.path;
  cloudinary.uploader.upload(path, function(result) {
    var imagePath = result.url;
    connection.query(sql, [userId, name, imagePath, price, feature, tag, text, createdAt],(error,result)=>{
      res.redirect('/frege')
    })
  })

  
  })

  module.exports = router;