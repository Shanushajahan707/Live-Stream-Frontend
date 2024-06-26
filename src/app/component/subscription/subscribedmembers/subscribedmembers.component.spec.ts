import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribedmembersComponent } from './subscribedmembers.component';

describe('SubscribedmembersComponent', () => {
  let component: SubscribedmembersComponent;
  let fixture: ComponentFixture<SubscribedmembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscribedmembersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubscribedmembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
