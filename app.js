/**
 * 获取一个网站
 * 需要注意的主要事项
 * 资源文件的抓取，抓取目标站和所有关联站点的
 * 页面文件抓取，只取目标站点的
 * 需要清理htm文件中所有多余代码，并将后缀名修改为html
 * 需要清理html文件中所有的连接地址，绝对改相对
 * 所有的资源按照相对路径保存
 * 所有带后缀参数的地址需要静态化处理为页面，参数模式可以配置，主要解决检索结果等问题
 * 抓取页面需要归档保存状态，保证断链或故障之后继续 
 * **可抓取数据存档
 * ---------------------
 * 需要数据存档的有：
 * 1、文件存档
 * 2、链接地址存档，链接地址需要修改路径，同时修改路径名称，并备份替换路径
 * 3、资源地址存档，资源
 *
 *
 * ---------------------
 * 资源引用
 * LevelDB     这个比较牛，以太坊就用的这个
 * nedb        js数据库
 * sqlite3     数据存储
 * jsdom       页面解析
 * request     网络抓取
 * cheerio     页面解析抓取
 * nightmare   网络抓取
 *
 *---------------------
 *相似项目
 *node-crawler
 * 
 */

var http = require("http");
var fs = require("fs");
var spider = require('./lib/spider');

var opt = {
	host: 'www.cubancigarwebsite.com',
	//host: 'www.wanmei.com',
	saveDir: '../webSite/',
	types: ['aspx'], //需要转化为html的后缀名
	//default: ['http://www.wanmei.com/index.htm'],
	//default: ['http://www.cubancigarwebsite.com/default.aspx', 'http://www.cubancigarwebsite.com/css/ccw.css'], //入口地址
	default: ['http://www.cubancigarwebsite.com/default.aspx', 'http://www.cubancigarwebsite.com/list.aspx?&includeimages=False&sortorder=noorder'], //入口地址
	actPage: {
		'name': {}
	} //动态页面 
}


var sp = spider(opt);
sp.on('end', function () {
	console.log('完成了');
});

sp.on('data', function (page) {
	//清理html页面的三条杠注释
	if (page.url.type[0] == 'text' && page.url.type[1] == 'html') {
		page.file = page.file.replace(/\<\!---([\s\S]*?)---\>/gmi, ' ');
	}


});


sp.start();