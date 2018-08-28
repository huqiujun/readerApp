var id = location.href.split('?id=').pop();

$.get('/book/ajax?id=' + id,function(d) {
  new Vue({
    el : '#app',

    data : d, //这里是把响应的数据整个作为绑定到vue组件的数据
    methods: {
     
    }
    // 数据格式和后端约定，这里是来自模拟数据home.json
  });

},'json')