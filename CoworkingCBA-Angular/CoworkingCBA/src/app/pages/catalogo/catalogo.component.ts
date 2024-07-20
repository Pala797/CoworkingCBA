import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {

  constructor(private http: HttpClient, private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:8000/api/catalogo-salas/')
      .subscribe(data => {
        console.log('Datos recibidos desde el backend:', data); // Verifica los datos
        this.renderCatalogo(data);
      }, error => {
        console.error('Error al obtener los datos:', error); // Maneja errores
      });
  }

  private renderCatalogo(salas: any[]): void {
    const container = this.el.nativeElement.querySelector('#catalogo-container');
  
    if (salas.length === 0) {
      const noData = this.renderer.createElement('p');
      this.renderer.setProperty(noData, 'textContent', 'No hay salas disponibles.');
      this.renderer.appendChild(container, noData);
      return;
    }
  
    salas.forEach(sala => {
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
      this.renderer.setProperty(text, 'textContent', ` Por Día : $${sala.precio}`);
  
      const capacity = this.renderer.createElement('p');
      this.renderer.addClass(capacity, 'card-text');
      this.renderer.setProperty(capacity, 'textContent', `Capacidad: ${sala.capacidad} personas`);
  
      const button = this.renderer.createElement('a');
      this.renderer.addClass(button, 'btn');
      this.renderer.addClass(button, 'btn-primary');
      this.renderer.addClass(button, 'btn-sm');  // Clase para hacer el botón más pequeño
      this.renderer.setAttribute(button, 'href', '#');
      this.renderer.setProperty(button, 'textContent', 'Reservar');
  
      this.renderer.appendChild(cardBody, title);
      this.renderer.appendChild(cardBody, text);
      this.renderer.appendChild(cardBody, capacity);
      this.renderer.appendChild(cardBody, button);
  
      this.renderer.appendChild(cardDiv, img);
      this.renderer.appendChild(cardDiv, cardBody);
  
      this.renderer.appendChild(container, cardDiv);
    });
  }
}
