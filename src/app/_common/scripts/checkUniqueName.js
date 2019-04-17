//** 该脚本用来检查saga所有工具是否有重名的 */

var fs = require("fs");
var path = require("path");
var filePath = path.resolve("./src/assets/json/tools_tree.json");

var nameList= [];

var data = fs.readFileSync(filePath, 'utf-8');
var data = JSON.parse(data);

parseChild(data)

function parseChild(data){
    data.forEach(item=>{
        var child = item.children;
        if(child){
            parseChild(child);
        }else{
            var label = item.value;
            var index = nameList.indexOf(label);
            if(index>=0){
                console.log("改工具已经存在~",label);
            }else{
                nameList.push(label);
            } 
        }
    })
}
