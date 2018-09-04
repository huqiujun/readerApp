var koa = require('koa');
var controller = require('koa-route'); //路由中间件
var view = require('co-views'); //渲染模板中间件
var koa_static = require('koa-static-server');//静态资源中间件
var qs = require('querystring');
var render = view('./view',{ //第一个参数：模板存放路径；第二个参数：映射，模板类型
	map : {html : 'ejs'} 
})

var app = koa();
var service = require('./service/webAppService.js');

//获取模拟数据
app.use(controller.get('/home',function*(){  
	this.body = service.getHomeData();
}));
app.use(controller.get('/male',function*(){  
	this.body = yield render('male',{title : '男生喜欢',nav:'男生频道'}); 
}));
app.use(controller.get('/ajax/male',function*(){  
	this.body = service.getMaleData(); 
}));

app.use(controller.get('/female',function*(){  
	this.body = yield render('female',{title : '女生喜欢',nav:'女生频道'}); 
}));
app.use(controller.get('/ajax/female',function*(){  
	this.body = service.getFemaleData(); 
}));


app.use(controller.get('/chapter',function*(){  
	this.body = service.getChapterData();
}));
app.use(controller.get('/chapter_data',function*(){  
	// req是node的response对象
	var params = qs.parse(this.req._parsedUrl.query);
	var id = params.id;	
	if(!id) {
		id = '';
	}
	this.body = service.getChapterContentData(id);
}));
app.use(controller.get('/book/ajax',function*(){  
	var params = qs.parse(this.req._parsedUrl.query);
	var id = params.id;
	if(!id) {
		id = '';
	}
	// 此处因为只有一本书，暂不传入id
	this.body = service.getBookData();
}));

app.use(controller.get('/',function*(){  
	this.body = yield render('index',{title : '首页'}); 
}));
app.use(controller.get('/reader',function*(){  
	this.body = yield render('reader',{title : ''}); 
}));
app.use(controller.get('/book',function*(){  
	var params = qs.parse(this.req._parsedUrl.query);
	var id = params.id;
	this.body = yield render('book',{bookId : id,nav:'返回'}); 
}));



app.use(koa_static({ //配置静态资源 参数：1.静态资源文件存放路径 2.访问静态资源的URL（浏览器） 3.缓存时间
	rootDir : './static',
	rootPath : '/static', //然后可以通过localhost:3001/static/文件路径来访问静态资源
	maxAge : 0
}))
app.listen(3001);
//然后通过http://localhost:3001/test访问，这里的后面要和get函数中的参数一样
console.log('started');