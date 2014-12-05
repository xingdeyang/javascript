# Flyweight:享元模式
## 简介

运行共享技术有效地支持大量细粒度的对象，避免大量拥有相同内容的小类的开销(如耗费内存)，使大家共享一个类(元类)。
享元模式可以避免大量非常相似类的开销，在程序设计中，有时需要生产大量细粒度的类实例来表示数据，如果能发现这些实例除了几个参数以外，开销基本相同的 话，就可以大幅度较少需要实例化的类的数量。如果能把那些参数移动到类实例的外面，在方法调用的时候将他们传递进来，就可以通过共享大幅度第减少单个实例 的数目。
## 使用场景
1. 存在资源密集型的对象，这些对象所保存数据有一部分可以转化为外在数据（高内聚）

1. 在外在数据分离出去后，对象数量将会有量级的减少

1. 在DOM层，享元模式被称作事件管理中心（也即事件委托）
2. 享元与组合模式的配合使用(section2)

3. 享元与单例模式的配合使用(section3)


## 特点
* 将对象数据一分为二，内在数据用来创建共享对象，用于共享（享元也即共享内在状态）

* 外在数据保存在管理器中，通常会改以参数的形式传入

* 享元模式就原有对象拆分为三部分：共享对象，对象工厂，对象管理器

* 减少资源消耗，提高代码运行效率

## 代码示例

