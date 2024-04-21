import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { AccountService } from '../../../service/account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss'
})
export class OtpComponent implements OnInit,OnDestroy{
    otpform!:FormGroup
    start:boolean=true
    value:number=60
    stop:boolean=false
    intervaltimer!:any
    constructor(private fb:FormBuilder,private service:AccountService,private toastr:ToastrService,private router:Router){}
    
    ngOnInit(): void {
      this.otpform=this.fb.group({
        digit1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
        digit2: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      digit3: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      digit4: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      digit5: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      digit6: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
   })
   this.timer()
  }
  otpsubmit(){
    console.log(this.otpform.value);
    this.service.otp(this.otpform.value).subscribe({
      next:(res=>{
        if(res && res.message){
        this.toastr.success(res.messages)
        this.router.navigate(['/login'])
        this.otpform.reset()
        }
      }),
      error:(err=>{
        if(err && err.error.message){
          this.toastr.error(err.error.message)
          this.otpform.reset()
        }
      })
    })
  }
  timer(){
    this.intervaltimer=setInterval(()=>{
      if (this.start && !this.stop && this.value > 0) {
        this.value--; 
      } else if (this.value === 0) {
        this.stop=true
        clearInterval(this.intervaltimer); 
      }
    },1000)
  }

  resendotp(){
   this.service.resendotp().subscribe({
    next:(res=>{
      if(res && res.message){
        this.toastr.success(res.message)
      }
    }),
    error:(err=>{
      if(err && err.error.message){
        this.toastr.error(err.error.message)
      }
    })
   })
  }

  ngOnDestroy(): void {
    clearInterval(this.intervaltimer)
  }
  
}
