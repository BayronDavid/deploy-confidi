'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTranslation } from '@/config/i18n';
import { homePageConfig } from '@/config/pages/home';
import './Home.css';
import Scene from '@/components/three/Scene';
import ScrollProgress from '@/components/ui/ScrollProgress';

export default function HomeContent() {
  const { locale } = useTranslation();
  const texts = homePageConfig[locale];
  const sectionsRef = useRef([]);

  useEffect(() => {
    const sections = sectionsRef.current;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.to(entry.target, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out'
          });
        }
      });
    }, { threshold: 0.1 });

    sections.forEach(section => {
      if (section) {
        gsap.set(section, { opacity: 0, y: 50 });
        observer.observe(section);
      }
    });

    return () => {
      sections.forEach(section => {
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []);


  return (
    <>
      <Scene />
      <ScrollProgress />

      <div className="scroll-container">
        <section
          className="section intro"
          ref={el => sectionsRef.current[0] = el}
        >
          <h1>{texts.intro.title}</h1>
          <b>{texts.intro.subtitle}</b>
          <span>{texts.intro.description}</span>
          <div className="scroll-down">
            <p>{texts.intro.scrollText}</p>
            <span className="arrow">↓</span>
          </div>
        </section>

        <section
          className="section content"
          ref={el => sectionsRef.current[1] = el}
        >
          <div className="content-wrapper">
            <h2>{texts.content.title}</h2>
            <p>{texts.content.description}</p>
          </div>
        </section>

        <section
          className="section features"
          ref={el => sectionsRef.current[2] = el}
        >
          <div className="content-wrapper">
            <h2>{texts.features.title}</h2>
            <div className="features-grid">
              {texts.features.items.map((feature, index) => (
                <div key={index} className="feature">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="section conclusion"
          ref={el => sectionsRef.current[3] = el}
        >
          <div className="content-wrapper">
            <h2>{texts.conclusion.title}</h2>
            <p>{texts.conclusion.description}</p>
            <button className="cta-button">
              {texts.conclusion.button}
            </button>
          </div>
        </section>
      </div>
    </>
  );

};
