import { UserDataService } from './user-data.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { _HttpClient } from './../httpUtils/http.client';
import { BehaviorSubject } from 'rxjs';
import { Injectable, Inject } from "@angular/core";
import { Location } from '@angular/common';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn:'root'
})
export class UserService{
    private _jwt;
    private baseUrl;
    
    public logined$:BehaviorSubject<boolean>;

    constructor(
        private http: _HttpClient,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private userDataService:UserDataService,
        @Inject("API") private api,
    ){
        this.baseUrl = `${this.api.backend_user}`;
        var jwt = localStorage.getItem('jwt');
        if(jwt){
            jwt = JSON.parse(jwt);
            this._jwt = jwt;
            if(this.isLogined){
                this.logined$ = new BehaviorSubject<boolean>(true);
                return;
            }
        }
        this.logined$ = new BehaviorSubject<boolean>(false); 
    }

    public set jwt(jwt) {
        this._jwt = jwt;
        console.log('current login state: ' + this.logined$.value);
        if (jwt) {
            localStorage.setItem('jwt', JSON.stringify(jwt));
            let url = this.route.snapshot.queryParams['redirect'];
            this.logined$.next(true);
            if (!url || url.indexOf('#/users/sign') !== -1) {
                this.router.navigate(['/saga-tools']);
            }
            else {
                this.router.navigate([url]);
            }
        }
        else {
            localStorage.removeItem('jwt');
            this.logined$.next(false);
        }
    }

    public get jwt() {
        return this._jwt;
    }

    public get user() {
        if (this.isLogined) {
            return this.jwt.user;
        }
        else {
            return null;
        }
    }

    public get isLogined(): boolean {
        return this.jwt;
    }

    signOut() {
        this.jwt = null;
        this.userDataService.userDatas = null;
    }

    signUp(user): Observable<any> {
        return this.http.post(`${this.baseUrl}/sign-up`, user)
            .pipe(
                map(res => {
                    console.log(res);
                    if (res.error) {
                        console.error('error in user.service: ', `${res.error}`);
                        return res;
                    }
                    else {
                        this.jwt = res.data;
                        this.http.setAuthHeaders();
                        return res;
                    }
                })
            )
    }

    signIn(user):Observable<any>{
        return this.http.post(`${this.baseUrl}/sign-in`, user)
            .pipe(
                map(res=>{
                    if(res.error){
                        console.error('error in user.service:', `${res.error}`);
                        return res;
                    }else{
                        this.jwt = res.data;
                        this.http.setAuthHeaders();
                        return res;
                    }
                })
            )
    }


}