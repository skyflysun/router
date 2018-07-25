(function ( context ){
    //原理：
    // 对象的toString 方法能够返回
    let class2type = {};
    "Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function(e,i){
        class2type[ "[object " + e + "]" ] = e.toLowerCase();
    }) ;
    window.until = {
        _typeof: ( data ) => {

        }
    }
})( window )