    //闭包
    (function(){
      var utl = (function(){
        var prefix = 'reader_';
        // 将localstorage封装是为了防止key被他人误操作，加上一个前缀
        var storageGetter = function(key) {
          return localStorage.getItem(key + prefix);
        }
        var storageSetter = function(key,val) {
          return localStorage.setItem(key + prefix,val);
        }
        // 封装方法，发起jsonp请求并解码
        var getBSONP = function(url, callback) {
          $.jsonp({
            url : url,
            cache : true,
            callback : 'duokan_fiction_chapter', //返回的Jsonp中约定好的
            success : function(result) { //响应成功后的回调，返回数据result
              
              var data = $.base64.decode(result);
              var json = decodeURIComponent(escape(data)); //???
              callback(json);

            }
          })
        }
        return {
          storageSetter,
          storageGetter,
          getBSONP
        }
      })();

      //获取要操作的dom元素的引用，避免重复获取
      var dom = {
        top_bottom_nav: $('.top_bottom_nav'), //需要切换显示和隐藏的元素的集合
        font_nav: $('.font_nav'),
        font_button : $('#font-button'),
        readContent : $('.read-content'),
        currnetBk : $('.bk-container-current'),
        dayIcon : $('#day_icon'),
        nightIcon : $('#night_icon'),
        page : $('#root'),
        menu : $('.menu')
      };
      var Win = $(window);
      var Doc = $(document);
      var readerModel;
      var readerUI

      // localStorage存储字符串，所以最好parseInt，然后初始化字体大小
      var fontSize = parseInt(utl.storageGetter('fontSize')) || 14;
      dom.readContent.css('fontSize', fontSize);

      var backgroundColor = utl.storageGetter('background-color') || '#e9dfc7';
      dom.page.css('background-color',backgroundColor);

      var backgroundColorIndex = parseInt(utl.storageGetter('background-color-index')) || 1;
      dom.currnetBk.eq(backgroundColorIndex - 1).show();
      //思路：先搭建整体框架，再具体实现
      function main() {
        // 入口函数
        eventHandler();
        readerModel = readerData();
        readerUI = readerFrame(dom.readContent);
        readerModel.init(function(data) {        
          readerUI(data);
        });
        
      }
      function readerData() {
        //与服务器数据交互
        // utl.storageSetter('chapter_id',1);
        var Chapter_Id = utl.storageGetter('chapter_id') || 1; //内部全局变量
        var ChapterNum = 4;


        // 该函数的参数一个回调，回调函数传入一个参数，即某节内容的json字符串
        var init = function(UIcallback) {
          //先请求章节信息，成功后回调函数，获取某节内容
          getFictionInfo(getCurChapterContent(Chapter_Id,function(data){
            // todo : 将获取的内容渲染到页面
            UIcallback && UIcallback(data);
          }))
        }
        
        var getFictionInfo = function(callback) {
          $.get('chapter',function(data){
            //获取章节信息后的回调，这里用本地的json文件模拟服务器
            Chapter_Id = data.chapters[1].chapter_id;
            

            callback && callback();
          },'json')
        }

        // 参数一：章节ID
        // 参数二：回调函数(这个函数其实是传入了getbsonp函数)，回调函数传入一个参数，即某节内容的json字符串（getbsonp请求到的数据），对其进行处理
        var getCurChapterContent = function(chapterId,callback) {
          //获取某个章节的内容
          
      
          $.get('/chapter_data',{id:chapterId},function(data){
            // 这里返回的数据格式是约定好的
            if(data.result == 0) {
              var url = data.jsonp; //返回的是一个url，用来获取真实内容（防止被爬虫）
              utl.getBSONP(url,function(data) {
           
                callback && callback(data); //这里的回调将获取的内容渲染到页面
              })
              // utl.getBSONP(url,callback);


            }
          },'json')
        }

        var prevChapter = function(UIcallback) {
          if(Chapter_Id == 1) {
            return;
          }
          Chapter_Id--;
          utl.storageSetter('chapter_id',Chapter_Id);
          getCurChapterContent(Chapter_Id,UIcallback);
        }
        var nextChapter = function(UIcallback) {
          if(Chapter_Id >= ChapterNum) {
            return;
          }
          Chapter_Id++;
          utl.storageSetter('chapter_id',Chapter_Id);
          getCurChapterContent(Chapter_Id,UIcallback);
        }
        return {
          init,
          prevChapter,
          nextChapter,
          getCurChapterContent
        }
      }

      function readerFrame(container) {
        //初始化UI结构，它的返回值是一个函数，该函数传入要渲染的数据
        var parseChapterData = function(jsonData) {
          //jsondata是某个章节内容对应的json字符串
         
          var jsonObj = JSON.parse(jsonData);
          var html = '<h4>' + jsonObj.t + '</h4>';
          for(var i = 0; i < jsonObj.p.length; i++) {
            html += '<p>' + jsonObj.p[i] + '</p>';
          }
          return html;
        }

        return function(data) {
          container.html(parseChapterData(data));
        }
      }

      function eventHandler() {
        // 交互事件
        
        // 这里用click而不是touch是为了兼容PC
        $('#active_mid').click(function(){
          if(dom.top_bottom_nav.css('display') == 'none') {
            dom.top_bottom_nav.show();
          } else {
            dom.top_bottom_nav.hide();
            dom.font_nav.hide();
            dom.font_button.removeClass('current');
          }
        });

        $('#menu_button').click(function(){
          if(dom.menu.css('display') == 'none') {
            dom.menu.show();
          } else {
            dom.menu.hide();          
          }
        });

        $('.menu').click(function(event){
          var index = $(event.target).data("index");
          utl.storageSetter('chapter_id',index);
          readerModel.getCurChapterContent(index,function(data){
            readerUI(data);
          });
          dom.menu.hide();
        });

        //滚动时，面板隐藏
        Win.scroll(function(){
          dom.top_bottom_nav.hide();
          dom.font_nav.hide();
          dom.font_button.removeClass('current');
        });

        $('#night-button').click(function(){
          //白天黑夜模式切换其实就是背景切换
          if(dom.dayIcon.css('display') == 'none') {
            dom.dayIcon.show();
            dom.nightIcon.hide();

            dom.page.css('background-color','#283548');
            dom.currnetBk.hide();
            dom.currnetBk.eq(4).show();


          } else {
            dom.dayIcon.hide();
            dom.nightIcon.show();
            dom.page.css('background-color',backgroundColor);
            dom.currnetBk.hide();
            dom.currnetBk.eq(backgroundColorIndex - 1).show();      
          }
          
        });

        //点击字体按钮时显示/隐藏字体选择面板，并改变按钮样式（通过class改变来实现）
        dom.font_button.click(function(){
          if(dom.font_nav.css('display') == 'none') {
            dom.font_nav.show();
            dom.font_button.addClass('current');
          } else {
            dom.font_nav.hide();
            dom.font_button.removeClass('current');
          }
        });

        $('#large-font').click(function(){
          if(fontSize > 20) {
            return;
          }
          fontSize++;
          dom.readContent.css('fontSize', fontSize);
          utl.storageSetter('fontSize',fontSize);
        });
        $('#small-font').click(function(){
          if(fontSize < 12) {
            return;
          }
          fontSize--;
          dom.readContent.css('fontSize', fontSize);
          utl.storageSetter('fontSize',fontSize);
        });

        $('.bk-container').click(function(){
          var $this = $(this);
          backgroundColor = $this.css('background-color');
          backgroundColorIndex = $this.index();
          dom.page.css('background-color',backgroundColor);
          //选中提示框随之变化
          dom.currnetBk.hide();
          $this.children().show();

          utl.storageSetter('background-color',backgroundColor);
          utl.storageSetter('background-color-index',backgroundColorIndex);
        });

        $('#prev-button').click(function(){
          readerModel.prevChapter(function(data) {
            readerUI(data);
          })
        });
        $('#next-button').click(function(){
          readerModel.nextChapter(function(data) {
            readerUI(data);
          })
        })
      }


      main();
    })();