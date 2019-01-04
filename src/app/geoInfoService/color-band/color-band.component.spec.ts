import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorBandComponent } from './color-band.component';

describe('ColorBandComponent', () => {
  let component: ColorBandComponent;
  let fixture: ComponentFixture<ColorBandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorBandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorBandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
