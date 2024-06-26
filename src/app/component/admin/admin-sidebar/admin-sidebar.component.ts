import { Component, OnInit } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss'
})
export class AdminSidebarComponent implements OnInit{
  date!:Date
  
  ngOnInit(): void {
    this.date=new Date()
  }
}
