import React from 'react';
import TiktokIcon from './TiktokIcon';

const TikTokFeed: React.FC = () => {
    return (
        <section className="animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-6 px-2 flex items-center gap-3">
                <TiktokIcon className="w-8 h-8"/>
                <span>Último en TikTok</span>
            </h2>
            {/* 
              IMPORTANTE: Este widget es un ejemplo de Elfsight.com.
              Para que funcione, necesitas seguir estos pasos:
              1. Ve a Elfsight.com, regístrate (es gratis) y crea un widget de "TikTok Feed".
              2. Personalízalo con el usuario @diosmasgym.
              3. Al final, te darán un código de instalación. Copia el identificador único del widget.
              4. Reemplaza la clase "elfsight-app-..." de abajo con la tuya.
              5. Asegúrate de que el script de Elfsight esté en tu `index.html`. Ya lo he añadido por ti.
            */}
            <div className="elfsight-app-d105ma5gym-t1kt0k-f33d" data-elfsight-app-lazy></div>
        </section>
    );
};

export default TikTokFeed;
