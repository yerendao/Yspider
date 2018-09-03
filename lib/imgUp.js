/**
 * 检测未下载成功的img图片
 * @authors Your Name (you@example.org)
 * @date    2016-08-25 10:25:51
 * @version $Id$
 */

var fs = require('fs');
var path = require("path");
var events = require("events");//EventEmitter通过events模块来访问
var util = require("util");
var mkdir = require('mkdirp');


var base = require('./base');
var cache = require('./cache');
var page = require('./page');
var URL = require('./url');



//判断一个文件是否存在
function isIn(url) {
	var dir = path.join(__dirname, ('../webSite/' +　url.dir).replace('//', '/'));
	var name = url.reName || url.name;
	var ph = path.join(dir, name);
	return fs.existsSync(ph);
}


//初始化缓存数据
var err = 0, yes = 0, list = [], f  = JSON.parse(fs.readFileSync(path.join(__dirname, '/data.json'), 'utf-8'));
f.forEach(function (n, i) {
	var u = URL(n);

	var dir = path.join(__dirname, ('../webSite/' + u.dir).replace('//', '/'));
	var name = u.reName || u.name;
	var ph = path.join(dir, name);


	if (u.fix == 'jpg' && isIn(u)) {
		var file = fs.statSync(ph);
		//找出空字节的图片
		if (file.size <= 0) {
			err ++;
			cache.add(u);
		}
	}
});
console.log('初始化完成');
console.log('共:' + cache.list.length + '条')
console.log('错误' + err)
console.log('正确' + yes)
