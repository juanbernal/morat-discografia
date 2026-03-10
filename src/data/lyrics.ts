export const LOCAL_LYRICS: Record<string, string> = {
    'anacronica': `[Intro]
Uh... Ah...

[Verso 1]
El tiempo corre pero yo no avanzo
Siento que vivo en un desajuste cronológico
Buscando piezas que ya no encajan
En una vida que parece ilógica

[Coro]
Soy así, anacrónica
Fuera de tiempo, sin lógica
Viviendo recuerdos que ya pasaron
Dejando huellas que se borraron
Anacrónica...

[Verso 2]
Las horas pesan como mil años
Y los minutos se me hacen extraños
Quisiera poder sincronizar
Pero mi mente prefiere volar

[Coro]
Soy así, anacrónica
Fuera de tiempo, sin lógica
Viviendo recuerdos que ya pasaron
Dejando huellas que se borraron
Anacrónica...

[Outro]
Frecuencia perdida...
Fuera de tiempo...
Anacrónica.

(Nota: Reemplaza esta letra provisional con la oficial en src/data/lyrics.ts)`,
};

export const getLocalLyric = (trackName: string): string | null => {
    // Clean track name to match keys
    let clean = trackName.toLowerCase();
    
    // Remove variations like " | versión extendida", " - Remastered", "(feat...)"
    clean = clean.split(' | ')[0]
        .split(' - ')[0]
        .replace(/\(.*\)/, '')
        .trim();

    // specific match
    if (LOCAL_LYRICS[clean]) {
        return LOCAL_LYRICS[clean];
    }
    
    // partial match
    const key = Object.keys(LOCAL_LYRICS).find(k => clean.includes(k));
    if (key) return LOCAL_LYRICS[key];

    return null;
};
