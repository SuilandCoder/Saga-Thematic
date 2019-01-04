import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullExtentComponent } from './full-extent.component';

describe('FullExtentComponent', () => {
  let component: FullExtentComponent;
  let fixture: ComponentFixture<FullExtentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullExtentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullExtentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
