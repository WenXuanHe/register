var redis = require("redis");
var bcrypt = require("bcryptjs");
var db = redis.createClient();

// redis 链接错误
db.on("error", function(error) {
    console.log(error);
});

/////把数据放到User上
function User(obj){
	for(var key in obj){
		this[key] = obj[key];
	}
}
////给User添加一个属性是函数
User.getByName = function(name, fn){
		////根据用户名称查询用户id
		 User.getID(name, function(err, id){
		 	if (err) return fn(err);
		 	if(id == null){
		 		return fn(null, { id:false,message:"没有此账号，请先注册再登陆网页"});
			}
			User.get(id, fn);
		 });
	};
////根据用户名称查询用户id
/// user:id 为键名这个只能获取user内的id属性的值
User.getID = function(name, fn){
	db.get("user:id:"+name, fn);
};
User.get = function(id, fn){
	////使用 hgetall 获取散列所有字段数据：
	////db.hgetall('repo:1').then(function(data){});
	////通过id获取所有的散列数据
	db.hgetall('user:'+ id, function(err, data){
		if (err) return fn(err);
		fn(null, new User(data));
	});
};
////构造实例函数才能用此方法
User.prototype.save=function(fn){
    if(this.id){
		this.update(fn);
	}else{
		var user = this;
		////Redis INCR命令用于由一个递增key的整数值。如果该key不存在，
		////它被设置为0执行操作之前。如果key包含了错误类型的值或包含不能被表示为整数，字符串，
		////则返回错误。该操作被限制为64位带符号整数。
		////创建唯一id   此处用来创建一个唯一id值
		 db.incr("user:ids", function(err, id){
		 	if(err) return fn(err);
		 	////保存id值
		 	user.id=id;
		 	user.hashPassWord(function(err){
                if(err) return fn(err);
                 user.update(fn);
             });
		 });
	}
};

User.prototype.hashPassWord = function(fn){
    var user = this;
    bcrypt.genSalt(12, function(err, salt){
		user.salt = salt;
        bcrypt.hash(user.pass, salt, function(err, hash){
            if(err) return fn(err);
            user.pass = hash;
            fn();
        });
    });
};

User.prototype.update= function(fn){
	var user = this;
	var id = user.id;
	db.set("user:id:"+ user.name, id, function(err){
        if(err) return fn(err);
		db.hmset("user:"+id, user, function(err){
			fn(err);
		});
	});
	// var id = user.name;
	// db.hmset("user:"+id, user, function(err){
	// 	fn(err);
	// });
};

User.authortich = function(name, pass, fn){
	User.getByName(name, function(err, data){
		 if(err) return fn(err);
		 if(!data.id){
			 return fn(null, data);
		 }
		 bcrypt.hash(pass, data.salt, function(err, hash){
			  if(err) return fn(err);
			  if(hash == data.pass){///匹配成功
				  return fn(null, data);
			  }
			  ////密码无效
			  fn(null, {id:false, message:"账号密码错误"});
		 });
	})
}
module.exports = User;