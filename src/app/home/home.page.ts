import { Component, OnInit } from '@angular/core';
import { EventService, Event } from '../services/events/events.service';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  selectedButton: string = 'mostViews';
  selectedTab: string = 'Home';
  events: Event[] = [];
  searchTerm: string = '';
  loading = false;
  userName: string = '';
  favorites: string[] = [];

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadUserName();
    this.loadEvents();
  }

  async loadUserName() {
    const loader = await this.loadingController.create({
      message: 'Fetching user information...',
    });
    await loader.present();

    this.authService.checkAuth().subscribe({
      next: (response) => {
        if (response.isAuthenticated && response.user) {
          this.userName = response.user.name;
        }
        loader.dismiss();
      },
      error: async (error) => {
        console.error('Error fetching user information:', error);
        loader.dismiss();
        const toast = await this.toastController.create({
          message: 'Failed to load user information. Please try again.',
          duration: 3000,
          color: 'danger',
        });
        toast.present();
      },
    });
  }

  async loadEvents() {
    const loader = await this.loadingController.create({
      message: 'Loading places...',
    });
    await loader.present();

    this.eventService.getAllEvents().subscribe({
      next: (data: Event[]) => {
        this.events = this.sortEvents(data, this.selectedButton);
        loader.dismiss();
      },
      error: async (error) => {
        console.error('Error fetching events', error);
        loader.dismiss();
        const toast = await this.toastController.create({
          message: 'Error loading places. Please try again.',
          duration: 3000,
          color: 'danger',
        });
        toast.present();
      },
    });
  }

  async goToEventDetails(eventId: string) {
    const loading = await this.loadingController.create({
      message: 'Loading event details...',
    });
    await loading.present();

    try {
      const eventDetails = await firstValueFrom(this.eventService.getEventDetails(eventId));
      console.log('Event Details:', eventDetails);
      this.router.navigate(['/event-details', eventId]);
    } catch (error) {
      console.error('Error fetching event details:', error);
      await this.showError('Error loading event details');
    } finally {
      await loading.dismiss();
    }
  }

  async showError(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'danger',
    });
    toast.present();
  }

  sortEvents(events: Event[], criteria: string): Event[] {
    switch (criteria) {
      case 'recent':
        return [...events].sort((a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      case 'latest':
        return [...events].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'mostViews':
      default:
        return events;
    }
  }

  selectButton(button: string) {
    this.selectedButton = button;
    this.events = this.sortEvents(this.events, button);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
  viewAllPlaces() {
    this.router.navigate(['/recents']);
  }
  

  searchPlaces(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.searchTerm = searchTerm;
  }

  async toggleFavorite(event: Event, cardEvent: MouseEvent) {
    cardEvent.stopPropagation();

    const isFavorite = this.favorites.includes(event.id);
    const loader = await this.loadingController.create({
      message: 'Updating favorite status...',
    });
    await loader.present();

    if (isFavorite) {
      this.eventService.removeFavorite(event.id).subscribe({
        next: async () => {
          this.favorites = this.favorites.filter((fav) => fav !== event.id);
          loader.dismiss();
          const toast = await this.toastController.create({
            message: 'Removed from favorites!',
            duration: 3000,
            color: 'danger',
          });
          toast.present();
        },
        error: async (error) => {
          console.error('Error removing from favorites', error);
          loader.dismiss();
          const toast = await this.toastController.create({
            message: 'Error removing from favorites. Please try again.',
            duration: 3000,
            color: 'danger',
          });
          toast.present();
        },
      });
    } else {
      this.eventService.addFavorite(event.id).subscribe({
        next: async () => {
          this.favorites.push(event.id);
          loader.dismiss();
          const toast = await this.toastController.create({
            message: 'Added to favorites!',
            duration: 3000,
            color: 'success',
          });
          toast.present();
        },
        error: async (error) => {
          console.error('Error adding to favorites', error);
          loader.dismiss();

          const toast = await this.toastController.create({
            message: 'Error adding to favorites. Please try again.',
            duration: 3000,
            color: 'danger',
          });
          toast.present();
        },
      });
    }
  }
}
