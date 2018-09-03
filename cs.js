/**
 * 测试一下
 * @authors Your Name (you@example.org)
 * @date    2016-08-25 14:41:45
 * @version $Id$
 */
var http = require("http");
var fs = require("fs");
var U = require("./lib/url");

var html =  fs.readFileSync('webSite/brand_6Ky9e5pI.html', {encoding:'utf-8'});

var a = [];
var aRegex = [
    /<a.*?href\s*=\s*['"]([^"']*)['"][^>]*>/gmi,
    /<script.*?src\s*=\s*['"]([^"']*)['"][^>]*>/gmi,
    /<link.*?href\s*=\s*['"]([^"']*)['"][^>]*>/gmi,
    /<img.*?src\s*=\s*['"]([^"']*)['"][^>]*>/gmi,
    /url\s*\(\s*[\\'"]\s*([^\(\)]+)\s*[\\'"]\s*\)/gmi, //CSS背景
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
a.forEach(function (n, i) {
	console.log(n)
	var url = U(n);
	if (url.pix == 'jpg') {
		//console.log(n);
	}
});


