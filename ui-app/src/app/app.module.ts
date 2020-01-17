import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BubbleComponent } from './components/bubble/bubble.component';
import { NewThoughtComponent } from './components/new-thought/new-thought.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule, MatSliderModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

const config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    BubbleComponent,
    NewThoughtComponent
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

    SocketIoModule.forRoot(config),
    LeafletModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
