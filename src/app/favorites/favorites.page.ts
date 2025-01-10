import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  // Inicializa a lista de favoritos com valores padrão (não marcados)
  favorites: boolean[] = Array(6).fill(false);

  // Lista de lugares
  places = [
    { name: 'Mount Fuji, Tokyo', location: 'Japan', rating: 4.8, image: 'assets/imagem/mount-fuji.jpg' },
    { name: 'Tower Eifell, Paris', location: 'France', rating: 4.7, image: 'assets/imagem/paris.jpg' },
    { name: 'Casa de la Moneda, Madrid', location: 'Spain', rating: 4.7, image: 'assets/imagem/casa-de-la-moneda.jpg' },
    { name: 'Ponte de Lima, Viana do Castelo', location: 'Portugal', rating: 4.7, image: 'assets/imagem/ptl.jpg' },
    { name: 'Big Ben, London', location: 'England', rating: 4.7, image: 'assets/imagem/big-ben.jpg' },
    { name: 'The Coliseum, Roma', location: 'Italy', rating: 4.7, image: 'assets/imagem/coliseu-roma.jpg' },
  ];

  constructor() {}

  ngOnInit() {}

  // Alterna entre favorito e não favorito
  toggleFavorite(index: number) {
    this.favorites[index] = !this.favorites[index];
  }
}
