// src/pages/PhotoService.js

import PW1 from '../assets/img/PW1.jpg';
import PW2 from '../assets/img/PW2.jpg';
import PW3 from '../assets/img/PW3.jpg';
import PW4 from '../assets/img/PW4.jpg';
import PW5 from '../assets/img/PW5.jpg';
import PW6 from '../assets/img/PW6.jpg';
import PW7 from '../assets/img/PW7.jpg';
import PW8 from '../assets/img/PW8.jpg';
import PW9 from '../assets/img/PW9.jpg';
import PW10 from '../assets/img/PW10.jpg';

export const PhotoService = {
  getImages: async () => {
    return [
      {
        itemImageSrc: PW6,
        thumbnailImageSrc: PW6,
        alt: 'Equipe trabalhando'
      },
      {
        itemImageSrc: PW7,
        thumbnailImageSrc: PW7,
        alt: 'Laboratório de testes'
      },
      {
        itemImageSrc: PW8,
        thumbnailImageSrc: PW8,
        alt: 'Protótipo em desenvolvimento'
      },
      {
        itemImageSrc: PW9,
        thumbnailImageSrc: PW9,
        alt: 'Instalação elétrica'
      },
      {
        itemImageSrc: PW10,
        thumbnailImageSrc: PW10,
        alt: 'Painel finalizado'
      }
    ];
  }
};