```
//section1:以汽车作为对象来看
function Car(make,model,year,owner,tag,renewDate){
	this.make = make;
	this.model = model;
	this.year = year;
	this.owner = owner;
	this.tag = tag;
	this.renewDate = renewDate;
}

Car.prototype.getMake = function(){};
Car.prototype.getModel = function(){};

从上述代码我们可以看出，汽车对象自身的数量是非常大的，但每年不同汽车厂商生产的
不同汽车型号是有限的(也即共享对象的数量是可控的)，当然每部车都拥有自己的tag,owner,renewDate,
这些都可以看做是外在数据。若把这些外在数据单独提取出来，那我们需要实例化的汽车对象数目会有一
个量级的改变


//用享元模式改造后
//共享对象
var Car = function(model,make,year){
	this.model = model;
	this.year = year;
	this.make = make;
};
Car.prototype.getMake = function(){
	return this.make;
};
Car.prototype.getModel = function(){
	return this.model;
};
Car.prototype.getYear = function(){
	return this.year;
};

//共享对象工场
var carFactory = (function(){
	var shareCar = {};
	function createCar(model,make,year){
		var car = shareCar[make + '-' + 'model' + '-' + year];
		if(!car){
			return shareCar[make + '-' + 'model' + '-' + year] = new Car(model,make,year);
		}
		return car;
	}
	return {
		createCar: createCar
	};
})();

//对象管理器
var carManager = (function(){
	var carStore = {};
	return {
		addCar: function(model,make,year,owner,tag,renewDate){
			var car = carFactory.createCar(model,make,year);
			carStore[tag] = {
				owner: owner,
				tag: tag,
				renewDate: renewDate,
				car: car
			};
		},
		transferOwnerShip: function(tag,newOwner){
			var car = carStore[tag];
			car.owner = newOwner;
		},
		getCarInfo: function(tag){
			return carStore[tag];
		}
		...
	};
})();


//section2:
管理享元对象的外在数据有许多方法，使用集中管理的数据库是一种方法（汽车案例就是这样做的），
其优点在于简单易维护，因为管理外在状态的无非就是一个对象字面量。另一种管理外在状态的办法是
使用组合模式，可以使用对象自身的层次体系来保存信息，而不需要一个集中管理的数据库。组合对象
的叶节点全都可以是享元对象，这样一来这些享元对象就可以在组合对象的层次体系中多个地方被共享，
对于大型的对象层次体系这非常有用:
//web 日历
(function(){
	var CalendarYear = function(year,parent){
		this.year = year;
		this.element = document.createElement('div');
		this.element.className = 'year';
		this.element.style.display = 'none';
		var title = document.createElement('h4');
		title.appendChild(document.createTextNode(year));
		parent.appendChild(this.element).appendChild(title);

		function isLeapYear(year){
			return (year > 0) && !(year%4) && ((year%100) || !(year%400));
		}

		this.months = [];
		this.numDays = [31,isLeapYear(year)?29:28,31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		for(var i=0; i<12; i++){
			this.months[i] = new CalendarMonth(i+1,this.numDays[i],this.element);
		}
	};

	CalendarYear.prototype.dispaly = function(){
		for(var i=0; i<this.months.length; i++){
			this.months[i].display();
		}
		this.element.style.display = 'block';
	};


	var CalendarMonth = function(month,days,parent){
		this.month = month;
		this.element = document.createElement('div');
		this.element.className = 'month';
		this.element.style.display = 'none';
		var title = document.createElement('h5');
		title.appendChild(document.createTextNode(month));
		parent.appendChild(this.element).appendChild(title);

		this.days = [];
		for(var i=0; i<days; i++){
			this.days[i] = new CalendarDay(i+1,this.element);
		}
	};

	CalendarMonth.prototype.display = function(){
		for(var i=0; i<this.days.length; i++){
			this.days[i].display();
		}
		this.element.style.display = 'block';
	};

	var CalendarDay = function(date,parent){
		this.date = date;
		this.element = document.createElement('div');
		this.element.className = 'day';
		this.element.style.display = 'none';
		parent.appendChild(this.element);
	};

	CalendarDay.prototype.display = function(){
		this.element.style.display  = 'block';
		this.element.innerHTML = this.date;
	};
})();

这样做的问题在于，你不得不为每一年创建365个calendarDay对象，如需要创建一个20年的日历那么你懂的，
这些对象也许不会过于占用硬件资源，但如果数目过大对于浏览器来说也是一笔不小的资源开销，更加有效
的作法是共享日期对象无论创建的日历要显示多少年。将日期对象享元其实很简单，无非将构造函数中的外
在数据移除，在需要用到的时候以参数形式传入：
(function(){
	var CalendarYear = function(year,parent){
		this.year = year;
		this.element = document.createElement('div');
		this.element.className = 'year';
		this.element.style.display = 'none';
		var title = document.createElement('h4');
		title.appendChild(document.createTextNode(year));
		parent.appendChild(this.element).appendChild(title);

		function isLeapYear(year){
			return (year > 0) && !(year%4) && ((year%100) || !(year%400));
		}

		this.months = [];
		this.numDays = [31,isLeapYear(year)?29:28,31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		for(var i=0; i<12; i++){
			this.months[i] = new CalendarMonth(i+1,this.numDays[i],this.element);
		}
	};

	CalendarYear.prototype.dispaly = function(){
		for(var i=0; i<this.months.length; i++){
			this.months[i].display();
		}
		this.element.style.display = 'block';
	};


	var CalendarMonth = function(month,days,parent){
		this.month = month;
		this.element = document.createElement('div');
		this.element.className = 'month';
		this.element.style.display = 'none';
		var title = document.createElement('h5');
		title.appendChild(document.createTextNode(month));
		parent.appendChild(this.element).appendChild(title);

		this.days = [];
		for(var i=0; i<days; i++){
			this.days[i] = calendarDayIns;
		}
	};

	CalendarMonth.prototype.display = function(){
		for(var i=0; i<this.days.length; i++){
			this.days[i].display(i+1,this.element);
		}
		this.element.style.display = 'block';
	};

	var CalendarDay = function(){};

	CalendarDay.prototype.display = function(date,parent){
		var element = document.createElement('div');
		element.className = 'day';
		parent.appendChild(element);
		element.innerHTML = date;
	};

	var calendarDayIns = new CalendarDay();
})();

现在日期对象的外在数据成了display方法的参数，而不是CalendarDay构造函数的参数，这也是享元主要
的工作方式。享元和组合模式配合的如此完美的原因在于组合的对象本身保存大量叶子对象，并且这些对
象还保存着许多可以作为外在处理的数据，而他们通常是可以提取出共享的内在数据的（享元），很容易
将他们转化为共享资源。


//section3:
单例模式和享元模式配合的经典案例（Tooltip）：
function Tooltip(targetElement,text){
	this.target = targetElement;
	this.text = text;
	this.delayTimeout = null;
	this.delay = 500;

	this.element = document.createElement('div');
	this.element.style.display = 'none';
	this.element.style.position = 'absolute';
	this.element.className = 'tooltip';
	document.body.appendChild(this.element);
	this.element.innerHTML = this.text;

	var me = this;
	this.target.addEventListener('mouseover',function(e){
		me.startDelay(e);
	},false);
	this.target.addEventListener('mouseout',function(e){
		me.hide();
	},false);
}

Tooltip.protype = {
	startDelay: function(e){
		if(this.delayTimeout == null){
			var me = this,
				x = e.clientX,
				y = e.clientY;
			me.delayTimeout = setTimeout(function(){
				me.show(x,y);
			},me.delay);
		}
	},
	show: function(x,y){
		this.element.style.left = x + 'px';
		this.element.style.top = y + 'px';
		this.element.style.display = 'block';
	},
	hide: function(){
		this.element.style.display = 'none';
	}
};
var dom1 = $('#link1'),
	dom2 = $('#link2');

new Tooltip(dom1,'some tips');
这样使用会面临同样的问题就是每个显示提示框操作都要生成一个Tooltip对象，对内存造成不必要的一些占用。
采用享元模式只需要创建一个或者少许几个即可，将提示内容和提示框的位置信息作为外在数据存储，优化后
代码如下：
(function(){
	var tooltipIns;

	function Tooltip(){
		this.delayTimeout = null;
		this.delay = 500;
		this.element = document.createElement('div');
		this.element.style.display = 'none';
		this.element.style.position = 'absolute';
		this.element.className = 'tooltip';
		document.body.appendChild(this.element);
	}

	Tooltip.protype = {
		startDelay: function(e,text){
			if(this.delayTimeout == null){
				var me = this,
					x = e.clientX,
					y = e.clientY;
				me.delayTimeout = setTimeout(function(){
					me.show(x,y,text);
				},me.delay);
			}
		},
		show: function(x,y,text){
			this.element.innerHTML = text;
			this.element.style.left = x + 'px';
			this.element.style.top = y + 'px';
			this.element.style.display = 'block';
		},
		hide: function(){
			this.element.style.display = 'none';
		}
	};

	return {
		createTooltip: function(){
			if(!tooltipIns){
				tooltipIns = new Tooltip();
			}
			return tooltipIns;
		},
		addTooltip: function(targetElement,text){
			var a = this.createTooltip();
			targetElement.addEventListener('mouseover',function(e){
				a.startDelay(e,text);
			},false);
			targetElement.addEventListener('mouseout',function(e){
				a.hide();
			},false);
		}
	};
})();
上述代码中通过单例模式获取的对象也就是享元，外在数据还是从构造器中拿出而改为以参数的方式按需传入，我们是没有创建中心数据库的，
我们需要创建的tooltip实例也只有一个。

```
