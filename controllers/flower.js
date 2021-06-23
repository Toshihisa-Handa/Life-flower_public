const connection = require('../mysqlConnection');
const multer = require('multer');//画像取得ようパッケージ（multer）読み込み
const moment = require('moment');//日付取得用パッケージ読み込み

//f_insert Ok
exports.f_insert =(req, res) => {
    res.sendFile(path.join(__dirname, 'views/frege.ejs'))
  }

//f_search Ok
exports.f_search = (req, res) => {
    let kensaku = req.query.kensaku;
    var sql = "SELECT S.name AS shopname, S.location AS basyo, F.id, F.user_id, F.name, F.image, F.price, F.feature, F.tag, F.text,ifnull(U.name, \'名無し\') AS uname, DATE_FORMAT(F.created_at, \'%Y年%m月%d日 %k時%i分%s秒\') AS created_at FROM flower F LEFT OUTER JOIN user U ON F.user_id = U.user_id JOIN shop S ON F.user_id = S.user_id WHERE S.name LIKE ? OR S.location LIKE ? OR F.name LIKE ? OR F.feature LIKE ? OR F.tag LIKE ? OR F.name LIKE ? ORDER BY F.created_at DESC"; 
    connection.query(sql,["%"+kensaku+"%","%"+kensaku+"%","%"+kensaku+"%","%"+kensaku+"%","%"+kensaku+"%","%"+kensaku+"%"],(error,results)=>{
      let uid = req.session.user_id? req.session.user_id: 0;
      connection.query('SELECT * FROM user',(error,users)=>{
        if(uid === 0){
          var shop = 'SELECT account_img FROM shop'
        }else{
          var shop = 'SELECT account_img FROM shop WHERE user_id = '+uid+'';
        }
        
         connection.query(shop,(error,shops)=>{
          if(error){
            console.log('ERROR.SELECT_DB: ', error);
            throw error;
        }
        // res.renderで指定ファイルの画面表示させる 
        res.render('flowers.ejs',{items:results,sitems:shops});

      })
      })
      })
  }

  //flower Ok
   exports.flower = (req, res)=>{
    var flowerId = req.params.id;
    var sql = 'SELECT S.name AS shopname, F.id, F.user_id, F.image, F.name, F.price, F.feature, F.text FROM flower AS F LEFT JOIN shop S ON F.user_id = S.user_id WHERE F.id = ?';
    var fsql = 'SELECT Fc.fcomment, ifnull(U.name, \'名無し\') AS user_name, DATE_FORMAT(Fc.created_at, \'%Y/%m/%d  %k:%i\') AS created_at FROM fcomment Fc LEFT OUTER JOIN user U ON Fc.user_id = U.user_id WHERE Fc.flower_id = ' + flowerId + ' ORDER BY Fc.created_at ASC'; 
    connection.query(sql,[req.params.id],(error,result)=>{
      connection.query(fsql,(error, dcomment)=>{
        let uid = req.session.user_id? req.session.user_id: 0;
        connection.query('SELECT * FROM user',(error,users)=>{
          if(uid === 0){
            var shop = 'SELECT account_img FROM shop'
          }else{
            var shop = 'SELECT account_img FROM shop WHERE user_id = '+uid+'';
          }
          
           connection.query(shop,(error,shops)=>{
            if(error){
              console.log('ERROR.SELECT_DB: ', error);
              throw error;
          }
          // res.renderで指定ファイルの画面表示させる 
          exports.stresult = result[0]
          res.render('flower.ejs',{
            item:result[0],
            fitems:dcomment,
            sitems:shops
          });
        })
        })
      })
     
      })
    }



  
