import type { Metadata } from 'next';
import Image from 'next/image';
import {
    Briefcase,
    GraduationCap,
    Theater,
    Music,
    Church,
    Hotel,
    Landmark,
    ShoppingBag,
    Video,
    Settings,
    Users,
    Layers,
    Wrench,
    Cpu,
    Play,
    Presentation,
    LifeBuoy,
    Volume2,
    CheckCircle2
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Soluciones — DIRECSA',
    description: 'Expertos en integración audiovisual para centros religiosos, entretenimiento y corporativos.',
};

export default function SolutionsPage() {
    const solutions = [
        {
            icon: <Briefcase className="w-8 h-8 text-blue-600" />,
            title: "Espacios Corporativos",
            description: "Diseñamos soluciones audiovisuales para salas de juntas, salas de consejo y espacios de colaboración. Integramos audio claro para voz, videoconferencia profesional y sistemas de control sencillos que mejoran la comunicación y productividad."
        },
        {
            icon: <GraduationCap className="w-8 h-8 text-blue-600" />,
            title: "Educación y Capacitación",
            description: "Implementamos sistemas audiovisuales para aulas, auditorios y espacios educativos. Nuestras soluciones permiten clases presenciales, híbridas y remotas, garantizando claridad en el audio, calidad visual y facilidad de operación."
        },
        {
            icon: <Theater className="w-8 h-8 text-blue-600" />,
            title: "Auditorios y Teatros",
            description: "Desarrollamos proyectos para auditorios y teatros con un enfoque en cobertura uniforme, inteligibilidad y potencia controlada. Realizamos diseño electroacústico, integración de sistemas de sonido profesional y optimización del rendimiento del espacio."
        },
        {
            icon: <Music className="w-8 h-8 text-blue-600" />,
            title: "Entretenimiento y Espectáculos",
            description: "Creamos soluciones para foros, venues y centros de entretenimiento. Integramos sistemas de audio de alto desempeño, monitoreo y control, diseñados para ofrecer experiencias sonoras impactantes y confiables."
        },
        {
            icon: <Church className="w-8 h-8 text-blue-600" />,
            title: "Espacios Religiosos",
            description: "Diseñamos sistemas audiovisuales para templos e iglesias, priorizando la claridad de la voz, la cobertura uniforme y una integración discreta. Facilitamos también la transmisión y grabación de servicios."
        },
        {
            icon: <Hotel className="w-8 h-8 text-blue-600" />,
            title: "Hoteles y Hospitalidad",
            description: "Integramos soluciones audiovisuales para salones de eventos, salas de conferencias y áreas comunes. Ofrecemos sistemas flexibles, escalables y fáciles de operar que se adaptan a distintos tipos de eventos."
        },
        {
            icon: <Landmark className="w-8 h-8 text-blue-600" />,
            title: "Espacios Públicos y Culturales",
            description: "Implementamos soluciones para auditorios públicos, centros culturales y salas institucionales. Nuestros sistemas aseguran comunicación clara, operación confiable y cumplimiento con los requerimientos técnicos del sector."
        },
        {
            icon: <ShoppingBag className="w-8 h-8 text-blue-600" />,
            title: "Comercial y Retail",
            description: "Diseñamos sistemas de audio ambiental y pantallas informativas que fortalecen la experiencia del cliente y la identidad de marca, con control zonificado y operación automatizada."
        },
        {
            icon: <Video className="w-8 h-8 text-blue-600" />,
            title: "Producción y Streaming",
            description: "Integramos soluciones para transmisión en vivo, grabación y producción audiovisual. Implementamos sistemas con cámaras, audio profesional y automatización para una operación eficiente y consistente."
        }
    ];

    const professionalServices = [
        { name: "Consultoría audiovisual", icon: <Users size={20} /> },
        { name: "Diseño e ingeniería AV", icon: <Layers size={20} /> },
        { name: "Integración e instalación", icon: <Wrench size={20} /> },
        { name: "Programación y control", icon: <Cpu size={20} /> },
        { name: "Puesta en marcha", icon: <Play size={20} /> },
        { name: "Capacitación", icon: <Presentation size={20} /> },
        { name: "Soporte y mantenimiento", icon: <LifeBuoy size={20} /> }
    ];

    const brands = [
        { name: 'Shure', logo: '/images/logos/logo-shure-01.jpg' },
        { name: 'Sonos', logo: '/images/logos/logo- Sonos_Wordmark_Black (2)-01-d2a961-original-1760697728.png' },
        { name: 'Biamp', logo: '/images/logos/logo-biamp-01.jpg' },
        { name: 'Nexo', logo: '/images/logos/logo-nexo-01.jpg' },
    ];

    return (
        <div className="bg-white">
            {/* Header Hero */}
            <section className="relative h-[65vh] min-h-[500px] flex items-center justify-center text-white overflow-hidden">
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: 'url("/images/live_events.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80 backdrop-blur-[2px]"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto text-center px-4">
                    <div className="flex justify-center mb-6">
                        <span className="p-3 bg-blue-600/20 rounded-full border border-blue-500/30 backdrop-blur-md">
                            <Volume2 className="w-8 h-8 text-blue-400" />
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-bold mb-8 tracking-tight">Nuestras Soluciones</h1>
                    <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                        En Direcsa diseñamos, integramos e implementamos soluciones audiovisuales profesionales que se adaptan a cada espacio y necesidad. Nos enfocamos en la funcionalidad, la experiencia del usuario y la confiabilidad de cada sistema.
                    </p>
                </div>
            </section>

            {/* Solutions Grid */}
            <section className="py-24 px-4 bg-gray-50/50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {solutions.map((item, index) => (
                            <div
                                key={index}
                                className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-500"
                            >
                                <div className="mb-6 p-4 bg-blue-50 w-fit rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Professional Services */}
            <section className="py-24 px-4 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-64 -mt-64 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[100px] opacity-50"></div>
                <div className="absolute bottom-0 left-0 -ml-64 -mb-64 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[100px] opacity-50"></div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div
                        className="relative bg-gray-900 rounded-[3rem] overflow-hidden shadow-2xl"
                        style={{
                            backgroundImage: 'url("/images/monitoring2.jpg")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        {/* Overlay with more weight on the left for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-900/90 to-blue-900/80 backdrop-blur-[2px]"></div>

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2">
                            <div className="p-12 lg:p-20 flex flex-col justify-center">
                                <div className="flex items-center gap-4 mb-6">
                                    <Settings className="w-8 h-8 text-blue-400 animate-spin-slow" />
                                    <span className="text-blue-400 font-semibold tracking-widest uppercase text-sm">Expertise Técnica</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Servicios Profesionales</h2>
                                <p className="text-gray-400 text-xl leading-relaxed mb-10">
                                    Acompañamos cada proyecto con servicios especializados que garantizan el éxito de tu inversión desde el diseño hasta la operación diaria.
                                </p>
                            </div>
                            <div className="bg-gray-800/50 p-12 lg:p-20 backdrop-blur-xl border-l border-white/5">
                                <div className="space-y-6">
                                    {professionalServices.map((service, index) => (
                                        <div key={index} className="flex items-center gap-6 group">
                                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                                {service.icon}
                                            </div>
                                            <span className="text-lg md:text-xl font-medium text-gray-300 group-hover:text-white transition-colors">
                                                {service.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Brands Section (Simplified) */}
            <section className="py-24 px-4 bg-gray-50/30">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-16">Alianzas con líderes globales</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                        {brands.map((brand) => (
                            <div key={brand.name} className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-60 hover:opacity-100">
                                <div className="relative w-40 h-20">
                                    <Image
                                        src={brand.logo}
                                        alt={brand.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Process Section */}
            <section className="py-24 px-4 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-blue-600 font-semibold tracking-widest uppercase text-sm">Metodología Direcsa</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4">Nuestro Proceso</h2>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-blue-100 -translate-y-8"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                            {[
                                {
                                    step: "01",
                                    title: "Consultoría",
                                    desc: "Entendemos tus necesidades y presupuesto para trazar el camino correcto.",
                                    icon: <Users className="w-6 h-6" />
                                },
                                {
                                    step: "02",
                                    title: "Ingeniería",
                                    desc: "Diseñamos el plano técnico y elegimos el hardware ideal para tu espacio.",
                                    icon: <Layers className="w-6 h-6" />
                                },
                                {
                                    step: "03",
                                    title: "Ejecución",
                                    desc: "Instalación limpia, estética y garantizada por nuestros expertos.",
                                    icon: <Wrench className="w-6 h-6" />
                                },
                                {
                                    step: "04",
                                    title: "Certificación",
                                    desc: "Pruebas exhaustivas de rendimiento y capacitación completa a tu equipo.",
                                    icon: <CheckCircle2 className="w-6 h-6" />
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="relative group">
                                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-500 relative z-10">
                                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 transform group-hover:rotate-6 transition-transform">
                                            {item.icon}
                                        </div>
                                        <span className="text-blue-600 font-bold text-5xl opacity-10 absolute top-8 right-8">{item.step}</span>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                        <p className="text-gray-600">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQs Section */}
            <section className="py-24 px-4 bg-gray-900 text-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Preguntas Frecuentes</h2>
                        <p className="text-gray-400">Todo lo que necesitas saber sobre trabajar con nosotros.</p>
                    </div>

                    <div className="space-y-6">
                        {[
                            {
                                q: "¿Realizan envíos y trabajos fuera de la CDMX?",
                                a: "Sí. En Direcsa contamos con cobertura en toda la República Mexicana. Realizamos envíos de equipo, proyectos de integración e instalación en diferentes estados, garantizando la misma calidad y seguimiento en cada proyecto."
                            },
                            {
                                q: "¿Qué tipo de garantías ofrecen?",
                                a: "Todos los equipos cuentan con garantía directa del fabricante conforme a sus políticas. Adicionalmente, ofrecemos planes de mantenimiento preventivo para asegurar el óptimo funcionamiento del sistema y prolongar la vida útil del equipo."
                            },
                            {
                                q: "¿Cómo es el proceso para iniciar un proyecto?",
                                a: "El proceso comienza con una visita o reunión para conocer las necesidades del espacio. Posteriormente, desarrollamos una propuesta técnica y económica personalizada. Una vez aprobada, coordinamos la instalación y puesta en marcha del sistema."
                            },
                            {
                                q: "¿Cuánto cuesta un proyecto de audio o video?",
                                a: "Cada proyecto es diferente, ya que depende del tamaño del espacio, las necesidades técnicas y el nivel de integración requerido. En Direcsa realizamos un diagnóstico previo para ofrecer una propuesta personalizada, clara y ajustada a cada presupuesto."
                            }
                        ].map((faq, idx) => (
                            <div key={idx} className="bg-gray-800/50 p-8 rounded-3xl border border-white/5 backdrop-blur-sm">
                                <h3 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-3">
                                    <span className="text-2xl">*</span>
                                    {faq.q}
                                </h3>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-4">
                <div className="max-w-5xl mx-auto bg-blue-600 rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl shadow-blue-500/20">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">¿Listo para transformar tu espacio?</h2>
                    <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
                        Nuestro equipo de ingenieros está listo para diseñar la solución perfecta para tus necesidades.
                    </p>
                    <a
                        href="/contacto"
                        className="inline-flex items-center gap-3 bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-1"
                    >
                        Solicitar asesoria
                        <CheckCircle2 className="w-6 h-6" />
                    </a>
                </div>
            </section>
        </div>
    );
}
