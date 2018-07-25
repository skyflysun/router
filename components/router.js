

function Router( option ) {
    /**
    * @routes
    * @beforeEach
    * @afterEach
    **/

    this.beforeEach = option.beforeEach;
    this.afterEach = option.afterEach;
    this.option = option;
    this.$route = null;
    this.init(  );

}

Router.prototype = {
    init: function (  ) {

    },
    analyzeHash: function(){
        let path = window.location.hash.replace(/#/g,"");
        let pathArr = path.split("/");
        this.currentPath = pathArr;

        //只有端口的情况，加载默认首页
        if ( pathArr.length === 0 ){
            console.warn("enter home");
            return ;
        }
    },
    renderHtml: function() {

    },
    get$route: function(){
        let _routes = this.options.routes;
        let _forItem = ( $routes ) => {
            for( let key in _routes ){
                if( _routes.hasOwnProperty( key )){
                    // if( )
                }
            }
        };

    },
    addEventListener: function(){
        let _this = this;
        window.onhashchange = function () {
            _this.option.beforeEnterRoute && _this.option.beforeEnterRoute();
        }
    },
    beforeEnterRoute : function () {

    },
    beforeLeaveRoute: function () {

    },
    routeEach: function () {

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