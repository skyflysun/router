
if( module.hot ){
    module.hot.accept();
}

console.log(22222222);
import Router from "../components/router"

window.asd =  new Router({
    routes: [
        {
            path: "/home",
            component: "<div>aaaaaaaaaaaaaa</div>"
        },
        {
            path: "/home1",
            component: "<div><span>tianzehao</span><router-view></router-view></div>",
            children: [
                {
                    path: "/child1",
                    component: "child1"
                },
                {
                    path: "/child2",
                    component: "child31231"
                },
                {
                    path: "/child3",
                    component: "child1",
                    children: [
                        {
                            path: "/child-child1",
                            component: "child1",
                            children: [
                                {
                                    path: "/child-child3",
                                    component: "child1"
                                },
                            ]
                        },
                    ]
                }
            ]
        },
        {
            path: "/home2",
            component: "home2"
        }
    ]
});
console.log( asd );
