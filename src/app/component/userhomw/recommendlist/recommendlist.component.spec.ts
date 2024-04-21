import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendlistComponent } from './recommendlist.component';

describe('RecommendlistComponent', () => {
  let component: RecommendlistComponent;
  let fixture: ComponentFixture<RecommendlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecommendlistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecommendlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
