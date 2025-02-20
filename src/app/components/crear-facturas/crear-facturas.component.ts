import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { DetalleFactura } from 'src/app/entity/detalle-factura.model';
import { Factura } from 'src/app/entity/factura.model';
import { DetalleFacturaService } from 'src/app/services/detalle-factura.service';
import { FacturasService } from 'src/app/services/facturas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-facturas',
  templateUrl: './crear-facturas.component.html',
  styleUrls: ['./crear-facturas.component.scss']
})
export class CrearFacturasComponent implements OnInit {
  fechaSeleccionada:string='';
  facturaForm: FormGroup;
  productos = [
    { id: 1, nombre: 'Producto 1', precioUnitario: 10 },
    { id: 2, nombre: 'Producto 2', precioUnitario: 20 },
    { id: 3, nombre: 'Producto 3', precioUnitario: 30 }
  ];

  constructor(private fb: FormBuilder, private facturaService: FacturasService, private detalleFacturaService: DetalleFacturaService) {
      this.facturaForm = this.fb.group({
          cliente: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
          fecha: ['', Validators.required],
          total: [{ value: '', disabled: true }, Validators.required],
          detalleFactura: this.fb.group({
            facturaId: [''],
            producto: [{ value: '', disabled: true }, Validators.required],
            cantidad: ['', [Validators.required, Validators.min(1), this.cantidadValidator]],   
            precioUnitario: [{ value: '', disabled: true }, Validators.required],
            subtotal: [{ value: '', disabled: true }, Validators.required]
          })
      });
      
      this.facturaForm.get('detalleFactura.cantidad')?.valueChanges.subscribe(value => this.modificarTotal());
      this.facturaForm.get('detalleFactura.precioUnitario')?.valueChanges.subscribe(value => this.modificarTotal());
  }

  cantidadValidator(control: AbstractControl){
    const value = control.value;
    return value > 0 ? null : { cantidadInvalida: true };
  }

  ngOnInit(): void {
  }
  

  modificarTotal() {
    const cantidad = this.facturaForm.get('detalleFactura.cantidad')?.value || 0;
    const precioUnitario = this.facturaForm.get('detalleFactura.precioUnitario')?.value || 0;
    const subtotal = cantidad * precioUnitario;
    const total= cantidad * precioUnitario;
    this.facturaForm.get('detalleFactura.subtotal')?.setValue(subtotal);
    this.facturaForm.get('total')?.setValue(total.toString());

  }

  selectProducto(producto: any) {

    this.facturaForm.patchValue({
      detalleFactura: {
        producto: producto.id,
        precioUnitario: producto.precioUnitario,
        cantidad:producto.cantidad=1,
      }
    });
  }


  async submit() {
    Swal.showLoading();
    if (this.facturaForm.valid) {
        const facturaData: Factura = {
            id: 0,
            cliente: this.facturaForm.get('cliente')?.value,
            fecha: this.facturaForm.get('fecha')?.value,
            total: this.facturaForm.get('total')?.value
        };
        try {
            const facturaId = await this.facturaService.createFactura(facturaData).toPromise();
            const detalle: DetalleFactura = {
                id: 0,
                facturaId: facturaId!,
                producto: this.facturaForm.get('detalleFactura.producto')?.value,
                cantidad: this.facturaForm.get('detalleFactura.cantidad')?.value,
                precioUnitario: this.facturaForm.get('detalleFactura.precioUnitario')?.value,
                subtotal: this.facturaForm.get('detalleFactura.subtotal')?.value
            };
            await this.detalleFacturaService.addDetallesFactura(detalle).toPromise();
            Swal.close();
            Swal.fire({
                title: '¡Éxito!',
                text: 'La factura ha sido creada.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
        } catch (error) {
            console.error('Error al crear la factura y los detalles:', error);
            Swal.close();
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al crear la factura.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
        this.facturaForm.reset();
    }
}
}
