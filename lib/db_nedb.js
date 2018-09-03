var ND = require('nedb');

// var obj = {
// 	"host":"www.cubancigarwebsite.com",
// 	"href":"http://www.cubancigarwebsite.com/default.aspx",
// 	"fix":"aspx",
// 	"type":["text","html","utf8"],
// 	"dir":"/",
// 	"path":"/default.aspx",
// 	"anchor":"",
// 	"query":"",
// 	"queryKey":{},
// 	"name":"default.aspx",
// 	"reName":"default.html",
// 	"status":0
// }

// status : 0 未开始，1 成功， -1 异常

class H {
	constructor() {
		this.total = 0;
		this.db = new ND({filename: "db/hosts.db", autoload: true });
	}

	list () {

	}
}

class D {
	constructor(host, dbname) {
		this.host = host;
		this.db = new ND({filename: "db/" + dbname, autoload: true });
		this.total = 0;   //总量
		this.finished = 0; //完成的
		this.unfinished = 0; //未完成的
	}

	//新增一个数据
	add (d, fn) {
		this.db.insert(d, fn);
	}

	//删除一条信息
	del (id, fn, ) {
		db.remove({ _id: di}, {}, fn);
	}

	//清空数据库
	clear (fn) {

	}

	//下一条合法的有待处理的数据
	next(fn) {
		db.findOne({status: 0}, {}, fn);
	}

	//根据id设置状态
	stat (id, sta, fn) {
		db.findOne({ _id: id }, function (err, doc) {
			if (err) {
				fn(err);
			} else {
				db.update({_id: id}, {status: sta}, {}, fn);
			}
		});
	}

	//是否存在，检测一个url是否存在，如果存在返回数据，否则，返回空
	isIn (url, fn) {
		db.findOne({href: url}, {}, fn);
	}
}


//记录表
let dbs = {}
function newDB(name) {
	if (!dbs[name]) {
		dbs[name] = {}
	}
	return function (host) {
		let ds = dbs[name];
		if (!ds[host]) {
			ds[host] = new D(host, host.replace('.', '_') + '_'+name+'.db');
		}
		return ds[host];
	}
}

exports.hosts = function () {
	return new H();
}
exports.pages = newDB('page')
exports.res = newDB('res');
