import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionsidebarComponent } from './subscriptionsidebar.component';

describe('SubscriptionsidebarComponent', () => {
  let component: SubscriptionsidebarComponent;
  let fixture: ComponentFixture<SubscriptionsidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionsidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubscriptionsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
