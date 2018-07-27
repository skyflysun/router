(function (){

    function Router( options ) {
        /**
         * @routes
         * @beforeEach
         * @afterEach
         **/

        this.beforeEach = options.beforeEach;
        this.afterEach = options.afterEach;
        this.options = options;
        this.$route = null;
        this.AppTree = null;
        this.init(  );

    }
//要去构建一个虚拟的dom树，不然在页面渲染完毕回到上一级的时候没法回去，因为router-view已经消失了。
// 因此要由虚拟的dom树去找到原来的位置，这也是每个组件必须要有一个根元素的原因；
    Router.prototype = {

        init: function (  ) {
            this.addEventListener();
            this.appTree( this.options.routes );
            // this.get$route();
        },
        analyzeHash: function(){


            //只有端口的情况，加载默认首页
            if ( pathArr.length === 0 ){
                console.warn("enter home");
                return ;
            }
        },
        renderHtml: function( components ) {
            let rootEl = document.getElementsByTagName("router-view");

            // components.forEach( function ( item ) {
            let _dom = document.createElement("div");
            _dom.innerHTML = components;
            console.log( _dom.childNodes );
            rootEl[0].parentElement.replaceChild ( _dom.childNodes[0],rootEl[0] );
            console.log( components )
            // });.

            // replaceChild
            // el.childNodes;
        },
        get$route: function(){

            this.currentPath = {
                fullPath:  window.location.hash,
            };
            let _routes = this.options.routes;
            this.forItemRouter( _routes );
            console.log( _uid )
        },
        //获取hash的路径；
        getCurrentHashToPathArr: function (  ) {
            let pathArr = this.currentPath.fullPath.replace(/#/g,"").split("/");
            let _tempArr = [];
            pathArr.forEach( function ( item,index ) {
                if( item ){
                    _tempArr.push( "/" + item );
                }
            });
            return _tempArr
        },
        //循环所有的路由并找到对应的路由对象
        forItemRouter: function( $routes ) {
            let pathArr = this.getCurrentHashToPathArr();
            for( let key in $routes ){
                _uid ++;
                console.log( 11111111 )
                if( $routes.hasOwnProperty( key ) ){

                    if( typeof $routes[key]  === "object" &&  $routes[key] != null ){
                        if( pathArr.indexOf( $routes[key]["path"] ) > -1){
                            this.renderHtml(  $routes[key]["component"]  );
                            this.forItemRouter( $routes[ key ][ "children" ] );
                            return;
                        }
                    }
                }
            }
        },
        appTree: function( $routes ) {
            let _uid = 0;
            let routeTree = {};
            for( let key in $routes ){
                //
                let _routesArr = [];
                let route = $routes[key];
                let forItemRouter = function( $routes,path ) {
                    // console.log( path )
                    // path = path || "";

                    // $routes[key]["path"] = path + $routes[key]["path"];
                    // _routesArr.push(  $routes[key]["path"] );
                    // console.log( _routesArr );
                    // console.log( _routesArr[_routesArr.length-1] );
                    // _uid ++;
                    // $routes[key]["_uid"] = _uid;

                    if( typeof $routes["children"]  === "object" &&  $routes!= null ){
                        forItemRouter( $routes[ "children" ], _routesArr[_routesArr.length-1] );
                    }

                };
                forItemRouter( route )
            }

            // console.log( routeTree )
        },
        addEventListener: function(){
            let _this = this;
            window.onhashchange = function () {
                let _routes = _this.options.routes;
                // _this.forItemRouter( _routes );
                console.log( 11111111 )
                // _this.option.beforeEnterRoute && _this.option.beforeEnterRoute();
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
    window.Router = Router;
}(window))
