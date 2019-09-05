// virtualDom 本质就是一个js对象，例如{type: 'div', prop: {class: 'container', id: 'test'}, children: []}

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

// 以下以一个ul li的列表为例
var virtualDom = createElement('ul', {class: "mylist"}, [
    createElement('li', {class: "item"}, ['derick']),
    createElement('li', {class: "item"}, ['nana']),
    createElement('li', {class: "item"}, ['xinzai'])
])

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

document.body.appendChild(createDom(virtualDom))