import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BubbleComponent } from './components/bubble/bubble.component';
import { NewThoughtComponent } from './components/new-thought/new-thought.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule, MatSliderModule } from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AmplifyAngularModule, AmplifyService} from 'aws-amplify-angular';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    BubbleComponent,
    NewThoughtComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    // material
    BrowserAnimationsModule,
    MatSliderModule,
    MatInputModule,

    AmplifyAngularModule
  ],
  providers: [
    AmplifyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
