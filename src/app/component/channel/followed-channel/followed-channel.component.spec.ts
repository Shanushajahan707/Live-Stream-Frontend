import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowedChannelComponent } from './followed-channel.component';

describe('FollowedChannelComponent', () => {
  let component: FollowedChannelComponent;
  let fixture: ComponentFixture<FollowedChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FollowedChannelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FollowedChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
