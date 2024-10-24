import { Injectable } from "@angular/core";
import jwt_decode from 'jwt-decode';
import { HttpClient } from "@angular/common/http";
import { of, Observable } from "rxjs";
import { tap, map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class JwtService {
  constructor(private http: HttpClient) {}

  getToken(): string {
    return window.localStorage["jwtToken"];
  }

  saveToken(token: string): void {
    window.localStorage["jwtToken"] = token;
  }

  destroyToken(): void {
    window.localStorage.removeItem("jwtToken");
  }

  verifyToken(): Observable<boolean> {
    const token = this.getToken();
    return token
      ? this.http.post("https://jsonplaceholder.typicode.com/users", { verify: token }).pipe(
          tap(res => (localStorage.data = JSON.stringify(res))),
          map(res => true, (error: any) => {console.log(error); false})
        )
      : of(false);
  }
  
  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
  }
}
