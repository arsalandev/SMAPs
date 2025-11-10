import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  username = 'admin';
  password = 'admin';

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

  cipher: any = {} ;

  RoleDetails:any ;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
   
  }

  onLogin() {
    this.userService.getUsers().subscribe((data) => {
      let userDetails = data.find((item:any) => item.Username === this.username);
      if(userDetails !== undefined){
       this.UserDetails = userDetails;
        this.getRoles(userDetails);           
      } else {
        console.log("Invalid User Name");        
      }            
    });
  }

  getRoles(userinfo:any){
    this.userService.getRoles().subscribe((data) => {
      const userRole = userinfo.Role;      
    if (userRole === 'Admin') {
        this.RoleDetails = data.Admin.Username === userinfo.Username ? data.Admin : null;
        this.projectCode = this.RoleDetails.ProjectCode + this.UserDetails['CNIC'];
        this.Verification();       
    } 
    else if (userRole === 'Agent') {
        // Agent is an array
        this.RoleDetails = data.Agent.find((r:any) => r.Username === userinfo.Username) || null;
        this.projectCode = this.RoleDetails.ProjectCode + this.UserDetails['CNIC'];
        this.Verification();
    } 
    else if (userRole === 'Manager') {
        // Manager is nested by country
        for (let country in data.Manager) {
            const managerList = data.Manager[country];
            const match = managerList.find((r:any) => r.Username === userinfo.Username);
            if (match) {
              this.RoleDetails =  {...match, ProjectCode: country};
            }
        }
        this.projectCode = this.RoleDetails.ProjectCode + this.UserDetails['CNIC'];
        this.Verification();
    }    
    }); 
  }

  Verification(){
    console.log(this.UserDetails);
    console.log(this.RoleDetails);
    this.cipher = {
      "a": this.projectCode[1] + this.projectCode[0] + this.UserDetails['CNIC'][1] + this.projectCode[2] + 'z' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "b": this.projectCode[2] + this.projectCode[1] + this.UserDetails['CNIC'][5] + this.projectCode[2] + 'y' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "c": this.projectCode[3] + this.projectCode[2] + this.UserDetails['CNIC'][1] + this.projectCode[1] + 'x' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "d": this.projectCode[4] + this.projectCode[3] + this.UserDetails['CNIC'][5] + this.projectCode[1] + 'w' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "e": this.projectCode[1] + this.projectCode[4] + this.UserDetails['CNIC'][1] + this.projectCode[2] + 'v' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "f": this.projectCode[2] + this.projectCode[0] + this.UserDetails['CNIC'][5] + this.projectCode[2] + 'u' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "g": this.projectCode[3] + this.projectCode[1] + this.UserDetails['CNIC'][1] + this.projectCode[1] + 't' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "h": this.projectCode[4] + this.projectCode[2] + this.UserDetails['CNIC'][5] + this.projectCode[1] + 's' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "i": this.projectCode[1] + this.projectCode[3] + this.UserDetails['CNIC'][1] + this.projectCode[2] + 'r' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "j": this.projectCode[2] + this.projectCode[4] + this.UserDetails['CNIC'][5] + this.projectCode[2] + 'q' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "k": this.projectCode[3] + this.projectCode[0] + this.UserDetails['CNIC'][1] + this.projectCode[1] + 'p' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "l": this.projectCode[4] + this.projectCode[1] + this.UserDetails['CNIC'][5] + this.projectCode[1] + 'o' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "m": this.projectCode[1] + this.projectCode[2] + this.UserDetails['CNIC'][1] + this.projectCode[2] + 'n' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "n": this.projectCode[2] + this.projectCode[3] + this.UserDetails['CNIC'][5] + this.projectCode[2] + 'm' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "o": this.projectCode[3] + this.projectCode[4] + this.UserDetails['CNIC'][1] + this.projectCode[1] + 'l' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "p": this.projectCode[4] + this.projectCode[0] + this.UserDetails['CNIC'][5] + this.projectCode[1] + 'k' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "q": this.projectCode[1] + this.projectCode[1] + this.UserDetails['CNIC'][1] + this.projectCode[2] + 'j' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "r": this.projectCode[2] + this.projectCode[2] + this.UserDetails['CNIC'][5] + this.projectCode[2] + 'i' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "s": this.projectCode[3] + this.projectCode[3] + this.UserDetails['CNIC'][1] + this.projectCode[1] + 'h' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "t": this.projectCode[4] + this.projectCode[4] + this.UserDetails['CNIC'][5] + this.projectCode[1] + 'g' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "u": this.projectCode[1] + this.projectCode[0] + this.UserDetails['CNIC'][1] + this.projectCode[2] + 'f' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "v": this.projectCode[2] + this.projectCode[1] + this.UserDetails['CNIC'][5] + this.projectCode[2] + 'e' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "w": this.projectCode[3] + this.projectCode[2] + this.UserDetails['CNIC'][1] + this.projectCode[1] + 'd' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "x": this.projectCode[4] + this.projectCode[3] + this.UserDetails['CNIC'][5] + this.projectCode[1] + 'c' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "y": this.projectCode[1] + this.projectCode[4] + this.UserDetails['CNIC'][1] + this.projectCode[2] + 'b' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "z": this.projectCode[2] + this.projectCode[0] + this.UserDetails['CNIC'][5] + this.projectCode[2] + 'a' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      
      "A": this.projectCode[3] + this.projectCode[1] + this.UserDetails['CNIC'][1] + this.projectCode[1] + 'Z' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "B": this.projectCode[4] + this.projectCode[2] + this.UserDetails['CNIC'][5] + this.projectCode[1] + 'Y' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "C": this.projectCode[1] + this.projectCode[3] + this.UserDetails['CNIC'][1] + this.projectCode[2] + 'X' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "D": this.projectCode[2] + this.projectCode[4] + this.UserDetails['CNIC'][5] + this.projectCode[2] + 'W' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "E": this.projectCode[3] + this.projectCode[0] + this.UserDetails['CNIC'][1] + this.projectCode[1] + 'V' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "F": this.projectCode[4] + this.projectCode[1] + this.UserDetails['CNIC'][5] + this.projectCode[1] + 'U' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "G": this.projectCode[1] + this.projectCode[2] + this.UserDetails['CNIC'][1] + this.projectCode[2] + 'T' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "H": this.projectCode[2] + this.projectCode[3] + this.UserDetails['CNIC'][5] + this.projectCode[2] + 'S' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "I": this.projectCode[3] + this.projectCode[4] + this.UserDetails['CNIC'][1] + this.projectCode[1] + 'R' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "J": this.projectCode[4] + this.projectCode[0] + this.UserDetails['CNIC'][5] + this.projectCode[1] + 'Q' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "K": this.projectCode[1] + this.projectCode[1] + this.UserDetails['CNIC'][1] + this.projectCode[2] + 'P' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "L": this.projectCode[2] + this.projectCode[2] + this.UserDetails['CNIC'][5] + this.projectCode[2] + 'O' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "M": this.projectCode[3] + this.projectCode[3] + this.UserDetails['CNIC'][1] + this.projectCode[1] + 'N' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "N": this.projectCode[4] + this.projectCode[4] + this.UserDetails['CNIC'][5] + this.projectCode[1] + 'M' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "O": this.projectCode[1] + this.projectCode[0] + this.UserDetails['CNIC'][1] + this.projectCode[2] + 'L' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "P": this.projectCode[2] + this.projectCode[1] + this.UserDetails['CNIC'][5] + this.projectCode[2] + 'K' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "Q": this.projectCode[3] + this.projectCode[2] + this.UserDetails['CNIC'][1] + this.projectCode[1] + 'J' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "R": this.projectCode[4] + this.projectCode[3] + this.UserDetails['CNIC'][5] + this.projectCode[1] + 'I' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "S": this.projectCode[1] + this.projectCode[4] + this.UserDetails['CNIC'][1] + this.projectCode[2] + 'H' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "T": this.projectCode[2] + this.projectCode[0] + this.UserDetails['CNIC'][5] + this.projectCode[2] + 'G' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "U": this.projectCode[3] + this.projectCode[1] + this.UserDetails['CNIC'][1] + this.projectCode[1] + 'F' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "V": this.projectCode[4] + this.projectCode[2] + this.UserDetails['CNIC'][5] + this.projectCode[1] + 'E' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "W": this.projectCode[1] + this.projectCode[3] + this.UserDetails['CNIC'][1] + this.projectCode[2] + 'D' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "X": this.projectCode[2] + this.projectCode[4] + this.UserDetails['CNIC'][5] + this.projectCode[2] + 'C' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "Y": this.projectCode[3] + this.projectCode[0] + this.UserDetails['CNIC'][1] + this.projectCode[1] + 'B' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "Z": this.projectCode[4] + this.projectCode[1] + this.UserDetails['CNIC'][5] + this.projectCode[1] + 'A' + this.UserDetails['CNIC'][3] + this.projectCode[1] + this.projectCode[2]
    };
    console.log(this.cipher);
    
    let encrypt = '';
    let word = this.password;
    console.log(word);    
    for (let index = 0; index < word.length; index++) {
      encrypt += this.cipher[word[index]];      
    }
    console.log(encrypt, "Current");
    console.log(this.RoleDetails.password, "Actual");
    if(encrypt == this.RoleDetails.password){
      console.log("Login");
    } else {
      console.log("Wrong Credentails");
      
    }
    
  }

  updatePassword() {
    this.userService.updatePassword(this.username, this.password).subscribe({
      next: (res) => {
        console.log(res);        
      },
      error: (err) => {
       let message = err.error?.error || 'Something went wrong';
      }
    });
  }

  decrypt(){
    let password:any = this.RoleDetails.password.match(/.{1,8}/g);
    console.log(password);

    let decrypt = password.map((chunk:any) => {
      return Object.keys(this.cipher).find(key => this.cipher[key] === chunk);
    });

    console.log(decrypt.join(""));
  }

  encrypt(){
    let encrypt = '';
    let word = this.RoleDetails.password;
    console.log(word);    
    for (let index = 0; index < word.length; index++) {
      encrypt += this.cipher[word[index]];      
    }
    console.log(encrypt);
  }


}
