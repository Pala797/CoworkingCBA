import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {
  salas: any[] = [];
  carrito: any = null;
  usuarioId: number | null = null;
  reservas: any[] = [];

  constructor(private http: HttpClient, private renderer: Renderer2, private el: ElementRef) { }
  private modalElement: HTMLElement | null = null;
  private reservaTemporal: any = null; // Para almacenar los datos de la reserva temporalmente

  ngOnInit(): void {
    this.modalElement = this.el.nativeElement.querySelector('#payment-modal');
    this.http.get<any[]>('http://localhost:8000/api/catalogo-salas/')
      .subscribe(data => {
        console.log('Datos recibidos desde el backend:', data);
        this.salas = data;
        this.renderCatalogo();
      }, error => {
        console.error('Error al obtener los datos:', error);
      });

    const usuarioIdString = localStorage.getItem('usuarioId');
    this.usuarioId = usuarioIdString ? +usuarioIdString : null;

    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      this.carrito = JSON.parse(carritoGuardado);
    }

    if (this.usuarioId) {
      this.obtenerReservas(); // Llama a la función para obtener las reservas del usuario
    }

    this.renderCarrito();
  }

  private obtenerReservas(): void {
    if (this.usuarioId) {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      this.http.get<any[]>(`http://localhost:8000/api/obtener_reservas/?usuario_id=${this.usuarioId}`, { headers: headers })
        .subscribe(data => {
          this.reservas = data;
          this.renderCarrito(); // Renderiza el carrito incluyendo las reservas
        }, error => {
          console.error('Error al obtener las reservas:', error);
        });
    }
  }

