import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineMapToolComponent } from './online-map-tool.component';

describe('OnlineMapToolComponent', () => {
  let component: OnlineMapToolComponent;
  let fixture: ComponentFixture<OnlineMapToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineMapToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineMapToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
