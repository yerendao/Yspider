/**
 * 节点，或者说数据存储
 * 任何一个元素或者一个页面即一个节点
 * @authors Your Name (you@example.org)
 * @date    2016-07-21 10:40:33
 * @version $Id$
 */

var base = require('./base');
var config = require('./config');
var fs = require('fs');
var path = require("path");
var url = require('./url');

var cache = function () {
	this.list = []; //节点组
}

//取下一个需要处理的对象
cache.prototype.getNext = function (sta) {
	var i = 0, l = this.list.length, node;
	for (; i < l; i++) {
		node = this.list[i];
		if (node.status == (sta || 0)) {
			return node;
		}
	}
	return null;
}

//www.wanmei.com 和 www.wanmei.com 和 www.wanmei.com/index.html 是否相同？
cache.prototype.getEqual = function (u) {
	var i = 0, l = this.list.length, one;
	for (; i < l; i++) {
		one = this.list[i];
		//完全相等
		if (u.href == one.href) { return one; }
		if (u.host == one.host && u.path == one.path && base.isEqual(one, u)) {
			return one;
		}
	}
	return null;
}

//判断节点是否已经存在了
cache.prototype.isIn = function (u) {
	return this.list.some(function (n) {
		return u == n;
	});
}

//将数据保存
cache.prototype.save = function (fn) {
	var str = JSON.stringify(this.list);
	fs.writeFile(path.join(__dirname, '/data.json'), str, function (err) {
		if (err) { console.log(err); fn(err); return; };
		fn(err);
	});
}

//增加一个节点
cache.prototype.add = function (u) {
	if (base.isArray(u)) {
		var self = this;
		u.forEach(function (n, i) {
			if (!self.isIn(n)) {
				self.list.push(n);
			}
		});
	}
	if (base.isObject(u)) {
		if (!this.isIn(u)) {
			this.list.push(u);
		}
	}
	return this;
}

//删除一个节点
cache.prototype.del = function (u) {
	var i = 0, l = this.list.length, node;
	for (; i < l; i++) {
		node = this.list[i];
		if (node == u) {
			this.list.splice(i, 1);
			break;
		}
	}
	return this;
}

module.exports = new cache();