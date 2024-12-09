import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  authMode: 'login' | 'signup' = 'login';

  constructor() {}

  toggleAuthMode(mode: 'login' | 'signup') {
    this.authMode = mode;
  }

}
