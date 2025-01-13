import { Component, OnInit } from '@angular/core';
import { EventService, Event } from '../../services/events/events.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  userId: string | null = null;
  favorites: Event[] = [];
  loading = false;

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  async loadFavorites() {
    const loading = await this.loadingController.create({
      message: 'Loading favorites...'
    });
    await loading.present();

    try {
      const authResponse = await firstValueFrom(this.authService.checkAuth());
      if (authResponse?.isAuthenticated && authResponse?.user) {
        this.userId = authResponse.user.id;
        await this.fetchFavorites();
      } else {
        await this.showError('Please log in to view favorites');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      await this.showError('Error checking authentication');
    } finally {
      await loading.dismiss();
    }
  }

  private async fetchFavorites() {
    if (!this.userId) return;

    this.loading = true;
    try {
      const favoritesData = await firstValueFrom(this.eventService.getUserFavorites(this.userId));
      this.favorites = favoritesData;
    } catch (error) {
      await this.showError('Error loading favorites');
    } finally {
      this.loading = false;
    }
  }

  async removeFavorite(event: MouseEvent, eventId: string) {
    event.stopPropagation();
    
    if (!this.userId) {
      await this.showError('Please log in to manage favorites');
      return;
    }

    try {
      await firstValueFrom(this.eventService.removeFavorite(eventId));
      await this.fetchFavorites();
      
      const toast = await this.toastController.create({
        message: 'Removed from favorites',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
    } catch (error) {
      await this.showError('Error updating favorites');
    }
  }

  private async showError(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'danger',
      position: 'bottom'
    });
    await toast.present();
  }
 
// Modify goToEventDetails method in FavoritesPage
async goToEventDetails(eventId: string) {
  const loading = await this.loadingController.create({
    message: 'Loading event details...',
  });
  await loading.present();

  try {
    const eventDetails = await firstValueFrom(this.eventService.getEventDetails(eventId));
    console.log('Event Details:', eventDetails);
    // Updated the route path to match '/event-details/:id'
    this.router.navigate(['/event-details', eventId]);
  } catch (error) {
    console.error('Error fetching event details:', error);
    await this.showError('Error loading event details');
  } finally {
    await loading.dismiss();
  }
}


}