//* 门户saga模型条目所需要的分类树信息
//* 通过 tools_tree.json获取分类树并添加分类oid
//* 生成的结果文件有两个用途： 1.用户给门户 classifications 表添加saga工具的分类数据  2.更新门户 modelItem 表 中saga条目的classification集合；
var fs = require("fs");
var path = require("path");
var filePath = path.resolve("./src/assets/json/tools_tree.json");
var result = "./src/assets/json/tree_classification.json";
var http = require("http")

main(filePath, result);

//* tree_classification已存在，而且不需要更新了
var needUpdate = false;

function main(filePath, result) {
  //*生成 或 更新 工具分类树：
  if(needUpdate){
    parseTools(filePath, result);
  }
  var treeJson = getSagaJson(result);
  if (treeJson) {
    updateClassification(treeJson);
  }
}

//* 读取json文件
function getSagaJson(filePath) {
  var data = fs.readFileSync(filePath, 'utf-8');
  data = JSON.parse(data);
  return data;
}

//* 向后台发送请求 添加分类信息
function updateClassification(json) {
  var options = {
    hostname: "127.0.0.1",
    port: 9999,
    path: "/api/addClassification",
    contentType: "application/json; charset=utf-8",
    method: "post",
  }
  return new Promise((resolve, reject) => {
    var req = http.request(options, res => {
      res.on('data', function (data) {
        console.log(data.toString());
        resolve(data);
      })
    });
    //* post 请求 body
    req.write(JSON.stringify(json));
    req.end();
  })
}


/**
 *  读取 tools_tree.json 数据，生成 分类信息数据，并写入tree_classification.json
 * 
 * @param {string} filePath 
 * @param {*} result 
 */
function parseTools(filePath, result) {
  var data = fs.readFileSync(filePath, 'utf-8');
  if (JSON.parse(data).length === 0) {
    console.log("暂无数据");
    return false;
  } else {
    var classifiedTree = {};
    classifiedTree["oid"] = generateUUID();
    classifiedTree["label"] = "SAGA";
    //* parentId 是从门户数据库查的 Geographic Information Analysis分类的id.
    classifiedTree["parentId"] = "3afc51dc-930d-4ab5-8a59-3e057b7eb086";
    var tools = []
    console.log(data);
    var data = JSON.parse(data);
    tools = parseItem(data,classifiedTree["parentId"]);
    console.log(tools);
    classifiedTree["children"]=tools;
    fs.writeFileSync(result, JSON.stringify(classifiedTree));
  }
}

/**
 * 递归 创建 分类信息
 * 
 * @param {string} data json 数据
 * @param {string} parentId 
 */
function parseItem(data, parentId) {
  var tools = []
  data.forEach(data => {
    var node = {};
    var label = data.value;
    var id = data.id;
    var oid = generateUUID();
    node["label"] = label;
    node["id"] = id;
    if (parentId) {
      node["parentId"] = parentId;
    }
    var child = data.children;
    if (child) {
      node["oid"] = oid;
      var children = parseItem(child, oid);
      node["children"] = children;
    }
    console.log("子类：", node);

    tools.push(node);
  })
  return tools;
}

/**
 * generateUUID 生成UUID
 * @returns {string} 返回字符串
 */
function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
  });
  return uuid;
}
