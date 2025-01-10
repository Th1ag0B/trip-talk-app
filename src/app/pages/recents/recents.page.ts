import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService, Event } from '../../services/events/events.service';
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

  selectedFile: File | null = null; // Declare selectedFile property
  showForm: boolean = false;
  editingEventId: string | null = null;
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
      loading = await this.loadingCtrl.create({ message: 'Loading events...' });
      await loading.present();
    }

    this.isLoading = true;
    this.eventService.getAllEvents().subscribe({
      next: (events: Event[]) => {
        this.events = events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.isLoading = false;
        loading?.dismiss();
      },
      error: async () => {
        this.isLoading = false;
        loading?.dismiss();
        const toast = await this.toastCtrl.create({ message: 'Error loading events.', duration: 2000, color: 'danger' });
        toast.present();
      },
    });
  }

  onFileSelected(event: InputEvent): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFile = input.files[0];
    }
  }

  async saveEvent(): Promise<void> {
    if (this.eventForm.valid) {
      const formData = new FormData();
      Object.entries(this.eventForm.value).forEach(([key, value]) => {
        if (typeof value === 'string' || value instanceof Blob) {
          formData.append(key, value); // Add only string or Blob
        }
      });
  
      if (this.selectedFile) {
        formData.append('image', this.selectedFile); // Add the file to the form data
      }
  
      const loading = await this.loadingCtrl.create({
        message: this.editingEventId ? 'Updating event...' : 'Creating event...',
      });
      await loading.present();
      if (this.editingEventId) {
        this.eventService.editEvent(this.editingEventId, formData).subscribe({
          next: async (updatedEvent) => {
            const index = this.events.findIndex((e) => e.id === this.editingEventId);
            if (index !== -1) this.events[index] = updatedEvent;
            this.resetForm();
            loading.dismiss();
            const toast = await this.toastCtrl.create({
              message: 'Event updated successfully!',
              duration: 2000,
              color: 'success',
            });
            toast.present();
          },
          error: async () => {
            loading.dismiss();
            const toast = await this.toastCtrl.create({
              message: 'Error updating event.',
              duration: 2000,
              color: 'danger',
            });
            toast.present();
          },
        });
      } else {
        this.eventService.createEvent(formData).subscribe({
          next: async (event) => {
            this.events.unshift(event);
            this.resetForm();
            loading.dismiss();
            const toast = await this.toastCtrl.create({
              message: 'Event created successfully!',
              duration: 2000,
              color: 'success',
            });
            toast.present();
          },
          error: async () => {
            loading.dismiss();
            const toast = await this.toastCtrl.create({
              message: 'Error creating event.',
              duration: 2000,
              color: 'danger',
            });
            toast.present();
          },
        });
      }
    }
  }
  resetForm(): void {
    this.showForm = false;
    this.editingEventId = null;
    this.eventForm.reset();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) this.resetForm();
  }

  async deleteEvent(eventId: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this event?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            const loading = await this.loadingCtrl.create({ message: 'Deleting event...' });
            await loading.present();
            this.eventService.deleteEvent(eventId).subscribe({
              next: async () => {
                this.events = this.events.filter((e) => e.id !== eventId);
                loading.dismiss();
                const toast = await this.toastCtrl.create({ message: 'Event deleted successfully', duration: 2000, color: 'success' });
                toast.present();
              },
              error: async () => {
                loading.dismiss();
                const toast = await this.toastCtrl.create({ message: 'Error deleting event.', duration: 2000, color: 'danger' });
                toast.present();
              },
            });
          },
        },
      ],
    });
    await alert.present();
  }

  startEditing(event: Event): void {
    this.showForm = true;
    this.editingEventId = event.id;
    this.eventForm.patchValue({
      name: event.name,
      description: event.description,
      destiny: event.destiny,
      startDate: event.startDate,
      endDate: event.endDate,
    });
  }

  formatDate(date: Date | string): string {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    return parsedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }

  getDuration(startDate: Date | string, endDate: Date | string): string {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
}
