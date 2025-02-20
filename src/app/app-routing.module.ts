import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacturaComponent } from './components/factura/factura.component';
import { CrearFacturasComponent } from './components/crear-facturas/crear-facturas.component';

const routes: Routes = [
  { path: 'facturas', component:FacturaComponent },
  {path:'facturas/nueva',component:CrearFacturasComponent},
  { path: '', redirectTo: '/facturas', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
