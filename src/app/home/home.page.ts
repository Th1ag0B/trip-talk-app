import { Component, OnInit } from '@angular/core';
import { EventService, Event } from '../services/events/events.service';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

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
  userName: string = 'Tobi'; // You might want to get this from your auth service
  favorites: string[] = []; // To store the list of favorite event IDs

  constructor(
    private eventService: EventService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  async loadEvents() {
    const loader = await this.loadingController.create({
      message: 'Loading places...'
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
          color: 'danger'
        });
        toast.present();
      }
    });
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
        return events; // Assuming the backend sorts by views or maintain current order
    }
  }

  selectButton(button: string) {
    this.selectedButton = button;
    this.events = this.sortEvents(this.events, button);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToTravelDetails(eventId: string) {
    this.router.navigate(['/travels', eventId]);
  }

  searchPlaces(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.searchTerm = searchTerm;
  }

  viewAllPlaces() {
    this.router.navigate(['/recents']);
  }

  async toggleFavorite(event: Event, cardEvent: MouseEvent) {
    cardEvent.stopPropagation(); // Prevent card click event from triggering
  
    // Check if the event is already in the favorites
    const isFavorite = this.favorites.includes(event.id);
    const loader = await this.loadingController.create({
      message: 'Updating favorite status...'
    });
    await loader.present();
  
    if (isFavorite) {
      // Remove from favorites
      this.eventService.removeFavorite(event.id).subscribe({
        next: async () => {
          // Remove the event from the local favorites list
          this.favorites = this.favorites.filter(fav => fav !== event.id);
          loader.dismiss();
          const toast = await this.toastController.create({
            message: 'Removed from favorites!',
            duration: 3000,
            color: 'danger'
          });
          toast.present();
        },
        error: async (error) => {
          console.error('Error removing from favorites', error);
          loader.dismiss();
          const toast = await this.toastController.create({
            message: 'Error removing from favorites. Please try again.',
            duration: 3000,
            color: 'danger'
          });
          toast.present();
        }
      });
    } else {
      // Add to favorites
      this.eventService.addFavorite(event.id).subscribe({
        next: async () => {
          // Add the event to the local favorites list
          this.favorites.push(event.id);
          loader.dismiss();
          const toast = await this.toastController.create({
            message: 'Added to favorites!',
            duration: 3000,
            color: 'success'
          });
          toast.present();
        },
        error: async (error) => {
          console.error('Error adding to favorites', error);
          loader.dismiss();
  
          // If the event is already in favorites, show a message without failing
          if (error?.message === 'Event already favorited') {
            const toast = await this.toastController.create({
              message: 'This event is already in your favorites.',
              duration: 3000,
              color: 'warning'
            });
            toast.present();
          } else {
            const toast = await this.toastController.create({
              message: 'Error adding to favorites. Please try again.',
              duration: 3000,
              color: 'danger'
            });
            toast.present();
          }
        }
      });
    }
  }
}