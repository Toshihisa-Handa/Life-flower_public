const connection = require('../mysqlConnection');//db接続読み取り
const moment = require('moment');//日付取得用パッケージ読み込み
const multer = require('multer');//画像取得ようパッケージ（multer）読み込み


//d_insert Ok
exports.d_insert = (req, res) => {
    res.sendFile(path.join(__dirname, 'views/drege.ejs'))
  }


//d_search Ok
exports.d_search = (req, res) => {
    let kensaku = req.query.kensaku;
      var sql = "SELECT S.name AS shopname, S.location AS basyo, D.id, D.user_id, D.title, D.image, D.tag, D.text,ifnull(U.name, \'名無し\') AS name, DATE_FORMAT(D.created_at, \'%Y年%m月%d日 %k時%i分%s秒\') AS created_at FROM diary D LEFT OUTER JOIN user U ON D.user_id = U.user_id JOIN shop S ON D.user_id = S.user_id WHERE S.name LIKE ? OR S.location LIKE ? OR D.title LIKE ? OR D.tag LIKE ? OR D.text LIKE ? ORDER BY D.created_at DESC"; // 変更
        connection.query(sql,["%"+kensaku+"%","%"+kensaku+"%","%"+kensaku+"%","%"+kensaku+"%","%"+kensaku+"%"],(error,results)=>{
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
            res.render('diarys.ejs',{items:results,sitems:shops});

          })
          })
        })
    }

//diary.js Ok
exports.diary = (req, res)=>{
    var diaryId = req.params.id;
    var sql = 'SELECT S.name AS shopname, D.id, D.user_id, D.image, D.title, D.tag, D.text FROM diary AS D LEFT JOIN shop S ON D.user_id = S.user_id WHERE D.id = ?';
    var dcsql = 'SELECT Dc.dcomment, ifnull(U.name, \'名無し\') AS user_name, DATE_FORMAT(Dc.created_at, \'%Y/%m/%d  %k:%i\') AS created_at FROM dcomment Dc LEFT OUTER JOIN user U ON Dc.user_id = U.user_id WHERE Dc.diary_id = ' + diaryId + ' ORDER BY Dc.created_at ASC'; 
    connection.query(sql,[req.params.id],(error,result)=>{
      connection.query(dcsql,(error, dcomment)=>{
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
          res.render('diary.ejs',{
            item:result[0],
            ditems:dcomment,
            sitems:shops
          });
        })
        })
     })
    })
   }


//dcomment_post Ok
exports.dcomment_post =  (req, res) => {
  var userId = req.session.user_id? req.session.user_id: 0; 
  var diaryId = req.params.diary_id;
  var dcomment = req.body.dcomment;
  var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  var sql = 'INSERT INTO dcomment (diary_id, dcomment, created_at, user_id) VALUES (?,?,?,?)';
  connection.query(sql,[diaryId, dcomment, createdAt, userId],(error,results)=>{
    if(error){
      console.log('ERROR.SELECT_DB: ', error);
      throw error;
  }
    res.redirect('/diary/' + diaryId);
    console.log('insert=============')
    console.log(diaryId)
  })
}

//diaryDelete Ok
exports.diaryDelete = (req,res)=>{
    connection.query('DELETE FROM diary WHERE id = ?',[req.params.id],(error,results)=>{
      if(error){
        console.log('ERROR.SELECT_DB: ', error);
        throw error;
    }
      res.redirect('/drege')
    })
  }


//dearyEdit Ok
exports.diaryEdit = (req, res)=>{
    connection.query('SELECT * FROM diary WHERE id = ?',[req.params.id],(error,result)=>{
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
        res.render('diaryEdit.ejs',{item:result[0],sitems:shops});

      })
      })
    })
  }

//diarys Ok
exports.diarys = (req, res) => {
    var sql = 'SELECT S.name AS shopname, S.location AS basyo, D.id, D.user_id, D.title, D.image, D.tag, D.text,ifnull(U.name, \'名無し\') AS name, DATE_FORMAT(D.created_at, \'%Y年%m月%d日 %k時%i分%s秒\') AS created_at FROM diary D LEFT OUTER JOIN user U ON D.user_id = U.user_id JOIN shop S ON D.user_id = S.user_id  ORDER BY D.created_at DESC'; // 変更
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
          res.render('diarys.ejs',{items:results,sitems:shops});

        })
        })
      })
  }

//diaryUpdate Ok
exports.diaryUpdate =(req,res)=>{
    var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
      connection.query('UPDATE diary SET title = ?, tag = ?, text = ? , created_at = ? WHERE id = ?',[req.body.title, req.body.tag, req.body.text, createdAt, req.params.id],function (error, result) {  
        if(error){
          console.log('ERROR.SELECT_DB: ', error);
          throw error;
      }
          res.redirect('/drege');
        });
  }

//drege Ok
exports.drege =  (req, res) => {
    var userId = req.session.user_id? req.session.user_id: 0;
    var sql = 'SELECT D.id, D.user_id, D.title, D.image, D.tag, D.text,ifnull(U.name, \'名無し\') AS name, DATE_FORMAT(D.created_at, \'%Y年%m月%d日 %k時%i分%s秒\') AS created_at FROM diary D LEFT OUTER JOIN user U ON D.user_id = U.user_id WHERE D.user_id = ' + userId + '  ORDER BY D.created_at DESC'; // 変更
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
        res.render('drege.ejs',{items:results,sitems:shops});
      })
      })
      })
  }



