import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomInterceptor } from './custom-interceptor';
import { CachingInterceptor } from './caching-interceptor';
import { LoggingInterceptor } from './logging-interceptor';

export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: CustomInterceptor, multi: true }, 
    { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },

]