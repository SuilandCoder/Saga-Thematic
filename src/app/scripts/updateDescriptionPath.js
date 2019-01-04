/**
 *  * 该脚本用来获取所以模型在模型门户的地址，并将模型地址更新进 Json 文件中
 */
var fs = require("fs");
var path = require("path");
var http = require("http")
var request = require("request");
var filePath = path.resolve("./src/assets/json/modelInfo");

var pathNum = 0;

updateJson_addPath(filePath);

function updateJson_addPath(filePath) {
  fs.readdir(filePath, (err, files) => {
    if (err) {
      console.warn("文件读取失败");
    } else {
      files.forEach(filename => {
        var filedir = path.join(filePath, filename);
        fs.stat(filedir, (error, stats) => {
          if (error) {
            console.warn("获取文件stats失败");
          } else {
            var isFile = stats.isFile();
            var isDir = stats.isDirectory();
            if (isFile) {
              // console.log(filedir);
            //   console.log(filename);
              if (filename.includes("application") || filename.includes("tree") || filename == "climate.json") {
                console.log(filename + "忽略");
              } else {
                //* 读取json文件
                readJsonFile(filedir).then(res => {
                  // ({library_name,tools} = res);
                  var toolNum = res.tools.length;
                  var count = 0;
                  res.tools.map((tool, index) => {
                    model_name = getModelName(res.library_name, tool);
                    getModelItemPath(model_name).then(data => {
                      count++;
                      var dataStr = data.toString();
                      if (dataStr.startsWith("{")) {
                        var dataJson = JSON.parse(dataStr);
                        if (dataJson.code == 0) {
                          // console.log(dataJson.data.path);
                          path = dataJson.data.path;
                          pathNum++;
                          console.log("pathNum:" + pathNum);
                          console.log("result:" + path);
                        //   var descritptionPath = res.library_name
                          tool["tool_path"] = path;
                          console.log("tooNum：" + toolNum + "  count:" + count);
                          if(toolNum==count){
                            //   console.log(res)
                            //   console.log("library_path:"+filedir);
                              fs.writeFile(filedir,JSON.stringify(res),function(err){
                                if(err){
                                    return console.log("write error");
                                }else{
                                    console.log("success");
                                }
                            });
                          }
                        }
                      }
                    });
                  })
                });
              }
            }
          }
        })
      })
    }
  });
}

function readJsonFile(filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, (err, data) => {
      if (err) {
        console.log("Json文件读取失败");
        return reject("error");
      } else {
        if (JSON.parse(data).length === 0) {
          console.log("暂无数据");
          return reject("暂无数据");
        } else {
          var res = JSON.parse(data);
          resolve(res);
        }
      }
    });
  });
}

function getModelName(library_name, tool) {
  var toolName = library_name + "_" + tool.tool_id + "-" + tool.tool_name;
  toolName = toolName.replace(/ /g, "_");
  toolName = toolName.replace(/\(/g, "_");
  toolName = toolName.replace(/\)/g, "");
  toolName = toolName.replace(/\:/g, "");
  toolName = toolName.replace(/\,/g, "");
  console.log("toolName:" + toolName);
  return toolName;
}

