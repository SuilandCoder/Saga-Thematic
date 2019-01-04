var fs = require('fs');
var cheerio = require('cheerio');

var myHtml = fs.readFileSync("./src/app/scripts/a.html");

var $ = cheerio.load(myHtml);
var tbody = $('tbody').children("tr").each((i,elem)=>{
    console.log(elem);
});