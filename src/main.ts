/*
 * File: main.ts
 * Description: Application bootstrap entry point.
 * To Implement: Keep in sync with appConfig and AppComponent imports.
 */

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
