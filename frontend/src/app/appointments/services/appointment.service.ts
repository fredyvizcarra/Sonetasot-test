import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiUrl = 'http://localhost:50000/api/appointments';

  constructor(private http: HttpClient) {}

  createAppointment(curp: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { curp: curp };
    return this.http.post<any>(this.apiUrl, body, { headers: headers });
  }
}
