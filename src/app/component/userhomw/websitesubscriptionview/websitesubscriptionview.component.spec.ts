import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsitesubscriptionviewComponent } from './websitesubscriptionview.component';

describe('WebsitesubscriptionviewComponent', () => {
  let component: WebsitesubscriptionviewComponent;
  let fixture: ComponentFixture<WebsitesubscriptionviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebsitesubscriptionviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WebsitesubscriptionviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
