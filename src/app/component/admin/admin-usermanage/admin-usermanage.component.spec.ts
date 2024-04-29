import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUsermanageComponent } from './admin-usermanage.component';

describe('AdminUsermanageComponent', () => {
  let component: AdminUsermanageComponent;
  let fixture: ComponentFixture<AdminUsermanageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminUsermanageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminUsermanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
