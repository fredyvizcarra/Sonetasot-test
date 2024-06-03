import { Component, ElementRef, ViewChild } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
})
export class CreateAppointmentComponent {
  curp: string = '';
  message: string = '';
  errorMessage: string = '';
  @ViewChild('carouselContainer') carouselContainer!: ElementRef;

  campaigns = [
    {
      image: 'assets/images/family.png',
      number: 1,
      title: 'Personas de 18 y más',
      dose: 'Primera Dosis',
      vaccine: 'ASTRA ZENECA',
      dateInfo: 'Primera dosis aplicada antes del 15 de Agosto',
    },
    {
      image: 'assets/images/family.png',
      number: 2,
      title: 'Personas de 18 y más',
      dose: 'Segunda Dosis',
      vaccine: 'ASTRA ZENECA',
      dateInfo: 'Primera dosis aplicada antes del 15 de Agosto',
    },
    {
      image: 'assets/images/family.png',
      number: 3,
      title: 'Personas de 18 y más',
      dose: 'Segunda Dosis',
      vaccine: 'ASTRA ZENECA',
      dateInfo: 'Primera dosis aplicada antes del 15 de Agosto',
    },
    {
      image: 'assets/images/family.png',
      number: 4,
      title: 'Personas de 18 y más',
      dose: 'Segunda Dosis',
      vaccine: 'ASTRA ZENECA',
      dateInfo: 'Primera dosis aplicada antes del 15 de Agosto',
    },
  ];

  footerLinks = [
    {
      text: 'Red de Vacunación Radar Jalisco',
      image: 'assets/images/red_vacunacion.png',
    },
    { text: 'Cuidarse es prevenir', image: 'assets/images/cuidarse.png' },
    { text: 'Salud', image: 'assets/images/salud.png' },
    {
      text: 'Servicios de Salud Jalisco',
      image: 'assets/images/servicios_salud.png',
    },
    { text: 'Medica', image: 'assets/images/medica.png' },
    { text: 'SEDENA', image: 'assets/images/sedena.png' },
    { text: 'BIENESTAR', image: 'assets/images/bienestar.png' },
  ];

  scrollCarousel(direction: string) {
    const container = this.carouselContainer.nativeElement;
    const scrollAmount = container.offsetWidth / 2;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  constructor(private appointmentService: AppointmentService) {}

  createAppointment() {
    this.appointmentService.createAppointment(this.curp).subscribe(
      (response) => {
        const date = response.appointment.date.split('T')[0];
        this.message = `Cita creada exitosamente para el CURP: ${response.appointment.curp} en la fecha: ${date}`;
        this.errorMessage = '';
      },
      (error) => {
        this.errorMessage = `Error: ${error.error.error}`;
        this.message = '';
      }
    );
  }

  onSubmit() {
    this.createAppointment();
  }
}
