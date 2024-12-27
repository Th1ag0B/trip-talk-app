import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecentsPageRoutingModule } from './recents-routing.module';

import { FooterModule } from '../components/footer/footer.components.module';
import { RecentsPage } from './recents.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecentsPageRoutingModule,
    FooterModule
  ],
  declarations: [RecentsPage]
})
export class RecentsPageModule {}
