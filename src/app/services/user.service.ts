import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:5000'; // Flask API base URL

  constructor(private http: HttpClient) {}

  // Get all users
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  // Add new user
  addUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, userData);
  }

  // Update existing user
  updateUser(username: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${username}`, updatedData);
  }

  // Delete user
  deleteUser(username: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${username}`);
  }

  // Get all roles
  getRoles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/roles`);
  }

  // Add new role
  addRole(role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/roles`, { Role: role });
  }

  updatePassword(username: string, password: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/roles/password`, {
      Username: username,
      password: password
    });
  }
}
