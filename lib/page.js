/**
 * 解析一个html文件
 * 保存解析出来的资源文件，存为资源文件
 * 保存解析之后的 HTML文件，存为文件
 * 传出解析出来的 HTML链接，存入链接库
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-07-22 15:52:40
 * @version $Id$
 */

var fs = require('fs');
var mkdir = require('mkdirp');
var path = require("path");

var urlMod = require('url');
var URL = require('./url');
var cache = require('./cache');

function page(opt) {
	this.url;
	this.file;
	this.option = opt || {};
	this.saveDir = opt.saveDir || './webSite/'; //如果不配置，默认存储在webSite
}

//重置数据
page.prototype.setData = function (url, file) {
	this.url = url;
	this.file = file;
}

//获取连接
page.prototype.getUrls = function () {
	var type = this.url.type;
	//文本的css和html需要解析
	if((type[0] === "text") && ((["css","html"]).indexOf(type[1]) > -1)){
		var html = this.file;
		if(!html){ return []; }
	    var a = [];
	    var aRegex = [
	    	/<a.*?href\s*=\s*['"]([^"']*)['"][^>]*>/gmi,
		    /<script.*?src\s*=\s*['"]([^"']*)['"][^>]*>/gmi,
		    /<link.*?href\s*=\s*['"]([^"']*)['"][^>]*>/gmi,
		    /<img.*?src\s*=\s*['"]([^"']*)['"][^>]*>/gmi,
		    /url\s*\(\s*[\\'"]\s*([^\(\)]+)\s*[\\'"]\s*\)/gmi //CSS背景
	    ];
	    html = html.replace(/[\n\r\t]/gm,'');
	    
	    for(var i = 0; i < aRegex.length; i++){
	        do {
	            var aRet = aRegex[i].exec(html);
	            if(aRet){
	            	a.push(decodeURIComponent(aRet[1].trim()));
	            }
	        } while (aRet);
	    }
	    return a;
	}
	return [];
}


//所有的绝对地址修改相对地址，并完成页面中替换
//含绝对地址，/开头地址
// 后准修改为html
page.prototype.parse = function () {
	var type = this.url.type, re = [], self = this, urls = [];


	//过滤不符合要求的地址
	this.getUrls().forEach(function (href) {
		if (!href || href === '/') { return; }
		function gh (l) { return href.substring(0, l); }
		if (gh(1) == '#' || gh(4) == 'data' || gh(6) == 'mailto' || gh(10) == 'javascript') { return; }
		urls.push(href);
	});
	urls.forEach(function (n, i) {
		var url = n, reUrl;
		//url = url.replace('%3F', '?'); //转义？
		url = url.split('?')[0].indexOf('/') == -1  ? './' + url : url; //如果地址中没有任何/,parseUrl方法就无法解析，需要在地址前面加上 ./

		//www.wanmei.com 和 www.wanmei.com/ 和 www.wanmei.com/index.html

		var U = urlMod.parse(url);
		if (U.host) {
			//外站数据不抓取
			if (U.host != self.option.host) { return; }
			reUrl = URL(url);
		} else {
			var toUrl = urlMod.resolve(self.url.href, url); //取绝对地址
			reUrl = URL(toUrl);
		}

		//获取缓存相同的记录
		var eq = cache.getEqual(reUrl), toU =  eq ? eq.path : reUrl.path, na = eq ? eq.getName() : reUrl.getName();

		//获取替换页面地址
		var ru = self.url.getRelativeUrl(toU, na);
		//var ru = base.getRelativeUrl(self.url.path, toU , na);

		if (ru != n) { self.replace(n, ru); } //不一样的才替换
		
		//加入缓存
		if (!eq) { re.push(reUrl); }

		//这里需要替换
		//是否html或者htm静态文件
		//如果是动态文件或者无后缀名动态地址，需要转换临时htm地址				
		if (reUrl.seach) {  }
	});
	return re;
}


//替换页面中的类容
page.prototype.replace = function (sc, re) {
	//console.log(sc + '替换' + re);
	this.file = this.file.replace(new RegExp(sc
        .replace(/\./g,'\\.')
        .replace(/\?/g,'\\?')
        .replace(/\*/g,'\\*')
        .replace(/\+/g,'\\+')
        .replace(/\$/g,'\\$')
        .replace(/\^/g,'\\^')
        .replace(/\[/g,'\\[')
        .replace(/\]/g,'\\]')
        .replace(/\(/g,'\\(')
        .replace(/\)/g,'\\)')
        .replace(/\{/g,'\\{')
        .replace(/\}/g,'\\}')
        .replace(/\|/g,'\\|')
        .replace(/\//g,'\\/')
        ,"gm"), re);
}


//保存节点数据
page.prototype.save = function (fn) {
	var self = this;
	var dir = path.join(__dirname, (this.saveDir +　this.url.dir).replace('//', '/'));
	var name = this.url.reName || this.url.name;
	mkdir(dir, function (err) {
		if (err) { console.log('新建文件夹出了问题'); fn(err); }
		var type = self.url.type || [];
		fs.writeFile(path.join(dir, name), self.file,  type[2] || "utf8", function (err) {
			if (err) {
				console.log('错误:' + self.url.href);
				self.url.status = -1;
				console.log(err); return;
			}
			console.log('完成:' + self.url.href);
			self.url.status = 3;
			cache.save(fn)
		});
	});
}

module.exports = page;