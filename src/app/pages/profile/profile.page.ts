import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { CommentsService } from '../../services/comments/comments.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userData = { name: '', email: '', profilePictureUrl: '' };
  userComments: Comment[] = [];
  profileForm!: FormGroup;
  userId: string | null = null;


  isProfileModalOpen = false;
  isCommentariesModalOpen = false;
  isScheduleModalOpen = false;
  isSettingsModalOpen = false;
  isVersionModalOpen = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private commentsService: CommentsService,
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.loadUserDetails();
    this.initializeForm();
  }

  initializeForm() {
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
    });
  }

  loadUserDetails() {
    this.authService.checkAuth().subscribe(authResponse => {
      if (authResponse.isAuthenticated && authResponse.user) {
        this.userId = authResponse.user.id;
        this.userData = {
          name: authResponse.user.name || 'Guest',
          email: authResponse.user.email || 'No email provided',
          profilePictureUrl: authResponse.user.profilePictureUrl || ''
        };
        this.loadUserComments(this.userId);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  loadUserComments(userId: string) {
    this.commentsService.getUserComments(userId).subscribe(comments => {
      this.userComments = comments;
    });
  }

  toggleProfileModal(open: boolean) {
    this.isProfileModalOpen = open;
    this.cdr.detectChanges(); 
  }

  toggleCommentariesModal(open: boolean) {
    this.isCommentariesModalOpen = open;
    this.cdr.detectChanges();
  }

  toggleScheduleModal(open: boolean) {
    this.isScheduleModalOpen = open;
    this.cdr.detectChanges();
  }

  toggleSettingsModal(open: boolean) {
    this.isSettingsModalOpen = open;
    this.cdr.detectChanges();
  }

  toggleVersionModal(open: boolean) {
    this.isVersionModalOpen = open;
    this.cdr.detectChanges();
  }

  saveProfile() {
    if (this.profileForm.valid) {
      const { name, email, currentPassword, newPassword } = this.profileForm.value;
      this.userService.updateUser(this.userId!, name, email, currentPassword, newPassword).subscribe(
        () => {
          this.toggleProfileModal(false);
          this.loadUserDetails();
        },
        (error) => {
          console.error('Error updating profile', error);
        }
      );
    }
  }

  presentLogoutModal() {
    if (confirm('Are you sure you want to log out?')) {
      this.logout();
    }
  }
// for later
  logout() {
    this.authService.logout().subscribe(
      () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Logout error:', error);
      }
    );
  }
}
