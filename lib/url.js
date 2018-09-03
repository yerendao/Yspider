/**
 * url 处理类
 * 处理url
 * 传递当前页面地址和连接地址
 * 获得对应的存储地址，
 * 1、解析当前地址，得到名称，路径、类型、域，参数等信息
 * 2、对文件进行重命名，命名规则可自定义，最好启用插件系统
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-07-20 15:42:03
 * @version $Id$
 */

var http = require("http");
var fs = require('fs');
var url = require("url");
var path = require("path");

var base = require('./base');
var config = require('./config');

var types = ['asp', 'aspx', 'php', 'jsp'].concat(config.types || []); 

var U = function (href, y) {
	var obj;
	if (typeof href == 'string') {
		var u1 = base.parseUrl(href);

		var reName = '', fix = '';
		if (!u1.directory) { reName = 'index.html'; }

		//资源文件的地址处理还没解决
		if (!u1.file) {
			//有些地址不带详细页面，mvc或者reself格式
			reName = 'index.html';
			if (u1.query) { reName = base.createID(8) + '_' + reName; }
		} else {
			var fis = u1.file.split('.'), id = base.createID(8);
			fix = fis.pop();

			reName = fis.join('.');
			if (u1.query) { reName +=  '_' + base.createID(8); }
			if (base.inArray(types, fix) > -1) {
				reName += '.html';
			} else {
				reName += '.'+fix;
			}
		}
		obj = {};
		obj.href = href;
		obj.fix = fix; //不一定有，
		obj.dir = u1.directory; //目标文件存储地址
		obj.path = u1.path;
		obj.host = u1.host;
		obj.anchor = u1.anchor;
		obj.query = u1.query;
		obj.queryKey = u1.queryKey;
		obj.name = u1.file; //原始文件名
		obj.reName = reName;

		obj.status = 0;
	} else {
		obj = href;
	}

	this.host = obj.host;
	this.href = obj.href;
	this.fix = obj.fix; //目标文件的类型
	this.type = ''; //文件类型
	this.dir = obj.dir; //目标文件存储地址
	this.path = obj.path; //目标路径
	this.anchor = obj.anchor; //锚点

	this.query = obj.query;
	this.queryKey = obj.queryKey;

	this.name = obj.name;

	this.reName = obj.reName; //目标文件名原始名称
	this.status = obj.status; //状态 0，未完成，  1：正在执行， 3：完成  -1：异常
}

//解析地址
U.prototype.parse = function () {
	return base.parseUrl(this.href);
}

//是否有效地址
U.prototype.isValid = function(){
	var href = this.href;
    return 
    	!href ||
    	href === '/' ||
    	href.charAt(0) === '#' ||
    	href.substring(0,4) === "data" ||
    	href.indexOf("javascript") > -1 ||
    	href.indexOf("mailto") > -1 ||
    	href.charAt(0) === '#'
    	? false : true;
};

//是否相同
U.prototype.is = function (u) {
	if (typeof u == 'string') {
		return u == this.endUrl;
	}

	if (u instanceof U) {
		return u.endUrl == this.endUrl;
	}
}

//是否主站
U.prototype.isMain = function () {

}

//设置别名
U.prototype.reName = function () {

}

//获取相对地址
U.prototype.getRelativeUrl = function (o, name) {
	var aUrl = this.path;
	var bUrl = base.isObject(o) ? o.path : o;

	var ar = aUrl.split('/').filter(function (n) { return n; });
    var br = bUrl.split('/').filter(function (n) { return n; });

    if (name) { br.splice(-1, 1, name); }

    var x, d = '';
    ar.forEach(function (a, i) {
        if (typeof x == 'number') { d += '../'; return; }
        if (a != br[i]) { x = i; d += ''; }
    });
    return d + br.slice(x).join('/');
}

//获取名称, is为true则去掉seach
U.prototype.getName = function (is) {
	var name = this.reName || this.name;
	if (!is && this.query) { name = name + '?' +this.query; }
	if (!is && this.anchor) { name = name + '#' + this.anchor; }
	return name;
}

//执行地址
//完成地址下载和存储
//如果是资源文件，直接保存，如果是文本文件，直接输出
U.prototype.get = function (fn) {
	var self = this;
	this.status = 1;

	console.log(this.href)
	http.get(this.href, function(res){
		//解析文件类型
		var type = res.headers["content-type"];
		if (type) {
			var aType = type.split('/');
		    aType.forEach(function(s,i,a){
		        a[i] = s.toLowerCase();
		    });

		    if(aType[1] && (aType[1].indexOf(';') > -1)){
		        var aTmp = aType[1].split(';');
		        aType[1] = aTmp[0];
		        for(var i = 1; i < aTmp.length; i++){
		            if(aTmp[i] && (aTmp[i].indexOf("charset") > -1)){
		                aTmp2 = aTmp[i].split('=');
		                aType[2] = aTmp2[1] ? aTmp2[1].replace(/^\s+|\s+$/,'').replace('-','').toLowerCase() : '';
		            }
		        }
		    }
		    if((["image"]).indexOf(aType[0]) > -1){
		        aType[2] = "binary";
		    }

		    //解决部分图片标识为html/text
		    if (self.fix == 'jpg') { aType[2] = "binary"; }

		    self.type = aType;
		}

	    var data = "", ty = '', ty2 = self.type[2];
	    ty = (ty2 == 'usascii' ? 'ascii' : ty2) || "utf8";

	    res.setEncoding(ty); //一定要设置response的编码为binary否则会下载下来的图片打不开
	    res.on("data", function(chunk){ data += chunk; });
	    res.on("end", function(){
	    	fn(null, data);
	    });
	    res.on('error', function () {
	    	console.log('搞毛，出错了');
	    })
	}).on('error', function(e) { 
		console.log("Got error: " + e.message);
		fn(e);
	});
}


module.exports = function (u, href) {
	return new U(u, href);
}
