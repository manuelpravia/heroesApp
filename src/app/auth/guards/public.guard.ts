import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, UrlSegment, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable, map, tap } from "rxjs";
import { AuthService } from "../services/auth.service";


@Injectable({providedIn: 'root'})
export class PublicGuard implements CanMatch, CanActivate{

  constructor(
    private authService: AuthService,
    private router: Router
    ) {}

  private chekAuthStatus(): boolean | Observable<boolean>{

      return this.authService.checkAuthentication()
      .pipe(
        tap(isAuthenticated => {
          if ( isAuthenticated ) {
            this.router.navigate(['./'])
          }
        }),
        map( isAuthenticated => !isAuthenticated)
      );
  }

  canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
    //console.log('Can Match')
    //console.log({route,segments})
    return this.chekAuthStatus();
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    //console.log('Can Activated')
   // console.log({route, state});
    return this.chekAuthStatus();;
  }

}
