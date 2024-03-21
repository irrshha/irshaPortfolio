import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { LoadingComponent } from './loading/loading.component';
import { ProjectdetailsComponent } from './projectdetails/projectdetails.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, AboutComponent, HeaderComponent, FooterComponent, PortfolioComponent, LoadingComponent, ProjectdetailsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),

    // RouterModule.forRoot([{ path: 'about', component: AboutComponent }]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
