import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RoutesConstants } from './constants/routes.constants';

const routes: Routes = [
  {
    path: '',
    redirectTo: RoutesConstants.LOGIN,
    pathMatch: 'full'
  },
  {
    path: RoutesConstants.LOGIN,
    loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: RoutesConstants.HOME,
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
