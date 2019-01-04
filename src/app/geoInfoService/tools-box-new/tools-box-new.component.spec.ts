import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsBoxNewComponent } from './tools-box-new.component';

describe('ToolsBoxNewComponent', () => {
  let component: ToolsBoxNewComponent;
  let fixture: ComponentFixture<ToolsBoxNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolsBoxNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolsBoxNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
