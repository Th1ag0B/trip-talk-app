import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  selectedButton: string = 'mostViews';
  selectedTab: string = 'Home';


  constructor(private router: Router) {}

    goToProfile() {
    this.router.navigate(['/profile']);
  }
  
  selectButton(button: string) {
    this.selectedButton = button;
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}
