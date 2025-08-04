import React, { useState, useEffect } from 'react';
import { Galleria } from 'primereact/galleria';
import { PhotoService } from './PhotoService'; 
import './QuemSomos.css';

export default function QuemSomos() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    PhotoService.getImages().then((data) => setImages(data));
  }, []);

  const itemTemplate = (item) => {
    return <img src={item.itemImageSrc} alt={item.alt} className="quem-img" />;
  };

  return (
    <div className="quem-container">
      <h1>Quem Somos</h1>
      <p className="quem-texto">
        Somos uma equipe dedicada à excelência e inovação, comprometida com a qualidade e a transparência
        em todos os nossos serviços.
      </p>
      <div className="quem-galeria">
        <Galleria
          value={images}
          numVisible={5}
          circular
          showThumbnails={false}
          showItemNavigators
          item={itemTemplate}
        />
      </div>

      <button
      className="btn-voltar"
      onClick={() => (window.location.href = "/Menu")}
      >
      Voltar à Página Inicial
      </button>
    </div>
  );
}
