var screenWidth = $(window.width);
if(screenWidth < 320) {
  screenWidth = 320
};
var offset = $($('.swipe-tab').find('a')[0]).offset;
var header_tab_width = offset.width;
$.get('/home',function(d) {
  new Vue({
    el : '#app',

    data : {
      top:d.items[0].data.data,
      hot:d.items[1].data.data,
      recommend:d.items[2].data.data,
      female:d.items[3].data.data,
      male:d.items[4].data.data,
      free:d.items[5].data.data,
      topic:d.items[6].data.data,
      position:0,
      headerPosition : 0,
      tab1Class : 'swipe-tab-on',
      tab2Class : '',
      screen_width: screenWidth,
      double_screen_width : 2 * screenWidth,
      header_tab_width,
    },
    methods: {
   
      
    }
    // 数据格式和后端约定，这里是来自模拟数据home.json
  });

},'json')