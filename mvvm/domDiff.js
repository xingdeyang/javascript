/* dom diff 算法实现
1. 先序深度优先遍历的原则
2. 同级比较
3. diff找出差异，打补丁patch修复差异
4. 将patch打到真实DOM上
*/

// 依赖的基础方法
class Element {
    constructor (type, prop, children) {
        this.type = type
        this.prop = prop
        this.children = children
    }
}

function createElement (type, prop, children) {
    return new Element(type, prop, children)
}

function createNode (virtualDom) {
    let type = virtualDom.type
    let el = document.createElement(type)
    let props = virtualDom.prop
    for (var key in props) {
        if (key == 'value') {
            if (type.toUpperCase() == 'INPUT' || type.toUpperCase() == 'TEXTAREA') {
                el.value = props[key]
            }
        } else {
            el.setAttribute(key, props[key])
        }
    }
    return el
}

function createDom (virtualDom) {
    let root = createNode(virtualDom)
    if (virtualDom.children && virtualDom.children.length > 0) {
        virtualDom.children.forEach(item => {
            if (item instanceof Element) {
                root.appendChild(createDom(item))
            } else {
                root.appendChild(document.createTextNode(item))
            }
        })
    }
    return root
}

// 第一步: 通过diff算法生成补丁
let patches = {};
let index = 0;

const ATTR = 0;
const TEXT = 1;
const REMOVE = 2;
const REPLACE = 3;

function diff(oldTree, newTree){
    walk(oldTree, newTree, index);
}

function walk(oldNode, newNode, index){

    let patch = [];
    // 删除
    if(!newNode){
        patch.push({type: REMOVE, index});
        // 文本
    }else if((typeof oldNode === "string") && (typeof newNode === "string")){
        if(newNode !== oldNode){
            patch.push({type: TEXT, text: newNode});
        }
    }else if(oldNode.type === newNode.type){
        // 属性
        let attr = diffAttr(oldNode.prop, newNode.prop);
        if (Object.keys(attr).length > 0) {
            patch.push({ type: ATTR, attr });
        }
        diffChildren(oldNode.children, newNode.children);
    }else {
        // 替换
        patch.push({type: REPLACE, newNode});
    }
    if(patch.length > 0){
        patches[index] = patch;
    }
}

function diffAttr(oldAttr, newAttr){
    let attr = {};
    // 看两个属性是否不同（修改）
    for (var key in oldAttr) {
        if(oldAttr[key] != newAttr[key]){
            attr[key] = newAttr[key];
        }
    }
    // 是否新增
    for (var key1 in newAttr) {
        if(!oldAttr.hasOwnProperty(key1)){
            attr[key1] = newAttr[key1];
        }
    }
    return attr;
}

function diffChildren(oldChildren, newChildren){
    oldChildren.forEach(function(child, i){
        walk(child, newChildren[i], ++ index);
    });
}

let vDom1 = createElement("div", {class: "div"}, [
    createElement("div", {class: "div"}, ["a"])
]);
let vDom2 = createElement("div", {class: "div1"}, [
    createElement("div", {class: "div2"}, ["b"])
]);
diff(vDom1, vDom2)
console.log(patches)


// 第二步: 打补丁（基于实际dom）

/*
* 构建的 JavaScript 对象树和render出来真正的DOM树的信息、结构是一样的。所以我们可以对那棵DOM树也进行深度优先的遍历，遍历的时候从生成的patches对象中找出当前遍历的节点差异，然后进行 DOM 操作
* */
var patchIndex = 0
function patch (dom, patches) {
    walkPatch(dom, patches)
}

function walkPatch (dom) {
    let patch = patches[patchIndex++]
    let children = dom.childNodes
    // 深度优先遍历的体现
    children.forEach(child => {
        walkPatch(child)
    })
    if (patch) {
        doPatch(dom, patch)
    }
}

function doPatch (node, patch) {
    patch.forEach(p => {
        switch (p.type) {
            case ATTR:
                for (key in p.attr) {
                    let value = p.attr[key]
                    if (value) {
                        node.setAttribute(key, value)
                    } else {
                        node.removeAttribute(key)
                    }
                }
                break;
            case TEXT:
                node.textContent = p.text;
                break;
            case REMOVE:
                node.parentNode.removeChild(node);
                break;
            case REPLACE:
                let newNode = p.newNode,
                    _newNode = newNode instanceof Element ? createDom(newNode) : document.createTextNode(newNode);
                node.parentNode.replaceChild(_newNode, node)
                break;
            default:
                break;
        }
    })
}