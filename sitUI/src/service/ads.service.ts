import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";

import { JwtService } from "./jwt.service";
import { map, distinctUntilChanged, tap, shareReplay } from "rxjs/operators";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from "../models/user.model";
import { Router } from "@angular/router";
import { environment } from './../environments/environment';

@Injectable({ providedIn: "root" })
export class ADSService {
    
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser = this.currentUserSubject
        .asObservable()
    // .pipe(distinctUntilChanged());

    public isAuthenticated = this.currentUser.pipe(map((user) => !!user));

    constructor(
        private readonly http: HttpClient,
        private readonly jwtService: JwtService,
    ) { }


    saveflashAds(req_obj: any) {
        let headers = this.getLeads(this.jwtService.getToken())
        return this.http.post(`${environment.baseurl}/saveads`, req_obj, { headers: headers })
    }

    getflashAds() {
        return this.http.get(`${environment.baseurl}/getflashads`)
    }


    getLeads(jwtToken: string) {
        let headers = new HttpHeaders();
        const authroizationToken = 'bearer '.concat(jwtToken);
        console.log(authroizationToken);
        headers = headers.append('Authorization', authroizationToken);
        // headers = headers.append('content-type', 'application/json');
        console.log(headers.get('Authorization'));
        return headers
    }


}
