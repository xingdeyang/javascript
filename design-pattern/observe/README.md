# Observe: 观察者模式
## 简介
它是这样一种设计模式，一个被称作被观察者的对象，维护一组被称为观察者的对象，这些对象依赖于被观察者
被观察者自动将自身的状态的任何变化通知给他们。当被观察者需要将一些变化通知给观察者的时候，它将采用广播的
方式，这条广播可能包含特定于这条通知的一些数据。当特定的观察者不需要接收它所注册的被观察者的通知的时候，
被观察者可以将其从所维护的组中删除，严格按照该定义的实现如section2

在javascript中我们通常使用pub/sub来实现观察者模式，在nodejs中已经在语言层面支持这种模式（也可以叫做事件机制）
而浏览器中的Dom事件本身也就是观察者模式的一种运用，但pub/sub其与观察者模式还是有写区别的：
1. pub/sub模式是基于一个事件/主题来作为观察者与被观察者沟通的桥梁(^^who pub who is the publisher,the subscribe callback is the subscriber^^)

1. 这个事件/主题允许定义应用相关的事件，该事件可以传递特殊参数，参数中包含订阅者所需的值

1. 很好的解耦应用的不同模块（符合低耦合，高内聚的思想）

1. 不足之处也是因为系统本身的解耦，发布者是无法感知订阅者的执行失效等异常情况


## 使用场景
略
## 注意事项
* 上述是在全局作用域中，在实际应用中我们可能会再次封装，pub/sub可能处于不同的上下文，则sub要事先绑定handler的context
具体实现可参见$.proxy,大致如下：

```
var proxy = (function(handler,context){
	return function(){
		handler.apply(context,arguments);
	};
})();
```

* 观察者模式其实也是异步编程解耦的很好解决方案，但在多异步的协作上（并行，串行）并不是很突出，具体可参见nodejs-notes版块中相关文章;此外很多框架（MVC框架Backbone）在实现中已将其作为核心架构模式（贯穿了Model和Collection两个模块,其都继承自event模块从而让自身拥有sub/pub机制），在backbone中collection从服务端拉取的数据model逐个对比后会触发对应model的change事件（包括add,remove,update等），从而可以和view层建立相应通知机制以反映到具体的视图上


## 代码示例
```
//section1:产品中的实现
S.MQ = {
	_handlers: {},
	_topics: function(topics){
		return topics.indexOf(',') == -1 ? [topics] : topics.replace(/\s/g,function(){return '';}).split(',');
	},
	_topicExist: function(topic){
		if(this._handlers.hasOwnProperty(topic) && this.handlers[topic].length > 0){
			return true;
		}
		return;
	},
	_each: function(array,processor){
		var item;
		for(var i=0,len=array.length; i<len; i++){
			item = array[i];
			processor(item,i);
		}
	},
	sub: function(topic,handler){
		var me = this;
		this._each(me._topics(topic),function(item,i){
			if(me._topicExist(item)){
				me._handlers[item].push(handler);
			}
			else{
				me._handlers[item] = [handler];
			}
		});
	},
	pub: function(topic,data){
		var me = this;
		this._each(this._topics(topic),function(topic){
			if(this._topicExist(topic)){
				me._each(me._handlers[topic],function(handler){
					handler({topic:topic,data:data});
				});
			}
			else{
				log('the topic' + topic + 'is not exist');
			}
		});
	},
	unsub: function(topic,handler){
		var me = this;
		this._each(this._topics(topic),function(topic){
			if(me._topicExist(topic)){
				me._each(me._handlers[topic],function(item,i){
					if(item == handler){
						me._handlers[topic].splice(i,1);
					}
				});
			}
			else{
				log('the topic' + topic + 'is not exist');
			}
		});
	},
	hasSub: function(topic){
		return this._topicExist(topic);
	}
};


//section2: 孩子妈叫孩子回家吃饭的场景
var Mom = function(){
	this.son = [];
};
Mom.prototype.call = function(msg){
	this.son.forEach(function(item){
		item.receive(msg);
	});
};
var Son = function(name){
	this.name = name;
};
Son.prototype.subscribe = function(mom){
	var me = this,
		isCall = mom.son.some(function(item){
			return me === item;
		});
	if(!isCall){
		mom.son.push(me);
	}
	return this;
};
Son.prototype.unsubscribe = function(mom){
	var me = this;
	mom.son = mom.son.filter(function(item){
		return item !== me;
	});
	return this;
};
Son.prototype.receive = function(msg){
	//...
};
var mom = new Mom(), son = new Son('小明');
son.subscribe(mom);
mom.call('滚出去最近很火');
```
## 个人体会
当一个抽象模型有两个方面，其中一个方面的操作依赖于另一个方面的状态变化，那么就可以选用
观察者模式，将这两者封装成为观察者和被观察者，当被观察者发生变化的时候，依赖于他的观察
者也发生相应的变化，这样就实现了两者的解耦使得他们可以各自独立使用。如果更改一个对象的
时候，需要同时改变其他对象，但并不知道有多少个对象需要被改变这种情况也可以选用观察者模
式，这是一种一对多的关系也是最常见的一种使用场景。当一个对象必须通知其他对象，但是又希望
这个对象和其他对象之间是一种松散耦合关系，这种情况也可以考虑使用观察者模式。至于观察者
和被观察者之间关系的建立，处理的方式是灵活的，可以再被观察者对象上注册观察者也可以在观察
者对象上中注册被观察者（妈妈叫小明吃饭的例子属于后者）


