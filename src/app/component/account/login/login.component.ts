import { Component,  OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { AccountService } from '../../../service/account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  res!:any

  constructor(private fb: FormBuilder,private store:Store,private http:HttpClient,private service:AccountService,private toastr: ToastrService,private router:Router) { }
  

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(){
    if(this.loginForm.valid){
      console.log("the form values are",this.loginForm.value);
      this.sendLoginData(this.loginForm.value)
    }
  }
  
  sendLoginData(data: any) {
   this.service.login(data).subscribe({
    next:(res)=>{
      if(res && res.message)
        {
       this.toastr.success(res.message)
       this.loginForm.reset()
       localStorage.setItem('userdata',res.token)
       console.log(res.token);
       this.service.islogged$.next(true)
       this.router.navigate(['/userhome'])
       this.loginForm.reset()
        }
    },
    error:(err)=>{
     if(err.error && err.error.message){
      this.toastr.error(err.error.message)
     }
    }
   })
  }
 
}
