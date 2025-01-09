import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from './footer.component';

@NgModule({
  declarations: [FooterComponent],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule, // Não se esqueça de importar o IonicModule
  ],
  exports: [FooterComponent] // Exporta o FooterComponent para ser usado em outros módulos
})
export class FooterModule {}
