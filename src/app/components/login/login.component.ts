import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
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
  
  Code:any = '';
  projectCode:any = ''; 

  cipher: any = {} ;

  RoleDetails:any ;

  step = 1;

  keyStrokes: string[] = [];
  isAnimating = false;


  message = ''; 
  messageType = '';

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key.length === 1 && /[a-zA-Z0-9]/.test(event.key)) {
      this.keyStrokes.push(event.key);
      if (this.keyStrokes.length > 5) {
        this.keyStrokes.shift();
      }
    }
}

  constructor(private userService: UserService,private router: Router) {}

  ngOnInit(): void {
   let token = localStorage.getItem('token');
   if(token){
    this.router.navigate(['/dashboard']);
   }
  }

  loginStep(){
    if(this.step == 1){
      this.onLogin();
    } else if(this.step == 2){
      this.getRoles(this.UserDetails);
    } else if(this.step == 3){
      this.Verification();
    }
  }

  onLogin() {
    this.userService.getUsers().subscribe((data) => {
      let userDetails = data.find((item:any) => item.Username === this.username);
      if(userDetails !== undefined){
       this.UserDetails = userDetails;
       this.step = 2;
      } else {
        this.message = 'Invalid User Name';
        this.messageType = "error-alert";
        setTimeout(() => {
          this.message = '';
          this.messageType = '';
        }, 3000);       
      }             
    });
  }

  getRoles(userinfo:any){
    this.userService.getRoles().subscribe((data) => {
      const userRole = userinfo.Role;      
    if (userRole === 'Admin') {
        this.RoleDetails = data.Admin.Username === userinfo.Username ? data.Admin : null;
        this.step = 3;      
    } 
    else if (userRole === 'Agent') {
        this.RoleDetails = data.Agent.find((r:any) => r.Username === userinfo.Username) || null;
        this.step = 3;
    } 
    else if (userRole === 'Manager') {
        for (let country in data.Manager) {
            const managerList = data.Manager[country];
            const match = managerList.find((r:any) => r.Username === userinfo.Username);
            if (match) {
              this.RoleDetails =  {...match, ProjectCode: country};
            }
        }
        this.step = 3;
    }   
    }); 
  }

  Verification(){
    this.projectCode = this.Code + this.UserDetails['CNIC'];
    localStorage.setItem("userinfo",JSON.stringify(this.UserDetails));
    localStorage.setItem("roleinfo",JSON.stringify(this.RoleDetails));
    console.log(this.UserDetails);
    console.log(this.RoleDetails);
    console.log(this.projectCode);
    console.log(this.Code);        
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
      this.message = "Login successful!";
      this.messageType = "success-alert";
      setTimeout(() => {
        localStorage.setItem("token",encrypt);
        this.router.navigate(['/dashboard']);        
      }, 1500);

    } else {
      this.message = 'Wrong Credentails';
      this.messageType = "warning-alert";
      setTimeout(() => {
        this.message = '';
        this.messageType = '';
      }, 3000);
    }

    this.decrypt();
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

  getButtonText(): string {
    switch (this.step) {
      case 1:
        return 'CONTINUE TO AUTHENTICATION';
      case 2:
        return 'CONTINUE TO VERIFICATION';
      case 3:
        return 'AUTHENTICATE';
      default:
        return 'LOGIN';
    }
  }

}
