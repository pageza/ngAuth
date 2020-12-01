import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {AuthData} from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token;

  constructor(private http: HttpClient) { }

  getToken(): void {
    return this.token;
  }

  createUser(email: string, password: string): void {
    const authData: AuthData = {email, password};
    this.http.post('http://localhost:3000/api/users/signup', authData)
      .subscribe( response => {
        console.log(response);
      });
  }

  login(email: string, password: string): void {
    const authData: AuthData = {email, password};
    this.http.post<{ token: string }>('http://localhost:3000/api/users/login', authData)
      .subscribe( response => {
        this.token = response.token;
      });
  }
}
