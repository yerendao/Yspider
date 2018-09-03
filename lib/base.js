var request = require('request');
var fs = require('fs');


function Type(type) {
    return function (obj) {
        return Object.prototype.toString.call(obj) === "[object " + type + "]";
    };
}

var base = {};

base.isObject = Type("Object"); //是否对象
base.isString = Type("String"); //是否字符串
base.isArray = Array.isArray || Type("Array"); //是否数组
base.isFunction = Type("Function"); //是否function
base.isNumber = Type("Number"); //是否function

//判断是否需要转换的连接
/*base.isValid = function (href) {
    return !href || href === '/' || href.charAt(0) === '#' || href.substring(0,4) === "data" || href.indexOf("javascript") > -1 || href.indexOf("mailto") > -1 || href.charAt(0) === '#' ? false : true;
}*/

base.inArray = function(arr, x) {
	var l = arr.length, re = -1;
	for (var i = 0; i < l; i++) { if (arr[i] === x) { re = i; break; } }
	return re;
};

//创建随机id
base.createID = function (num) {
	num = num || 12;
　　var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijkmlnopqrstuvwxyz123456789';
　　var len = chars.length;
　　var pwd = '';
　　for (i = 0; i < num; i++) {
　　　　pwd += chars.charAt(Math.floor(Math.random() * len));
　　}
　　return pwd;
}


//解析地址
base.parseUrl = function (str) {
	var o = {
        strictMode: false,
        key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
        q:   {name:   "queryKey", parser: /(?:^|&)([^&=]*)=?([^&]*)/g },
        parser: {
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
        }
    }, m = o.parser[o.strictMode ? "strict" : "loose"].exec(str), uri = {}, i   = 14;
    while (i--) uri[o.key[i]] = m[i] || "";
    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) { if ($1) uri[o.q.name][$1] = $2; });
    return uri;
}

//解析html中的连接地址
/*base.parseHtml = function (html) {
	 if(!html){ return []; }
    var a = [];
    var aRegex = [
        /<a.*?href=['"]([^"']*)['"][^>]*>/gmi,
        /<script.*?src=['"]([^"']*)['"][^>]*>/gmi,
        /<link.*?href=['"]([^"']*)['"][^>]*>/gmi,
        /<img.*?src=['"]([^"']*)['"][^>]*>/gmi,
        /url\s*\([\\'"]*([^\(\)]+)[\\'"]*\)/gmi, //CSS背景
    ];
    html = html.replace(/[\n\r\t]/gm,'');
    for(var i = 0; i < aRegex.length; i++){
        do{
            var aRet = aRegex[i].exec(html);
            if(aRet){
                this.debug && this.oFile.save("_log/aParseUrl.log",aRet.join("\n")+"\n\n","utf8",function(){},true);
                //a.push(aRet[1].trim().replace(/^\/+/,'')); //删除/是否会产生问题
                a.push(aRet[1].trim()); 
            }
        }while(aRet);
    }
    return a;
}*/

/*base.getType = function (type) {
     if(!type){ return ''; }
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
    return aType;
}*/

//获取相对地址
/*base.getRelativeUrl = function (aUrl, bUrl, name) {
    var ar = aUrl.split('/').filter(function (n) { return n; });
    var br = bUrl.split('/').filter(function (n) { return n; });
    if (name) { br.splice(-1, 1, name); }
    var x, d = '';
    ar.forEach(function (a, i) {
        if (typeof x == 'number') { d += '../'; return; }
        if (a != br[i]) { x = i; d += ''; }
    });
    return d + br.slice(x).join('/');
}*/


/*base.getUrl = function (to, from) {
    to = to.replace('%3F', '?'); //转义？
    to = to.split('?')[0].indexOf('/') == -1  ? './' + to : to;

    var toU = this.parseUrl(to);
    var frU = this.parseUrl(from);


    console.log('----------');
    console.log(toU);
    console.log(frU);
}*/

//判断两个对象是否相等
base.isEqual = function (a, b) {
    for (var i in a) {
        if (a[i] != b[i]) {
            return false;
        }
    }
    return true;
}

module.exports = base;

//var h1 = 'http://pic22.nipic.com/20120801/6608733_154516839000_2.jpg';
//var h2 = 'http://image.baidu.com/';

/*request.get(h2)
  .on('error', function(err) {
    console.log(err)
  }).on('data', function (data) {
    //console.log(data);
    console.log('1')
  }).
  on('response', function (req) {
    var type = req.headers["content-type"];
    console.log('2');
  })
  .pipe(fs.createWriteStream('a.html'));
  console.log('3')*/