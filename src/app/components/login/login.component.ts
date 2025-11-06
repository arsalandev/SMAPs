import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  username = '';
  password = '';
  UserDetails:any = {
    "Username":"", 
    "FirstName": "" ,
    "LastName": "" ,
    "CNIC":"" ,
    "Role":"",
    "Lat":"",
    "long":""
  };
  projectCode:any = ''; 

  cipher:any = {
    "a":'',
    "A":''
  }

  constructor(private userService: UserService) {}

  ngOnInit(): void {
   
  }
  onLogin() {
    this.userService.getUsers().subscribe((data) => {
      console.log(data[0].CNIC);
      let a = data[0].CNIC;
      console.log(a[0]);
            
    });
    this.userService.getRoles().subscribe((data) => {
      console.log(data);      
    });
  }


}
