import React, { useState, useEffect } from 'react';

// Character Data base sa slides mo
const CHARACTERS = [
  { id: 'peyudo', name: 'PEYUDO', faction: 'PANGINOON', role: 'Pangunahing puwersa ng Panginoon', power: 'bilis, yaman, impluwensiya', symbol: 'mataas na posisyon sa tatsulok', desc: 'Mabilis, mayaman, tanyag, at may kapangyarihan.' },
  { id: 'misteryo', name: 'MISTERYO', faction: 'PANGINOON', role: 'Tagapagtanggol sa dilim', power: 'pumapatay at kumukuha ng hustisiya', symbol: 'misteryosong balabal', desc: 'Hustisya na dumadaan sa dahas.' },
  { id: 'bangag', name: 'BANGAG', faction: 'PANGINOON', role: 'Hari ng Trono', power: 'baliw, makapangyarihan', symbol: 'trono ng kapangyarihan', desc: 'Magulong kapangyarihang nakaupo sa trono.' },
  { id: 'pula', name: 'PULA', faction: 'PANGINOON', role: 'Kamay na Bakal', power: 'mga sinulid na pumupunit', symbol: 'sinulid ng tadhana', desc: 'Kamay na bakal at mga sinulid na pumupunit.' },
  { id: 'tanikala', name: 'TANIKALA', faction: 'PANGINOON', role: 'Tauhan ng Panginoon', power: 'tagasunod at tagabuklod', symbol: 'mga kadena', desc: 'Tagasunod na nagbubuklod sa sistema.' },
  { id: 'presyo', name: 'PRESYO', faction: 'MALAKAS', role: 'Nangmamanipula', power: 'hipnotismo at yaman', symbol: 'pera at kontrata', desc: 'Gumagamit ng hipnotismo para baguhin ang direksyon ng laban.' },
  { id: 'pintuan', name: 'PINTUAN', faction: 'MALAKAS', role: 'Trangkahan ng Tadhana', power: 'pagmanipula ng tadhana', symbol: 'misteryosong pinto', desc: 'Trangkahan na maaaring magmanipula ng tadhana.' },
  { id: 'ling', name: 'LING', faction: 'MABUTI', role: 'Tagapagpagaling', power: 'kabutihan at paggaling', symbol: 'liwanag sa dilim', desc: 'Puso at kabutihan laban sa sistemang bumabagsak.' },
  { id: 'batid', name: 'BATID', faction: 'MABUTI', role: 'Edukasyon', power: 'kaalaman at isip', symbol: 'aklat ng karunungan', desc: 'Kumakatawan sa edukasyon at dunong.' },
  { id: 'tisa', name: 'TISA', faction: 'MABUTI', role: 'Magsasaka', power: 'pagtatanim at buhay', symbol: 'lupa at halaman', desc: 'Kumakatawan sa pagtatanim at pagpupunyagi.' }
];

