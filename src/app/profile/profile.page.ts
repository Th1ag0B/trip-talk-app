import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private alertController: AlertController) { }

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
    window.location.href = '/login'; // Redireciona para a página de login
  }
  ngOnInit() {
    
  }

}
