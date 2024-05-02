import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelOverviewComponent } from './channel-overview.component';

describe('ChannelOverviewComponent', () => {
  let component: ChannelOverviewComponent;
  let fixture: ComponentFixture<ChannelOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChannelOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
