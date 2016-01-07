var express = require('express');
var router = express.Router();
var Info = require('../lib/info.js');

router.get('/saveInfo', function(req, res, next) {
    res.locals.removeMessage();
    res.render('information/saveInfo', { title: '请输入你想输入的信息'});
});

router.get('/showInfo', function(req, res, next) {
    res.locals.removeMessage();
    res.render('information/showInfo', { title: 'show', dataList:""});
});

router.post('/showInfo', function(req, res, next) {
    var from = req.body.from;
    var to = req.body.to;
    var userName = req.user.name;
    Info.getRange(userName, parseInt(from, 10), parseInt(to, 10), function(err, dataList){
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

module.exports = router;