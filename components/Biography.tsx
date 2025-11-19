
import React, { useState } from 'react';

const QuoteIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
    </svg>
);

const Biography: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <section className="mb-12 animate-fade-in">
            <div className="relative bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-10 overflow-hidden transition-all duration-500">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-6 justify-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-700 text-blue-400 flex-shrink-0">
                            <QuoteIcon className="w-5 h-5" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">La historia de Diosmasgym</h2>
                    </div>
                    
                    <div className="space-y-4 text-lg text-gray-300 leading-relaxed text-left">
                        <p className="font-medium text-white">
                            Diosmasgym nace como un proyecto muy personal de un joven que buscaba una manera de combinar su fe en Dios, su amor por el gimnasio y su necesidad de expresar todo lo que llevaba dentro.
                        </p>
                        <p>
                            Al principio no era un artista, ni alguien que buscara fama. Era solo un muchacho con luchas internas, problemas, experiencias fuertes, y una convicción:
                            <br/>
                            <span className="text-blue-400 font-semibold">👉 Dios le había levantado más de una vez cuando nadie más estuvo ahí.</span>
                        </p>

                        {/* Expandable Content */}
                        <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="pt-4 space-y-6 border-t border-slate-700/50 mt-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">⭐ Cómo inició</h3>
                                    <p>
                                        Diosmasgym comenzó como una página de reflexiones. En redes empezó a compartir frases sobre fe, superación, disciplina y levantarse después de caer. Hablaba mucho de que Dios es tu fortaleza y que el gimnasio es tu disciplina, y que juntos se convierten en un estilo de vida. Poco a poco la gente empezó a seguir ese mensaje.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">🎤 El salto a la música</h3>
                                    <p>
                                        Con el tiempo, Diosmasgym empezó a escribir letras: sobre lo que vive, lo que piensa, lo que sufre, lo que cree. No estaba buscando sonar “profesional”; estaba siendo sincero.
                                    </p>
                                    <p className="mt-2">
                                        Después empezó a publicar canciones en plataformas digitales: temas sencillos, directos, con letras de fe, dolor, amor, pruebas y crecimiento. Varios de sus discos, como <em>Mi Historia</em>, <em>Desde el 614</em> o <em>Lo Nuestro Se Acabó</em>, reflejan etapas emocionales diferentes de su vida. Otros, como <em>¡Quería ser Pastor!</em> o <em>Los Protestantes</em>, hablan de su relación con Dios y las críticas que ha recibido.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">💪 El mensaje que lo mueve</h3>
                                    <ul className="list-disc list-inside space-y-1 pl-2 text-gray-300">
                                        <li>Dios no abandona.</li>
                                        <li>La gente falla, pero Dios no.</li>
                                        <li>El cuerpo y el espíritu se entrenan.</li>
                                        <li>Caerse no te define, levantarte sí.</li>
                                        <li>La fe no te hace perfecto, te hace resistente.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">🏆 La identidad del proyecto</h3>
                                    <p>
                                        Hoy en día, Diosmasgym es un proyecto musical cristiano-urbano, un espacio de motivación espiritual y personal, y una marca con estilo propio: <strong className="text-white">fe + gimnasio + fortaleza</strong>. Es una historia de alguien que convirtió su dolor y sus luchas en arte.
                                    </p>
                                </div>
                                <div className="text-center pt-4">
                                    <p className="text-blue-400 italic font-semibold">"Su enfoque no es ser famoso. Su enfoque es dejar una huella con fe, honestidad y disciplina." 🔥</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Toggle Button */}
                    <div className="mt-6 text-center">
                        <button 
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="group inline-flex items-center gap-2 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-full transition-all hover:scale-105 font-medium text-sm"
                        >
                            {isExpanded ? 'Leer menos' : 'Leer historia completa'}
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth={2} 
                                stroke="currentColor" 
                                className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Biography;
