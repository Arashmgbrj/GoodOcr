// src/app/routing.module.ts  
import { NgModule } from '@angular/core';  
import { RouterModule, Routes } from '@angular/router';  
import { MainComponent } from './main/main.component';  
import { RegisterComponent } from './register/register.component';
import { RememberpassComponent } from './rememberpass/rememberpass.component';
import { OcrpageComponent } from './ocrpage/ocrpage.component';
import { UserComponent } from './user/user.component';


const routes: Routes = [  
  { path: '', component: MainComponent },  
  { path: 'register', component: RegisterComponent},
  { path: 'rememberpass', component: RememberpassComponent},
  { path: 'ocr', component: OcrpageComponent},
  { path: 'profile', component: UserComponent},

];  

@NgModule({  
  imports: [RouterModule.forRoot(routes)],  
  exports: [RouterModule]  
})  
export class AppRoutingModule {}