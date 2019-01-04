import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({ name: 'upperCaseFirst' })
export class UpperCaseFirst implements PipeTransform {
    transform(value: string): string {
        　　　　　//返回值需要是一个函数对象
        var arr = value.toString().split(" ");　　//将目标值利用空格分割，保存为一个数组对象
        arr = arr.map((ele,index)=> {　　//利用高阶函数map的方法将对每一个元素进行匹配
            if (ele && ele[0].charCodeAt(index) >= 97 && ele[0].charCodeAt(index) <= 122) {　　　　//判断当前单词是否是小写字母
                ele = ele[0].toUpperCase() + ele.substring(1);
            }
            return ele;
        });
        return arr.join(" ");　　　　//将改变后的数组arr以空格拼接为字符串，作为返回值
    }
}