import React, { useEffect } from 'react';
import { Shield, ArrowLeft, Mail, Calendar } from 'lucide-react';

const PrivacyPolicy: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
                        <Shield size={24} className="text-blue-400" />
                    </div>
                    <span className="text-blue-500 text-[9px] font-black uppercase tracking-[0.3em]">Legal</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
                    Política de <span className="text-white/20">Privacidad</span>
                </h1>

                <div className="flex items-center gap-6 text-white/30 text-[10px] font-bold uppercase tracking-widest mb-12">
                    <span className="flex items-center gap-2"><Calendar size={11} /> Última actualización: 3 de mayo, 2026</span>
                </div>

                <div className="space-y-12 text-sm leading-relaxed text-white/60">
                    <section>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">1. Responsable del Tratamiento</h2>
                        <p>
                            Diosmasgym Records, con domicilio en el norte de México, es responsable del tratamiento de tus datos personales. Puedes contactarnos en <a href="mailto:contacto@diosmasgym.com" className="text-blue-400 hover:underline">contacto@diosmasgym.com</a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">2. Datos que Recopilamos</h2>
                        <p className="mb-3">Recopilamos los siguientes tipos de información:</p>
                        <ul className="space-y-2 ml-4">
                            {[
                                'Datos de navegación: dirección IP, tipo de navegador, páginas visitadas y tiempo de visita.',
                                'Datos de contacto: cuando nos escribes a través del formulario de contacto (nombre, correo electrónico, mensaje).',
                                'Datos de uso: interacciones con nuestro reproductor, búsquedas realizadas y preferencias de idioma.',
                                'Cookies y tecnologías similares: para mejorar la experiencia del usuario y analizar el tráfico del sitio.'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">3. Finalidad del Tratamiento</h2>
                        <p className="mb-3">Utilizamos tus datos para:</p>
                        <ul className="space-y-2 ml-4">
                            {[
                                'Mostrarte el catálogo musical y permitir la navegación por nuestra discografía.',
                                'Procesar mensajes enviados a través del formulario de contacto y responder consultas.',
                                'Enviar notificaciones sobre nuevos lanzamientos (solo si has dado tu consentimiento explícito).',
                                'Analizar y mejorar el rendimiento y la experiencia de nuestro sitio web.',
                                'Recordar tus preferencias de idioma y configuración de notificaciones.'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">4. Servicios de Terceros</h2>
                        <p className="mb-3">
                            Nuestro sitio interactúa con servicios externos que tienen sus propias políticas de privacidad:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                                { name: 'Spotify', desc: 'Reproductor embebido y enlaces a perfiles de artistas.' },
                                { name: 'YouTube', desc: 'Reproductor de video embebido para previsualización de música.' },
                                { name: 'Google Sheets', desc: 'Fuente de datos del catálogo musical (solo lectura pública).' },
                                { name: 'Google Fonts', desc: 'Carga de tipografías Inter y Outfit para la interfaz.' },
                                { name: 'LRCLIB', desc: 'Servicio de búsqueda de letras de canciones (API externa).' },
                                { name: 'Google Gemini AI', desc: 'Generación de contenido creativo (frases, reflexiones).' }
                            ].map(service => (
                                <div key={service.name} className="glass rounded-xl p-4 border border-white/5">
                                    <p className="text-white font-black text-xs uppercase tracking-tight">{service.name}</p>
                                    <p className="text-white/40 text-[11px] mt-1">{service.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">5. Cookies</h2>
                        <p className="mb-3">
                            Utilizamos cookies y almacenamiento local (<code className="text-blue-400">localStorage</code>, <code className="text-blue-400">sessionStorage</code>) para:
                        </p>
                        <ul className="space-y-2 ml-4">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                <span><strong className="text-white">Preferencia de idioma</strong> — recordar si elegiste español o inglés.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                <span><strong className="text-white">Notificaciones</strong> — recordar si activaste o desactivaste las notificaciones del navegador.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                <span><strong className="text-white">Landing de estrenos</strong> — controlar la visualización de modales de nuevos lanzamientos por sesión.</span>
                            </li>
                        </ul>
                        <p className="mt-4">
                            Puedes desactivar las cookies desde la configuración de tu navegador. Ten en cuenta que esto podría afectar la funcionalidad del sitio.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">6. Seguridad</h2>
                        <p>
                            Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos contra acceso no autorizado, alteración, divulgación o destrucción. El sitio utiliza HTTPS y las contraseñas o tokens de API nunca se exponen en el código del lado del cliente.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">7. Derechos del Usuario (ARCO)</h2>
                        <p className="mb-3">
                            De acuerdo con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (México), tienes derecho a:
                        </p>
                        <ul className="space-y-2 ml-4">
                            {[
                                'Acceso: conocer qué datos personales tuyos estamos tratando.',
                                'Rectificación: solicitar la corrección de datos inexactos o desactualizados.',
                                'Cancelación: pedir la eliminación de tus datos cuando consideres que no son necesarios para las finalidades descritas.',
                                'Oposición: oponerte al tratamiento de tus datos para fines específicos.'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-4">
                            Para ejercer cualquiera de estos derechos, envía un correo a <a href="mailto:contacto@diosmasgym.com" className="text-blue-400 hover:underline">contacto@diosmasgym.com</a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">8. Menores de Edad</h2>
                        <p>
                            Nuestro sitio está dirigido a todo público. No recopilamos intencionalmente datos personales de menores de 13 años sin consentimiento de un padre o tutor. Si detectas que un menor ha proporcionado datos sin consentimiento, contáctanos para que procedamos a su eliminación.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">9. Cambios a esta Política</h2>
                        <p>
                            Nos reservamos el derecho de modificar esta política en cualquier momento. Cualquier cambio será publicado en esta misma página con la fecha de última actualización actualizada. Te recomendamos revisarla periódicamente.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">10. Contacto</h2>
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

export default PrivacyPolicy;
