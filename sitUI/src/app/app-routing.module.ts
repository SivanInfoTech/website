import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CoursesComponent } from './courses/courses.component';
import { StudentslistComponent } from './studentslist/studentslist.component';
import { CanActivateGuard } from './can-activate.guard';
import { EnrollmentsComponent } from './enrollments/enrollments.component';
import { CoursepdfsComponent } from './coursepdfs/coursepdfs.component';
import { AdsConfigurationComponent } from './ads-configuration/ads-configuration.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentstatusComponent } from './paymentstatus/paymentstatus.component';
import { CloudaccleratorComponent } from './cloudacclerator/cloudacclerator.component';
import { RefundComponent } from './refund/refund.component';
import { TermsComponent } from './terms/terms.component';
import { ForgotComponent } from './forgot/forgot.component';
import { BluzapComponent } from './bluzap/bluzap.component';
import { OpticosComponent } from './opticos/opticos.component';
import { RuppelsComponent } from './ruppels/ruppels.component';
import { SwiftMiComponent } from './swift-mi/swift-mi.component';
import { Terrgen2Component } from './terrgen2/terrgen2.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'course', component: CoursesComponent },
  { path: 'payment', component: PaymentComponent},
  {path: 'cloudacclerator', component: CloudaccleratorComponent },
  {path: 'refund', component: RefundComponent },
  {path: 'terms', component: TermsComponent },
  {path: 'forgotpassword', component: ForgotComponent},
  {path: 'bluzap', component: BluzapComponent},
  {path: 'opticos', component: OpticosComponent},
  {path: 'ruppels', component: RuppelsComponent},
  {path: 'swiftmi', component:SwiftMiComponent},
  {path: 'terrgen2', component: Terrgen2Component},










  { 
    path: 'paymentstatus/:transaction_id', 
    component: PaymentstatusComponent 
  },

  {
    path: 'student',
    children: [     // Children routes are inside the parent route
      { path: 'enrollments', component: EnrollmentsComponent },
      // { path: 'payment', component: PaymentComponent} Need to Update Upon Check
    ]
  },
  {
    path: 'admin',
    children: [     // Children routes are inside the parent route
      { path: 'studentlist', component: StudentslistComponent },
      { path: 'coursepdfs', component: CoursepdfsComponent },
      { path: 'configads', component: AdsConfigurationComponent},
      // { path: 'payment', component: PaymentComponent} Need to Update Upon Check
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
