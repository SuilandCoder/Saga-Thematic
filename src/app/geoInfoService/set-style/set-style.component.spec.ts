import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetStyleComponent } from './set-style.component';

describe('SetStyleComponent', () => {
  let component: SetStyleComponent;
  let fixture: ComponentFixture<SetStyleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetStyleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
