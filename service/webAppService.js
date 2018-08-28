//用于前后端数据的连接

//mock数据
var fs = require('fs');
exports.readContent = function() {
  var content = fs.readFileSync('./mock/test.json','utf-8'); 
  //读取模拟数据文件,注意这里的路径，实际上是引入到app.js中使用的
  return content;
}
exports.getChapterData = function() {
  var content = fs.readFileSync('./mock/reader/chapter.json','utf-8'); 
  return content;
}
exports.getChapterContentData = function(id) {
  if(!id) {
    id = "1";
  }
  var content = fs.readFileSync('./mock/reader/data/data' + id +'.json','utf-8'); 
  return content;
}

exports.getHomeData = function() {
  var content = fs.readFileSync('./mock/home.json','utf-8'); 
  return content;
}
exports.getMaleData = function() {
  var content = fs.readFileSync('./mock/channel/male.json','utf-8');  
  return content;
}
exports.getFemaleData = function() {
  var content = fs.readFileSync('./mock/channel/female.json','utf-8'); 
  return content;
}
exports.getRankData = function() {
  var content = fs.readFileSync('./mock/rank.json','utf-8'); 
  return content;
}
exports.getCategoryData = function() {
  var content = fs.readFileSync('./mock/category.json','utf-8'); 
  return content;
}
exports.getBookbacketData = function() {
  var content = fs.readFileSync('./mock/bookbacket.json','utf-8'); 
  return content;
}
exports.getBookData = function(id) {
  if(!id) {
    id = "18218";
  }
  var content = fs.readFileSync('./mock/book/' + id +'.json','utf-8'); 
  return content;
}

//后端真实数据
//由于Node.js访问数据库性能不佳，一般用其来访问一个http连接

exports.searchContent = function(start, end, keyword) {
  return function(cb) {
    var http = require('http');
    var qs = require('querystring');
    var data = { //注意这里，约定API的 格式一定要正确
      s: keyword,
      start,
      end     
    };
    var content = qs.stringify(data); //将对象转换成http请求中的字符串
    var http_request = {
      hostname : 'dushu.xiaomi.com',
      port : 80,
      path: '/store/v0/lib/query/onebox?' + content,
      method: 'GET'
    };
    
    var req_obj = http.request(http_request,function(res){
      var data = '';
      res.setEncoding('utf8');
      res.on('data',function(chunk){
        data += chunk;
      });
      res.on('end',function(){
        cb(null, data);
      })
    });
    req_obj.on('error',function(){

    });
    req_obj.end(); //发送请求
  }
}

