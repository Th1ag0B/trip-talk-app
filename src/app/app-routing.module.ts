import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'recents', loadChildren: () => import('./recents/recents.module').then(m => m.RecentsPageModule) },
  { path: 'favorites', loadChildren: () => import('./favorites/favorites.module').then(m => m.FavoritesPageModule) },
  { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule) },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }