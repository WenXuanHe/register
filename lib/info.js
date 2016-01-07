var redis = require("redis");
var client = redis.createClient();

////构造函数
var info = function(obj){
	for(var key in obj){
		this[key] = obj[key];
	}
}

////把数据保存在一个list列表中
info.prototype.save = function(userName, fn){
	var jsonData = JSON.stringify(this);
	client.lpush(userName, jsonData, function(err){
		if(err) return fn(err);
		fn();
	});
}

////获取这个list中的一部分消息
info.getRange = function(userName, from, to, fn){
	client.lrange(userName, from, to, function(err, datas){
		if(err) return fn(err);
		var dataList = [];
		if(datas.length >= 1){
			datas.forEach(function(data){
				dataList.push(JSON.parse(data));
			});
			fn(null, dataList);
		}else{
			fn(null, "there is no data");
		}
		
	});
}
module.exports = info;
