import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandinghomeComponent } from './landinghome.component';

describe('LandinghomeComponent', () => {
  let component: LandinghomeComponent;
  let fixture: ComponentFixture<LandinghomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandinghomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LandinghomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
