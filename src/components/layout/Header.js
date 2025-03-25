'use client';

import { useState, useEffect, useRef } from "react";
import "./Header.css";
import { useScrollContext } from "@/context/ScrollContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHome, faInfoCircle, faEnvelope, faClipboardList, faCube } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import MenuPopup from "./MenuPopup";

const Header = () => {
  const { scrollY } = useScrollContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef(null);

  useEffect(() => {
    setIsScrolled(scrollY > 50);
  }, [scrollY]);

  // Cerrar menú al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cerrar el menú cuando la ruta cambia
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Función para generar la miga de pan estilizada
  const getBreadcrumbItems = () => {
    if (!pathname) return null;
    
    const segments = pathname.split('/').filter(Boolean);
    let accumulatedPath = "";
    
    return (
      <div className="breadcrumb-container">
        <Link href="/" className={`breadcrumb-item ${pathname === '/' ? 'active-breadcrumb' : ''}`}>
          <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
          <span>Home</span>
        </Link>
        {segments.map((segment, index) => {
          accumulatedPath += `/${segment}`;
          const isActive = pathname === accumulatedPath;
          
          return (
            <div key={segment} className="breadcrumb-item-wrapper">
              <span className="breadcrumb-separator">/</span>
              <Link 
                href={accumulatedPath} 
                className={`breadcrumb-item ${isActive ? 'active-breadcrumb' : ''}`}
              >
                {segment.charAt(0).toUpperCase() + segment.slice(1)}
              </Link>
            </div>
          );
        })}
      </div>
    );
  };

  const menuItems = [
    { title: "About", icon: faInfoCircle, path: "/about" },
    { title: "Contact", icon: faEnvelope, path: "/contact" },
    { title: "Forms", icon: faClipboardList, path: "/forms" },
    { title: "3D", icon: faCube, path: "/test" }
  ];

  return (
    <header className={`header ${isScrolled ? "header-scrolled" : ""}`}>
      <div className="header-container">
        <div className="logo">
          <Link href="/">
            <img src="/Logo.png" alt="logo" height={"60px"} />
          </Link>
        </div>
        <nav className="navigation">
          <div className="menu-button-container" ref={menuRef}>
            <button 
              className="menu-button" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon icon={faBars} size="lg" />
            </button>
            
            <MenuPopup 
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              pathname={pathname}
              menuItems={menuItems}
              getBreadcrumbItems={getBreadcrumbItems}
            />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
