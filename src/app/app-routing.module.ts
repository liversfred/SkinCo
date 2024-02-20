import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RoutesConstants } from './constants/routes.constants';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: RoutesConstants.LOGIN,
    pathMatch: 'full'
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: RoutesConstants.LOGIN,
    loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: RoutesConstants.HOME,
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canMatch: [authGuard]
  },
  { path: '**' , redirectTo: RoutesConstants.LOGIN }  // To handle unknown url path
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
