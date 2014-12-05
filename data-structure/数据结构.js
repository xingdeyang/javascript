/*
* stack
* queue
* sets(union intersect difference)
* linkedlist
* dictionary
* */

//set

function Set(){
    this.dataStore = [];
    this.add = add;
    this.remove = remove;
    this.size = size;
    this.intersect = intersect;
    this.union = union;
    this.difference = difference;
}

function size(){
    return this.dataStore.length;
}

function add(data){
    var dataStore = this.dataStore;
    if(dataStore.indexOf(data) == -1){
        this.dataStore.push(data);
        return true;
    }
    else{
        return false;
    }
}

function remove(data){
    var pos = this.dataStore.indexOf(data);
    if(pos > -1){
        this.dataStore.splice(pos,1);
        return true;
    }
    else{
        return false;
    }
}

function union(set){
    var _set = new Set();
    for(var i=0; i<this.dataStore.length; i++){
        _set.add(this.dataStore[i]);
    }
    for(var j=0; j<set.dataStore.length; j++){
        _set.add(set.dataStore[j]);
    }
    return _set;
}

function intersect(set){
    var _set = new Set();
    for(var i=0; i<this.dataStore.length; i++){
        if(set.dataStore.indexOf(this.dataStore[i]) !== -1){
            _set.add(this.dataStore[i]);
        }
    }
    return _set;
}

function subset(set){
    if(this.size() > set.size()){
        return false;
    }
    else{
        for(var i=0; i<this.dataStore.length; i++){
            if(set.indexOf(this.dataStore[i]) == -1){
                return false;
            }
        }
        return true;
    }
}

function difference(set){
    var _set = new Set();
    for(var i=0; i<this.dataStore.length; i++){
        if(set.dataStore.indexOf(this.dataStore[i]) == -1){
            _set.add(this.dataStore[i]);
        }
    }
    return _set;
}

//dictionary
function Dictionary(){
    this.dataStore = new Array();
    this.add = add;
    this.find = find;
    this.size = size;
}

function size(){
    var me = this;
    return Object.keys(me.dataStore).length;
}

function add(key,value){
    this.dataStore[key] = value;
}

function find(key){
    return this.dataStore[key];
}

function remove(key){
    delete this.dataStore[key];
}

function showAll(){
    for(var key in Object.keys(this.dataStore).sort()){
        return this.dataStore[key];
    }
}

//linkedList
function Node(element){
    this.element = element;
    this.next = null;
    this.previous = null;
}

function LinkedList(){
    this.head = new Node('head');
    this.find = find;
    this.findPrevious = findPrevious;
    this.findLast = findLast;
    this.insert = insert;
    this.remove = remove;
}

function find(item){
    var currentNode = this.head;
    while(currentNode && currentNode.element !== item){
        currentNode = currentNode.next;
    }
    return currentNode;
}

function findPrevious(item){
    var currentNode = this.head;
    while(currentNode.next){
        if(currentNode.next.item !== item){
            currentNode = currentNode.next;
        }
        else{
            return currentNode;
        }
    }
}

function findLast(){
    var currentNode = this.head;
    while(currentNode.next){
        currentNode = currentNode.next;
    }
    return currentNode;
}

function insert(node,item){
    var targetNode = this.find(item);
    node.next = targetNode.next;
    targetNode.next = node;
    node.previous = targetNode;
}

function remove(item){
    var targetNode = this.find(item),
        previousNode = this.findPrevious(item),
        nextNode = targetNode.next;
    previousNode.next = nextNode;
    nextNode.previous = previousNode;
    targetNode = null;
}

//hash
function HashTable(){
    this.table = new Array(137);
    this.createHash = createHash;
    this.put = put;
    this.get = get;
}

function put(data){
    var key = this.createHash(data),
        index = 0;
    if(this.table[key][index] == undefined){
        this.table[key][index] = data;
    }
    else{
        this.table[key][index] = data;
    }
}

function createHash(data){

}






