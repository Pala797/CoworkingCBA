import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {
  salas: any[] = [];
  carrito: any = null;
  usuarioId: number | null = null;

  constructor(private http: HttpClient, private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit(): void {
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

    this.renderCarrito();
  }

  private renderCatalogo(): void {
    const container = this.el.nativeElement.querySelector('#catalogo-container');
    this.renderer.setProperty(container, 'innerHTML', '');

    if (this.salas.length === 0) {
      const noData = this.renderer.createElement('p');
      this.renderer.setProperty(noData, 'textContent', 'No hay salas disponibles.');
      this.renderer.appendChild(container, noData);
      return;
    }

    this.salas.forEach(sala => {
      const cardDiv = this.renderer.createElement('div');
      this.renderer.addClass(cardDiv, 'col-md-6');
      this.renderer.addClass(cardDiv, 'mb-4');
      this.renderer.addClass(cardDiv, 'card');

      const img = this.renderer.createElement('img');
      this.renderer.setAttribute(img, 'src', sala.imagen_url);
      this.renderer.addClass(img, 'card-img-top');
      this.renderer.setAttribute(img, 'alt', sala.nombre_sala);

      const cardBody = this.renderer.createElement('div');
      this.renderer.addClass(cardBody, 'card-body');

      const title = this.renderer.createElement('h3');
      this.renderer.addClass(title, 'card-title');
      this.renderer.setProperty(title, 'textContent', sala.nombre_sala);

      const text = this.renderer.createElement('p');
      this.renderer.addClass(text, 'card-text');
      this.renderer.setProperty(text, 'textContent', `Por Día: $${sala.precio}`);

      const capacity = this.renderer.createElement('p');
      this.renderer.addClass(capacity, 'card-text');
      this.renderer.setProperty(capacity, 'textContent', `Capacidad: ${sala.capacidad} personas`);

      const button = this.renderer.createElement('button');
      this.renderer.addClass(button, 'btn');
      this.renderer.addClass(button, 'btn-primary');
      this.renderer.addClass(button, 'btn-sm');
      this.renderer.setProperty(button, 'textContent', 'Seleccionar');
      this.renderer.listen(button, 'click', () => this.agregarAlCarrito(sala));

      this.renderer.appendChild(cardBody, title);
      this.renderer.appendChild(cardBody, text);
      this.renderer.appendChild(cardBody, capacity);
      this.renderer.appendChild(cardBody, button);

      this.renderer.appendChild(cardDiv, img);
      this.renderer.appendChild(cardDiv, cardBody);

      this.renderer.appendChild(container, cardDiv);
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
      this.renderer.setProperty(finalizarButton, 'textContent', 'Finalizar Reserva');
      this.renderer.listen(finalizarButton, 'click', () => this.finalizarReserva());
      this.renderer.appendChild(finalizarButtonContainer, finalizarButton);
    }
  }

  private actualizarDiaReserva(dia: string): void {
    this.carrito.dia_reservado = dia;
    this.actualizarCarrito();
  }

  private finalizarReserva(): void {
    if (!this.usuarioId) {
      alert('Usuario no autenticado');
      return;
    }
  
    if (!this.carrito.dia_reservado) {
      alert('Por favor, seleccione una fecha para la reserva.');
      return;
    }
  
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
        this.actualizarCarrito();
      }, error => {
        console.error('Error al guardar la reserva:', error);
        alert('Error al guardar la reserva');
      });
  }
  
  
  
  
  private getTodayDate(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
