import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import Globe from 'globe.gl';
import { Router } from '@angular/router';
import * as L from 'leaflet';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{

  users: any = [];
  roles: any = {};
  userRoles: string[] = [];
  editMode = false;
  userForm: FormGroup = this.fb.group({});
  editingCNIC: string | null = null;
  projectCode:any;
  password:any;
  UserRole = '';
  @ViewChild('globeContainer', { static: false }) globeContainer!: ElementRef;
  private globe: any;
  private data = [];
  private isAutoRotating = true;
  allusers: any = [];

  view = 'map';
  message = '';

  constructor(private userService: UserService,private fb: FormBuilder,private router: Router) { }

  ngOnInit() {
    this.userForm = this.fb.group({
      CNIC: ['', Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Username: ['', Validators.required],
      Role: ['', Validators.required],
      Lat: [''],
      long: ['']
    }); 
    let user:any = localStorage.getItem("userinfo");
    let role:any = JSON.parse(user);
    this.UserRole = role.Role;
    if(this.UserRole == "Admin"){
      this.userRoles = ['Admin', 'Agent', 'Manager'];
    } else if(this.UserRole == "Manager"){
      this.userRoles = ['Agent'];
    } if(this.UserRole == "Agent"){
      this.userRoles = ['Agent'];
    }
    this.getAllUsers();  
  }  

  earth(){
     // Get the DOM element
     const container = this.globeContainer.nativeElement;

     // Initialize the globe with 'new' keyword
     this.globe = new Globe(container)
       .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
       .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
       .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
       .width(container.clientWidth)
       .height(container.clientHeight)
       .backgroundColor('rgba(0,0,0,0)')
       .showAtmosphere(true)
       .atmosphereColor('lightblue')
       .atmosphereAltitude(0.15)
       fetch(
        'https://raw.githubusercontent.com/vasturiano/globe.gl/refs/heads/master/example/datasets/ne_110m_populated_places_simple.geojson'
      )
        .then(res => res.json())
        .then(places => {
          this.globe
          .labelsData(places.features)
          .labelLat((d:any)=> d.properties.latitude)
          .labelLng((d:any) => d.properties.longitude)
          .labelText((d:any) => d.properties.name)
          .labelSize((d:any) => Math.sqrt(d.properties.pop_max) * 4e-4)
          .labelDotRadius((d:any) => Math.sqrt(d.properties.pop_max) * 4e-4)
          .labelColor(() => 'rgba(255, 165, 0, 0.75)')
          .labelResolution(2);
        });
      //  .globeTileEngineUrl((x, y, l) => `https://tile.openstreetmap.org/${l}/${x}/${y}.png`);
     // Add data points
     this.globe.pointsData(this.data)
       .pointColor('color')
       .pointAltitude('size')
       .pointRadius(0.5);
 
     // Add arcs between points
    //  this.globe.arcsData([
    //    { startLat: 40.7128, startLng: -74.0060, endLat: 51.5074, endLng: -0.1278, color: 'orange' },
    //    { startLat: 51.5074, startLng: -0.1278, endLat: 35.6762, endLng: 139.6503, color: 'purple' }
    //  ])
    //  .arcColor('color')
    //  .arcAltitude(0.1)
    //  .arcStroke(0.5);

     // Custom point rendering with labels
  this.globe.pointsData(this.data)
  .pointColor('color')
  .pointAltitude(0.1)
  .pointRadius(0.4)
  .pointLabel((point: any) => `
    <div class="custom-tooltip" style="width:500px;height:200px;font-size:30px">
      <div class="tooltip-title">${point.Username}</div>
      <div class="tooltip-details">
        <div>Role : ${point.Role}</div>
        <div>Full Name: ${point.FirstName}, ${point.LastName}</div>
        <div>Coordinates: ${point.lat}, ${point.lng}</div>
      </div>
    </div>
  `)
  .onPointHover((hoverPoint: any, prevPoint: any) => {
    // Change cursor style
    container.style.cursor = hoverPoint ? 'pointer' : 'default';
    
    // Visual feedback
    this.globe.pointColor((p: any) => 
      p === hoverPoint ? '#FFD700' : p.color
    );
    this.globe.pointRadius((p: any) => 
      p === hoverPoint ? 0.7 : 0.4
    );
    const controls = this.globe.controls();
  
    // Auto-rotate configuration
    controls.autoRotate = false;
  });
 
     // Append to DOM
     this.globe(container);
    //  this.setupAutoRotation();
  }

  addOrUpdateUser() {  
    console.log(this.userForm.invalid);
    console.log(this.editMode);
    console.log(this.editingCNIC);
        
    
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
      } else if(this.userForm.value.Role == 'Agent'){
        this.encrypt();      
        let index = this.roles.Agent.findIndex((a:any) => a.Username === this.userForm.value.Username);

        this.roles.Agent[index].ProjectCode = this.projectCode;
        this.roles.Agent[index].password = this.password;
        data = { 
          Users:Fulldata,
          Role:this.roles
        };
      }  else if(this.userForm.value.Role == 'Manager'){
        this.encrypt();      
        this.roles.Manager[this.projectCode][0].ProjectCode = this.projectCode;
        this.roles.Manager[this.projectCode][0].password = this.password;
        data = { 
          Users:Fulldata,
          Role:this.roles
        };
      }
      this.saveData(data);
      this.cancelEdit();
    } else {
      const cnicExists = this.users.some((item:any) => item.CNIC === this.userForm.value.CNIC);
      const usernameExists = this.users.some((item:any) => item.Username === this.userForm.value.Username);
      let code = Object.keys(this.roles.Manager);
      const codeExists = code.some((item:any) => item === this.projectCode);

      if (cnicExists) {
          this.message = 'CNIC Already Exists';
          setTimeout(() => {
            this.message = '';
          }, 3000);
      } else if (usernameExists) {
          this.message = 'Username Already Exists';
          setTimeout(() => {
            this.message = '';
          }, 3000);
      } else {
          if(this.userForm.value.Role == 'Agent'){

            if(!codeExists){
              this.message = 'Code Not Exists';
              setTimeout(() => {
                this.message = '';
              }, 3000);
            } else{
              this.encrypt();
              this.users.push(this.userForm.value);
              this.roles.Agent.push({
                  "ProjectCode": this.projectCode,
                  "Username": this.userForm.value.Username,
                  "password": this.password
              })
              let data = { 
                Users:this.users,
                Role:this.roles
              };
              this.saveData(data);
              this.cancelEdit(); 
            }
            
          }
          if(this.userForm.value.Role == 'Manager'){
            let code = Object.keys(this.roles.Manager);
            const managerCodeExists = code.some((item:any) => item === this.projectCode);
            if(!managerCodeExists){
              this.encrypt();
              this.users.push(this.userForm.value);
              this.roles.Manager[this.projectCode] = [];
              this.roles.Manager[this.projectCode].push({
                  "Username": this.userForm.value.Username,
                  "password": this.password
              })
              let data = { 
                Users:this.users,
                Role:this.roles
              };
              this.saveData(data);
              this.cancelEdit(); 
              
            } else {
              this.encrypt();
              this.users.push(this.userForm.value);
              this.roles.Manager[this.projectCode].push({
                  "Username": this.userForm.value.Username,
                  "password": this.password
              })
              let data = { 
                Users:this.users,
                Role:this.roles
              };
              this.saveData(data);
              this.cancelEdit(); 
            }
            
          }
      }
    //  this.cancelEdit();
    }

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
    } else if(user.Role == "Agent"){
      let found = this.roles.Agent.find((a:any) => a.Username === user.Username);
      this.projectCode = found.ProjectCode;
      this.password = found.password;
      this.decrypt();
    } else if(user.Role == "Manager"){
      for (let key in this.roles.Manager) {
        let managers = this.roles.Manager[key];
    
        // Find matching username
        let found = managers.find((m:any) => m.Username === user.Username);
    
        if (found) {
            this.projectCode = key;    // key is the ProjectCode (Italy, USA)
            this.password = found.password;
            break;
        }
    }
      this.decrypt();
    }
    

  }

  deleteUser(user: any) {    
    if(user.Role == 'Agent'){
      this.users = this.users.filter((item:any) => item.CNIC !== user.CNIC); 
      this.allusers = this.allusers.filter((item:any) => item.CNIC !== user.CNIC);  
      this.roles.Agent = this.roles.Agent.filter((item:any) => item.Username !== user.Username);    
      let data = { 
        Users: this.allusers,
        Role:this.roles
      };    
     console.log(data);
     
      this.saveData(data);
    } else if(user.Role == 'Manager'){
      this.users =  this.users.filter((item:any) => item.CNIC !== user.CNIC);  
      let code  = this.getCode(user.Role,user);
      this.roles.Manager[code] = this.roles.Manager[code].filter((item:any) => item.Username !== user.Username);
      let username = this.roles.Agent.filter((item:any) => item.ProjectCode == code);
      this.roles.Agent = this.roles.Agent.filter((item:any) => item.ProjectCode !== code);
      const deleteUsernames = new Set(username.map((u:any) => u.Username));
      this.users =  this.users.filter((u:any) => !deleteUsernames.has(u.Username));
      let data = { 
        Users:  this.users,
        Role:this.roles
      };    
      console.log(data);
      
      this.saveData(data);     
    }
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

  // Two API For Update & get Users Role

  saveData(data:any){
    this.userService.UpdateData(data).subscribe((data) => {
      console.log(data);
      this.message = 'Successfully Add/Update';
      setTimeout(() => {
        this.message = '';
      }, 3000);
    });
  }

  getAllUsers(){
    this.userService.getData().subscribe((data) => {
      if(this.UserRole == "Agent"){
        let currentRole:any = localStorage.getItem("userinfo");
        let parse = JSON.parse(currentRole);
        // 1. Get current user's project code from Role section
        let currentProjectCode = data.Role[parse.Role]
        .find((u:any) => u.Username === parse.Username)?.ProjectCode;

        // 2. Get all usernames that belong to same project (Agent + Manager)
        let sameProjectUsernames = [
        ...data.Role.Agent.filter((u:any) => u.ProjectCode === currentProjectCode).map((u:any) => u.Username),
        ...Object.values(data.Role.Manager).flat()
            .filter((u:any) => u.ProjectCode === currentProjectCode)
            .map((u:any) => u.Username)
        ];

        // 3. Get full user details from Users array
        let sameProjectUsersDetails = data.Users.filter((u:any) =>
        sameProjectUsernames.includes(u.Username)
        );
        
        this.users = sameProjectUsersDetails;
        this.roles = data.Role;
      } else if(this.UserRole == "Manager"){
        let currentRole:any = localStorage.getItem("userinfo");
        let parse = JSON.parse(currentRole);
        console.log(parse);
        // 1. Find Manager's project
        let currentProject = Object.keys(data.Role.Manager)
        .find(key => data.Role.Manager[key].some((m:any) => m.Username === parse.Username));

        // 2. Get all Agent usernames in same project
        let projectUsernames = data.Role.Agent
        .filter((a:any) => a.ProjectCode === currentProject)
        .map((a:any) => a.Username);

        // 3. Filter Users[] by these usernames
        let filteredUsers = data.Users.filter((u:any) => 
          projectUsernames.includes(u.Username)
        );
        this.users = filteredUsers;
        this.roles = data.Role;
        
        
      } else {
        this.users = data.Users;
        this.roles = data.Role;
      }
      this.allusers = data.Users;
      this.makeDataForEarth(this.users)
    });
  }

  // Global Encryption

  decrypt(){
    this.userForm.get('CNIC')?.enable();
    this.userForm.get('Username')?.enable();
    let pwd :any = this.password.match(/.{1,8}/g);
    let projectCode = this.projectCode + this.userForm.value.CNIC;
    let cipher:any = {
      "a": projectCode[1] + projectCode[0] + this.userForm.value['CNIC'][1] + projectCode[2] + 'z' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "b": projectCode[2] + projectCode[1] + this.userForm.value['CNIC'][5] + projectCode[2] + 'y' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "c": projectCode[3] + projectCode[2] + this.userForm.value['CNIC'][1] + projectCode[1] + 'x' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "d": projectCode[4] + projectCode[3] + this.userForm.value['CNIC'][5] + projectCode[1] + 'w' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "e": projectCode[1] + projectCode[4] + this.userForm.value['CNIC'][1] + projectCode[2] + 'v' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "f": projectCode[2] + projectCode[0] + this.userForm.value['CNIC'][5] + projectCode[2] + 'u' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "g": projectCode[3] + projectCode[1] + this.userForm.value['CNIC'][1] + projectCode[1] + 't' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "h": projectCode[4] + projectCode[2] + this.userForm.value['CNIC'][5] + projectCode[1] + 's' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "i": projectCode[1] + projectCode[3] + this.userForm.value['CNIC'][1] + projectCode[2] + 'r' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "j": projectCode[2] + projectCode[4] + this.userForm.value['CNIC'][5] + projectCode[2] + 'q' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "k": projectCode[3] + projectCode[0] + this.userForm.value['CNIC'][1] + projectCode[1] + 'p' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "l": projectCode[4] + projectCode[1] + this.userForm.value['CNIC'][5] + projectCode[1] + 'o' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "m": projectCode[1] + projectCode[2] + this.userForm.value['CNIC'][1] + projectCode[2] + 'n' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "n": projectCode[2] + projectCode[3] + this.userForm.value['CNIC'][5] + projectCode[2] + 'm' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "o": projectCode[3] + projectCode[4] + this.userForm.value['CNIC'][1] + projectCode[1] + 'l' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "p": projectCode[4] + projectCode[0] + this.userForm.value['CNIC'][5] + projectCode[1] + 'k' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "q": projectCode[1] + projectCode[1] + this.userForm.value['CNIC'][1] + projectCode[2] + 'j' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "r": projectCode[2] + projectCode[2] + this.userForm.value['CNIC'][5] + projectCode[2] + 'i' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "s": projectCode[3] + projectCode[3] + this.userForm.value['CNIC'][1] + projectCode[1] + 'h' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "t": projectCode[4] + projectCode[4] + this.userForm.value['CNIC'][5] + projectCode[1] + 'g' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "u": projectCode[1] + projectCode[0] + this.userForm.value['CNIC'][1] + projectCode[2] + 'f' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "v": projectCode[2] + projectCode[1] + this.userForm.value['CNIC'][5] + projectCode[2] + 'e' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "w": projectCode[3] + projectCode[2] + this.userForm.value['CNIC'][1] + projectCode[1] + 'd' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "x": projectCode[4] + projectCode[3] + this.userForm.value['CNIC'][5] + projectCode[1] + 'c' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "y": projectCode[1] + projectCode[4] + this.userForm.value['CNIC'][1] + projectCode[2] + 'b' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "z": projectCode[2] + projectCode[0] + this.userForm.value['CNIC'][5] + projectCode[2] + 'a' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      
      "A": projectCode[3] + projectCode[1] + this.userForm.value['CNIC'][1] + projectCode[1] + 'Z' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "B": projectCode[4] + projectCode[2] + this.userForm.value['CNIC'][5] + projectCode[1] + 'Y' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "C": projectCode[1] + projectCode[3] + this.userForm.value['CNIC'][1] + projectCode[2] + 'X' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "D": projectCode[2] + projectCode[4] + this.userForm.value['CNIC'][5] + projectCode[2] + 'W' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "E": projectCode[3] + projectCode[0] + this.userForm.value['CNIC'][1] + projectCode[1] + 'V' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "F": projectCode[4] + projectCode[1] + this.userForm.value['CNIC'][5] + projectCode[1] + 'U' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "G": projectCode[1] + projectCode[2] + this.userForm.value['CNIC'][1] + projectCode[2] + 'T' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "H": projectCode[2] + projectCode[3] + this.userForm.value['CNIC'][5] + projectCode[2] + 'S' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "I": projectCode[3] + projectCode[4] + this.userForm.value['CNIC'][1] + projectCode[1] + 'R' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "J": projectCode[4] + projectCode[0] + this.userForm.value['CNIC'][5] + projectCode[1] + 'Q' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "K": projectCode[1] + projectCode[1] + this.userForm.value['CNIC'][1] + projectCode[2] + 'P' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "L": projectCode[2] + projectCode[2] + this.userForm.value['CNIC'][5] + projectCode[2] + 'O' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "M": projectCode[3] + projectCode[3] + this.userForm.value['CNIC'][1] + projectCode[1] + 'N' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "N": projectCode[4] + projectCode[4] + this.userForm.value['CNIC'][5] + projectCode[1] + 'M' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "O": projectCode[1] + projectCode[0] + this.userForm.value['CNIC'][1] + projectCode[2] + 'L' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "P": projectCode[2] + projectCode[1] + this.userForm.value['CNIC'][5] + projectCode[2] + 'K' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "Q": projectCode[3] + projectCode[2] + this.userForm.value['CNIC'][1] + projectCode[1] + 'J' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "R": projectCode[4] + projectCode[3] + this.userForm.value['CNIC'][5] + projectCode[1] + 'I' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "S": projectCode[1] + projectCode[4] + this.userForm.value['CNIC'][1] + projectCode[2] + 'H' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "T": projectCode[2] + projectCode[0] + this.userForm.value['CNIC'][5] + projectCode[2] + 'G' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "U": projectCode[3] + projectCode[1] + this.userForm.value['CNIC'][1] + projectCode[1] + 'F' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "V": projectCode[4] + projectCode[2] + this.userForm.value['CNIC'][5] + projectCode[1] + 'E' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "W": projectCode[1] + projectCode[3] + this.userForm.value['CNIC'][1] + projectCode[2] + 'D' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "X": projectCode[2] + projectCode[4] + this.userForm.value['CNIC'][5] + projectCode[2] + 'C' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "Y": projectCode[3] + projectCode[0] + this.userForm.value['CNIC'][1] + projectCode[1] + 'B' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "Z": projectCode[4] + projectCode[1] + this.userForm.value['CNIC'][5] + projectCode[1] + 'A' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2]
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
    let projectCode = this.projectCode + this.userForm.value.CNIC;
    let cipher:any = {
      "a": projectCode[1] + projectCode[0] + this.userForm.value['CNIC'][1] + projectCode[2] + 'z' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "b": projectCode[2] + projectCode[1] + this.userForm.value['CNIC'][5] + projectCode[2] + 'y' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "c": projectCode[3] + projectCode[2] + this.userForm.value['CNIC'][1] + projectCode[1] + 'x' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "d": projectCode[4] + projectCode[3] + this.userForm.value['CNIC'][5] + projectCode[1] + 'w' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "e": projectCode[1] + projectCode[4] + this.userForm.value['CNIC'][1] + projectCode[2] + 'v' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "f": projectCode[2] + projectCode[0] + this.userForm.value['CNIC'][5] + projectCode[2] + 'u' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "g": projectCode[3] + projectCode[1] + this.userForm.value['CNIC'][1] + projectCode[1] + 't' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "h": projectCode[4] + projectCode[2] + this.userForm.value['CNIC'][5] + projectCode[1] + 's' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "i": projectCode[1] + projectCode[3] + this.userForm.value['CNIC'][1] + projectCode[2] + 'r' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "j": projectCode[2] + projectCode[4] + this.userForm.value['CNIC'][5] + projectCode[2] + 'q' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "k": projectCode[3] + projectCode[0] + this.userForm.value['CNIC'][1] + projectCode[1] + 'p' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "l": projectCode[4] + projectCode[1] + this.userForm.value['CNIC'][5] + projectCode[1] + 'o' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "m": projectCode[1] + projectCode[2] + this.userForm.value['CNIC'][1] + projectCode[2] + 'n' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "n": projectCode[2] + projectCode[3] + this.userForm.value['CNIC'][5] + projectCode[2] + 'm' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "o": projectCode[3] + projectCode[4] + this.userForm.value['CNIC'][1] + projectCode[1] + 'l' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "p": projectCode[4] + projectCode[0] + this.userForm.value['CNIC'][5] + projectCode[1] + 'k' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "q": projectCode[1] + projectCode[1] + this.userForm.value['CNIC'][1] + projectCode[2] + 'j' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "r": projectCode[2] + projectCode[2] + this.userForm.value['CNIC'][5] + projectCode[2] + 'i' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "s": projectCode[3] + projectCode[3] + this.userForm.value['CNIC'][1] + projectCode[1] + 'h' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "t": projectCode[4] + projectCode[4] + this.userForm.value['CNIC'][5] + projectCode[1] + 'g' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "u": projectCode[1] + projectCode[0] + this.userForm.value['CNIC'][1] + projectCode[2] + 'f' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "v": projectCode[2] + projectCode[1] + this.userForm.value['CNIC'][5] + projectCode[2] + 'e' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "w": projectCode[3] + projectCode[2] + this.userForm.value['CNIC'][1] + projectCode[1] + 'd' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "x": projectCode[4] + projectCode[3] + this.userForm.value['CNIC'][5] + projectCode[1] + 'c' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "y": projectCode[1] + projectCode[4] + this.userForm.value['CNIC'][1] + projectCode[2] + 'b' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "z": projectCode[2] + projectCode[0] + this.userForm.value['CNIC'][5] + projectCode[2] + 'a' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      
      "A": projectCode[3] + projectCode[1] + this.userForm.value['CNIC'][1] + projectCode[1] + 'Z' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "B": projectCode[4] + projectCode[2] + this.userForm.value['CNIC'][5] + projectCode[1] + 'Y' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "C": projectCode[1] + projectCode[3] + this.userForm.value['CNIC'][1] + projectCode[2] + 'X' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "D": projectCode[2] + projectCode[4] + this.userForm.value['CNIC'][5] + projectCode[2] + 'W' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "E": projectCode[3] + projectCode[0] + this.userForm.value['CNIC'][1] + projectCode[1] + 'V' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "F": projectCode[4] + projectCode[1] + this.userForm.value['CNIC'][5] + projectCode[1] + 'U' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "G": projectCode[1] + projectCode[2] + this.userForm.value['CNIC'][1] + projectCode[2] + 'T' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "H": projectCode[2] + projectCode[3] + this.userForm.value['CNIC'][5] + projectCode[2] + 'S' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "I": projectCode[3] + projectCode[4] + this.userForm.value['CNIC'][1] + projectCode[1] + 'R' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "J": projectCode[4] + projectCode[0] + this.userForm.value['CNIC'][5] + projectCode[1] + 'Q' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "K": projectCode[1] + projectCode[1] + this.userForm.value['CNIC'][1] + projectCode[2] + 'P' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "L": projectCode[2] + projectCode[2] + this.userForm.value['CNIC'][5] + projectCode[2] + 'O' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "M": projectCode[3] + projectCode[3] + this.userForm.value['CNIC'][1] + projectCode[1] + 'N' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "N": projectCode[4] + projectCode[4] + this.userForm.value['CNIC'][5] + projectCode[1] + 'M' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "O": projectCode[1] + projectCode[0] + this.userForm.value['CNIC'][1] + projectCode[2] + 'L' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "P": projectCode[2] + projectCode[1] + this.userForm.value['CNIC'][5] + projectCode[2] + 'K' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "Q": projectCode[3] + projectCode[2] + this.userForm.value['CNIC'][1] + projectCode[1] + 'J' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "R": projectCode[4] + projectCode[3] + this.userForm.value['CNIC'][5] + projectCode[1] + 'I' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "S": projectCode[1] + projectCode[4] + this.userForm.value['CNIC'][1] + projectCode[2] + 'H' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "T": projectCode[2] + projectCode[0] + this.userForm.value['CNIC'][5] + projectCode[2] + 'G' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "U": projectCode[3] + projectCode[1] + this.userForm.value['CNIC'][1] + projectCode[1] + 'F' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "V": projectCode[4] + projectCode[2] + this.userForm.value['CNIC'][5] + projectCode[1] + 'E' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "W": projectCode[1] + projectCode[3] + this.userForm.value['CNIC'][1] + projectCode[2] + 'D' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "X": projectCode[2] + projectCode[4] + this.userForm.value['CNIC'][5] + projectCode[2] + 'C' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "Y": projectCode[3] + projectCode[0] + this.userForm.value['CNIC'][1] + projectCode[1] + 'B' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2],
      "Z": projectCode[4] + projectCode[1] + this.userForm.value['CNIC'][5] + projectCode[1] + 'A' + this.userForm.value['CNIC'][3] + projectCode[1] + projectCode[2]
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

  // Helping Function
  countAgentsByKey(key:any) {
    if (!this.roles.Manager[key]) {
        return `ProjectCode '${key}' not found`;
    }

    // Count agents that match this ProjectCode
    let agentCount = this.roles.Agent.filter((a:any) => a.ProjectCode === key).length;

    return agentCount;
 }


  private setupAutoRotation(): void {
  const controls = this.globe.controls();
  
  // Auto-rotate configuration
  controls.autoRotate = this.isAutoRotating;
  controls.autoRotateSpeed = 0.8; // Slower, more elegant rotation
  
  // Smooth controls
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.rotateSpeed = 0.8;
  controls.zoomSpeed = 0.8;
  controls.panSpeed = 0.8;
  
  // Zoom limits
  controls.minDistance = 200;
  controls.maxDistance = 800;
  }

// Public methods to control rotation
  toggleRotation(): void {
    this.isAutoRotating = !this.isAutoRotating;
    const controls = this.globe.controls();
    controls.autoRotate = this.isAutoRotating;
  }

  setRotationSpeed(speed: number): void {
    const controls = this.globe.controls();
    controls.autoRotateSpeed = speed;
  }

  makeDataForEarth(data:any)
  {
    const roleColors:any = {
      Admin: "#d9534f",     // Red
      Manager: "#0275d8",   // Blue
      Agent: "#5cb85c"      // Green
    };

    const updatedData = data.map((item:any) => {
      return {
          ...item,
          lat: item.Lat,
          lng: item.long,
          size: 0.1,
          color: roleColors[item.Role] || "#999999",
          // Remove old keys
          Lat: undefined,
          long: undefined
      };
    });
    // Clean old keys
    updatedData.forEach((obj:any) => {
        delete obj.Lat;
        delete obj.long;
    });
  
    this.data = updatedData;
    console.log(this.data);
    this.initMap();
    // this.earth();    
  }

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  overlayOpen = false;

  toggleOverlay() {
    this.overlayOpen = !this.overlayOpen;
    this.cancelEdit();
  }

  private map!: L.Map;
  private initMap(): void {
    this.map = L.map('map').setView([24.8607, 67.0011], 3); 
    // L.tileLayer(
    //   'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    //   {
    //     attribution: '© OpenStreetMap © CARTO'
    //   }
    // ).addTo(this.map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.addDataMarkers();
  }

  private addDataMarkers(): void {
    // Assuming you have access to your data array
    let data:any = this.data; // Make sure you have your data accessible here
    
    if (!data || !Array.isArray(data)) return;
  
    data.forEach(item => {
      // Parse latitude and longitude from string to number
      const lat = parseFloat(item.lat);
      const lng = parseFloat(item.lng);
      
      // Skip if coordinates are invalid
      if (isNaN(lat) || isNaN(lng)) {
        console.warn(`Invalid coordinates for ${item.FirstName} ${item.LastName}`);
        return;
      }
  
      // Create marker with custom size and color
      const marker = L.circleMarker([lat, lng], {
        radius: item.size * 100, // Scale the size if needed (0.1 * 100 = 10px)
        color: item.color,
        fillColor: item.color,
        fillOpacity: 0.8,
        weight: 2
      }).addTo(this.map);
  
      // Create popup content
      const popupContent = `
        <div style="font-family: Arial, sans-serif; padding: 5px;">
          <strong>Name:</strong> ${item.FirstName} ${item.LastName}<br>
          <strong>Role:</strong> ${item.Role}<br>
          <strong>Username:</strong> ${item.Username}<br>
          <strong>CNIC:</strong> ${item.CNIC}<br>
          <strong>Location:</strong> ${lat.toFixed(3)}, ${lng.toFixed(3)}
        </div>
      `;
  
      // Bind popup to marker
      marker.bindPopup(popupContent);
    });
  }

  viewChange(item:any){
    if(item === 'map'){
      this.view = 'map';
      setTimeout(() => {
        this.initMap();
      }, 1000);
    } else {
      this.view = 'earth';
      setTimeout(() => {
         this.earth();
      }, 1000);
    }
  }
  
}
