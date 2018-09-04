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

exports.getBookData = function(id) {
  if(!id) {
    id = "18218";
  }
  var content = fs.readFileSync('./mock/book/' + id +'.json','utf-8'); 
  return content;
}


