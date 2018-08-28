var koa = require('koa');
var controller = require('koa-route'); 
var view = require('co-views'); 
var koa_static = require('koa-static-server');
var qs = require('querystring');
var render = view('./view',{
	map : {html : 'ejs'} 
})

var app = koa();
var service = require('./service/webAppService.js');


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

app.use(controller.get('/free',function*(){  
	this.body = yield render('female',{title : '女生喜欢',nav:'女生频道'}); 
}));


app.use(controller.get('/chapter',function*(){  
	this.body = service.getChapterData();
}));
app.use(controller.get('/chapter_data',function*(){  
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



app.use(koa_static({ 
	rootDir : './static',
	rootPath : '/static',
	maxAge : 0
}))
app.listen(3001);

console.log('started');