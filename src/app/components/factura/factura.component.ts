import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DetalleFactura } from 'src/app/entity/detalle-factura.model';
import { Factura } from 'src/app/entity/factura.model';
import { DetalleFacturaService } from 'src/app/services/detalle-factura.service';
import { FacturasService } from 'src/app/services/facturas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.scss']
})
export class FacturaComponent implements OnInit {
  facturas: Factura[] = [];
  facturaSeleccionada: Factura | null = null;
  detalleFacturaSeleccionado: DetalleFactura | null = null;
  editForm: FormGroup;
  isModalOpen = false;

  constructor(
    private fb: FormBuilder,
    private facturaService: FacturasService,
    private detallefacturaService: DetalleFacturaService,
  ) {
    this.editForm = this.fb.group({
      cliente: ['', Validators.required],
      fecha: ['', Validators.required],
      total: ['', Validators.required],
      detalleFactura: this.fb.group({
        producto: ['', Validators.required],
        cantidad: ['', Validators.required],
        precioUnitario: ['', Validators.required],
        subtotal: ['', Validators.required],
      })
    });
    this.editForm.get('detalleFactura.cantidad')?.valueChanges.subscribe(value => this.modificarTotal());
    this.editForm.get('detalleFactura.precioUnitario')?.valueChanges.subscribe(value => this.modificarTotal());
    
  }
  modificarTotal() {
    const cantidad = this.editForm.get('detalleFactura.cantidad')?.value || 0;
    const precioUnitario = this.editForm.get('detalleFactura.precioUnitario')?.value || 0;
    const subtotal = cantidad * precioUnitario;
    const total= cantidad * precioUnitario;
    this.editForm.get('detalleFactura.subtotal')?.setValue(subtotal);
    this.editForm.get('total')?.setValue(total.toString());
  }

  ngOnInit(): void {
    this.ObetenerFacturas();
  }

  ObetenerFacturas() {
    this.facturaService.getListFacturas().subscribe(data => {
      this.facturas = data;
    });
  }

  eliminarfactura(facturaId: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esta acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.detallefacturaService.borrarDetalleFactura(facturaId).subscribe(response => {
          this.facturaService.eliminarFactura(facturaId).subscribe(response => {
            Swal.fire(
              '¡Eliminado!',
              'El dato ha sido eliminado.',
              'success'
            );
            this.ObetenerFacturas();
          });
        });
      }
    });
  }

  abrirModalEditar(facturaId: number) {
    this.facturaService.getFacturaById(facturaId).subscribe(response => {
      this.facturaSeleccionada = response;
      this.detallefacturaService.getDetalleFacturaById(facturaId).subscribe(detalleResponse => {
        this.detalleFacturaSeleccionado = detalleResponse;
        this.editForm.patchValue({
          cliente: response.cliente,
          fecha: response.fecha,
          total: response.total,
          detalleFactura: {
            producto: detalleResponse.producto,
            cantidad: detalleResponse.cantidad,
            precioUnitario: detalleResponse.precioUnitario,
            subtotal: detalleResponse.subtotal
          }
        });
        this.isModalOpen = true;
      });
    });
  }

  async actualizarFactura() {
    if (this.editForm.valid) {
      if (this.facturaSeleccionada && this.detalleFacturaSeleccionado) {
        const facturaData: Factura = {
          id: this.facturaSeleccionada.id,
          cliente: this.editForm.get('cliente')?.value,
          fecha: this.editForm.get('fecha')?.value,
          total: this.editForm.get('total')?.value
        };

        const detalleData: DetalleFactura = {
          id: this.detalleFacturaSeleccionado.id,
          facturaId: this.facturaSeleccionada.id,
          producto: this.editForm.get('detalleFactura.producto')?.value,
          cantidad: this.editForm.get('detalleFactura.cantidad')?.value,
          precioUnitario: this.editForm.get('detalleFactura.precioUnitario')?.value,
          subtotal: this.editForm.get('detalleFactura.subtotal')?.value
        };

        try {
          await this.facturaService.actualizarFactura(facturaData.id, facturaData).toPromise();
          await this.detallefacturaService.actualizarDetalleFactura(detalleData.id, detalleData).toPromise();
          Swal.fire('¡Actualizado!', 'La factura y los detalles han sido actualizados.', 'success');
          this.ObetenerFacturas();
        } catch (error) {
          console.error('Error al actualizar la factura y los detalles:', error);
          Swal.fire('Error', 'Hubo un problema al actualizar la factura y los detalles.', 'error');
        }

        this.editForm.reset();
        this.ObetenerFacturas();
        this.isModalOpen = false;
      }
    }
  }
  
}
