const connection = require('../mysqlConnection');
const multer = require('multer');//画像取得ようパッケージ（multer）読み込み
const moment = require('moment');//日付取得用パッケージ読み込み




//map Ok
  exports.map = (req, res)=>{
    var userId = req.session.user_id? req.session.user_id: 0;
    var sql = 'SELECT M.lat,M.lon,M.title,M.pincolor,M.description, M.image, S.id as sid from map M join shop S on M.user_id = S.user_id'
    connection.query(sql,[req.params.id],(error,results)=>{
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
        res.render('map.ejs',{items:results,sitems:shops});
      })
      })
    })
  }
  

//mapinfo Ok
exports.mapinfo = (req, res) => {
    var userId = req.session.user_id? req.session.user_id: 0;
    // var sql = 'SELECT M.id, M.lat, M.lon, M.title, M.pincolor, M.description, M.image,ifnull(U.name, \'名無し\') AS uname, DATE_FORMAT(M.created_at, \'%Y年%m月%d日 %k時%i分%s秒\') AS created_at, M.user_id,FROM map M LEFT OUTER JOIN user U ON M.user_id = U.user_id WHERE M.user_id = ' + userId + '  ORDER BY M.created_at DESC'; 
    var sql ='SELECT * FROM map where user_id = '+userId+''
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
                    res.render('mapinfo.ejs',{items:results,sitems:shops});
                  })
                  })
      })
  }



  //mapEdit Ok
  exports.mapEdit = (req, res)=>{
    connection.query('SELECT * FROM map WHERE id = ?',[req.params.id],(error,result)=>{
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
        res.render('mapEdit.ejs',{item:result[0],sitems:shops});
        console.log(result[0])
      })
      })
    })
  }

  //mapUpdate Ok
  exports.mapUpdate = (req,res)=>{
    var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
      connection.query('UPDATE map SET lat = ?, lon = ?, title = ?, pincolor = ?, description = ? , created_at = ? WHERE id = ?',[req.body.lat, req.body.lon, req.body.maptitle, req.body.pincolor, req.body.description, createdAt, req.params.id],function (error, result) {  
        if(error){
          console.log('ERROR.SELECT_DB: ', error);
          throw error;
      }
          res.redirect('/mapinfo');
        });
  }

 
