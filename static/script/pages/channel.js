var sex = location.href.split('/').pop();

$.get('/ajax/' + sex,function(d) {
  new Vue({
    el : '#app',

    data : d,
    methods: {
     
    }
    // 数据格式和后端约定，这里是来自模拟数据home.json
  });

},'json')