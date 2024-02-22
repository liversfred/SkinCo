import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RouteConstants } from './constants/route.constants';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: RouteConstants.LOGIN,
    pathMatch: 'full'
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: RouteConstants.LOGIN,
    loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: RouteConstants.HOME,
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canMatch: [authGuard]
  },
  {
    path: RouteConstants.CLINIC,
    loadChildren: () => import('./pages/clinic/clinic.module').then( m => m.ClinicPageModule),
    canMatch: [authGuard]
  },
  { path: '**' , redirectTo: RouteConstants.LOGIN }  // To handle unknown url path
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
