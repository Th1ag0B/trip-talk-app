import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  selectedButton: string = 'mostViews';
  selectedTab: string = 'Home';

  constructor() {}

  selectButton(button: string) {
    this.selectedButton = button;
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}