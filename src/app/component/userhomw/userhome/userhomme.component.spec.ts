import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserhommeComponent } from './userhomme.component';

describe('UserhommeComponent', () => {
  let component: UserhommeComponent;
  let fixture: ComponentFixture<UserhommeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserhommeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserhommeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
