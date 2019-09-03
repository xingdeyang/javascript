function deepClone (source, target) {
    if (typeof source !== 'object') {
        return source
    }
    if (!target) {
        target = Object.prototype.toString.call(source) === '[object Array]' ? [] : {}
    }
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            let tmpVal = source[key]
            if (Object.prototype.toString.call(tmpVal) === '[object Array]') {
                target[key] = []
                deepClone(source[key], target[key])
            } else if (Object.prototype.toString.call(tmpVal) === '[object Object]') {
                target[key] = {}
                deepClone(source[key], target[key])
            } else {
                target[key] = source[key]
            }
        }
    }
    return target
}