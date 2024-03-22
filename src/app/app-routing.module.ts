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
    path: RouteConstants.REGISTER,
    loadChildren: () => import('./pages/auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: RouteConstants.FORGOT_PASSWORD,
    loadChildren: () => import('./pages/auth/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: RouteConstants.LOGIN,
    loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: RouteConstants.HOME_PATIENT,
    loadChildren: () => import('./pages/home-patient/home-patient.module').then( m => m.HomePatientPageModule),
    canMatch: [authGuard]
  },
  {
    path: RouteConstants.HOME_STAFF,
    loadChildren: () => import('./pages/home-staff/home-staff.module').then( m => m.HomeStaffPageModule),
    canMatch: [authGuard]
  },
  {
    path: RouteConstants.CLINIC,
    loadChildren: () => import('./pages/clinic/clinic.module').then( m => m.ClinicPageModule),
    canMatch: [authGuard]
  },
  {
    path: RouteConstants.MANAGE_CLINICS,
    loadChildren: () => import('./pages/manage-clinics/manage-clinics.module').then( m => m.ManageClinicsPageModule),
    canMatch: [authGuard]
  },
  {
    path: RouteConstants.PROFILE,
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule),
    canMatch: [authGuard]
  },
  {
    path: RouteConstants.CLINIC_SERVICES,
    loadChildren: () => import('./pages/clinic-services/clinic-services.module').then( m => m.ClinicServicesPageModule),
    canMatch: [authGuard]
  },
  {
    path: RouteConstants.CLINIC_BANK_DETAILS,
    loadChildren: () => import('./pages/clinic-bank-details/clinic-bank-details.module').then( m => m.ClinicBankDetailsPageModule),
    canMatch: [authGuard]
  },
  {
    path: RouteConstants.BOOKINGS,
    loadChildren: () => import('./pages/booking-history/booking-history.module').then( m => m.BookingHistoryPageModule),
    canMatch: [authGuard]
  },
  { path: '**' , redirectTo: RouteConstants.LOGIN },  // To handle unknown url path
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
