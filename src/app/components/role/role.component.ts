import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  
  data: any;
  roles: string[] = [];
  userForm: FormGroup = this.fb.group({});
  newRoleForm: FormGroup = this.fb.group({});;
  editUserMode = false;
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

    this.newRoleForm = this.fb.group({
      RoleName: ['', Validators.required]
    });
    
  }

  getAllUsers(){
    this.userService.getData().subscribe((data) => {
      console.log(data);
      this.data = data.Users;
      this.roles = Object.keys(data.Role);
    });
  }

  // Users
  addOrUpdateUser() {
    if (this.userForm.invalid) return;
    

    if (this.editUserMode && this.editingCNIC) {
      console.log(this.userForm.value);
      console.log(this.editingCNIC);     
      
    } else {
      console.log(this.userForm.value);
    }
    this.cancelEditUser();
  }

  editUser(user: any) {
    this.editUserMode = true;
    this.editingCNIC = user.CNIC;
    console.log(user);
    
    // this.userForm.patchValue(user);
  }

  deleteUser(cnic: string) {
    console.log(cnic);
    
    // this.service.deleteUser(cnic);
  }

  cancelEditUser() {
    this.editUserMode = false;
    this.editingCNIC = null;
    this.userForm.reset();
  }

  getUsersByRole(role: string) {
    return this.data.filter((u: any) => u.Role === role);
  }

  // Roles
  addRole() {
    if (this.newRoleForm.invalid) return;
    console.log(this.newRoleForm.value.RoleName);    
    this.newRoleForm.reset();
  }

  deleteRole(role: string) {
    console.log(role);
    
    // this.service.deleteRole(role);
  }


  saveData(data:any){
    this.userService.UpdateData(data).subscribe((data) => {
      console.log(data);
    });
  }

}
