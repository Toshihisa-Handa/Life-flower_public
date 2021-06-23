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

//cloudinaryを使用する準備＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'second-cube',
  api_key: '**',
  api_secret: '**'
});
//＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝


// const path = require('path')

// router.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views/myprofile.ejs'))
// })	;




//送信する画像が1つの時第二引数は 「upload.single('account_img')」を使う
router.post('/', upload.single('image'), function (req, res, next) {
  
  var userId = req.session.user_id? req.session.user_id: 0; 
  console.log('test============================')
  console.log(req.files)
  console.log(req.file)
  console.log(req.file.filename)
  console.log(req)
  console.log('testdes============================')

  var sql='UPDATE map SET image = ? WHERE user_id = '+ userId +''; 
  var path = req.file.path;
  cloudinary.uploader.upload(path, function(result) {
    var imagePath = result.url;
    connection.query(sql,[imagePath],(error,result)=>{
      // res.redirect('/myprofile')
      res.redirect(req.get('referer'))
    })
  })
  

  })

  module.exports = router;

