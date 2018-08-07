
import until from "../components/until";
    function Router(options) {
        /**
         * @routes
         * @beforeEach
         * @afterEach
         **/

        this.beforeEach = options.beforeEach;
        this.afterEach = options.afterEach;
        this.options = options;
        this.$route = null;
        this.route = null;
        this.App = null;
        this.init();

    }

//要去构建一个虚拟的dom树，不然在页面渲染完毕回到上一级的时候没法回去，因为router-view已经消失了。
// 因此要由虚拟的dom树去找到原来的位置，这也是每个组件必须要有一个根元素的原因；
    Router.prototype = {

        init: function () {
            this.appTree(this.options.routes);
            this._init$route();
            this.addEventListener();
        },
        renderHtml: function () {
            let pathArr = this.resolvePathArr();
            let AppComponents = this.AppComponents;
            console.log( pathArr ,"pathArr");
            console.log( AppComponents ,"组件");
            if( pathArr.length > 0 ){
                this._hasHashRenderHtml( pathArr )
            }
            else{
                this._noHashRenderHtml();
            }

        },
        /**
         * @method: _hasHashRenderHtml
         * @param:   pathArr
         * @return:   null；
         **/
        _hasHashRenderHtml( pathArr ) {
            let AppComponents = this.AppComponents;
            for (let key in pathArr) {
                //判断是否是数组本身的属性；
                if ( pathArr.hasOwnProperty(key) ) {
                    if( pathArr[key].split("/").length > 2 ){
                        let rootEl = document.getElementsByTagName("router-view");
                        if( AppComponents[ pathArr[key] ] ){
                            if( this.hashChanged( AppComponents[ pathArr[key] ] ) ) {
                                this.replaceChild( rootEl, this.textToDom(AppComponents[ pathArr[key] ]["component"]), rootEl[0] )
                            }
                        }
                        else{
                            console.log( AppComponents[ pathArr[key] ] )
                        }
                    }
                    else{
                        let rootEl = document.getElementById("app");
                        let oldDom =  rootEl.childNodes[0];
                        if( this.hashChanged( AppComponents[ pathArr[key] ] ) ){
                            this.replaceChild( rootEl,this.textToDom(AppComponents[ pathArr[key] ]["component"]), oldDom, true )
                        }
                    }
                }
            }
            return null;
        },
        /**
         * @method: _noHashRenderHtml  渲染默认页面
         * @param:
         * @return:   ；
         **/
        _noHashRenderHtml() {
            let AppComponents = this.AppComponents;
            let rootEl = document.getElementById("app");
            let oldDom =  rootEl.childNodes[0];
            console.log( AppComponents[ "/" ] );
            if( this.hashChanged( AppComponents[ "/" ] ) ){
                this.replaceChild( rootEl,this.textToDom( AppComponents[ "/" ]["component"] ), oldDom, true )
            }
        },
        /**
         * @method: replaceChild 因为原生的replaceChild 新旧dom相同的时候不能相互替换
         * @param: oldDom
         * @return:   null；
         **/
        replaceChild( rootDom , newDom ,oldDom, type ) {
            let _oldDom = oldDom.cloneNode();
            _oldDom.innerHTML = "";
            if( type ){
                rootDom.replaceChild( _oldDom, oldDom );
                rootDom.replaceChild( newDom, _oldDom );
                return;
            }
            rootDom[0].parentElement.replaceChild( newDom, oldDom );
        },
        _init$route: function () {
            let toPath = this.resolvePathArr().join();
            let _toObj = this.AppComponents[ toPath ] ? this.AppComponents[ toPath ] : this.AppComponents [this.App[0]["path"]] ;
            let route = {
                fullPath: toPath,
                meta: _toObj.meta || "", // 可以作为传输的数据
                name: _toObj.name || "",
                params: _toObj.params || "",
                path: _toObj.path || "",
                query: _toObj.query || ""
            };
            this.currentRoute = route;
        },



        //循环所有的路由并找到对应的路由对象
        appTree: function ($routes) {
            $routes = until._extend($routes);
            let _uid = 0;
            let _tempTree = {};
            let _forRouter = ($routes, path) => {
                path = path || "";
                for (let key in $routes) {
                    _uid++;
                    $routes[key]["comment"] = document.createComment(_uid);
                    $routes[key]["_uid"] = _uid;
                    $routes[key]["_path"] = path + $routes[key]["path"];
                    _tempTree[$routes[key]["_path"]] = $routes[key];
                    if ( $routes.hasOwnProperty(key) ) {
                        if (typeof $routes[key]["children"] === "object" && $routes[key] != null) {
                            _forRouter($routes[key]["children"], $routes[key]["_path"]);
                        }
                    }
                }
            };
            _forRouter($routes, "", _tempTree);
            this.App = $routes;
            //构建注
            this.AppComponents = _tempTree;
            this.renderHtml();
        },
        textToDom: function (text) {
            let _domWrap = document.createElement("div");
            _domWrap.innerHTML = text;
            return _domWrap.childNodes[0]
        },
        addEventListener: function () {
            let _this = this;
            window.onhashchange = function () {
                _this.renderHtml();
            }
        },
        //获取hash的路径；
        resolvePath: function ( path ) {
            path = path ? path.split("/") : "";
            let pathArr =  path || window.location.hash.replace(/#/g, "").split("/");
            let _tempArr = [];
            pathArr.forEach(function (item, index) {
                if (item) {
                    _tempArr.push( "/" + item);
                }
            });
            //在没有hash值得时候是显示的默认的也就是根目录下的页面
            return _tempArr.join("") || "/";
        },
        resolvePathArr: function ( path ) {
            path = path ? path.split("/") : "";
            let pathArr =  path || window.location.hash.replace(/#/g, "").split("/");
            let _tempArr = [];
            pathArr.forEach(function (item, index) {
                if (item) {
                    _tempArr.push((_tempArr[index - 1] ? _tempArr[index - 1] : "") + "/" + item);
                }
            });
            return _tempArr;
        },
        /**
         * @method:  change$route hash变化后改变form, to对象
         * @param:   当前hash值构成的路由
         * @return: null
         **/
        getToPath( _toPath  ) {
            let toPath = _toPath || this.resolvePath();
            console.log( this.resolvePath() );
            let _toObj = this.AppComponents[ toPath ];
            let _obj = {
                fullPath: toPath,
                meta: _toObj.meta || {}, // 可以作为传输的数据
                name: _toObj.name || {},
                params: _toObj.params || {},
                path: _toObj.path || {},
                query: _toObj.query || {}
            }
            return _obj;
        },

        /**
         * @method: hashChanged hash改变时渲染页面需要的状态；
         * @param:
         * @return: true or false
         **/

        hashChanged( component ) {
            let toPath = this.resolvePathArr(  );
            if ( component.beforeRouterEnter ){
                return component.beforeRouterEnter( this.currentRoute , toPath ,this.next);
            }
            return this.next(  );
        },
        /**
         * @method: next 路由器的钩子函数只有运行了这个函数才会渲染后面的页面
         * @param:  obj  可以重新导向的页面配置
         * @return:  null
         **/

        next( obj ) {
            if( obj ){
                let _toPath = this.getToPath( obj.path );
                window.location.hash = "#" + obj.path;
                return false;
            }
            this.currentRoute = this.getToPath( );
            return true;
        },




        beforeEnterRoute: function () {

        },
        beforeLeaveRoute: function () {

        },
        routeEach: function () {

        },
        push: function () {

        },
        replace: function () {

        },
        go: function (to) {

        },
        back: function () {

        },
        forward: function () {

        }
    };
    export default Router;
