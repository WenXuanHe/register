var express = require("express");
var res = express.response;
res.message = function(msg, type){
	type=type|| "info";
	var sess = this.req.session;
	sess.message = sess.message || [];
	sess.message.push({type:type, string:msg});
}

////把错误信息添加到session中
res.error = function(msg){
	return this.message(msg, "error");
}

////取到session中的数据，展示到页面
module.exports = function(req, res, next){
	res.locals.messages = req.session.message||[];
	res.locals.removeMessage = function(){
		req.session.messages = [];
	};
	next();
}