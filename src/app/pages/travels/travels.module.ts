import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TravelsPageRoutingModule } from './travels-routing.module';

import { FooterModule } from '../../components/footer/footer.components.module';
import { CommentInputComponent } from '../../components/comment-input/comment-input.component'; // Import the component

import { TravelsPage } from './travels.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TravelsPageRoutingModule,
    FooterModule
  ],
  declarations: [TravelsPage, CommentInputComponent]
})
export class TravelsPageModule {}
