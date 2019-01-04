import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsBoxSettingPanelComponent } from './tools-box-setting-panel.component';

describe('ToolsBoxSettingPanelComponent', () => {
  let component: ToolsBoxSettingPanelComponent;
  let fixture: ComponentFixture<ToolsBoxSettingPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolsBoxSettingPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolsBoxSettingPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
