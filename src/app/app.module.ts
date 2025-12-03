import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; // اضافه کردن این خط

import { MainComponent } from './main/main.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FeaturesComponent } from './features/features.component';
import { SlideComponent } from './slide/slide.component';
import { AboutComponent } from './about/about.component';
import { ServicesComponent } from './services/services.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ContactComponent } from './contact/contact.component';
import { RegisterComponent } from './register/register.component';
import { RootComponent } from './root/root.component';
import { AppRoutingModule } from './routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RememberpassComponent } from './rememberpass/rememberpass.component';
import { OcrpageComponent } from './ocrpage/ocrpage.component';
import { UserComponent } from './user/user.component';
import { EnglishmainComponent } from './englishmain/englishmain.component';

@NgModule({
  declarations: [
    MainComponent,
    HeaderComponent,
    FooterComponent,
    FeaturesComponent,
    SlideComponent,
    AboutComponent,
    ServicesComponent,
    PortfolioComponent,
    ContactComponent,
    RegisterComponent,
    RootComponent,
    RememberpassComponent,
    OcrpageComponent,
    UserComponent,
    EnglishmainComponent
  ],
  imports: [
    BrowserModule,
    CommonModule, // اضافه کردن CommonModule به اینجا
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule 
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class AppModule { }