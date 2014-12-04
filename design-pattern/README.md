# Single:单例模式
## 简介
单例模式被熟知的原因是它限制了类的实例化次数只能一次（按需(惰性)且避免重复实例化）
	非常适用于大量数据的单体直到需要的时候才去实例化
## 使用场景
1. 命名空间的划分

1. web应用中交互式弹层的设计

1. 进行分支特性检测（嗅探）,见section5

## 代码示例


```
//section1:最简单的单体就是对象字面量
var singleTon = {
	attr1: 1,
	method1: function(){}
};


//section2：对象字面量所有成员都是公开的（但在团队内部也可以做相应的约定如'_'prefix代表私有成员），
			当然可以通过闭包实现的私有成员的单体
var singleTon = (function(){
	var attr = 1,
		fn = function(){};
	return {
		getAttr: function(){
			return attr;
		},
		method: function(){
			fn();
		}
	};
})();


//section3: 那如何实现单体的惰性加载呢
var Singleton = (function(){
	var instance;
	function Constructor(){
		//...
	}
	return {
		getInstance: function(){
			if(!instance){
				instance = new Constructor();
			}
			return instance;
		}
	};
})();


//section4: 通过静态属性缓存来实现单体（不太常用的作法）
function Constructor(){
	if(typeof Constructor.instance == 'object'){
		return Constructor.instance;
	}
	...
	some initial operation code
	...
	Constructor.instance = this;
}


//section5: example
var xhrFactory = (function(){
	var xhr;
	var standard = {
		createXhr: function(){
			if(!xhr){
				xhr = new XMLHttpRequest();
			}
			return xhr;
		}
	};
	var activeNew = {
		createXhr: function(){
			if(!xhr){
				xhr = new ActiveXObject('Msxml2.XMLHTTP');
			}
			return xhr;
		}
	};
	var activeOld = {
		createXhr: function(){
			if(!xhr){
				xhr = new ActiveXObject('Microsoft.XMLHTTP');
			}
			return xhr;
		}
	};
	//分支代码
	try{
		standard.createXhr();
		return standard;
	}
	catch(e){
		try{
			activeNew.createXhr();
			return activeNew;
		}
		catch(e){
			try{
				activeOld.createXhr();
				return activeOld;
			}
			catch(e){
				log(e);
			}
		}
	}
})();
xhrFactory.createXhr();
```
## 个人体会
单例或者单体模式在命名空间的使用场景下可以很好的组织代码并增强代码的可阅读性，通过闭包实现的私有单例可有效避免多人协作中出现的误改等问题并有效避免全局变量的污染，只暴露公开的。其实在具体运用时（对于简单的产品）我们经常一个业务模块可能就是一个单例，在这种情况下看来单体模式就是模块模式，只是从定义的角度来看二者重点不同而已。饿汉式的单体在知道需要的时候才会创建，从而减少不必要的内存消耗（特别是在需要创建大量对象时）。分支技术则可以再运行时基于特定的运行环境返回对象字面量，从而避免每次调用时都要运行相应逻辑。但同样它的问题在于是一种单体访问，那有可能造成模块间的强耦合。在具体使用是必须要考虑这些问题。


