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
  roles: string[] = ['Admin', 'Agent', 'Manager'];
  editMode = false;
  userForm: FormGroup = this.fb.group({});
  editingCNIC: string | null = null;
  
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
      console.log(data);
      this.users = data.Users;
    });
  }

  addOrUpdateUser() {
    if (this.userForm.invalid) return;

    if (this.editMode && this.editingCNIC) {
      console.log(this.editingCNIC, this.userForm.value);
      
    } else {
     console.log(this.userForm.value);
     
    }

    this.cancelEdit();
  }

  editUser(user: any) {
    this.editMode = true;
    this.editingCNIC = user.CNIC;
    this.userForm.patchValue(user);
  }

  deleteUser(cnic: string) {
    console.log(cnic);
    
    // this.userService.deleteUser(cnic);
  }

  cancelEdit() {
    this.editMode = false;
    this.editingCNIC = null;
    this.userForm.reset();
  }

  getUsersByRole(role: string) {
    return this.users.filter((u:any) => u.Role?.toLowerCase() === role.toLowerCase());;
  }

  saveData(data:any){
    this.userService.UpdateData(data).subscribe((data) => {
      console.log(data);
    });
  }

}
