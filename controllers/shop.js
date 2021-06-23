const connection = require('../mysqlConnection');//db接続読み取り
const moment = require('moment');//日付取得用パッケージ読み込み


//mypage Ok
exports.mypage = (req, res) => {
    var sql = 'SELECT * FROM shop'; 
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
        res.render('mypage.ejs',{items:results,sitems:shops});
      })
      })
      })
  }

//myprofile Ok
exports.myprofile = (req, res) => {
    var userId = req.session.user_id? req.session.user_id: 0;
    var sql ='SELECT * FROM shop where user_id = '+userId+''
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
        res.render('myprofile.ejs',{items:results,sitems:shops});
      })
      })
      })
  }

//myprofileEdit Ok
exports.myprofileEdit = (req, res)=>{
    connection.query('SELECT * FROM shop WHERE id = ?',[req.params.id],(error,result)=>{
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
                    res.render('myprofileEdit.ejs',{item:result[0],sitems:shops});
                  })
                  })
    })
  }


//myprofileUpdate Ok
exports.myprofileUpdate = (req,res)=>{
    var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    var sql = 'UPDATE shop SET name = ?, title = ?, account_name = ?, web = ?, email = ?, tell = ?, open = ?, close = ?, holiday = ?, location = ?, map = ?, message = ?, comment = ?, feature = ?, created_at = ? WHERE id = ?'
      connection.query(sql,[req.body.name, req.body.title, req.body.account_name, req.body.web, req.body.email, req.body.tell, req.body.open, req.body.close, req.body.holiday, req.body.location, req.body.map, req.body.message, req.body.comment, req.body.feature, createdAt, req.params.id],function (error, result) {  
        if(error){
          console.log('ERROR.SELECT_DB: ', error);
          throw error;
      }
          res.redirect('/myprofile');
        });
  }


//s_search Ok
exports.s_search = (req, res)=>{
  let kensaku = req.query.kensaku;
  var sql = "SELECT S.id, S.user_id, S.name AS shopname, S.location AS basyo, S.account_img, S.shop_img, S.close, S.open, S.feature, ifnull(U.name, \'名無し\') AS username, DATE_FORMAT(S.created_at, \'%Y年%m月%d日 %k時%i分%s秒\') AS created_at FROM shop S LEFT OUTER JOIN user U ON S.user_id = U.user_id WHERE S.name LIKE ? OR S.location LIKE ? OR S.feature LIKE ? ORDER BY S.created_at DESC"; 
   connection.query(sql,["%"+kensaku+"%","%"+kensaku+"%","%"+kensaku+"%"],(error,results)=>{
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
                    res.render('shops.ejs',{items:results,sitems:shops});

                  })
                  })
      })
  }


//shop Ok
exports.shop = (req, res)=>{
      var sql = 'SELECT D.image AS dimg, F.image AS fimg, S.id, S.user_id, S.name, S.title, S.account_name, S.web, S.email, S.tell, S.open, S.close, S.holiday, S.location, S.map, S.account_img, S.shop_img, S.img1, S.img2, S.message, S.comment, S.created_at FROM shop S LEFT JOIN diary D ON S.user_id = D.user_id LEFT JOIN flower F ON S.user_id = F.user_id WHERE S.id = ?';
      connection.query(sql,[req.params.id],(error,result)=>{
          let uid = result[0].user_id;
          var flowers = 'SELECT * FROM flower WHERE user_id = '+ uid +''
          var diarys = 'SELECT * FROM diary WHERE user_id = '+ uid +''
            connection.query(flowers,(error,flower)=>{
                connection.query(diarys,(error,diary)=>{
                  var sql = 'SELECT S.id, S.user_id, S.name AS shopname, S.location AS basyo, S.account_img, S.shop_img, S.close, S.open, S.feature, ifnull(U.name, \'名無し\') AS username, DATE_FORMAT(S.created_at, \'%Y年%m月%d日 %k時%i分%s秒\') AS created_at FROM shop S LEFT OUTER JOIN user U ON S.user_id = U.user_id  ORDER BY S.created_at DESC'; 
                  connection.query(sql,(error,results)=>{
                    if(error){
                      console.log('ERROR.SELECT_DB: ', error);
                      throw error;
                  }
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
                    res.render('shop.ejs',{fitem:flower, ditem:diary, item:result,sitems:shops});
                    })
                  })
                })
          })
        })
      })
    }

//shops Ok
exports.shops = (req, res) => {
    var sql = 'SELECT S.id, S.user_id, S.name AS shopname, S.location AS basyo, S.account_img, S.shop_img, S.close, S.holiday, S.open, S.feature, ifnull(U.name, \'名無し\') AS username, DATE_FORMAT(S.created_at, \'%Y年%m月%d日 %k時%i分%s秒\') AS created_at FROM shop S LEFT OUTER JOIN user U ON S.user_id = U.user_id  ORDER BY S.created_at DESC'; 
      connection.query(sql,(error,results)=>{
        if(error){
          console.log('ERROR.SELECT_DB: ', error);
          throw error;
      }
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
        res.render('shops.ejs',{items:results,sitems:shops}) ;
 
        })
      })
    })
  }
