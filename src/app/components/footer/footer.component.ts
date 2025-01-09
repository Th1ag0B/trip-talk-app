import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  tabs: { id: string; icon: string; label: string; route: string }[] = [];
  selectedTab: string = '';

  constructor() {}

  ngOnInit() {
    this.tabs = [
      { id: 'Home', icon: 'home-outline', label: 'Home', route: '/home' },
      { id: 'Recents', icon: 'add-circle-outline', label: 'Add', route: '/recents' },
      { id: 'Favorites', icon: 'heart-outline', label: 'Favorites', route: '/favorites' },
      { id: 'Profile', icon: 'person-outline', label: 'Profile', route: '/profile' },
    ];
    this.selectedTab = this.tabs[0].id;
  }

  selectTab(tabId: string) {
    this.selectedTab = tabId;
  }
}
