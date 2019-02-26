// import FileSystemObject from Scripting;
var fs = require("fs");
var readline = require('readline');
var path = require("path");
var filePath = path.resolve("F:\\DATA\\test\\Annual Course of Daily Insolation.txt");

readFileToArr(filePath,function(arr,value){
    console.log(arr);
    console.log(value);
})

/*
* 按行读取文件内容
* 返回：字符串数组
* 参数：fReadName:文件名路径
*      callback:回调函数
* */
function readFileToArr(fReadName,callback){
    var fRead = fs.createReadStream(fReadName);
    var objReadline = readline.createInterface({
        input:fRead
    });
    var firstLine = true;
    var fieldArr = new Array();
    var fieldValue = new Array();
    let obj;
    objReadline.on('line',function (line) {
        if(firstLine){
            fieldArr = line.split("\t");
            console.log(fieldArr);
        }else{
            var arr = line.split("\t");
            console.log(arr);
            arr.forEach((element,index) => {
                console.log("element ",element);
                obj[fieldArr[index]]=element;
            });
            fieldValue.push(obj);
        } 
        firstLine = false;
        //console.log('line:'+ line);
    });
    objReadline.on('close',function () {
       // console.log(arr);
        callback(fieldArr,fieldValue);
    });
}
