import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: any = [];
  roles: any = {};
  userRoles: string[] = ['Admin', 'Agent', 'Manager'];
  editMode = false;
  userForm: FormGroup = this.fb.group({});
  editingCNIC: string | null = null;
  projectCode:any;
  password:any;
  
  constructor(private userService: UserService,private fb: FormBuilder) { }

  ngOnInit() {
    this.getAllUsers();
    this.userForm = this.fb.group({
      CNIC: ['', Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Username: ['', Validators.required],
      Role: ['', Validators.required],
      Lat: [''],
      long: ['']
    }); 
  }

  getAllUsers(){
    this.userService.getData().subscribe((data) => {
      this.users = data.Users;
      this.roles = data.Role;
    });
  }

  addOrUpdateUser() {
    if (this.userForm.invalid) return;

    if (this.editMode && this.editingCNIC) {
      this.userForm.get('CNIC')?.enable();
      this.userForm.get('Username')?.enable();      
      let Fulldata = this.users.map((item:any) =>
      item.CNIC === this.userForm.value.CNIC
          ? { ...item, ...this.userForm.value }
          : item
    );
    let data:any ;
    if(this.userForm.value.Role == 'Admin'){
      this.encrypt();
     
      this.roles.Admin.ProjectCode = this.projectCode;
      this.roles.Admin.password = this.password;
      data = { 
        Users:Fulldata,
        Role:this.roles
      };     
      
    }
    
    
    
    this.saveData(data);
    } else {
     console.log(this.userForm.value);
     
    }

    this.cancelEdit();
  }

  editUser(user: any) {
    this.editMode = true;
    this.editingCNIC = user.CNIC;
    this.userForm.patchValue(user);
    this.userForm.get('CNIC')?.disable();
    this.userForm.get('Username')?.disable();
    if(user.Role == "Admin"){
      this.projectCode = this.roles.Admin.ProjectCode;
      this.password = this.roles.Admin.password;
      this.decrypt();
    }
    

  }

  deleteUser(cnic: string) {
    console.log(cnic);
    
    // this.userService.deleteUser(cnic);
  }

  cancelEdit() {
    this.editMode = false;
    this.editingCNIC = null;
    this.userForm.get('CNIC')?.enable();
    this.userForm.get('Username')?.enable();
    this.userForm.reset();
    this.password = '';
    this.projectCode = '';
  }

  getUsersByRole(role: string) {
    return this.users.filter((u:any) => u.Role?.toLowerCase() === role.toLowerCase());
  }

  saveData(data:any){
    this.userService.UpdateData(data).subscribe((data) => {
      console.log(data);
    });
  }

  decrypt(){
    this.userForm.get('CNIC')?.enable();
    this.userForm.get('Username')?.enable();
    let pwd :any = this.password.match(/.{1,8}/g);
    let cipher:any = {
      "a": this.projectCode[1] + this.projectCode[0] + this.userForm.value['CNIC'][1] + this.projectCode[2] + 'z' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "b": this.projectCode[2] + this.projectCode[1] + this.userForm.value['CNIC'][5] + this.projectCode[2] + 'y' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "c": this.projectCode[3] + this.projectCode[2] + this.userForm.value['CNIC'][1] + this.projectCode[1] + 'x' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "d": this.projectCode[4] + this.projectCode[3] + this.userForm.value['CNIC'][5] + this.projectCode[1] + 'w' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "e": this.projectCode[1] + this.projectCode[4] + this.userForm.value['CNIC'][1] + this.projectCode[2] + 'v' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "f": this.projectCode[2] + this.projectCode[0] + this.userForm.value['CNIC'][5] + this.projectCode[2] + 'u' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "g": this.projectCode[3] + this.projectCode[1] + this.userForm.value['CNIC'][1] + this.projectCode[1] + 't' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "h": this.projectCode[4] + this.projectCode[2] + this.userForm.value['CNIC'][5] + this.projectCode[1] + 's' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "i": this.projectCode[1] + this.projectCode[3] + this.userForm.value['CNIC'][1] + this.projectCode[2] + 'r' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "j": this.projectCode[2] + this.projectCode[4] + this.userForm.value['CNIC'][5] + this.projectCode[2] + 'q' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "k": this.projectCode[3] + this.projectCode[0] + this.userForm.value['CNIC'][1] + this.projectCode[1] + 'p' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "l": this.projectCode[4] + this.projectCode[1] + this.userForm.value['CNIC'][5] + this.projectCode[1] + 'o' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "m": this.projectCode[1] + this.projectCode[2] + this.userForm.value['CNIC'][1] + this.projectCode[2] + 'n' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "n": this.projectCode[2] + this.projectCode[3] + this.userForm.value['CNIC'][5] + this.projectCode[2] + 'm' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "o": this.projectCode[3] + this.projectCode[4] + this.userForm.value['CNIC'][1] + this.projectCode[1] + 'l' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "p": this.projectCode[4] + this.projectCode[0] + this.userForm.value['CNIC'][5] + this.projectCode[1] + 'k' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "q": this.projectCode[1] + this.projectCode[1] + this.userForm.value['CNIC'][1] + this.projectCode[2] + 'j' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "r": this.projectCode[2] + this.projectCode[2] + this.userForm.value['CNIC'][5] + this.projectCode[2] + 'i' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "s": this.projectCode[3] + this.projectCode[3] + this.userForm.value['CNIC'][1] + this.projectCode[1] + 'h' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "t": this.projectCode[4] + this.projectCode[4] + this.userForm.value['CNIC'][5] + this.projectCode[1] + 'g' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "u": this.projectCode[1] + this.projectCode[0] + this.userForm.value['CNIC'][1] + this.projectCode[2] + 'f' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "v": this.projectCode[2] + this.projectCode[1] + this.userForm.value['CNIC'][5] + this.projectCode[2] + 'e' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "w": this.projectCode[3] + this.projectCode[2] + this.userForm.value['CNIC'][1] + this.projectCode[1] + 'd' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "x": this.projectCode[4] + this.projectCode[3] + this.userForm.value['CNIC'][5] + this.projectCode[1] + 'c' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "y": this.projectCode[1] + this.projectCode[4] + this.userForm.value['CNIC'][1] + this.projectCode[2] + 'b' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "z": this.projectCode[2] + this.projectCode[0] + this.userForm.value['CNIC'][5] + this.projectCode[2] + 'a' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      
      "A": this.projectCode[3] + this.projectCode[1] + this.userForm.value['CNIC'][1] + this.projectCode[1] + 'Z' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "B": this.projectCode[4] + this.projectCode[2] + this.userForm.value['CNIC'][5] + this.projectCode[1] + 'Y' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "C": this.projectCode[1] + this.projectCode[3] + this.userForm.value['CNIC'][1] + this.projectCode[2] + 'X' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "D": this.projectCode[2] + this.projectCode[4] + this.userForm.value['CNIC'][5] + this.projectCode[2] + 'W' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "E": this.projectCode[3] + this.projectCode[0] + this.userForm.value['CNIC'][1] + this.projectCode[1] + 'V' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "F": this.projectCode[4] + this.projectCode[1] + this.userForm.value['CNIC'][5] + this.projectCode[1] + 'U' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "G": this.projectCode[1] + this.projectCode[2] + this.userForm.value['CNIC'][1] + this.projectCode[2] + 'T' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "H": this.projectCode[2] + this.projectCode[3] + this.userForm.value['CNIC'][5] + this.projectCode[2] + 'S' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "I": this.projectCode[3] + this.projectCode[4] + this.userForm.value['CNIC'][1] + this.projectCode[1] + 'R' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "J": this.projectCode[4] + this.projectCode[0] + this.userForm.value['CNIC'][5] + this.projectCode[1] + 'Q' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "K": this.projectCode[1] + this.projectCode[1] + this.userForm.value['CNIC'][1] + this.projectCode[2] + 'P' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "L": this.projectCode[2] + this.projectCode[2] + this.userForm.value['CNIC'][5] + this.projectCode[2] + 'O' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "M": this.projectCode[3] + this.projectCode[3] + this.userForm.value['CNIC'][1] + this.projectCode[1] + 'N' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "N": this.projectCode[4] + this.projectCode[4] + this.userForm.value['CNIC'][5] + this.projectCode[1] + 'M' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "O": this.projectCode[1] + this.projectCode[0] + this.userForm.value['CNIC'][1] + this.projectCode[2] + 'L' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "P": this.projectCode[2] + this.projectCode[1] + this.userForm.value['CNIC'][5] + this.projectCode[2] + 'K' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "Q": this.projectCode[3] + this.projectCode[2] + this.userForm.value['CNIC'][1] + this.projectCode[1] + 'J' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "R": this.projectCode[4] + this.projectCode[3] + this.userForm.value['CNIC'][5] + this.projectCode[1] + 'I' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "S": this.projectCode[1] + this.projectCode[4] + this.userForm.value['CNIC'][1] + this.projectCode[2] + 'H' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "T": this.projectCode[2] + this.projectCode[0] + this.userForm.value['CNIC'][5] + this.projectCode[2] + 'G' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "U": this.projectCode[3] + this.projectCode[1] + this.userForm.value['CNIC'][1] + this.projectCode[1] + 'F' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "V": this.projectCode[4] + this.projectCode[2] + this.userForm.value['CNIC'][5] + this.projectCode[1] + 'E' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "W": this.projectCode[1] + this.projectCode[3] + this.userForm.value['CNIC'][1] + this.projectCode[2] + 'D' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "X": this.projectCode[2] + this.projectCode[4] + this.userForm.value['CNIC'][5] + this.projectCode[2] + 'C' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "Y": this.projectCode[3] + this.projectCode[0] + this.userForm.value['CNIC'][1] + this.projectCode[1] + 'B' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "Z": this.projectCode[4] + this.projectCode[1] + this.userForm.value['CNIC'][5] + this.projectCode[1] + 'A' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2]
    };
    console.log(pwd);

    let decrypt = pwd.map((chunk:any) => {
      return Object.keys(cipher).find(key => cipher[key] === chunk);
    });

    console.log(decrypt.join(""));
    this.password = decrypt.join("");
    this.userForm.get('CNIC')?.disable();
    this.userForm.get('Username')?.disable();
  }

  encrypt(){
    let encrypt = '';
    let word = this.password;
    console.log(word); 
    let cipher:any = {
      "a": this.projectCode[1] + this.projectCode[0] + this.userForm.value['CNIC'][1] + this.projectCode[2] + 'z' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "b": this.projectCode[2] + this.projectCode[1] + this.userForm.value['CNIC'][5] + this.projectCode[2] + 'y' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "c": this.projectCode[3] + this.projectCode[2] + this.userForm.value['CNIC'][1] + this.projectCode[1] + 'x' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "d": this.projectCode[4] + this.projectCode[3] + this.userForm.value['CNIC'][5] + this.projectCode[1] + 'w' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "e": this.projectCode[1] + this.projectCode[4] + this.userForm.value['CNIC'][1] + this.projectCode[2] + 'v' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "f": this.projectCode[2] + this.projectCode[0] + this.userForm.value['CNIC'][5] + this.projectCode[2] + 'u' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "g": this.projectCode[3] + this.projectCode[1] + this.userForm.value['CNIC'][1] + this.projectCode[1] + 't' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "h": this.projectCode[4] + this.projectCode[2] + this.userForm.value['CNIC'][5] + this.projectCode[1] + 's' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "i": this.projectCode[1] + this.projectCode[3] + this.userForm.value['CNIC'][1] + this.projectCode[2] + 'r' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "j": this.projectCode[2] + this.projectCode[4] + this.userForm.value['CNIC'][5] + this.projectCode[2] + 'q' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "k": this.projectCode[3] + this.projectCode[0] + this.userForm.value['CNIC'][1] + this.projectCode[1] + 'p' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "l": this.projectCode[4] + this.projectCode[1] + this.userForm.value['CNIC'][5] + this.projectCode[1] + 'o' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "m": this.projectCode[1] + this.projectCode[2] + this.userForm.value['CNIC'][1] + this.projectCode[2] + 'n' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "n": this.projectCode[2] + this.projectCode[3] + this.userForm.value['CNIC'][5] + this.projectCode[2] + 'm' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "o": this.projectCode[3] + this.projectCode[4] + this.userForm.value['CNIC'][1] + this.projectCode[1] + 'l' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "p": this.projectCode[4] + this.projectCode[0] + this.userForm.value['CNIC'][5] + this.projectCode[1] + 'k' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "q": this.projectCode[1] + this.projectCode[1] + this.userForm.value['CNIC'][1] + this.projectCode[2] + 'j' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "r": this.projectCode[2] + this.projectCode[2] + this.userForm.value['CNIC'][5] + this.projectCode[2] + 'i' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "s": this.projectCode[3] + this.projectCode[3] + this.userForm.value['CNIC'][1] + this.projectCode[1] + 'h' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "t": this.projectCode[4] + this.projectCode[4] + this.userForm.value['CNIC'][5] + this.projectCode[1] + 'g' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "u": this.projectCode[1] + this.projectCode[0] + this.userForm.value['CNIC'][1] + this.projectCode[2] + 'f' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "v": this.projectCode[2] + this.projectCode[1] + this.userForm.value['CNIC'][5] + this.projectCode[2] + 'e' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "w": this.projectCode[3] + this.projectCode[2] + this.userForm.value['CNIC'][1] + this.projectCode[1] + 'd' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "x": this.projectCode[4] + this.projectCode[3] + this.userForm.value['CNIC'][5] + this.projectCode[1] + 'c' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "y": this.projectCode[1] + this.projectCode[4] + this.userForm.value['CNIC'][1] + this.projectCode[2] + 'b' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "z": this.projectCode[2] + this.projectCode[0] + this.userForm.value['CNIC'][5] + this.projectCode[2] + 'a' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      
      "A": this.projectCode[3] + this.projectCode[1] + this.userForm.value['CNIC'][1] + this.projectCode[1] + 'Z' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "B": this.projectCode[4] + this.projectCode[2] + this.userForm.value['CNIC'][5] + this.projectCode[1] + 'Y' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "C": this.projectCode[1] + this.projectCode[3] + this.userForm.value['CNIC'][1] + this.projectCode[2] + 'X' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "D": this.projectCode[2] + this.projectCode[4] + this.userForm.value['CNIC'][5] + this.projectCode[2] + 'W' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "E": this.projectCode[3] + this.projectCode[0] + this.userForm.value['CNIC'][1] + this.projectCode[1] + 'V' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "F": this.projectCode[4] + this.projectCode[1] + this.userForm.value['CNIC'][5] + this.projectCode[1] + 'U' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "G": this.projectCode[1] + this.projectCode[2] + this.userForm.value['CNIC'][1] + this.projectCode[2] + 'T' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "H": this.projectCode[2] + this.projectCode[3] + this.userForm.value['CNIC'][5] + this.projectCode[2] + 'S' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "I": this.projectCode[3] + this.projectCode[4] + this.userForm.value['CNIC'][1] + this.projectCode[1] + 'R' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "J": this.projectCode[4] + this.projectCode[0] + this.userForm.value['CNIC'][5] + this.projectCode[1] + 'Q' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "K": this.projectCode[1] + this.projectCode[1] + this.userForm.value['CNIC'][1] + this.projectCode[2] + 'P' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "L": this.projectCode[2] + this.projectCode[2] + this.userForm.value['CNIC'][5] + this.projectCode[2] + 'O' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "M": this.projectCode[3] + this.projectCode[3] + this.userForm.value['CNIC'][1] + this.projectCode[1] + 'N' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "N": this.projectCode[4] + this.projectCode[4] + this.userForm.value['CNIC'][5] + this.projectCode[1] + 'M' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "O": this.projectCode[1] + this.projectCode[0] + this.userForm.value['CNIC'][1] + this.projectCode[2] + 'L' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "P": this.projectCode[2] + this.projectCode[1] + this.userForm.value['CNIC'][5] + this.projectCode[2] + 'K' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "Q": this.projectCode[3] + this.projectCode[2] + this.userForm.value['CNIC'][1] + this.projectCode[1] + 'J' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "R": this.projectCode[4] + this.projectCode[3] + this.userForm.value['CNIC'][5] + this.projectCode[1] + 'I' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "S": this.projectCode[1] + this.projectCode[4] + this.userForm.value['CNIC'][1] + this.projectCode[2] + 'H' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "T": this.projectCode[2] + this.projectCode[0] + this.userForm.value['CNIC'][5] + this.projectCode[2] + 'G' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "U": this.projectCode[3] + this.projectCode[1] + this.userForm.value['CNIC'][1] + this.projectCode[1] + 'F' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "V": this.projectCode[4] + this.projectCode[2] + this.userForm.value['CNIC'][5] + this.projectCode[1] + 'E' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "W": this.projectCode[1] + this.projectCode[3] + this.userForm.value['CNIC'][1] + this.projectCode[2] + 'D' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "X": this.projectCode[2] + this.projectCode[4] + this.userForm.value['CNIC'][5] + this.projectCode[2] + 'C' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "Y": this.projectCode[3] + this.projectCode[0] + this.userForm.value['CNIC'][1] + this.projectCode[1] + 'B' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2],
      "Z": this.projectCode[4] + this.projectCode[1] + this.userForm.value['CNIC'][5] + this.projectCode[1] + 'A' + this.userForm.value['CNIC'][3] + this.projectCode[1] + this.projectCode[2]
    };   
    for (let index = 0; index < word.length; index++) {
      encrypt += cipher[word[index]];      
    }
    console.log(encrypt);
    this.password = encrypt;
  }

  // Agents
  fetchCode(role:any ,user:any){
   let data =  this.roles[role].find(
      (x:any) => x.Username === user.Username
    );
    return data.ProjectCode;    
  }

  fetchPassword(role:any ,user:any){
    let data =  this.roles[role].find(
       (x:any) => x.Username === user.Username
     );
     return data.password;    
  }


  // Manager
  getCode(role:any ,user:any) {
    for (let country in this.roles[role]) {
      const pass = this.roles[role][country].find((u: any) => u.Username === user.Username);
      if (pass) return country;
    }
    return '';
  }

  getPassword(role:any ,user:any) {
    for (let country in this.roles[role]) {
      const pass = this.roles[role][country].find((u: any) => u.Username === user.Username);
      if (pass) return pass.password;
    }
    return '';
  }

}
