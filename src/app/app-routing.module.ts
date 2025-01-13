import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // Import AuthGuard

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomeModule),
    canActivate: [AuthGuard], // Protected route
  },
  {
    path: 'recents',
    loadChildren: () =>
      import('./pages/recents/recents.module').then((m) => m.RecentsPageModule),
    canActivate: [AuthGuard], // Protected route
  },
  {
    path: 'favorites',
    loadChildren: () =>
      import('./pages/favorites/favorites.module').then(
        (m) => m.FavoritesPageModule
      ),
    canActivate: [AuthGuard], // Protected route
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/profile/profile.module').then((m) => m.ProfilePageModule),
    canActivate: [AuthGuard], // Protected route
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'event-details/:id',
    loadChildren: () =>
      import('./pages/travels/travels.module').then((m) => m.TravelsPageModule),
    canActivate: [AuthGuard], // Protected route
  },  
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/home' }, // Wildcard route

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
