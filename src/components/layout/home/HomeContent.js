'use client';
import Scene from '@/components/three/Scene';
import ScrollProgress from '@/components/ui/ScrollProgress';
import React, { useEffect, useRef } from 'react'
import { gsap } from "gsap";
import './Home.css';

function HomeContent() {
  const sectionsRef = useRef([]);

  useEffect(() => {
    const sections = sectionsRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(entry.target, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((section) => {
      if (section) {
        gsap.set(section, { opacity: 0, y: 50 });
        observer.observe(section);
      }
    });

    return () => {
      sections.forEach((section) => {
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
          ref={(el) => (sectionsRef.current[0] = el)}
        >
          <h1>CONFIDI TRENTINO IMPRESE</h1>
          <b>Hacemos que tu empresa acceda al crédito que necesita para crecer</b>
          <span>Las grandes ideas merecen ser realizadas. CTI te apoya para transformar tus proyectos en realidad.</span>
          <div className="scroll-down">
            <p>Scroll Down</p>
            <span className="arrow">↓</span>
          </div>
        </section>

        <section
          className="section content"
          ref={(el) => (sectionsRef.current[1] = el)}
        >
          <div className="content-wrapper">
            <h2>Section Title</h2>
            <p>Generic content for this section.</p>
          </div>
        </section>

        <section
          className="section features"
          ref={(el) => (sectionsRef.current[2] = el)}
        >
          <div className="content-wrapper">
            <h2>Features</h2>
            <div className="features-grid">
              <div className="feature">
                <h3>Feature 1</h3>
                <p>Description for feature 1</p>
              </div>
              <div className="feature">
                <h3>Feature 2</h3>
                <p>Description for feature 2</p>
              </div>
              <div className="feature">
                <h3>Feature 3</h3>
                <p>Description for feature 3</p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="section conclusion"
          ref={(el) => (sectionsRef.current[3] = el)}
        >
          <div className="content-wrapper">
            <h2>Conclusion</h2>
            <p>Summary or call to action.</p>
            <button className="cta-button">Learn More</button>
          </div>
        </section>
      </div>
    </>
  );
}

export default HomeContent;