private renderCatalogo(): void {
  const container = this.el.nativeElement.querySelector('#catalogo-container');
  this.renderer.setProperty(container, 'innerHTML', '');

  if (this.salas.length === 0) {
    const noData = this.renderer.createElement('p');
    this.renderer.addClass(noData, 'text-center');
    this.renderer.addClass(noData, 'text-muted');
    this.renderer.setProperty(noData, 'textContent', 'No hay salas disponibles.');
    this.renderer.appendChild(container, noData);
    return;
  }

  const row = this.renderer.createElement('div');
  this.renderer.addClass(row, 'row');
  this.renderer.appendChild(container, row);

  this.salas.forEach(sala => {
    const colDiv = this.renderer.createElement('div');
    this.renderer.addClass(colDiv, 'col-md-6');
    this.renderer.addClass(colDiv, 'mb-4');
    this.renderer.appendChild(row, colDiv);

    const cardDiv = this.renderer.createElement('div');
    this.renderer.addClass(cardDiv, 'card');
    this.renderer.addClass(cardDiv, 'shadow-sm');

    const img = this.renderer.createElement('img');
    this.renderer.setAttribute(img, 'src', sala.imagen_url);
    this.renderer.addClass(img, 'card-img-top');
    this.renderer.setAttribute(img, 'alt', sala.nombre_sala);

    const cardBody = this.renderer.createElement('div');
    this.renderer.addClass(cardBody, 'card-body');

    const title = this.renderer.createElement('h5');
    this.renderer.addClass(title, 'card-title');
    this.renderer.setProperty(title, 'textContent', sala.nombre_sala);

    const text = this.renderer.createElement('p');
    this.renderer.addClass(text, 'card-text');
    this.renderer.setProperty(text, 'textContent', `Precio Por Dia: $${sala.precio}`);

    const capacity = this.renderer.createElement('p');
    this.renderer.addClass(capacity, 'card-text');
    this.renderer.setProperty(capacity, 'textContent', `Capacidad: ${sala.capacidad} personas`);

    const button = this.renderer.createElement('button');
    this.renderer.addClass(button, 'btn');
    this.renderer.addClass(button, 'btn-primary');
    this.renderer.setProperty(button, 'textContent', 'Seleccionar');
    this.renderer.listen(button, 'click', () => this.agregarAlCarrito(sala));

    this.renderer.appendChild(cardBody, title);
    this.renderer.appendChild(cardBody, text);
    this.renderer.appendChild(cardBody, capacity);
    this.renderer.appendChild(cardBody, button);

    this.renderer.appendChild(cardDiv, img);
    this.renderer.appendChild(cardDiv, cardBody);

    this.renderer.appendChild(colDiv, cardDiv);
  });
}


  private agregarAlCarrito(sala: any): void {
    const reserva = {
      ...sala,
      dia_reservado: this.carrito?.dia_reservado || null
    };
    this.carrito = reserva;
    this.actualizarCarrito();
  }

  private eliminarDelCarrito(): void {
    this.carrito = null;
    this.actualizarCarrito();
  }

  private actualizarCarrito(): void {
    if (this.carrito) {
      localStorage.setItem('carrito', JSON.stringify(this.carrito));
    } else {
      localStorage.removeItem('carrito');
    }
    this.renderCarrito();
  }

  private renderCarrito(): void {
    const carritoContainer = this.el.nativeElement.querySelector('.cart-sidebar ul');
    this.renderer.setProperty(carritoContainer, 'innerHTML', '');

    if (!this.carrito) {
      const emptyMessage = this.renderer.createElement('li');
      this.renderer.setProperty(emptyMessage, 'textContent', 'No hay artículos en el carrito.');
      this.renderer.appendChild(carritoContainer, emptyMessage);
    } else {
      const item = this.renderer.createElement('li');
      this.renderer.addClass(item, 'd-flex');
      this.renderer.addClass(item, 'align-items-center');
      this.renderer.setProperty(item, 'textContent', `${this.carrito.nombre_sala} - $${this.carrito.precio}`);

      const input = this.renderer.createElement('input');
      this.renderer.setAttribute(input, 'type', 'date');
      this.renderer.addClass(input, 'form-control');
      this.renderer.addClass(input, 'ml-2');
      this.renderer.setStyle(input, 'width', 'auto');
      this.renderer.setAttribute(input, 'min', this.getTodayDate());
      this.renderer.setProperty(input, 'value', this.carrito.dia_reservado || '');
      this.renderer.listen(input, 'change', (event) => this.actualizarDiaReserva(event.target.value));
      this.renderer.appendChild(item, input);

      const deleteButton = this.renderer.createElement('button');
      this.renderer.addClass(deleteButton, 'btn');
      this.renderer.addClass(deleteButton, 'btn-danger');
      this.renderer.addClass(deleteButton, 'ml-2');
      this.renderer.setProperty(deleteButton, 'textContent', '✖');
      this.renderer.listen(deleteButton, 'click', () => this.eliminarDelCarrito());
      this.renderer.appendChild(item, deleteButton);

      this.renderer.appendChild(carritoContainer, item);
    }

    const finalizarButtonContainer = this.el.nativeElement.querySelector('.finalizar-reserva-container');
    this.renderer.setProperty(finalizarButtonContainer, 'innerHTML', '');
    if (this.carrito) {
      const finalizarButton = this.renderer.createElement('button');
      this.renderer.addClass(finalizarButton, 'btn');
      this.renderer.addClass(finalizarButton, 'btn-success');
      this.renderer.addClass(finalizarButton, 'mt-3');
      this.renderer.setProperty(finalizarButton, 'textContent', ' Reservar Sala');
      this.renderer.listen(finalizarButton, 'click', () => this.finalizarReserva());
      this.renderer.appendChild(finalizarButtonContainer, finalizarButton);
    }

    this.renderReservas(carritoContainer); // Renderiza las reservas
  }
  

 private renderReservas(container: any): void {
  const reservasContainer = this.renderer.createElement('ul');
  this.renderer.setProperty(reservasContainer, 'innerHTML', '');
  const title = this.renderer.createElement('h5');
  this.renderer.setProperty(title, 'textContent', 'Reservas Realizadas');
  this.renderer.addClass(title, 'mb-4');
  this.renderer.setStyle(title, 'marginTop', '20px');
  this.renderer.appendChild(container, title);
  if (this.reservas.length === 0) {
    const noReservasMessage = this.renderer.createElement('li');
    this.renderer.setProperty(noReservasMessage, 'textContent', 'No tienes reservas.');
    this.renderer.appendChild(reservasContainer, noReservasMessage);
  } else {
    this.reservas.forEach(reserva => {
      const sala = this.salas.find(sala => sala.id === reserva.sala_id);
      const nombreSala = sala ? sala.nombre_sala : 'Sala desconocida';

      const reservaItem = this.renderer.createElement('li');
      this.renderer.addClass(reservaItem, 'mb-2');

      const nombreSalaDiv = this.renderer.createElement('div');
      this.renderer.setProperty(nombreSalaDiv, 'textContent', `Usted tendra Disponible La ${nombreSala}`);
      this.renderer.appendChild(reservaItem, nombreSalaDiv);

      const fechaReservaDiv = this.renderer.createElement('div');
     
      const date = new Date(reserva.dia_reservado);
          
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); 
      const year = date.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      
      this.renderer.setProperty(fechaReservaDiv, 'textContent', `Fecha Reserva: ${formattedDate}`);
      this.renderer.appendChild(reservaItem, fechaReservaDiv);

      const precioDiv = this.renderer.createElement('div');
      this.renderer.setProperty(precioDiv, 'textContent', `Precio Final: $${reserva.precio}`);
      this.renderer.appendChild(reservaItem, precioDiv);

      this.renderer.appendChild(reservasContainer, reservaItem);
    });
  }

  this.renderer.appendChild(container, reservasContainer);
}


  private actualizarDiaReserva(dia: string): void {
    this.carrito.dia_reservado = dia;
    this.actualizarCarrito();
  }

  private finalizarReserva(): void {
    this.abrirModal();
  }

  private getTodayDate(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  confirmarReserva(): void {
    if (!this.usuarioId) {
      alert('Usuario no autenticado');
      this.cerrarModal();
      return;
    }

    if (!this.carrito.dia_reservado) {
      alert('Por favor, seleccione una fecha para la reserva.');
      this.cerrarModal();
      return;
    }

    // Obtener datos de la tarjeta desde el modal
    const cardNumber = (this.el.nativeElement.querySelector('#cardNumber') as HTMLInputElement).value;
    const cardExpiry = (this.el.nativeElement.querySelector('#cardExpiry') as HTMLInputElement).value;
    const cardCvc = (this.el.nativeElement.querySelector('#cardCvc') as HTMLInputElement).value;

    // Validar los datos de la tarjeta (simulación)
    if (!cardNumber || !cardExpiry || !cardCvc) {
      alert('Por favor, complete todos los campos de datos de la tarjeta.');
      return;
    }

    console.log(`Datos de la tarjeta: ${cardNumber}, ${cardExpiry}, ${cardCvc}`);

    // Simular procesamiento del pago
    this.procesarPago('tarjeta');

    const reserva = {
      dia_reservado: this.carrito.dia_reservado,
      precio: this.carrito.precio,
      sala_id: this.carrito.id,
      usuario_id: this.usuarioId
    };

    console.log('Datos de reserva a enviar:', reserva);

    this.http.post('http://localhost:8000/api/reservar/', reserva)
      .subscribe(response => {
        console.log('Reserva guardada:', response);
        alert('Reserva guardada exitosamente');
        this.carrito = null;
        this.obtenerReservas(); // Llama a la función para obtener las reservas actualizadas
        this.cerrarModal(); // Cierra el modal después de confirmar la reserva
      }, error => {
        console.error('Error al guardar la reserva:', error);
        if (error.status === 400 && error.error.non_field_errors) {
          alert(error.error.non_field_errors[0]);
        } else {
          alert('Error al guardar la reserva');
        }
        this.cerrarModal(); // Cierra el modal en caso de error
      });
  }


   abrirModal(): void {
    if (this.modalElement) {
      this.renderer.setStyle(this.modalElement, 'display', 'block');
    }
  }

   cerrarModal(): void {
    if (this.modalElement) {
      this.renderer.setStyle(this.modalElement, 'display', 'none');
    }
  }

   procesarPago(metodo: string): void {
    console.log(`Procesando pago con ${metodo}`);
    // Aquí puedes simular el procesamiento del pago.
  }

}
