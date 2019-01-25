import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerSettingsComponent } from './layer-settings.component';

describe('LayerSettingsComponent', () => {
  let component: LayerSettingsComponent;
  let fixture: ComponentFixture<LayerSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
