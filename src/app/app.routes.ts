import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { ForgotComponent } from './pages/forgot/forgot.component';
import { SendEmailComponent } from './pages/send-email/send-email.component';
import { HomepageComponent } from './public/homepage/homepage.component';
import { UserFormComponent } from './pages/user-form/user-form.component';
import { UserComponent } from './pages/user/user.component';

export const routes: Routes = [
    {
        path:'auth',
        component: LoginComponent
    },
    {
        path:'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard, adminGuard],
        children:[
            {
                path: 'users',
                component: UserComponent
            },
            {
                path: 'users/add',
                component: UserFormComponent,
            },
            {
                path: 'users/edit/:id',
                component: UserFormComponent,
            }
        ]
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
    },
    {
        path: '',
        component: HomepageComponent
    },
    {
        path: 'dashboard/user',
        component: UserFormComponent
    }

];
