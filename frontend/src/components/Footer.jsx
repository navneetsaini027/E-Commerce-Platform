import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import InfoModal from './InfoModal';
import BRAND from '../config/brand';

export default function Footer() {
  const { theme } = useTheme();
  const [activePage, setActivePage] = useState(null);

  const links = {
    'Customer Service': ['FAQ', 'Shipping & Returns', 'Size Guide', 'Contact Us'],
    'About': ['Our Story', 'Sustainability', 'Careers', 'Press'],
    'Legal': ['Privacy Policy', 'Terms & Conditions', 'Cookie Policy'],
  };

  return (
    <>
    <footer style={{ 
      background: theme.colors.text, 
      color: theme.colors.background, 
      padding: 'clamp(40px, 6vw, 72px) clamp(16px, 4vw, 60px) 32px',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 40,
        marginBottom: 56,
      }}>
        {/* Brand */}
        <div>
          <h3 style={{ 
            fontSize: 16, 
            fontWeight: 700, 
            letterSpacing: '0.04em', 
            marginBottom: 16,
            fontFamily: '"Cinzel Decorative", serif',
            color: theme.colors.background,
          }}>
            {BRAND.name}
          </h3>
          <p style={{ 
            fontSize: 13, 
            color: theme.colors.background === '#fff' ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)', 
            lineHeight: 1.7, 
            fontWeight: 300 
          }}>
            Curated fashion for the modern Indian wardrobe. Quality, style, and value — always.
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(links).map(([heading, items]) => (
          <div key={heading}>
            <h4 style={{ 
              fontSize: 10, 
              fontWeight: 700, 
              letterSpacing: '0.16em', 
              textTransform: 'uppercase', 
              marginBottom: 16, 
              color: theme.colors.background === '#fff' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' 
            }}>
              {heading}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {items.map(item => (
                <li key={item}>
                  <a
                    href="#"
                    onClick={e => { e.preventDefault(); setActivePage(item); }}
                    style={{ 
                      fontSize: 13, 
                      color: theme.colors.background === '#fff' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)', 
                      fontWeight: 300, 
                      transition: 'color 0.2s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => e.target.style.color = theme.colors.background}
                    onMouseLeave={e => e.target.style.color = theme.colors.background === '#fff' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{
        borderTop: `1px solid ${theme.colors.background === '#fff' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        paddingTop: 28,
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ 
            fontSize: 12, 
            color: theme.colors.background === '#fff' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', 
            fontWeight: 300,
            letterSpacing: '0.04em',
          }}>
            © {BRAND.year} {BRAND.name}. All rights reserved.
          </p>
          <p style={{ 
            fontSize: 12, 
            color: theme.colors.background === '#fff' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', 
            fontWeight: 300 
          }}>
            Made with love in India
          </p>
        </div>

        {/* Copyright only */}
        <div style={{
          borderTop: `1px solid ${theme.colors.background === '#fff' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          paddingTop: 20,
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: 11, color: theme.colors.background === '#fff' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
            letterSpacing: '0.1em',
          }}>
            © {BRAND.year} {BRAND.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>

    <InfoModal page={activePage} onClose={() => setActivePage(null)} />
    </>
  );
}
