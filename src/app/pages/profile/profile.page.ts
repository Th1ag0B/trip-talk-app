import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private alertController: AlertController,
    private router: Router // Inject Router to handle navigation
  ) { }

  async presentLogoutModal() {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Do you really want to leave?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes, exit',
          handler: () => {
            this.logout();
          },
        },
      ],
    });

    await alert.present();
  }

  logout() {
    // Assuming the token is stored in cookies or local storage
    // Remove token from local storage or cookies (update based on your storage method)
    localStorage.removeItem('token'); // If token is stored in localStorage
    // OR for cookies
    // document.cookie = 'token=; Max-Age=0; path=/'; 

    // Redirect to the login page
    this.router.navigate(['/login']); // Use Angular Router for navigation instead of window.location.href
  }

  ngOnInit() {
  }

}
