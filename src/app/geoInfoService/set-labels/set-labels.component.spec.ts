import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetLabelsComponent } from './set-labels.component';

describe('SetLabelsComponent', () => {
  let component: SetLabelsComponent;
  let fixture: ComponentFixture<SetLabelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetLabelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