export default function App() {
  const [slide, setSlide] = useState(1); // 1 to 10 Slides
  const [playerName, setPlayerName] = useState(localStorage.getItem('tatsulok_name') || '');
  const [selectedChar, setSelectedChar] = useState(CHARACTERS[0]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (playerName) localStorage.setItem('tatsulok_name', playerName);
  }, [playerName]);

  // General Styles
  const bgStyle = {
    backgroundColor: '#0d0f12',
    color: '#ffffff',
    fontFamily: 'sans-serif',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '40px',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden'
  };

  const titleGold = { color: '#d4af37', fontWeight: 'bold' };
  const titleRed = { color: '#e63946', fontWeight: 'bold' };

  return (
    <div style={bgStyle}>
      {/* Header Tag */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #2a2d32', pb: '10px' }}>
        <span style={{ fontSize: '12px', color: '#d4af37', letterSpacing: '2px' }}>
          {slide === 1 && "■ BITAWAN MO ANG IYONG SALAMPUWIT"}
          {slide === 2 && "KASALAN AY KASALANAN"}
          {slide === 3 && "THE ENTRY POINT / LOBBY"}
          {slide >= 4 && slide <= 8 && `FACTION OVERVIEW / DOSSIER`}
          {slide === 9 && "PUZZLE GAME FLOW / SELECTION"}
          {slide === 10 && "FINAL LOBBY STATE"}
        </span>
        <span style={{ fontSize: '14px', color: '#888' }}>{String(slide).padStart(2, '0')} / 10</span>
      </div>

      {/* SLIDE 1: COVER */}
      {slide === 1 && (
        <div style={{ textAlign: 'center', my: 'auto' }}>
          <h1 style={{ fontSize: '80px', margin: '10px 0', letterSpacing: '8px', fontWeight: '900' }}>TATSULOK</h1>
          <p style={{ fontSize: '20px', color: '#aaa', letterSpacing: '4px' }}>Baliktarin ang tatsulok</p>
          <div style={{ marginTop: '60px', textAlign: 'left', maxWidth: '500px' }}>
            <h3 style={{ ...titleGold, fontSize: '24px' }}>Mabuhay o Mamatay?</h3>
            <p style={{ color: '#ccc', lineHeight: '1.6' }}>
              Ang larong nagtatanong, sumasagot at humahanap ng digmaan sa bangko ng mga may kapangyarihan.
            </p>
          </div>
        </div>
      )}

      {/* SLIDE 2: ANG MUNDO NG TATSULOK */}
      {slide === 2 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '48px', margin: '0' }}>ANG MUNDO NG <span style={titleRed}>TATSULOK</span></h2>
          <p style={{ color: '#888', marginBottom: '40px' }}>Tatlong panig. Isang misteryo. Bawat lakas ay may kapalit.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <div>
              <h3 style={{ ...titleGold, fontSize: '20px' }}>TATLONG PANIG NG LIPUNAN</h3>
              <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                <div style={{ border: '1px solid #d4af37', padding: '15px', flex: 1 }}>
                  <h4 style={titleGold}>PANGINOON</h4>
                  <p style={{ fontSize: '12px', color: '#aaa' }}>Kapangyarihan at kontrol</p>
                </div>
                <div style={{ border: '1px solid #e63946', padding: '15px', flex: 1 }}>
                  <h4 style={titleRed}>MALAKAS</h4>
                  <p style={{ fontSize: '12px', color: '#aaa' }}>Puwsersang nagbabago ng tadhana</p>
                </div>
                <div style={{ border: '1px solid #2a9d8f', padding: '15px', flex: 1 }}>
                  <h4 style={{ color: '#2a9d8f' }}>MABUTI</h4>
                  <p style={{ fontSize: '12px', color: '#aaa' }}>Puso, isip, at kabutihan</p>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ ...titleGold, fontSize: '20px' }}>MGA TEMANG HAHARAPIN</h3>
              <ul style={{ color: '#ccc', lineHeight: '2' }}>
                <li>▪ Baha</li>
                <li>▪ Lindol</li>
                <li>▪ Kurapsyon</li>
                <li>▪ Pang-aalipin</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE 3: LOBBY INPUT */}
      {slide === 3 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '600px' }}>
          <h2 style={{ fontSize: '48px', margin: '0' }}>LOBBY <span style={titleRed}>/ MENU</span></h2>
          <div style={{ margin: '30px 0' }}>
            <label style={{ display: 'block', color: '#d4af37', marginBottom: '10px' }}>IPASOK ANG IYONG PANGALAN:</label>
            <input 
              type="text" 
              value={playerName} 
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Pangalan ng Manlalaro"
              style={{ width: '100%', padding: '15px', backgroundColor: '#16191e', border: '1px solid #d4af37', color: '#fff', fontSize: '18px' }}
            />
          </div>
          <ul style={{ color: '#aaa', lineHeight: '2', fontSize: '14px' }}>
            <li>▪ Maglagay ng pangalan para makapasok</li>
            <li>▪ Maaaring i-save ang laro at progreso (Progress Saved Locally)</li>
            <li>▪ Pindutin ang simula para simulan ang misyon</li>
          </ul>
        </div>
      )}

      {/* SLIDE 4 to 8: DOSSIER & FACTIONS */}
      {slide >= 4 && slide <= 8 && (
        <div style={{ flex: 1, display: 'flex', gap: '40px', alignItems: 'center' }}>
          <div style={{ width: '300px', height: '400px', border: '2px solid #d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#16191e' }}>
            <span style={{ color: '#555', fontSize: '14px' }}>[ PORTRAIT: {selectedChar.name} ]</span>
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ color: '#888', letterSpacing: '2px' }}>{selectedChar.faction} / CHARACTER DOSSIER</span>
            <h2 style={{ fontSize: '56px', margin: '10px 0', ...titleGold }}>{selectedChar.name}</h2>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>{selectedChar.desc}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '40px', borderTop: '1px solid #2a2d32', paddingTop: '20px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#888' }}>PAPEL</span>
                <p style={{ fontSize: '14px', margin: '5px 0' }}>{selectedChar.role}</p>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#888' }}>LAKAS</span>
                <p style={{ fontSize: '14px', margin: '5px 0' }}>{selectedChar.power}</p>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#888' }}>SIMBOLO</span>
                <p style={{ fontSize: '14px', margin: '5px 0' }}>{selectedChar.symbol}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE 9: CHARACTER SELECTION GRID */}
      {slide === 9 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '36px', ...titleGold, margin: '0 0 10px 0' }}>PILIIN ANG IYONG KARAKTER</h2>
          <p style={{ color: '#888', marginBottom: '20px' }}>Libre ang lahat ng karakter at puwedeng gamitin.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px' }}>
            {CHARACTERS.map((char) => (
              <div 
                key={char.id}
                onClick={() => setSelectedChar(char)}
                style={{
                  border: selectedChar.id === char.id ? '2px solid #d4af37' : '1px solid #2a2d32',
                  padding: '15px',
                  backgroundColor: '#16191e',
                  cursor: 'pointer'
                }}
              >
                <h4 style={{ margin: '0 0 5px 0', color: char.faction === 'PANGINOON' ? '#d4af37' : char.faction === 'MALAKAS' ? '#e63946' : '#2a9d8f' }}>{char.name}</h4>
                <span style={{ fontSize: '10px', color: '#888' }}>{char.faction}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SLIDE 10: FINAL READY LOBBY */}
      {slide === 10 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '56px', margin: '0', ...titleRed }}>START. READY.<br/>HARAPIN ANG MISYON.</h1>
          <div style={{ display: 'flex', gap: '30px', margin: '30px 0' }}>
            <button 
              onClick={() => setIsReady(!isReady)} 
              style={{ padding: '15px 30px', backgroundColor: isReady ? '#2a9d8f' : '#e63946', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {isReady ? 'READY ✓' : 'MAG-READY'}
            </button>
          </div>
          <p style={{ fontSize: '18px', ...titleGold, marginTop: '40px' }}>
            ANG TATSULOK AY HINDI LANG LABAN NG LAKAS — LABAN DIN ITO NG PANININDIGAN.
          </p>
        </div>
      )}

      {/* Slide Controls Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #2a2d32', paddingTop: '15px' }}>
        <button 
          disabled={slide === 1} 
          onClick={() => setSlide(slide - 1)}
          style={{ padding: '8px 20px', backgroundColor: '#16191e', color: '#fff', border: '1px solid #444', cursor: slide === 1 ? 'not-allowed' : 'pointer' }}
        >
          ← PREV SLIDE
        </button>
        
        <span style={{ fontSize: '12px', color: '#888' }}>
          PLAYER: <strong style={{ color: '#fff' }}>{playerName || '---'}</strong> | SELECTED: <strong style={{ color: '#d4af37' }}>{selectedChar.name}</strong>
        </span>

        <button 
          disabled={slide === 10} 
          onClick={() => setSlide(slide + 1)}
          style={{ padding: '8px 20px', backgroundColor: '#d4af37', color: '#000', border: 'none', fontWeight: 'bold', cursor: slide === 10 ? 'not-allowed' : 'pointer' }}
        >
          NEXT SLIDE →
        </button>
      </div>
    </div>
  );
}
