import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../../service/account.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  constructor(private router:Router,private service:AccountService){}
  islogged:Boolean=false

  ngOnInit(): void {
   console.log(localStorage.getItem('userdata'));
   this.service.islogged$.subscribe(res=>{
    this.islogged= this.service.islogged()
   })
  }
  onlogin(){
    this.router.navigate(['/login'])
  }
  onsignup(){
    this.router.navigate(['/signup'])
  }
  onlogout(){
    localStorage.removeItem('userdata')
    this.service.islogged$.next(false)
    this.router.navigate([''])
  }
}
