import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivescreenComponent } from './livescreen.component';

describe('LivescreenComponent', () => {
  let component: LivescreenComponent;
  let fixture: ComponentFixture<LivescreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LivescreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LivescreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
