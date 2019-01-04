var a = {"tools":[
    {"b":123},
    {"b":345},
    {"b":456}
]};
tools = a.tools;
tools.map((tool,index)=>{
    console.log("index:"+index);
    console.log("map tool:"+JSON.stringify(tool));
   return tool["c"]=123;
});
console.log("tools length:"+tools.length)
console.log(JSON.stringify(tools));

var d = {"aa":123,"bb":123};
({aa,bb}=d);

console.log("aa"+aa);                       
var a = {"tools":[
    {"b":123},
    {"c":345},
    {"d":4664},
]};
