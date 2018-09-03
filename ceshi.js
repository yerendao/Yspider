/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-08-04 18:04:47
 * @version $Id$
 */

console.log(decodeURIComponent('http://www.cubancigarwebsite.com/brand.aspx?brand=romeo_y_julieta#162_R%7Ceplica_de_Humidor_Antiguo'))


var _s = 'xsf background-images: url("../image/a.png"); sdfsfsdf';

 var _p = /url\s*\(\s*[\\'"]*([^\(\)]+)\s*[\\'"]\s*\)/gmi;

 var _r = _p.exec(_s);


console.log(_r);

//console.log(_r[1]);

var x = ['sdfsdf','xxxfis']

console.log(x.join('.'))