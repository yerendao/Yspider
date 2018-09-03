/*
 * sqlite数据库驱动
 * 主要涉及操作：
 * 1、清理库
 * 2、查询一个最新的未完成的数据
 * 3、修改一条数据的状态及类容
 * 4、根据地质查询一条数据是否已经存在
 * 5、新增一条数据
 * 6、删除一条数据
 * ----------------------------
 * 数据字段：
 *	"host":"www.cubancigarwebsite.com",
 *	"href":"http://www.cubancigarwebsite.com/default.aspx",
 *	"fix":"aspx",
 *	"type":["text","html","utf8"],
 *	"dir":"/",
 *	"path":"/default.aspx",
 *	"anchor":"",
 *	"query":"",
 *	"queryKey":{},
 *	"name":"default.aspx",
 *	"reName":"default.html",
 *	"status":3
 */






class D {
	constructor() {

	}

	//清空数据库
	clear () {

	}

	//下一条合法的有待处理的数据
	next() {

	}

	//根据id修改一条数据
	edit (id, opt) {

	}

	//根据URL检索一条数据
	search(opt) {

	}

}