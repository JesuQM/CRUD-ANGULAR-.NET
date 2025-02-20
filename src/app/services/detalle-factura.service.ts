import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetalleFactura } from '../entity/detalle-factura.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetalleFacturaService {
  myAppUrl='https://localhost:44373/api/DetalleFacturas'

  constructor(private http: HttpClient) {  }


addDetallesFactura(detalles: DetalleFactura): Observable<any> {
    return this.http.post(this.myAppUrl, detalles);
  }
 borrarDetalleFactura(facturaId:number):Observable<any>{
  return this.http.delete(`${this.myAppUrl}/ByFacturaId/${facturaId}`);

 }
 getDetalleFacturaById(facturaId:number):Observable<DetalleFactura>{
  return this.http.get<DetalleFactura>(`${this.myAppUrl}/ByFacturaId/${facturaId}`);
 }
 actualizarDetalleFactura(id: number, detalleFactura: DetalleFactura): Observable<any> {
  return this.http.put(`${this.myAppUrl}/${id}`, detalleFactura);
}
}
