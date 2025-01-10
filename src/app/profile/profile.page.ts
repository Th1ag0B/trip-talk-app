import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private alertController: AlertController) { }

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
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
    window.location.href = '/login';
  }

  async profileModal() {
    const alert = await this.alertController.create({
      header: 'Profile',
      message: 'Edit your profile',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });

    await alert.present();
  }

  async commentariesModal() {
    const alert = await this.alertController.create({
      header: 'Commentaries',
      message: 'See your commentaries',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });

    await alert.present();
  }

  async scheduleModal() {
    const alert = await this.alertController.create({
      header: 'Schedule',
      message: 'Do you really want to leave?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });

    await alert.present();
  }

  async settingsModal() {
    const alert = await this.alertController.create({
      header: 'Settings',
      message: 'Do you really want to leave?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });

    await alert.present();
  }

  async versionModal() {
    const alert = await this.alertController.create({
      header: 'Version',
      message: '1.0.0',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });

    await alert.present();
  }
  ngOnInit() {
    
  }
  
}
