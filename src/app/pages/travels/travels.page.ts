import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService, Event, Comment } from '../../services/events/events.service';
import { AuthService } from '../../services/auth/auth.service';
import { LoadingController, ToastController, ActionSheetController, RefresherCustomEvent } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-travels',
  templateUrl: './travels.page.html',
  styleUrls: ['./travels.page.scss'],
})
export class TravelsPage implements OnInit, OnDestroy {
  event: Event | null = null;
  comments: Comment[] = [];
  newCommentContent: string = '';
  isAddingComment = false;
  currentUserId: string | null = null;
  currentUserName = '';
  private destroy$ = new Subject<void>();
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private authService: AuthService,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.setupUser();
      this.loadEventDetails(eventId);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  testBinding() {
    console.log('Current value:', this.newCommentContent);
    this.newCommentContent = 'Test ' + new Date().toISOString();
    console.log('New value:', this.newCommentContent);
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Event Options',
      buttons: [
        {
          text: 'Edit Event',
          icon: 'create',
          handler: () => {
            if (this.event?.id) {
              this.router.navigate(['/events/edit', this.event.id]);
            }
          }
        },
        {
          text: 'Delete Event',
          icon: 'trash',
          role: 'destructive',
          handler: () => {
            this.deleteEvent();
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  private async setupUser() {
    try {
      const authData = await this.authService.checkAuth().toPromise();
      if (authData?.isAuthenticated && authData?.user) {
        this.currentUserId = authData.user.id;
        this.currentUserName = authData.user.name || 'Anonymous User';
      }
    } catch (error) {
      console.error('Error setting up user:', error);
    }
  }
  async loadComments(eventId: string) {
    try {
      const commentsResponse = await this.eventService.getComments(eventId)
        .pipe(takeUntil(this.destroy$))
        .toPromise();
  

      if (commentsResponse && Array.isArray(commentsResponse)) {

        this.comments = commentsResponse.map(comment => ({
          ...comment,
          user: comment.user || { id: '', name: 'Anonymous' }  
        }));
      } else {
        this.comments = [];
      }
    } catch (error) {
      this.showToast('Error loading comments', 'danger');
      this.comments = [];
    }
  }
  async loadEventDetails(eventId: string) {
    try {
      const eventDetails = await this.eventService.getEventDetails(eventId)
        .pipe(takeUntil(this.destroy$))
        .toPromise();


      this.event = eventDetails || null;

      if (this.event) {
        await this.loadComments(eventId);
      }
    } catch (error) {
      this.showToast('Error loading event details', 'danger');
    }
  }



  private async deleteEvent() {
    if (!this.event?.id) return;

    try {
      await this.eventService.deleteEvent(this.event.id)
        .pipe(takeUntil(this.destroy$))
        .toPromise();

      this.showToast('Event deleted successfully');
      this.router.navigate(['/home']);
    } catch (error) {
      this.showToast('Error deleting event', 'danger');
    }
  }

  async addComment() {
    if (!this.newCommentContent.trim() || !this.event?.id || this.isAddingComment) return;
  
    this.isAddingComment = true;
  
    try {
      const newCommentContent = this.newCommentContent.trim();
  

      const newComment: Comment = {
        id: "",
        eventId: this.event.id,
        userId: this.currentUserId!,
        content: newCommentContent,
        createdAt: new Date().toISOString(), 
        user: {
          id: this.currentUserId!,  
          name: this.currentUserName || 'Anonymous'  
        },
        commentType: "DESTINY"  
      };
  

      this.comments.push(newComment);
  

      await this.eventService.addComment({
        text: newCommentContent,
        eventId: this.event.id,
        commentType: "DESTINY" 
      })
        .pipe(takeUntil(this.destroy$))
        .toPromise();
  
      this.newCommentContent = ''; 
      this.showToast('Comment added successfully', 'success');
    } catch (error) {
      this.comments.pop();
      this.showToast('Error adding comment', 'danger');
    } finally {
      this.isAddingComment = false;
    }
  }
  

  async deleteComment(commentId: string) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Delete Comment',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            try {
              await this.eventService.deleteComment(commentId)
                .pipe(takeUntil(this.destroy$))
                .toPromise();
              await this.loadComments(this.event!.id);
              this.showToast('Comment deleted', 'success');
            } catch (error) {
              this.showToast('Error deleting comment', 'danger');
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  getUserInitials(name: string = ''): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';
  }

  handleRefresh(event: RefresherCustomEvent) {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEventDetails(eventId).then(() => {
        event.target.complete();
      });
    }
  }

  getFormattedDateRange(): string {
    if (!this.event) return '';
    const start = new Date(this.event.startDate);
    const end = new Date(this.event.endDate);

    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };

    return `${start.toLocaleDateString(undefined, options)} - ${end.toLocaleDateString(undefined, options)}`;
  }

  private async showToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
