import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserhomeComponent } from './userhomme.component';

describe('UserhommeComponent', () => {
  let component: UserhomeComponent;
  let fixture: ComponentFixture<UserhomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserhomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
