import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule, MatSliderModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { HttpClientModule } from '@angular/common/http';
import { NewThoughtComponent } from './components/new-thought/new-thought.component';
import { BubbleComponent } from './components/bubble/bubble.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MatButtonModule } from "@angular/material/button";
import { MapComponent } from './map/map.component';
import { PermissionComponent } from './permission/permission.component';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    BubbleComponent,
    NewThoughtComponent,
    MapComponent,
    PermissionComponent,
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
    MatButtonModule,

    HttpClientModule,

    // socket
    SocketIoModule.forRoot(config),

    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
