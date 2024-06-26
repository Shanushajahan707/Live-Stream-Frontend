import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminchannelsubscriptionComponent } from './adminchannelsubscription.component';

describe('AdminchannelsubscriptionComponent', () => {
  let component: AdminchannelsubscriptionComponent;
  let fixture: ComponentFixture<AdminchannelsubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminchannelsubscriptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminchannelsubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
