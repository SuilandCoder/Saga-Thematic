const fs = require("fs");

fs.readFile('./src//assets//json/tree.json', (err, data) => {
    if (err) {
        console.log("文件读取失败");
    } else {
        if (JSON.parse(data).length === 0) {
            console.log("暂无数据");
        } else {
            var res = JSON.parse(data);
            var new_tree= {};
            res.forEach(element => {
                // console.log("text:"+element.text);
                var child = {};
                element.nodes.forEach(node=>{
                    // console.log("text:"+node.text +"  link:"+node.link);
                    child[node.text]=node.link;
                })
                new_tree[element.text]=child; 
            });
            console.log(JSON.stringify(new_tree));
            var content = JSON.stringify(new_tree);
            var file = "./src/assets/json/tree_new.json";
            fs.writeFile(file,content,function(err){
                if(err){
                    return console.log("write error");
                }else{
                    console.log("success");
                }
            });
        }
    }
});
