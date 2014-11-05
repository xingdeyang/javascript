//ÊµÏÖ¶þ²æÊ÷
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
				parentNode.left = targetNode£»
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

var binaryTreeIns = new BinaryTree();
binaryTreeIns.insert(50);