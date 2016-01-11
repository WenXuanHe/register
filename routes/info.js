var express = require('express');
var router = express.Router();
var Info = require('../lib/info.js');
var url = require('url');
router.get('/saveInfo', function(req, res, next) {
    res.locals.removeMessage();
    res.render('information/saveInfo', { title: '请输入你想输入的信息'});
});

router.get('/showInfo', function(req, res, next) {
    if(url.parse(req.url).query!= null){
         showIn(req, res, next); 
    }else{
        res.locals.removeMessage();
        res.locals.page = false;
        res.render('information/showInfo', { title: 'show', dataList:""});
    }
    
});

router.post('/showInfo', function(req, res, next) {
    showIn(req, res, next);
});

router.post('/saveInfo', function(req, res, next) {
    var title = req.body.titie;
    var body = req.body.meanValue;
    var userName = req.user.name;
    if(userName == undefined){
         res.error("请重新登录");
         res.redirect("/login");
    }
    var info = new Info({
        userName:userName,
        title:title,
        body:body
    });
    info.save(userName, function(err){
         if(err) return next(err);
         res.redirect("back");
    });
});

function showIn(req, res, next){
    var userName = req.user.name;
    var pager = req.page;
    if(userName==undefined){
         res.render('information/showInfo', {
             title: 'data',
             dataList: "请先登录"
        });
    }else{
        Info.getRange(userName, pager.from, pager.to, function(err, dataList){
            if(err) return next(err);
            if( typeof(dataList) == "string" ){
                res.error(dataList);
                res.redirect("back");
            }else{
                res.render('information/showInfo', {
                title: 'data',
                dataList: dataList
                });
            }
        });
    }
}
module.exports = router;