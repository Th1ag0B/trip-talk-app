import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { UploadService } from '../../services/upload/upload.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  userData: any = {};
  isModalOpen = false;
  userId: string = '';
  currentPassword: string = '';
  newPassword: string = '';
  isUploading: boolean = false;
  profilePictureFile: any;

  constructor(
    private alertController: AlertController,
    private userService: UserService,
    private authService: AuthService,
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    this.authService.checkAuth().subscribe(
      (response) => {
        if (response.isAuthenticated && response.user) {
          this.userData = response.user;
          this.userId = response.user.id;
        } else {
          console.error('User is not authenticated');
        }
      },
      (error) => {
        console.error('Error loading user info:', error);
      }
    );
  }

  // Profile Picture Upload Methods
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  async handleProfilePictureChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      const alert = await this.alertController.create({
        header: 'Invalid File',
        message: 'Please select an image file.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    this.isUploading = true;
    const token = localStorage.getItem('token') || '';

    try {
      const response = await this.uploadService.uploadProfilePicture(file, token).toPromise();
      this.userData.profilePictureUrl = response.profilePictureUrl;
      
      const alert = await this.alertController.create({
        header: 'Success',
        message: 'Profile picture updated successfully!',
        buttons: ['OK']
      });
      await alert.present();
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Failed to upload profile picture. Please try again.',
        buttons: ['OK']
      });
      await alert.present();
    } finally {
      this.isUploading = false;
    }
  }

  // Modal Controls
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  // Logout Modal and Function
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
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  // Profile Edit Modal
  async profileModal() {
    this.setOpen(true);
  }

  // Save Profile Changes
  saveProfile() {
    if (!this.userData.name || !this.userData.email) {
      console.error('Name and email are required!');
      return;
    }

    if (this.newPassword && !this.currentPassword) {
      console.error('Please enter your current password to change it.');
      return;
    }

    const updateData = {
      name: this.userData.name,
      email: this.userData.email,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
    };

    this.userService.updateUser(
      this.userId, 
      updateData.name, 
      updateData.email, 
      updateData.currentPassword, 
      updateData.newPassword
    ).subscribe(
      (response) => {
        console.log('Profile updated successfully', response);
        this.setOpen(false);
        this.loadUserInfo();
      },
      (error) => {
        console.error('Error updating profile:', error);
      }
    );
  }

  // Other Modals
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
}