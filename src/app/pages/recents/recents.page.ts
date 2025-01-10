import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService, Event } from '../../services/events.service';
import { LoadingController, ToastController, AlertController, RefresherCustomEvent } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-recents',
  templateUrl: './recents.page.html',
  styleUrls: ['./recents.page.scss'],
})
export class RecentsPage implements OnInit {
  eventForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    destiny: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  showForm: boolean = false;
  events: Event[] = [];
  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadEvents();
  }

  async handleRefresh(event: RefresherCustomEvent) {
    await this.loadEvents(false);
    event.target.complete();
  }

  async loadEvents(showLoading: boolean = true): Promise<void> {
    let loading: HTMLIonLoadingElement | undefined;
    if (showLoading) {
      loading = await this.loadingCtrl.create({
        message: 'Loading events...',
      });
      await loading.present();
    }
  
    this.isLoading = true;
  
    this.eventService.getAllEvents().subscribe({
      next: (events: Event[]) => {
        this.events = events.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.isLoading = false;
        loading?.dismiss();
      },
      error: async (error: HttpErrorResponse) => {
        console.error('Error loading events:', error);
        this.isLoading = false;
        loading?.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'Error loading events. Please try again.',
          duration: 2000,
          color: 'danger',
        });
        toast.present();
      },
    });
  }

  async addEvent(): Promise<void> {
    if (this.eventForm.valid) {
      const loading = await this.loadingCtrl.create({
        message: 'Creating event...',
      });
      await loading.present();

      this.eventService.createEvent(this.eventForm.value).subscribe({
        next: async (event: Event) => {
          this.events.unshift(event);
          this.eventForm.reset();
          this.showForm = false;
          loading.dismiss();
          
          const toast = await this.toastCtrl.create({
            message: 'Event created successfully!',
            duration: 2000,
            color: 'success',
          });
          toast.present();
        },
        error: async (error: HttpErrorResponse) => {
          console.error('Error creating event:', error);
          loading.dismiss();
          
          const toast = await this.toastCtrl.create({
            message: 'Error creating event. Please try again.',
            duration: 2000,
            color: 'danger',
          });
          toast.present();
        }
      });
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this event?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              message: 'Deleting event...'
            });
            await loading.present();

            this.eventService.deleteEvent(eventId).subscribe({
              next: async () => {
                this.events = this.events.filter(event => event.id !== eventId);
                loading.dismiss();
                
                const toast = await this.toastCtrl.create({
                  message: 'Event deleted successfully',
                  duration: 2000,
                  color: 'success'
                });
                toast.present();
              },
              error: async (error: HttpErrorResponse) => {
                console.error('Error deleting event:', error);
                loading.dismiss();
                
                const toast = await this.toastCtrl.create({
                  message: 'Error deleting event. Please try again.',
                  duration: 2000,
                  color: 'danger'
                });
                toast.present();
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.eventForm.reset();
    }
  }

  formatDate(date: Date | string): string {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    return parsedDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  
  getDuration(startDate: Date | string, endDate: Date | string): string {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
}
