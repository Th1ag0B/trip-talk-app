import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavoritesPageRoutingModule } from './favorites-routing.module';


import { FooterModule } from '../components/footer/footer.components.module';
import { FavoritesPage } from './favorites.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavoritesPageRoutingModule,
    FooterModule
  ],
  declarations: [FavoritesPage]
})
export class FavoritesPageModule {}
