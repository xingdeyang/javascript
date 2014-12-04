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
