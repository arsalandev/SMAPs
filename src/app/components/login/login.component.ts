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

  cipher: any = {
    "a": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'a' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "b": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'b' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "c": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'c' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "d": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'd' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "e": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'e' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "f": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'f' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "g": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'g' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "h": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'h' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "i": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'i' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "j": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'j' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "k": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'k' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "l": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'l' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "m": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'm' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "n": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'n' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "o": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'o' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "p": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'p' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "q": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'q' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "r": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'r' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "s": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 's' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "t": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 't' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "u": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'u' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "v": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'v' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "w": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'w' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "x": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'x' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "y": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'y' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "z": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'z' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    
    "A": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'A' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "B": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'B' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "C": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'C' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "D": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'D' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "E": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'E' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "F": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'F' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "G": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'G' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "H": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'H' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "I": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'I' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "J": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'J' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "K": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'K' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "L": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'L' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "M": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'M' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "N": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'N' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "O": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'O' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "P": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'P' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "Q": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'Q' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "R": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'R' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "S": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'S' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "T": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'T' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "U": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'U' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "V": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'V' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "W": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'W' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "X": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'X' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "Y": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'Y' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
    "Z": this.projectCode[3] + this.projectCode[0] + this.UserDetails['Username'][1] + this.projectCode[2] + 'Z' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2]
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
