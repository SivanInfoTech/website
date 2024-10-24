import { APP_INITIALIZER,NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { HeaderMobileComponent } from './headerMobile/headerMobile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { RegisterComponent } from './register/register.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { JwtService } from 'src/service/jwt.service';
import { UserService } from 'src/service/user.service';
import { EMPTY } from "rxjs";
import { CoursesComponent } from './courses/courses.component';
import { StudentslistComponent } from './studentslist/studentslist.component';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { EnquiryComponent } from './enquiry/enquiry.component';
import { MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule} from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

import { EnrollmentsComponent } from './enrollments/enrollments.component';
import { StudentdetailsComponent } from './studentdetails/studentdetails.component';
// import { NgxCaptchaModule } from 'ngx-captcha';
import { CoursepdfsComponent } from './coursepdfs/coursepdfs.component';
import { VerifycertComponent } from './verifycert/verifycert.component';
import { MatRadioModule } from '@angular/material/radio';
import { AdsConfigurationComponent } from './ads-configuration/ads-configuration.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentstatusComponent } from './paymentstatus/paymentstatus.component';
import { CloudaccleratorComponent } from './cloudacclerator/cloudacclerator.component';
import { ForgotComponent } from './forgot/forgot.component';
import { MatCardModule } from '@angular/material/card';
import { BluzapComponent } from './bluzap/bluzap.component';
import { OpticosComponent } from './opticos/opticos.component';
import { RuppelsComponent } from './ruppels/ruppels.component';
import { SwiftMiComponent } from './swift-mi/swift-mi.component';
import { Terrgen2Component } from './terrgen2/terrgen2.component';
import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
  NgxUiLoaderHttpModule,
  NgxUiLoaderService,
} from 'ngx-ui-loader';
export function initAuth(jwtService: JwtService, userService: UserService) {
  return () => (jwtService.getToken() ? userService.getCurrentUser() : EMPTY);
}
const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsColor: '#F0841D',
  fgsPosition: POSITION.centerCenter,
  fgsSize: 60,
  fgsType: SPINNER.squareJellyBox,
  pbDirection: PB_DIRECTION.leftToRight,
  pbThickness: 5,
  logoPosition: 'center-center',
  logoSize: 60,
  logoUrl: 'assets/images/footerlogo.png',
};
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    HeaderMobileComponent,
    RegisterComponent,
    FooterComponent,
    LoginComponent,
    CoursesComponent,
    StudentslistComponent,
    EnquiryComponent,
    EnrollmentsComponent,
    StudentdetailsComponent,
    CoursepdfsComponent,
    VerifycertComponent,
    AdsConfigurationComponent,
    AboutusComponent,
    PaymentComponent,
    PaymentstatusComponent,
    CloudaccleratorComponent,
    ForgotComponent,
    BluzapComponent,
    OpticosComponent,
    RuppelsComponent,
    SwiftMiComponent,
    Terrgen2Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(), 
    MatIconModule,
    MatTabsModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTableModule,
    MatDialogModule,
    MatRadioModule,
    MatExpansionModule,
    MatListModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    // NgxCaptchaModule,
    FormsModule,
    MatCardModule,
    NgxUiLoaderHttpModule.forRoot({
      showForeground: true,
      exclude: [
           ],
    }),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initAuth,
      deps: [JwtService, UserService],
      multi: true,
    },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ],
  bootstrap: [AppComponent]

})
export class AppModule { }
