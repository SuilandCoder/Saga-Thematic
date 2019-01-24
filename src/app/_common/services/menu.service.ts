import { Injectable } from '@angular/core';
import * as $ from "jquery"; 

@Injectable()
export class MenuService {

  constructor() { }

  public getTreeJson() {
    return new Promise(function (resolve, reject) {
      $.ajax({
        type: "get",
        async: false,
        url: "assets/json/tree.json",
        dataType: "json",
        success: function (result) {
          resolve(result);
        },
        error: function () {
          reject();
        }
      })
    });
  }

  public queryModelJson(link) {
    let url = "assets/"+link;
    return new Promise(function(resolve,reject){
      $.getJSON(url,function(data){
        resolve(data);
      });
    })
  }
}
