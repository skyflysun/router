(function () {

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
        analyzeHash: function () {


            //只有端口的情况，加载默认首页
            if (pathArr.length === 0) {
                console.warn("enter home");
                return;
            }
        },
        renderHtml: function () {
            let pathArr = this.resolvePath();
            let AppComponents = this.AppComponents;

            for (let key in pathArr) {
                if (pathArr.hasOwnProperty(key)) {
                    let rootEl = document.getElementsByTagName("router-view");
                        console.log( pathArr )
                        if( AppComponents[ pathArr ] ){
                            //组件存在
                            if (!AppComponents[ pathArr ].rendered) {
                                //初次进入
                                AppComponents[ pathArr ].rendered = true;
                                rootEl[0].parentElement.replaceChild(AppComponents[pathArr[key]]["componentDom"], rootEl[0]);
                            }
                            else if ( AppComponents[pathArr[key]].rendered ) {
                                //二次进入
                                this.hideNotHash(pathArr);
                            }
                        }

                }
            }
        },
        /**
         * @method: _renderedHtml  对于渲染过的dom处理
         * @param:
         * @return:
         **/
        _renderedHtml() {

            return
        },
        /**
         * @method: htmlNotHash 隐藏不包含的hash
         * @param:
         * @return:
         **/

        hideNotHash( key ) {
            let AppComponents = this.AppComponents;
            for (let key in AppComponents) {
                if (AppComponents.hasOwnProperty(key)) {
                    if (!(pathArr.indexOf(key) > -1)) {
                        console.log(AppComponents[key].componentDom.parentElement, key);
                        AppComponents[key].componentDom.parentElement.replaceChild(AppComponents[key].comment, AppComponents[key].componentDom)
                    }
                }
            }
        },
        _init$route: function () {
            let toPath = this.resolvePath().join();
            let _toObj = this.AppComponents[ toPath ] ? this.AppComponents[ toPath ] : this.AppComponents [this.App[0]["path"]] ;

            let route = {
                fullPath: toPath,
                meta: _toObj.meta, // 可以作为传输的数据
                name: _toObj.name,
                params: _toObj.params,
                path: _toObj.path,
                query: _toObj.query
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
                    $routes[key]["componentDom"] = this.textToDom($routes[key]["component"]);
                    _tempTree[$routes[key]["_path"]] = $routes[key];
                    if ($routes.hasOwnProperty(key)) {
                        if (typeof $routes[key]["children"] === "object" && $routes[key] != null) {
                            _forRouter($routes[key]["children"], $routes[key]["_path"]);
                        }
                    }
                }
            };
            _forRouter($routes, "", _tempTree);
            console.log(_tempTree);
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
                _this.hashChanged();
            }
        },
        //获取hash的路径；
        resolvePath: function ( path ) {
            let pathArr =  path.split("/") || window.location.hash.replace(/#/g, "").split("/");
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
            let toPath = _toPath || this.resolvePath().join("") ;
            let _toObj = this.AppComponents[toPath];
            let _obj = {
                fullPath: toPath,
                meta: _toObj.meta, // 可以作为传输的数据
                name: _toObj.name,
                params: _toObj.params,
                path: _toObj.path,
                query: _toObj.query
            }
            return _obj;
        },

        /**
         * @method: hashChanged hash改变时候要做的事情
         * @param:
         * @return:
         **/

        hashChanged() {
            let toPath = this.getToPath(  );
            if ( his.AppComponents[ toPath ].beforeRouterEnter ){
                this.AppComponents[ toPath ].beforeRouterEnter( this.currentRoute , toPath ,this.next);
                return;
            }
            this.next(  );

        },
        /**
         * @method: next 路由器的钩子函数只有运行了这个函数才会渲染后面的页面
         * @param:  obj  可以重新导向的页面配置
         * @return:  null
         **/

        next( obj ) {
            let _toPath = this.getToPath( obj.path );
            if( obj ){
                window.location.hash = "#" + obj.path;
                return
            }
            this.renderHtml();
            this.currentRoute = _toPath;
            return null
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
    window.Router = Router;
}(window))