//fcomment_post Ok
exports.fcomment_post =  (req, res) => {
  var userId = req.session.user_id? req.session.user_id: 0; 
  var flowerId = req.params.flower_id;
  var fcomment = req.body.fcomment;
  var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  var sql = 'INSERT INTO fcomment (flower_id, fcomment, created_at, user_id) VALUES (?,?,?,?)';
  connection.query(sql,[flowerId, fcomment, createdAt, userId],(error,results)=>{
    if(error){
      console.log('ERROR.SELECT_DB: ', error);
      throw error;
  }
    res.redirect('/flower/' + flowerId);
    console.log('insert=============')
    console.log(flowerId)
  })
}


  //flowerDelete Ok
  exports.flowerDelete = (req,res)=>{
    connection.query('DELETE FROM flower WHERE id = ?',[req.params.id],(error,results)=>{
      if(error){
        console.log('ERROR.SELECT_DB: ', error);
        throw error;
    }
      res.redirect('/frege')
    })
  }

  //flowerEdit Ok
  exports.flowerEdit = (req, res)=>{
    connection.query('SELECT * FROM flower WHERE id = ?',[req.params.id],(error,result)=>{
      let uid = req.session.user_id? req.session.user_id: 0;
      connection.query('SELECT * FROM user',(error,users)=>{
        if(uid === 0){
          var shop = 'SELECT account_img FROM shop'
        }else{
          var shop = 'SELECT account_img FROM shop WHERE user_id = '+uid+'';
        }
        
         connection.query(shop,(error,shops)=>{
          if(error){
            console.log('ERROR.SELECT_DB: ', error);
            throw error;
        }
        // res.renderで指定ファイルの画面表示させる 
        res.render('flowerEdit.ejs',{item:result[0],sitems:shops});

      })
      })
    })
  }

  //flowers Ok
  exports.flowers =  (req, res) => {
    var sql = 'SELECT S.name AS shopname, S.location AS basyo, F.id, F.user_id, F.name, F.image, F.price, F.feature, F.tag, F.text,ifnull(U.name, \'名無し\') AS uname, DATE_FORMAT(F.created_at, \'%Y年%m月%d日 %k時%i分%s秒\') AS created_at FROM flower F LEFT OUTER JOIN user U ON F.user_id = U.user_id JOIN shop S ON F.user_id = S.user_id ORDER BY F.created_at DESC'; 
    connection.query(sql,(error,results)=>{
      let uid = req.session.user_id? req.session.user_id: 0;
      connection.query('SELECT * FROM user',(error,users)=>{
        if(uid === 0){
          var shop = 'SELECT account_img FROM shop'
        }else{
          var shop = 'SELECT account_img FROM shop WHERE user_id = '+uid+'';
        }
        
         connection.query(shop,(error,shops)=>{
          if(error){
            console.log('ERROR.SELECT_DB: ', error);
            throw error;
        }
        // res.renderで指定ファイルの画面表示させる 
        res.render('flowers.ejs',{items:results,sitems:shops});

      })
      })
      })
  }

  //flowerUpdate Ok
  exports.flowerUpdate = (req,res)=>{
    var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
      connection.query('UPDATE flower SET name = ?, price = ?, feature = ?, tag = ?, text = ? , created_at = ? WHERE id = ?',[req.body.name, req.body.price, req.body.feature, req.body.tag, req.body.text, createdAt, req.params.id],function (error, result) {  
        if(error){
          console.log('ERROR.SELECT_DB: ', error);
          throw error;
      }
          res.redirect('/frege');
        });
  }

  //frege Ok
  exports.frege = (req, res) => {
    var userId = req.session.user_id? req.session.user_id: 0;
    var sql = 'SELECT F.id, F.user_id, F.name, F.image, F.price, F.feature, F.tag, F.text,ifnull(U.name, \'名無し\') AS uname, DATE_FORMAT(F.created_at, \'%Y年%m月%d日 %k時%i分%s秒\') AS created_at FROM flower F LEFT OUTER JOIN user U ON F.user_id = U.user_id WHERE F.user_id = ' + userId + '  ORDER BY F.created_at DESC'; // 変更
    //sqlのSELECT文内のカラム(user_idやimageなど）の順番はテーブル内の順番と異なっていても機能する。
    connection.query(sql,(error,results)=>{
      let uid = req.session.user_id? req.session.user_id: 0;
      connection.query('SELECT * FROM user',(error,users)=>{
        if(uid === 0){
          var shop = 'SELECT account_img FROM shop'
        }else{
          var shop = 'SELECT account_img FROM shop WHERE user_id = '+uid+'';
        }
        
         connection.query(shop,(error,shops)=>{
          if(error){
            console.log('ERROR.SELECT_DB: ', error);
            throw error;
        }
        // res.renderで指定ファイルの画面表示させる 
        res.render('frege.ejs',{items:results,sitems:shops});
      })
      })
      })
  }

  //f_success
  exports.f_success =  (req, res) => {
        res.render('f_success.ejs')
   
  }

  //f_error
  exports.f_error =  (req, res) => {
        res.render('f_error.ejs')

  }