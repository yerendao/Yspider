var fs = require('fs');
var U = require("./lib/url");
var P = require("path");

//读取文件夹
function redDir(path) {
	var re = {};
	var red = function (path) {
		var files = fs.readdirSync(path);
		files.forEach(function(item) {
			var temPath = path + '/' + item;
			var stats = fs.statSync(temPath);
			 if (stats.isDirectory()) {
            	red(temPath);
            } else {
            	var mod = U(temPath.replace('%3F', '?'));
            	if (mod.fix == 'html') {
            		var file =  fs.readFileSync(temPath, {encoding:'utf-8'});
            		
            		
            		//fs.writeFileSync(temPath, file, {encoding:'utf-8'});
            	}
            }
		});
	}
	red(path);
	console.log('处理完成！')
}

redDir('./webSite');