//实现二叉树,注意parentNode引用关系
function Node(data,left,right,parent){
	this.data = data;
	this.left = left || null;
	this.right = right || null;
	this.parent = parent || null;
	this.show = show;
}

function show(){
	return this.data;
}

function BinaryTree(root){
	this.root = root || null;
	this.insert = insert;
	this.find = find;
	this.findMin = findMin;
	this.findMax = findMax;
	this.remove = remove;
	//遍历
	this.traversalAsc = traversalAsc;
	this.traversalTop = traversalTop;
	this.traversalBottom = traversalBottom;
}

function insert(data){
	var targetNode = new Node(data),
		currentNode = this.root,
		parentNode;
	if(!currentNode){
		this.root = targetNode;
		return;
	}
	while(true){
		parentNode = currentNode;
		if(data < currentNode.data){
			currentNode = parentNode.left;
			if(!currentNode){
				parentNode.left = targetNode;
				targetNode.parent = parentNode;
				break;
			}
		}
		else{
			currentNode = parentNode.right;
			if(!currentNode){
				parentNode.right = targetNode;
				targetNode.parent = parentNode;
				break;
			}
		}
	}
}

function find(data){
	var currentNode = this.root;
	while(true){
		if(!currentNode){
			return false;
		}
		if(currentNode.data == data){
			return currentNode;
		}
		else if(data < currentNode.data){
			currentNode = currentNode.left;
		}
		else{
			currentNode = currentNode.right;
		}
	}
}

function findMin(){
	var currentNode = this.root;
	while(currentNode.left !== null){
		currentNode = currentNode.left;
	}
	return currentNode.data;
}

function findMax(){
	var currentNode = this.root;
	while(currentNode.right !== null){
		currentNode = currrentNode.right;
	}
	return currentNode.data;
}

function remove(data){
	var targetNode = this.find(data);
	if(!targetNode){return;}
	if(!targetNode.left && targetNode.right){
		
	}
}

//升序二叉树遍历
function traversalAsc(node){
	var self = arguments.callee;
	if(!(node == null)){
		self(node.left);
		console.log(node.show());
		selft(node.right);
	}
}

//自上而下二叉树遍历
function traversalTop(node){
	var self = arguments.callee;
	if(!(node == null)){
		console.log(node.show());
		self(node.left);
		self(node.right);
	}
}

//自下而上二叉树遍历
function traversalBottom(node){
	var self = arguments.callee;
	if(!(node == null)){
		self(node.left);
		self(node.right);
		console.log(node.show());
	}
}


//For example:
var binaryTreeIns = new BinaryTree();
binaryTreeIns.insert(50);
binaryTreeIns.insert(60);
binaryTreeIns.insert(40);
binaryTreeIns.find(40);

