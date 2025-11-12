import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:5000'; // Flask API base URL

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/allInfo`);
  }
  
  // Get all users
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  // Add new user
  UpdateData(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, userData);
  }

  // Get all roles
  getRoles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/roles`);
  }


  updatePassword(username: string, password: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/roles/password`, {
      Username: username,
      password: password
    });
  }

}
