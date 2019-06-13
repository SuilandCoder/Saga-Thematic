//* 根据 tree_classification.json 文件生成 门户分类树所需格式的文件
var fs = require("fs");
var path = require("path");
var filePath = path.resolve("./src/assets/json/tree_classification.json");
var result = "./src/assets/json/portalClassification.json";

// main(filePath, result);


function main(filePath, result) {
    parseTools(filePath, result);
}


/**
 *  读取 tree_classification.json 数据，生成 门户需要的分类信息数据，并写入portalClassification.json
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
    var data = JSON.parse(data);
    classifiedTree = parseItem(data);
    fs.writeFileSync(result, JSON.stringify(classifiedTree));
  }
}

/**
 * 递归 创建 分类信息
 * 
 * @param {string} data json 数据
 */
function parseItem(data) {
  var cl = {};
  cl["label"] = data.label;
  cl["oid"] = data.oid;
  if(data.children){
      cl["children"] = [];
      data.children.forEach(child=>{
          var res = parseItem(child);
          if(res!=""){
            cl["children"].push(parseItem(child));
          }
      })
  }else{
      return "";
  }
  if(cl["children"].length==0){
    return {"label": data.label,"oid":data.oid};
  }
  return cl;
}

