/*
 * sqlite数据库驱动
 * 主要涉及操作：
 * 1、清理库
 * 2、查询一个最新的未完成的数据
 * 3、修改一条数据的状态及类容
 * 4、根据地质查询一条数据是否已经存在
 * 5、新增一条数据
 * 6、删除一条数据
 */

var level = require('level')

// 1) Create our database, supply location and options.
//    This will create or open the underlying LevelDB store.
var db = level('./db')

var db1 = level('./db1');
// 2) Put a key & value
// db.put('haha', {a:1, b:2}, function (err) {
//   if (err) return console.log('Ooops!', err) // some kind of I/O error

//   // 3) Fetch by key
  
// })


 db.put('haha', 'ddddd', function (err) {
   if (err) return console.log('Ooops!', err) // some kind of I/O error
   	console.log('sdfsdf')
  
 })

db.get('haha', function (err, value) {
    if (err) return console.log('Ooops!', err) // likely the key was not found
    // Ta da!
    console.log()
});


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