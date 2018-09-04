
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
    },
    methods: {
   
      
    }
    // 数据格式和后端约定，这里是来自模拟数据home.json
  });

},'json')