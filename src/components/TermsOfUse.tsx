import React, { useEffect } from 'react';
import { FileText, ArrowLeft, Mail, Calendar } from 'lucide-react';

const TermsOfUse: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200">
            <div className="max-w-3xl mx-auto px-6 py-16">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-white/40 hover:text-white text-xs font-bold uppercase tracking-wider mb-12 transition-colors group"
                    aria-label="Volver al inicio"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Volver al inicio
                </button>

                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-500/20">
                        <FileText size={24} className="text-blue-400" />
                    </div>
                    <span className="text-blue-500 text-[9px] font-black uppercase tracking-[0.3em]">Legal</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
                    Términos de <span className="text-white/20">Uso</span>
                </h1>

                <div className="flex items-center gap-6 text-white/30 text-[10px] font-bold uppercase tracking-widest mb-12">
                    <span className="flex items-center gap-2"><Calendar size={11} /> Última actualización: 3 de mayo, 2026</span>
                </div>

                <div className="space-y-12 text-sm leading-relaxed text-white/60">
                    <section>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">1. Aceptación de los Términos</h2>
                        <p>
                            Al acceder y utilizar el sitio web de Diosmasgym Records (en adelante, "el Sitio"), aceptas cumplir con estos Términos de Uso. Si no estás de acuerdo con alguna parte de estos términos, te pedimos que no utilices nuestro Sitio.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">2. Descripción del Servicio</h2>
                        <p>
                            El Sitio funciona como catálogo digital oficial del sello discográfico independiente Diosmasgym Records. Ofrece:
                        </p>
                        <ul className="space-y-2 ml-4 mt-3">
                            {[
                                'Consulta de discografía, álbumes, sencillos y estrenos del sello.',
                                'Reproducción de previews de música a través de YouTube embebido.',
                                'Acceso a enlaces externos a plataformas de streaming (Spotify, YouTube Music, Apple Music).',
                                'Notificaciones de nuevos lanzamientos (con consentimiento del usuario).',
                                'Generación de contenido creativo asistido por inteligencia artificial (frases, reflexiones).',
                                'Formulario de contacto para consultas profesionales y colaboraciones.'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">3. Propiedad Intelectual</h2>
                        <p className="mb-3">
                            Todo el contenido disponible en este Sitio, incluyendo pero no limitado a:
                        </p>
                        <ul className="space-y-2 ml-4">
                            {[
                                'Portadas de álbumes, arte gráfico e imágenes promocionales.',
                                'Letras de canciones originales de los artistas del sello.',
                                'Textos, descripciones y contenido generado por inteligencia artificial.',
                                'Logotipos, identidad visual y marca "Diosmasgym Records".',
                                'Código fuente, diseño de interfaz y estructura del sitio.'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-4">
                            está protegido por las leyes de propiedad intelectual y pertenece a Diosmasgym Records o a sus respectivos titulares. Queda prohibida la reproducción, distribución, modificación o uso comercial sin autorización expresa por escrito.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">4. Contenido de Terceros</h2>
                        <p className="mb-3">
                            El Sitio incluye contenido y funcionalidades de terceros:
                        </p>
                        <ul className="space-y-2 ml-4">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                <span><strong className="text-white">Spotify:</strong> Los previews y enlaces a Spotify están sujetos a los términos de uso de Spotify AB. No almacenamos ni distribuimos audio de Spotify directamente.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                <span><strong className="text-white">YouTube:</strong> Los videos embebidos son proporcionados por YouTube (Google LLC). Su uso está sujeto a los Términos de Servicio de YouTube.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                <span><strong className="text-white">Google Gemini AI:</strong> El contenido generado por IA es de carácter creativo y puede no reflejar opiniones oficiales del sello.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                <span><strong className="text-white">Google Sheets:</strong> Los datos del catálogo se obtienen de hojas de cálculo públicas de Google.</span>
                            </li>
                        </ul>
                        <p className="mt-4">
                            No nos hacemos responsables de la disponibilidad, exactitud o contenido de los servicios de terceros enlazados desde este Sitio.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">5. Uso Permitido</h2>
                        <p className="mb-3">
                            Puedes utilizar este Sitio para uso personal y no comercial, incluyendo:
                        </p>
                        <ul className="space-y-2 ml-4">
                            {[
                                'Escuchar previews de canciones disponibles públicamente.',
                                'Navegar por el catálogo y descubrir nueva música.',
                                'Compartir enlaces al Sitio en redes sociales.',
                                'Contactar al sello para consultas profesionales.',
                                'Activar notificaciones para enterarte de nuevos lanzamientos.'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-4 font-black text-white text-xs uppercase tracking-tight">
                            Queda prohibido:
                        </p>
                        <ul className="space-y-2 ml-4 mt-3">
                            {[
                                'Extraer, copiar o distribuir música fuera de los reproductores embebidos autorizados.',
                                'Utilizar el Sitio para actividades ilegales, fraudulentas o que infrinjan derechos de terceros.',
                                'Intentar acceder a sistemas, APIs o datos protegidos sin autorización.',
                                'Modificar, revertir la ingeniería o copiar el código fuente del Sitio.',
                                'Usar bots, scrapers o herramientas automatizadas para extraer datos masivamente.'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">6. Limitación de Responsabilidad</h2>
                        <p className="mb-3">
                            Diosmasgym Records no será responsable por:
                        </p>
                        <ul className="space-y-2 ml-4">
                            {[
                                'Interrupciones, caídas o errores en la disponibilidad del Sitio.',
                                'Daños directos o indirectos derivados del uso o la imposibilidad de uso del Sitio.',
                                'Contenido generado por inteligencia artificial que pueda contener imprecisiones.',
                                'La disponibilidad o contenido de los servicios de terceros enlazados.',
                                'Pérdida de datos o información personal por causas de fuerza mayor.'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">7. Disponibilidad del Sitio</h2>
                        <p>
                            Nos esforzamos por mantener el Sitio disponible las 24 horas del día, 7 días a la semana. Sin embargo, no garantizamos que el servicio será ininterrumpido, libre de errores o que se mantendrá disponible indefinidamente. Podremos suspender o discontinuar el servicio en cualquier momento sin previo aviso.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">8. Enlaces a Sitios Externos</h2>
                        <p>
                            El Sitio contiene enlaces a plataformas externas (Spotify, YouTube, Instagram, TikTok, Apple Music). Estos enlaces se proporcionan únicamente para tu comodidad. No controlamos ni nos hacemos responsables del contenido, políticas de privacidad o prácticas de dichos sitios externos. Te recomendamos leer los términos y políticas de cada plataforma antes de utilizarlas.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">9. Modificaciones a los Términos</h2>
                        <p>
                            Nos reservamos el derecho de modificar estos Términos de Uso en cualquier momento. Los cambios entrarán en vigor desde su publicación en esta página con la fecha de última actualización actualizada. El uso continuado del Sitio después de cualquier modificación constituye tu aceptación de los nuevos términos.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">10. Ley Aplicable y Jurisdicción</h2>
                        <p>
                            Estos Términos de Uso se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier controversia derivada de la interpretación o cumplimiento de estos términos será sometida a la jurisdicción de los tribunales competentes en el norte de México.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">11. Contacto</h2>
                        <div className="glass rounded-2xl p-6 border border-white/5">
                            <p className="flex items-center gap-2 mb-2">
                                <Mail size={14} className="text-blue-400" />
                                <a href="mailto:contacto@diosmasgym.com" className="text-blue-400 hover:underline">contacto@diosmasgym.com</a>
                            </p>
                            <p className="text-white/30 text-xs">
                                Diosmasgym Records · Norte de México · Música Independiente
                            </p>
                        </div>
                    </section>
                </div>

                <div className="border-t border-white/5 mt-16 pt-8 text-center">
                    <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest">
                        © {new Date().getFullYear()} Diosmasgym Records · Todos los derechos reservados
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfUse;
