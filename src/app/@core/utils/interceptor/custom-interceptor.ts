import { Injectable } from "@angular/core";
import { HttpEvent,HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { Observable } from 'rxjs';
@Injectable()
export class CustomInterceptor implements HttpInterceptor{
    
    intercept(req: HttpRequest<any>,next:HttpHandler): Observable<HttpEvent<any>>{
        return next.handle(req);
    }
}