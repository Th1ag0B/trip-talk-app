import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { FooterModule } from '../components/footer/footer.components.module';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import { FilterPipe } from '../fiter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    FooterModule
  ],
  declarations: [HomePage, FilterPipe]
})
export class HomeModule {}