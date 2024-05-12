import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminChannelmanageComponent } from './admin-channelmanage.component';

describe('AdminChannelmanageComponent', () => {
  let component: AdminChannelmanageComponent;
  let fixture: ComponentFixture<AdminChannelmanageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminChannelmanageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminChannelmanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
