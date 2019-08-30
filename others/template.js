	// 测试数据 
        var mylist = [{name: 'derick'}, {name: 'nana'}],
            testTplStr = '<ul><% for(var i=0; i<data.length; i++) { %><li><%= data[i].name %></li> <% } %></ul>';

        // 原始方法: dom字符串拼接
        function originalCreateTpl (data) {
            var arr = [];
            arr.push('<ul>')
            for (var i=0; i<data.length; i++) {
                arr.push('<li>' + data[i].name + '</li>')
            }
            arr.push('</ul>')
            return arr.join('');
        }

        // 新方案: 模板引擎
        // tips1: 在html中编写模板代码, 一般放在script标签内部, 每个模板指定id
        // tips2: 模板引擎中<%...%>为js逻辑代码部分,<%=...%>为js数据输出部分
        // tips3: 获取模板字符串，例如: testTplStr = document.getElementById('tpl1').innerHTML

        // 模板引擎: 模板字符串转换为函数构造器的字符串
        function tplEngine (tplStr) {
            var reg = /<%=?([^%>]+)%>/g,
                reg1 = /^(\s*(if|else|for|switch|case|break|}))/g,
                // \n是为了便于查看生成字符串的结构，生产使用可以优化掉
                codeStr = 'var arr = []; \n',
                cursor = 0, matchResult;

            var addStr = function (str, isJs) {
                // 区分是否为js代码部分
                if (isJs) {
                    // 区分是否为逻辑代码部分
                    if (str.match(reg1)) {
                        codeStr += (str + '\n')
                    } else {
                        // 注意这里变量不要作为字符串push，坑
                        codeStr += `arr.push(${str}); \n`
                    }
                } else {
                    codeStr += `arr.push('${str}'); \n`
                }
            }

            while(matchResult = reg.exec(tplStr)) {
                addStr(tplStr.slice(cursor, matchResult.index))
                // 子匹配
                addStr(matchResult[1], true)
                cursor = matchResult.index + matchResult[0].length
            }
            // 截取最后一部分
            addStr(tplStr.slice(cursor, tplStr.length))
            codeStr += 'return arr.join("")'
            return codeStr
        }
        tplEngine(testTplStr)

        // 通过函数构造器生成函数，注意第一个参数（形参）的使用
        var tplFunc = new Function('data', tplEngine(testTplStr))
        tplFunc([{name: 'derick'}, {name: 'nana'}])
        // 得到最终生成的dom字符串, end
