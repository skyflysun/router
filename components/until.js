
    //原理：
    // 对象的toString 方法能够返回自身的类型。除了null无法找到外，其它类型均能找到。
    // 其他类型的toString方法被改写了，所以要使用call或者apply 调用对象上的toString；
    let class2type = {};
    "Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function(e,i){
        class2type[ "[object " + e + "]" ] = e.toLowerCase();
    }) ;
    let until = {
        _typeof: ( data ) => {
            if( data === null ){
                return null;
            }
            return class2type[class2type.toString.call( data )]
        },
        _extend: function ( data ) {
            return JSON.parse( JSON.stringify( data ) );
        }
    }

    export default until;