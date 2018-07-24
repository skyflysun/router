

function Router( option ) {
    let defaultOption = {
        //全局路由守卫
        beforeEnterRoute: function () {

        },
        //全局路由守卫
        beforeLeavaRoute: function () {

        },
        routes: [

        ],
    };
    for( var key in option ){
        //因为简单不需要去深层次的遍历;
        defaultOption = option[key];
    }
    this.option = defaultOption;
    this.init( defualtOption );

}

Router.prototype = {
    init: function (  ) {

    },
    analyzeHash: function(){
        let path = window.location.hash.replace(/#/g,"");
        let pathArr = path.split("/");
        this.currentPath = pathArr;
        if ( pathArr.length === 0 ){
            console.warn("进入默认首页");
            return ;
        }
    },
    renderHtml: function() {

    },
    addEventListener: function(){
        let _this = this;
        window.hashchange = function () {
            _this.option.beforeEnterRoute && _this.option.beforeEnterRoute();
        }
    },
    beforeEnterRoute : function () {

    },
    beforeLeaveRoute: function () {

    },
    beforeEach: function () {

    },
    afterEach: function () {

    },
    push: function () {

    },
    replace: function () {

    },
    go: function ( to ) {

    },
    back: function (  ) {

    },
    forward: function () {

    }
};