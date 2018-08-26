import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { Credentials } from './credentials.model';
import { environment } from '../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';


interface ILoginResult {
  expires: number;
  token: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwt: JwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient, private toast: NotifierService) { }

  public isLoggedIn() {
    const token = localStorage.getItem('token');
    return !!token && !this.jwt.isTokenExpired(token);
  }

  public signupUser(creds: Credentials): Observable<ILoginResult> {
    return this.handleLoginResult(this.http.post<ILoginResult>(environment.apiUrl + "Account/Register", creds));
  }

  public loginUser(creds: Credentials): Observable<ILoginResult> {
    return this.handleLoginResult(this.http.post<ILoginResult>(environment.apiUrl + "Account/Login", creds));
  }

  private handleLoginResult(obs: Observable<ILoginResult>): Observable<ILoginResult> {

    obs.pipe(
      tap(x => 
        localStorage.setItem('token', x.token)),
      catchError(err => {
        this.toast.notify('error', err);
        throw err;
      }));

    return obs;
  }


}
