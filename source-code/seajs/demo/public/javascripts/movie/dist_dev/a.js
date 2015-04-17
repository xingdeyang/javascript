/**
 * Created by Administrator on 2015/4/10.
 */
define(function(require,exports,module){
    var b = require('../src/b.js'),
        c = require('../src/c.js');

    exports.say = function(){
        alert('xx');
        alert('test456');
        b.say();
    };
});
