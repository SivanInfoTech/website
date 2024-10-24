import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";

import { JwtService } from "./jwt.service";
import { map, distinctUntilChanged, tap, shareReplay } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from "../models/user.model";
import { Router } from "@angular/router";
import { environment } from './../environments/environment';

@Injectable({ providedIn: "root" })
export class CourseService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser = this.currentUserSubject
        .asObservable()
    // .pipe(distinctUntilChanged());

    public isAuthenticated = this.currentUser.pipe(map((user) => !!user));

    constructor(
        private readonly http: HttpClient,
        private readonly jwtService: JwtService,
        private readonly router: Router
    ) { }


    enrollcourse(req_obj: any): Observable<{ user: User[] }> {
        let headers = this.getLeads(this.jwtService.getToken())
        return this.http.post<{ user: User[] }>(`${environment.baseurl}/enroll`, req_obj, { headers: headers })
    }

    getcoursedetails(courseid: string): Observable<{ user: User[] }> {
        return this.http.get<{ user: User[] }>(`${environment.baseurl}/courseDetails?courseid=${courseid}`)
    }

    getCourseAndBatchDetails(): Observable<{ user: User[] }> {
        return this.http.get<{ user: User[] }>(`${environment.baseurl}/getCourseAndBatchDetails`)
    }

    getCourselist() {
        let headers = this.getLeads(this.jwtService.getToken())
        return this.http.get(`${environment.baseurl}/courselist`, { headers: headers })
    }

    getCoursesyllabusDoc(courseid: string) {
        let headers = this.getLeads(this.jwtService.getToken())
        return this.http.get(`${environment.baseurl}/getcourseDoc?courseid=${courseid}`, { headers: headers })
    }

    saveCoursesyllabusDoc(formdata: FormData) {
        let headers = this.getLeads(this.jwtService.getToken())
        return this.http.post(`${environment.baseurl}/uploadcourseDoc`, formdata, { headers: headers })
    }

    verifycert(formdata: FormData) {
        return this.http.post(`${environment.baseurl}/verifyCert`, formdata)
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
