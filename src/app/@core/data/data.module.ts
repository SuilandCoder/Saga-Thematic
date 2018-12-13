import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuService } from './menu.service';
import { ModelService } from './model.service';
import { RequestCache, RequestCacheWithMap } from './request-cache.service';
import { MessageService } from './message.service';

const SERVICES = [
  MenuService,
  ModelService, 
  { provide: RequestCache, useClass: RequestCacheWithMap },
  MessageService
];

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    ...SERVICES,
  ],
})
export class DataModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: DataModule,
      providers: [
        ...SERVICES,
      ],
    };
  }
}
