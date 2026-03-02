import type { Metadata } from 'next';
import Image from 'next/image';
import {
    MapPin,
    ArrowRight,
    Target,
    Wrench,
    CheckCircle2
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Casos de Éxito — DIRECSA',
    description: 'Nuestra trayectoria a través de proyectos audiovisuales emblemáticos.',
};

export default function ProjectsPage() {
    const projects = [
        {
            title: "Modernización de Auditorio para Presentaciones y Videoconferencia",
            location: "Ciudad de México",
            image: "/images/proyectos/auditorio.jpg",
            reto: [
                "Sonido claro para presentaciones locales.",
                "Uso de microfonía inalámbrica confiable.",
                "Proyección de video en múltiples pantallas.",
                "Integración de cámaras PTZ para transmisión.",
                "Capacidad de realizar videoconferencias sin complicaciones técnicas.",
                "Operación sencilla para el personal interno."
            ],
            solucion: [
                "Sistema de microfonía inalámbrica profesional.",
                "Distribución de video a múltiples proyectores y pantallas.",
                "Integración de cámaras PTZ para cobertura completa del escenario.",
                "Configuración para transmisión y videoconferencia.",
                "Puesta en marcha, ajustes finos y optimización del sistema."
            ],
            resultado: [
                "Audio claro y uniforme en todo el auditorio.",
                "Transiciones fluidas entre presentaciones locales y videoconferencia.",
                "Operación simplificada para el equipo interno.",
                "Espacio listo para eventos híbridos y transmisiones en vivo."
            ]
        },
        {
            title: "Modernización de Sala Parlamentaria para Sesiones Oficiales",
            location: "Recinto Gubernamental",
            image: "/images/proyectos/sala_parlamentaria.jpg",
            reto: [
                "Uso de microfonía individual para cada participante.",
                "Refuerzo sonoro claro para la audiencia.",
                "Sistema de votación electrónica integrado.",
                "Seguimiento automático de cámaras para transmisión y grabación oficial.",
                "Operación estable durante sesiones prolongadas."
            ],
            solucion: [
                "Microfonía parlamentaria individual con control centralizado.",
                "Sistema de refuerzo sonoro para cobertura uniforme en sala.",
                "Plataforma de votación electrónica para registro seguro de decisiones.",
                "Sistema de seguimiento automático de cámaras para transmisión en vivo.",
                "Participación en la puesta en marcha, configuración y ajuste fino."
            ],
            resultado: [
                "Audio claro y controlado en cada intervención.",
                "Procesos de votación eficientes y precisos.",
                "Transmisiones profesionales con seguimiento automático del orador.",
                "Infraestructura lista para sesiones híbridas y archivo digital."
            ]
        },
        {
            title: "Sistema de Voceo y Emergencia para Institución Educativa",
            location: "Plantel Educativo",
            image: "/images/proyectos/voceo.jpg",
            reto: [
                "Voceo general en todo el plantel.",
                "Uso de microfonía inalámbrica para eventos en explanada.",
                "Automatización de la campana escolar por horarios.",
                "Integración de un micrófono dedicado para anuncios de emergencia.",
                "Integración de alerta sísmica dentro del sistema de audio."
            ],
            solucion: [
                "Microfonía inalámbrica para eventos y anuncios en exteriores.",
                "Automatización programada de la campana escolar.",
                "Canal prioritario para micrófono de emergencia.",
                "Integración de señal de alerta sísmica al sistema de audio.",
                "Diseño técnico y participación en la puesta en marcha."
            ],
            resultado: [
                "Comunicación clara y uniforme en todo el plantel.",
                "Operación sencilla para personal administrativo.",
                "Mayor seguridad ante situaciones de emergencia.",
                "Infraestructura preparada para eventos escolares."
            ]
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* Project Hero */}
            <section className="bg-gray-900 py-32 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-[120px] rounded-full"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <span className="text-blue-400 font-semibold tracking-widest uppercase text-sm mb-6 block">Trayectoria y Resultados</span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">Nuestros Casos de Éxito</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Transformamos espacios con ingeniería audiovisual de precisión. Conoce cómo resolvemos desafíos complejos para nuestros clientes.
                    </p>
                </div>
            </section>

            {/* Projects list */}
            <section className="py-24 px-4 bg-gray-50/50">
                <div className="max-w-7xl mx-auto space-y-32">
                    {projects.map((project, idx) => (
                        <div key={idx} className="bg-white rounded-[3rem] overflow-hidden shadow-sm border border-gray-100">
                            <div className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                                {/* Image section */}
                                <div className="lg:w-1/2 relative h-[400px] lg:h-auto">
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                                    <div className="absolute bottom-8 left-8 text-white">
                                        <div className="flex items-center gap-2 mb-2 font-medium bg-blue-600/80 backdrop-blur-md px-4 py-1.5 rounded-full text-sm w-fit">
                                            <MapPin size={16} />
                                            {project.location}
                                        </div>
                                    </div>
                                </div>

                                {/* Content section */}
                                <div className="lg:w-1/2 p-8 lg:p-16">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-12 leading-tight">
                                        {project.title}
                                    </h2>

                                    <div className="space-y-10">
                                        {/* Reto */}
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                                    <Target size={20} />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900">El Reto</h3>
                                            </div>
                                            <ul className="space-y-2">
                                                {project.reto.map((item, i) => (
                                                    <li key={i} className="flex gap-3 text-gray-600">
                                                        <span className="text-orange-500 font-bold">•</span>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Solución */}
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                                    <Wrench size={20} />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900">La Solución</h3>
                                            </div>
                                            <ul className="space-y-2">
                                                {project.solucion.map((item, i) => (
                                                    <li key={i} className="flex gap-3 text-gray-600">
                                                        <span className="text-blue-500 font-bold">•</span>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Resultado */}
                                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                                    <CheckCircle2 size={20} />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900">El Resultado</h3>
                                            </div>
                                            <ul className="space-y-2">
                                                {project.resultado.map((item, i) => (
                                                    <li key={i} className="flex gap-3 text-green-800 font-medium">
                                                        <CheckCircle2 size={16} className="mt-1 flex-shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-4 bg-white">
                <div className="max-w-5xl mx-auto bg-blue-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-500/20">
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold mb-8">¿Listo para iniciar tu proyecto?</h2>
                        <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
                            Nuestro equipo de expertos está listo para diseñar la solución que tu espacio necesita.
                        </p>
                        <a
                            href="/contacto"
                            className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-blue-50 transition-all inline-flex items-center gap-3 shadow-lg"
                        >
                            Solicitar asesoría
                            <ArrowRight className="w-6 h-6" />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
