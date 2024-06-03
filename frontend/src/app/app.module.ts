import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CreateAppointmentComponent } from './appointments/components/create-appointment/create-appointment.component';
import { AppointmentService } from './appointments/services/appointment.service';

@NgModule({
  declarations: [AppComponent, CreateAppointmentComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule],
  providers: [AppointmentService],
  bootstrap: [AppComponent],
})
export class AppModule {}
