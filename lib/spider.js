var fs = require('fs');
var path = require("path");
var events = require("events");//EventEmitter通过events模块来访问
var util = require("util");

var base = require('./base');
var cache = require('./cache'); //数据的存储，比较和读取
var page = require('./page');   //页面类，完成一个页面的解析和保存及整个生命周期
var url = require('./url');     //地址处理类，处理地址

/*
 * 主类
 * 可以启动及停止
 *
 * 
 */


function spider (opt) {
	events.EventEmitter.call(this);

	this.option = opt;
	this.page = new page(opt); //初始化页面

	this.completes = 0; //完成的数量
	this.errors = 0; //出错的数量


	this.state = true; //状态，当前是开启还是关闭状态
	this.maxConnections = 10; //最大同时下载的数量



	//初始化缓存数据
	var self = this, def = opt.default || [], f  = JSON.parse(fs.readFileSync(path.join(__dirname, '/data.json'), 'utf-8'));
	f.forEach(function (n, i) {
		cache.add(url(n));
	});
 	def.forEach(function (n, i) {
 		var d = url(n);
 		//不存在的才增加
 		if (!cache.getEqual(d)) { cache.add(d); }
 	});
}
util.inherits(spider, events.EventEmitter); //使这个类继承EventEmitter  

//抓取一个元素
spider.prototype.catch = function (node, fn) {
	if (!node) { fn(); return; }
	var self = this, P = this.page;
	node.get(function (err, file) {
		if (err) {
			node.status = -1;
			fn(); return;
		}
		P.setData(node, file);
		self.emit('data', P);
		//解析文件获取地址
		var urls = P.parse();
		self.emit('parse', urls);
		//将地址保存进节点
		if (urls.length > 0) {
			cache.add(urls).save(function () {
				P.save(fn);
			});
		} else {
			P.save(fn);
		}
	});
}

spider.prototype.end = function () {
	var self = this;
	cache.save(function () {
		self.emit('end');
	});
}

//停止
spider.prototype.stop = function () {
	this.emit('stop');
}

//开始
spider.prototype.start = function () {
	this.emit('start');
	var self = this;
	function go () {
		var node = cache.getNext() || cache.getNext(1) || cache.getNext(-1);
		if (!node) { self.end(); return; }
		self.catch(node, go);
	}
	go();
}

module.exports = function (opt) {
	return new spider(opt);
}