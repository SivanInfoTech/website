import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { JwtService } from "src/service/jwt.service";


@Injectable()
export class CanActivateGuard  {

  constructor(
    private jwt: JwtService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const token = this.jwt.getToken();
    const url = "/token/verify/";

    if (!token) {
      this.router.navigate(["/login"]);
      return false;
    }

    return this.jwt.verifyToken().pipe(
      tap(allowed => {
        if (!allowed) this.router.navigate(["/login"]);
      })
    );
  }
}
