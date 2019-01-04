import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsBoxSettingComponent } from './tools-box-setting.component';

describe('ToolsBoxSettingComponent', () => {
  let component: ToolsBoxSettingComponent;
  let fixture: ComponentFixture<ToolsBoxSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolsBoxSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolsBoxSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
