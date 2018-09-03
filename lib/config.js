/**
 * 配置参数
 */
module.exports = {
	host: 'www.cubancigarwebsite.com',
	saveDir: '../webSite/',
	cache: 'lib/data.json',
	types: ['aspx'], //需要转化为html的后缀名
	default: ['http://www.cubancigarwebsite.com/default.aspx'], //入口地址
	actPage: {
		'name': {}
	} //动态页面 
}

//http://www.cubancigarwebsite.com/default.aspx