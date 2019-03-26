/**
 *  * 该脚本用来更新modelInfo文件夹下的文件信息
 *  * 包括 oid, stateId, tool_path，
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
              console.log(filename);
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
                    updateModleJson(model_name).then(data => {
                      // return;
                      count++;
                      var dataStr = data.toString();
                      if (dataStr.startsWith("{")) {
                        var dataJson = JSON.parse(dataStr);
                        if (dataJson.code == 0) {
                          // console.log(dataJson.data.path);
                          tool_path = dataJson.data.path;
                          oid = dataJson.data.oid;
                          stateId = dataJson.data.stateId;
                          mdlId = dataJson.data.mdlId;
                          pathNum++;
                          console.log("pathNum:" + pathNum);
                          console.log("result:" + tool_path);
                          tool["tool_path"] = tool_path;
                          tool["oid"] = oid;
                          tool["stateId"] = stateId;
                          tool['mdlId'] = mdlId;
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


function updateModleJson(name){
  var options = {
    hostname: "127.0.0.1",
    port: 9999,
    path: "/api/updateModelJson?name=" + name,
    method: "GET",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    }
  }
  return new Promise((resolve, reject) => {
    var req = http.request(options, res => {
      res.on('data', function (data) {
        console.log(data.toString());
        resolve(data);
      })
    });
    req.end();
  })
}

function getModelItemPath(model_name) {
  var options = {
    hostname: "127.0.0.1",
    port: 9999,
    path: "/saga_theme/api/getModelPath?model_name=" + model_name,
    method: "GET",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    }
  }
  return new Promise((resolve, reject) => {
    var req = http.request(options, res => {
      res.on('data', function (data) {
        resolve(data);
      })
    });
    req.end();
  })

}
