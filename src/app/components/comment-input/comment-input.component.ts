import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-comment-input',
  templateUrl: './comment-input.component.html',
  styleUrls: ['./comment-input.component.scss'],
})
export class CommentInputComponent {
  @Input() currentUserId: string | null = null;
  @Input() isAddingComment: boolean = false;
  @Input() newCommentContent: string = '';
  @Output() commentAdded = new EventEmitter<string>();

  addComment() {
    if (this.newCommentContent.trim()) {
      this.commentAdded.emit(this.newCommentContent);
      this.newCommentContent = ''; // Reset the input field after sending
    }
  }
  

  getUserInitials(name: string = ''): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';
  }
}
