import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Factura } from '../entity/factura.model';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {
  myAppUrl='https://localhost:44373/api/Facturas'

  constructor(private http: HttpClient) {  }

  getListFacturas(): Observable<Factura[]>{

    return this.http.get<Factura[]>(this.myAppUrl);
  }

  createFactura(factura: Factura): Observable<number> {
    return this.http.post<number>(this.myAppUrl, factura);
  }

  eliminarFactura(id: number): Observable<any> {
    return this.http.delete(`${this.myAppUrl}/${id}`);
  }

  getFacturaById(id:number):Observable<Factura>{
    return this.http.get<Factura>(`${this.myAppUrl}/${id}`)
  }
  actualizarFactura(id: number, factura: Factura): Observable<any> {
    return this.http.put(`${this.myAppUrl}/${id}`, factura);
  }

}
   
