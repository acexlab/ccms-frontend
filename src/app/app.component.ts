/*
 * File: app.component.ts
 * Description: Root application component hosting the router outlet.
 * To Implement: Keep styles minimal.
 */

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
  styles: []
})
export class AppComponent {
  title = 'ccms-frontend';
}
