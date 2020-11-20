import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HideWithCustomBpComponent } from './hide-with-custom-bp.component';

describe('HideWithCustomBpComponent', () => {
  let component: HideWithCustomBpComponent;
  let fixture: ComponentFixture<HideWithCustomBpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HideWithCustomBpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HideWithCustomBpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
