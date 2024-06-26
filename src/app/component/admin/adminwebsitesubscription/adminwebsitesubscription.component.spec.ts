import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminwebsitesubscriptionComponent } from './adminwebsitesubscription.component';

describe('AdminwebsitesubscriptionComponent', () => {
  let component: AdminwebsitesubscriptionComponent;
  let fixture: ComponentFixture<AdminwebsitesubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminwebsitesubscriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminwebsitesubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
