import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../../service/account.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DataPassingService } from '../../../service/data-passing.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  constructor(
    private _router: Router,
    private _service: AccountService,
    private _dataService:DataPassingService
  ) {}
  islogged: Boolean = false;
  isadmin: Boolean = false;
  visible: boolean = false;
  Livename!: string;
  RoomId!: number;

  ngOnInit(): void {
    this._service.islogged$.subscribe((res) => {
      this.islogged = this._service.islogged();
    });
    this._service.isAdmin$.subscribe((res) => {
      this.isadmin = this._service.isAdmin();
    });
    console.log('logged',this.islogged);
  }
  onlogin() {
    this._router.navigate(['/login']);
  }
  onsignup() {
    this._router.navigate(['/signup']);
  }
  onlogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this._service.islogged$.next(false);
    this._router.navigate(['']);
  }
  test() {
    console.log('clicked')
    // this.service.test().subscribe((res) => {
    //   console.log('response', res);
    // });
  }
  livepage(){
    this.visible = true;
  }
  createRoom(){
    this.visible=false
    const data={
      Livename:this.Livename,
      RoomId:this.RoomId
    }
    this._dataService.changeData(data)
    this._router.navigateByUrl('live')
  }
}
