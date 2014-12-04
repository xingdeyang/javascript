# Module:模块模式
## 简介
模块模式被定义为一种为对象提供公有和私有封装的方法，Nodejs在语言层面已经（通过module,exports,require）提供了这种模块机制。基于浏览器宿主环境的javascript则需要通过自我实现，最新版的ECMAScript(Harmony)已经考虑了该需求
## 使用场景
1. 目前我主要用于业务代码的组织架构

## 代码示例
```
//section1:通过闭包模拟私有以实现模块化
var testModule = (function(){
	var counter = 0;
		/*
			...
			counter为私有变量
		*/
	return {
		incrementCounter: function(){
			counter++;
		},
		resetCounter: function(){
			counter = 0;
		}
	};
})();


//section2: 模块模式的变体（导入混合）
var myModule = (function($,_){
	var privateVariable;
	function privateMethod(){
		...
		//使用导入模块jquery,underscore
	}
	return {
		publicMethod: function(){
			privateMethod();
		}
	};
})(jQuery,_);


//section3: 关于模块命名
在不考虑使用模块化工具库的情况下，一般采用命名空间的方式来定义各模块名称


//section5: 更好的写法
/*
	第一部分写法不太爽的地方是在一个公有方法中调用另个一公有方法时要重复模块名称或者this，
	可以简单在私有作用域中定义所有函数与变量，返回匿名对象中以指针方式指向想要暴露的成员,可读性更强
*/
var myModule = (function(){
	function method1(){
		//...
	}
	function method2(){
		//...
	}
	return {
		set: method1,
		get: method2
	};
})();


//section4:关于seajs实现模块化加载的源码设计思路待续
1.模块缓存（id标示，状态设计）
2.模块加载后自执行生成module对象，通过require或者user方法调用模块时执行factory,要特别注意module.exports如何返回
3.模块层级依赖的解决方案
4.路由设计```



