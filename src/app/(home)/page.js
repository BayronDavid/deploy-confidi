'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTranslation } from '@/config/i18n';
import { homePageConfig } from '@/config/pages/landing/home.config';
import Scene from '@/components/three/Scene';
import ScrollProgress from '@/components/ui/ScrollProgress';

export default function HomePage() {
  return (
    <div>Home</div>
  )
}

// import './Home.css';

// export default function HomePage() {
//   const { locale } = useTranslation();
//   const texts = homePageConfig[locale];
//   const sectionsRef = useRef([]);

//   // Animación de entrada con IntersectionObserver + GSAP
//   useEffect(() => {
//     const sections = sectionsRef.current;
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             gsap.to(entry.target, {
//               opacity: 1,
//               y: 0,
//               duration: 0.8,
//               ease: 'power2.out',
//             });
//           }
//         });
//       },
//       { threshold: 0.1 }
//     );

//     sections.forEach((section) => {
//       if (section) {
//         gsap.set(section, { opacity: 0, y: 50 });
//         observer.observe(section);
//       }
//     });

//     return () => {
//       sections.forEach((section) => {
//         if (section) {
//           observer.unobserve(section);
//         }
//       });
//     };
//   }, []);

//   return (
//     <>
//       {/* Escena 3D y barra de progreso de scroll */}
//       <Scene />
//       <ScrollProgress />

//       <div className="scroll-container">
//         {/* SECCIÓN DE INTRODUCCIÓN */}
//         <section
//           className="intro-section"
//           ref={(el) => (sectionsRef.current[0] = el)}
//         >
//           <div className="">
//             <h1>{texts.intro.title}</h1>
//             <h3 className="subtitle">{texts.intro.subtitle}</h3>
//             <span className="description">{texts.intro.description}</span>
//           </div>

//           {/* Flecha/Texto para desplazar hacia abajo */}
//           <div className="scroll-down">
//             <p>{texts.intro.scrollText}</p>
//             <span className="arrow">↓</span>
//           </div>
//         </section>

//         <section
//           className="content-section"
//           ref={(el) => (sectionsRef.current[1] = el)}
//         >
//           <h2>{texts.content.title}</h2>
//           <p>{texts.content.description}</p>
//         </section>

//         {/* SECCIÓN DE “CÍRCULOS” (FEATURES) */}
//         <section
//           className="features-section"
//           ref={(el) => (sectionsRef.current[2] = el)}
//         >
//           {texts.features.items.map((feature, index) => (
//             <div className={`feature-item ${index % 2 !== 0 ? 'feature-item-reverse' : ''}`} key={index}>
//               <div className="circle-image">
//                 {/* Imagen circular de placehold.co */}
//                 <img
//                   src="https://placehold.co/150x150"
//                   alt={feature.title}
//                 />
//               </div>
//               <div className="feature-text">
//                 <h3>{feature.title}</h3>
//                 <p>{feature.description}</p>
//               </div>
//             </div>
//           ))}
//         </section>

//         {/* SECCIÓN DE CONCLUSIÓN O CTA */}
//         <section
//           className="conclusion-section"
//           ref={(el) => (sectionsRef.current[3] = el)}
//         >
//           <h2>{texts.conclusion.title}</h2>
//           <p>{texts.conclusion.description}</p>
//           <button className="cta-button">{texts.conclusion.button}</button>
//         </section>
//       </div>
//     </>
//   );
// }
