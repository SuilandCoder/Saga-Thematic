/**
 * * 该脚本用来生成或更新 tools_tree.json 文件。
 * * tools_tree 文件为 saga application页面的工具树信息。
 */
var fs = require("fs");
var path = require("path");
var filePath = path.resolve("./src/assets/json/tree.json");
var result = "./src/assets/json/tools_tree.json";

const settings = {
  cssClasses: {
    expanded: 'fa fa-caret-down',
    collapsed: 'fa fa-caret-right',
    empty: 'fa fa-caret-right disabled',
    leaf: 'fa fa-lg'
  },
  templates: {
    node: '<i class="fa fa-archive tree-node"></i>',
    leaf: '<i class="fa fa-wrench tree-leaf"></i>'
  },
  isCollapsedOnInit: true,
}

generateTreeJson(filePath);

function generateTreeJson(path) {
  fs.readFile(path, (err, data) => {
    if (err) {
      console.log("Json文件读取失败");
    } else {
      if (JSON.parse(data).length === 0) {
        console.log("暂无数据");
      } else {
        var content = [];
        var res = JSON.parse(data);
        for (var key in res) {
          var node = {};
          var children = [];
          node['value'] = key;
          node['id']= key;
          node["settings"] = settings;
          toolJson = res[key];
          console.log(toolJson);
          for (var toolKey in toolJson) {
            var childNode = {};
            var value = toolKey;
            var toolPath = toolJson[toolKey];
            // console.log(toolKey);
            tools = parseTools(toolPath);
            childNode['value'] = value;
            childNode['id']=toolPath;
            childNode['children'] = tools;
            children.push(childNode);
          }
          node['children'] = children;
          content.push(node);
        }
        console.log(content);
        fs.writeFile(result, JSON.stringify(content), function (err) {
          if (err) {
            return console.log("write error");
          } else {
            console.log("success");
          }
        })
      }
    }
  })
}

function parseTools(filePath) {
  filePath = path.resolve("./src/assets", filePath);
  var data = fs.readFileSync(filePath, 'utf-8');
  if (JSON.parse(data).length === 0) {
    console.log("暂无数据");
    return null;
  } else {
    var data = JSON.parse(data);
    var toolsJson = data["tools"];
    var tools = []
    toolsJson.forEach(data => {
      var node = {};
      var id = data.tool_id;
      var value = data.tool_name;
      node["id"] = id;
      node['value'] = value;
      tools.push(node);
    })
    return tools;
  }
}
