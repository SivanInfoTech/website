import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";

import { JwtService } from "./jwt.service";
import { map, distinctUntilChanged, tap, shareReplay } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from "../models/user.model";
import { Router } from "@angular/router";
import { environment } from './../environments/environment';

@Injectable({ providedIn: "root" })
export class UserService {
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

  login(credentials: {
    email: string;
    password: string;
  }): Observable<{ user: User }> {
    return this.http.post(`${environment.baseurl}/signin`, credentials)
      .pipe<{ user: User }>(
        tap((user: any) => this.setAuth(user)
        )
      );
  }

  getCurrentUser(): Observable<{ user: User }> {
    let headers = this.getLeads(this.jwtService.getToken())

    return this.http.get(`${environment.baseurl}/getToken`, { headers: headers })
      .pipe<{ user: User }>(
        tap({
          next: (user: any) => this.setAuth(user),
          error: () => this.purgeAuth(),
        }
        )
      );
  }

  register(credentials: User): Observable<{ user: User }> {
    return this.http
      .post<{ user: User }>(`${environment.baseurl}/signup`, credentials)
    // .pipe(tap(({ user }) => this.setAuth(user)));
  }

  logout(): Observable<{ user: User }> {
    let headers = this.getLeads(this.jwtService.getToken())
    return this.http
      .get<{ user: User }>(`${environment.baseurl}/logOut`, { headers: headers })

  }

  update(user: Partial<User>): Observable<{ user: User }> {
    return this.http.put<{ user: User }>("/user", { user }).pipe(
      tap(({ user }) => {
        this.currentUserSubject.next(user);
      })
    );
  }

  getstudents(): Observable<{ user: User[] }> {
    let headers = this.getLeads(this.jwtService.getToken())

    return this.http.get<{ user: User[] }>(`${environment.baseurl}/studentsList`, { headers: headers })
  }

  getenrollmentslist(userid: string): Observable<{ user: User[] }> {
    let headers = this.getLeads(this.jwtService.getToken())
    return this.http.get<{ user: User[] }>(`${environment.baseurl}/enrollmentsList?userid=${userid}`, { headers: headers })
  }

  updateenrollmentstatus(userid: string, enrollmentID: string, status: string, courseShortForm: string): Observable<{ user: User }> {
    let headers = this.getLeads(this.jwtService.getToken())
    return this.http.post(`${environment.baseurl}/updateEnrollment`, { userid: userid, enrollmentID: enrollmentID, status: status, courseShortForm: courseShortForm }, { headers: headers })
      .pipe<{ user: User }>(
        tap((user: any) => console.log(user)
        )
      );
  }

  downloadcert(userid: string, certid: string) {
    return this.http.get(`${environment.baseurl}/downloadCertificate?userid=${userid}&certificationID=${certid}`,
    {
      // headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text'
   })
  }

  sendenquiry(req: any) {
    return this.http.post(`${environment.baseurl}/enquiry`, req)
      .pipe<{ res: any }>(
        tap((res: any) => console.log(res)
        )
      );
  }
  
  getLeads(jwtToken: string) {
    let headers = new HttpHeaders();
    const authroizationToken = 'bearer '.concat(jwtToken);
    // console.log(authroizationToken);
    headers = headers.append('Authorization', authroizationToken);
    headers = headers.append('content-type', 'application/json');
    // console.log(headers.get('Authorization'));
    return headers
  }

  setAuth(user: any): void {
    this.jwtService.saveToken(user.token);
    let userdata = this.jwtService.getDecodedAccessToken(user.token)
    this.currentUserSubject.next(userdata);
  }

  purgeAuth(): void {
    this.jwtService.destroyToken();
    this.currentUserSubject.next(null);
  }

}
