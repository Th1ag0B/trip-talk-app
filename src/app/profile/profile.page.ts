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
      cssClass: 'modal',
      header: 'Confirmation',
      message: 'Do you really want to leave?',
      buttons: [
        {
          cssClass: 'cancel-button',
          text: 'Cancel',
          role: 'cancel',
        },
        {
          cssClass: 'exit-button',
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
      cssClass: 'modal',
      header: 'Profile',
      message: 'Edit your profile',
      inputs: [
        {
          cssClass: 'placeholders',
          name: 'username',
          type: 'text',
          placeholder: 'Change your username',
        },
        {
          cssClass: 'placeholders',
          name: 'email',
          type: 'email',
          placeholder: 'Change your email',
        },
        {
          cssClass: 'placeholders',
          name: 'profilePicture',
          type: 'url',
          placeholder: 'Choose your profile picture',
        },
      ],
      buttons: [
        {
          cssClass: 'cancel-button',
          text: 'Cancel',
          role: 'cancel',
        },
        {
          cssClass: 'save-button',
          text: 'Save',
          handler: (data) => {
            console.log('Saved data:', data);
          },
        },
      ],
    });
  
    await alert.present();
  }
  
  async commentariesModal() {
    const alert = await this.alertController.create({
      cssClass: 'modal',
      header: 'Commentaries',
      message: 'See your commentaries',
      buttons: [
        {
          cssClass: 'cancel-button',
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });

    await alert.present();
  }


  async scheduleModal() {
    const alert = await this.alertController.create({
      cssClass: 'modal',
      header: 'Schedule',
      message: 'See your calendar here',
      buttons: [
        {
          cssClass: 'cancel-button',
          text: 'Cancel',
          role: 'cancel',
        },
        {
          cssClass: 'save-button',
          text: 'Save',
          },
      ],
    });
  
    const settingsHTML = `
      <ion-datetime
          presentation="date"
          class="calendar"
        ></ion-datetime>
    `;
  
    const messageContainer = alert.querySelector('.alert-message');
    if (messageContainer) {
      messageContainer.innerHTML = settingsHTML;
    }
  
    await alert.present();
  }


  async settingsModal() {
    const alert = await this.alertController.create({
      cssClass: 'modal',
      header: 'Settings',
      message: '',
      buttons: [
        {
          cssClass: 'cancel-button',
          text: 'Cancel',
          role: 'cancel',
        },
        {
          cssClass: 'save-button',
          text: 'Save',
          handler: () => {
            const notifications = (document.getElementById('notifications') as HTMLInputElement).checked;
            const theme = (document.getElementById('theme') as HTMLSelectElement).value;
            const language = (document.getElementById('language') as HTMLSelectElement).value;
  
            console.log('Settings saved:', { notifications, theme, language });

          },
        },
      ],
    });
  
    const settingsHTML = `
      <div class="settings-container">
        <label for="notifications">Notifications:</label>
        <input type="checkbox" id="notifications" />
        
        <label for="theme">Select Theme:</label>
        <select id="theme">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        
        <label for="language">Language:</label>
        <select id="language">
          <option value="en">English</option>
          <option value="pt">Português</option>
          <option value="es">Español</option>
        </select>
      </div>
    `;
  
    const messageContainer = alert.querySelector('.alert-message');
    if (messageContainer) {
      messageContainer.innerHTML = settingsHTML;
    }
  
    await alert.present();
  }

  async versionModal() {
    const alert = await this.alertController.create({
      cssClass: 'modal',
      header: 'Version',
      message: '',
      buttons: [
        {
          cssClass: 'cancel-button',
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
  
    const versionHTML = `
        <div>
          <strong>Version:</strong> 1.0.0
        </div>
        <div>
          <strong>Developers:</strong> Tiago Barros & Duarte Menezes
        </div>
      `;
  
    const messageContainer = alert.querySelector('.alert-message');
    if (messageContainer) {
      messageContainer.innerHTML = versionHTML;
    }
    await alert.present();
    }

  ngOnInit() {
    
  }
  
}
