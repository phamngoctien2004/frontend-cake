import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { ForgotComponent } from './pages/forgot/forgot.component';
import { SendEmailComponent } from './pages/send-email/send-email.component';

export const routes: Routes = [
    {
        path:'',
        component: LoginComponent
    },
    {
        path:'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard, adminGuard]
    },
    {
        path:'forbidden',
        component: ForbiddenComponent
    },
    {
        path:'reset-password',
        component: ForgotComponent
    },
    {
        path: 'send-email',
        component: SendEmailComponent
    }

];
