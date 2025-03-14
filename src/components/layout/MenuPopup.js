'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faHome, faLanguage } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import LanguageSelector from "@/components/ui/LanguageSelector";
import "./MenuPopup.css";

const MenuPopup = ({ isOpen, onClose, pathname, menuItems, getBreadcrumbItems }) => {
  if (!isOpen) return null;

  return (
    <div className="menu-popup">
      <div className="popup-header">
        <h3>Navigation</h3>
        <button 
          className="close-button"
          onClick={onClose}
          aria-label="Close menu"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      
      <div className="breadcrumb-section">
        <h4>You are here:</h4>
        {getBreadcrumbItems()}
      </div>
      
      <div className="menu-divider"></div>
      
      <ul className="menu-list">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <li key={item.title} className={isActive ? 'active' : ''}>
              <Link 
                href={item.path} 
                className={`menu-link ${isActive ? 'active-link' : ''}`}
                onClick={onClose}
              >
                <FontAwesomeIcon 
                  icon={item.icon} 
                  className={`menu-icon ${isActive ? 'active-icon' : ''}`} 
                />
                <span>{item.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      
      <div className="menu-divider"></div>
      
      <div className="language-section">
        <div className="language-header">
          <FontAwesomeIcon icon={faLanguage} className="language-icon" />
          <h4>Select Language</h4>
        </div>
        <LanguageSelector />
      </div>
    </div>
  );
};

export default MenuPopup;
