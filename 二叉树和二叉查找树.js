//实现二叉树,注意parentNode引用关系
function Node(data,left,right){
	this.data = data;
	this.left = left || null;
	this.right = right || null;
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
				break;
			}
		}
		else{
			currentNode = parentNode.right;
			if(!currentNode){
				parentNode.right = targetNode;
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
			return true;
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

//For example:
var binaryTreeIns = new BinaryTree();
binaryTreeIns.insert(50);
binaryTreeIns.insert(60);
binaryTreeIns.insert(40);
binaryTreeIns.find(40);