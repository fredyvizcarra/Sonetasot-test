import { Component } from '@angular/core';
import { AppointmentService } from './appointments/services/appointment.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  curp: string = '';
  date: string = '';

  constructor(private appointmentService: AppointmentService) {}

  onSubmit() {
    this.appointmentService.createAppointment(this.curp).subscribe(
      (response) => {
        console.log('Cita creada:', response);
        // Aquí puedes agregar lógica para manejar la respuesta, como redirigir al usuario o mostrar un mensaje.
      },
      (error) => {
        console.error('Error al crear la cita:', error);
      }
    );
  }
}
