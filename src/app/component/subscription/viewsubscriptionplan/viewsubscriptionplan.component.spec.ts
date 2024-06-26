import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsubscriptionplanComponent } from './viewsubscriptionplan.component';

describe('ViewsubscriptionplanComponent', () => {
  let component: ViewsubscriptionplanComponent;
  let fixture: ComponentFixture<ViewsubscriptionplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewsubscriptionplanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewsubscriptionplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
