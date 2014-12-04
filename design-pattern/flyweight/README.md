# Flyweight:享元模式
## 简介

运行共享技术有效地支持大量细粒度的对象，避免大量拥有相同内容的小类的开销(如耗费内存)，使大家共享一个类(元类)。
享元模式可以避免大量非常相似类的开销，在程序设计中，有时需要生产大量细粒度的类实例来表示数据，如果能发现这些实例除了几个参数以外，开销基本相同的 话，就可以大幅度较少需要实例化的类的数量。如果能把那些参数移动到类实例的外面，在方法调用的时候将他们传递进来，就可以通过共享大幅度第减少单个实例 的数目。
## 使用场景
1. 存在资源密集型的对象，这些对象所保存数据有一部分可以转化为外在数据（高内聚）

1. 在外在数据分离出去后，对象数量将会有量级的减少

1. 在DOM层，享元模式被称作事件管理中心（也即事件委托）


## 特点
* 将对象数据一分为二，内在数据用来创建共享对象，用于共享

* 外在数据保存在管理器中，以便于标示对象的唯一性

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


//section2:用享元模式改造后
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

```
