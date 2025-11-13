import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  Role = '';
  Userinfo:any;
  Roleinfo:any;

  constructor(private userService: UserService,private router: Router) {}

  ngOnInit(): void {
    this.setData();
  }

  setData(){
    let userParse:any = localStorage.getItem('userinfo');
    this.Userinfo = JSON.parse(userParse);
    let roleParse:any = localStorage.getItem('roleinfo');
    this.Roleinfo = JSON.parse(roleParse);
    this.Role = this.Userinfo.Role;
  }

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
