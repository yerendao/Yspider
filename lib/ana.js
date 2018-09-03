/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-08-11 10:16:47
 * @version $Id$
 */
var fs = require('fs');
var url = require("url");
var path = require("path");


var list = JSON.parse(fs.readFileSync(path.join(__dirname, '/data.json'), 'utf-8'));
console.log('共'+list.length + '文件');

var yes = 0, no = 0, err = 0, dd = 0;
list.forEach(function (n) {
	if (n.href == 'http://www.cubancigarwebsite.com/list.aspx?&includeimages=False&sortorder=noorder') {
		console.log(n);
	}
	if (n.status == 0) { no++; }
	if (n.status == 3) { yes++; }
	if (n.status == -1) { err++; }
	if (n.status == 1) { dd++; }
});

console.log('完成:' + yes);
console.log('未完成:' + no);
console.log('异常:' + err);
console.log('执行中断:' + dd);