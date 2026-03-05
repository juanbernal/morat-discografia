export const BEHIND_THE_BEATS: Record<string, string> = {
    // track id or name lowercase
    'juan 614': 'Este tema fue grabado en una sola toma durante la madrugada. Representa la esencia pura del proyecto colaborativo entre Diosmasgym y Juan 614.',
    'diosmasgym': 'El track fundacional de la discográfica. Sus sintes fueron inspirados en la electrónica de los 90s pero con un dembow oculto en el bassline.',
    'el elegido': 'Producido enteramente en dispositivos móviles antes de pasar al estudio. Fue el primer experimento de Juan 614 mezclando corridos con trap.',
    'la marca': 'Originalmente iba a ser un descarte, pero luego de que Diosmasgym añadió el drop final, se convirtió en el focus track del álbum.'
};

export const getBehindTheBeats = (trackName: string): string | null => {
    const key = Object.keys(BEHIND_THE_BEATS).find(k => trackName.toLowerCase().includes(k));
    if (key) return BEHIND_THE_BEATS[key];

    // Default random trivia for testing
    const defaults = [
        "El beat de esta canción tardó más de 3 meses en perfeccionarse.",
        "Grabada con micrófonos vintage para darle esa textura especial.",
        "La letra fue improvisada casi en su totalidad en el estudio.",
        "Representa una transición hacia los nuevos sonidos globales de Diosmasgym Records."
    ];
    return defaults[Math.floor(Math.random() * defaults.length)];
};
