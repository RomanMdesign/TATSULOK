export const FACTIONS = {
  PANGINOON: { name: 'PANGINOON', color: '#e53e3e', description: 'Mataas na antas ng kapangyarihan, yaman, at kontrol.' },
  MALAKAS: { name: 'MALAKAS', color: '#dd6b20', description: 'Puwersang nagbabago ng tadhana at direksiyon ng laban.' },
  MABUTI: { name: 'MABUTI', color: '#319795', description: 'Puso, isip, at kabutihan laban sa sistemang bumabagsak.' }
};

export const CHARACTERS = [
  {
    id: 'peyudo',
    name: 'Peyudo',
    faction: 'PANGINOON',
    role: 'Pangunahing puwersa ng Panginoon',
    power: 'Bilis, yaman, at impluwensiya',
    symbol: 'Mataas na posisyon sa Tatsulok',
    description: 'Mabilis, mayaman, tanyag, at may hawak sa sistema.',
    image: '/assets/character-01.jpg'
  },
  {
    id: 'misteryo',
    name: 'Misteryo',
    faction: 'PANGINOON',
    role: 'Tagatupad ng Madilim na Hustisiya',
    power: 'Pumapatay at kumukuha ng hustisiya',
    symbol: 'Maskara ng Lihim',
    description: 'Hustisya na dumadaan sa dahas at kadiliman.',
    image: '/assets/character-02.jpg'
  },
  {
    id: 'bangag',
    name: 'Bangag',
    faction: 'PANGINOON',
    role: 'Simbolo ng Kurapsyon',
    power: 'Magulong kapangyarihan sa trono',
    symbol: 'Trono ng Sakim',
    description: 'Baliw, makapangyarihan, nakaupo, at mataba.',
    image: '/assets/character-03.jpg'
  },
  {
    id: 'pula',
    name: 'Pula',
    faction: 'PANGINOON',
    role: 'Esekusyruner',
    power: 'Kamay na bakal at sinulid na pumupunit',
    symbol: 'Sinulid ng Tadhana',
    description: 'May kamay na bakal at mga sinulid na pumupunit.',
    image: '/assets/character-04.jpg'
  },
  {
    id: 'tanikala',
    name: 'Tanikala',
    faction: 'PANGINOON',
    role: 'Tagasunod',
    power: 'Pang-aalipin at pagbubuklod sa sistema',
    symbol: 'Guintong Tanikala',
    description: 'Tauhan ng Panginoon na nagpapanatili ng kadena.',
    image: '/assets/character-05.jpg'
  },
  {
    id: 'presyo',
    name: 'Presyo',
    faction: 'MALAKAS',
    role: 'Manipulador ng Isip',
    power: 'Hipnotismo at Panlilinlang',
    symbol: 'Mata ng Salapi',
    description: 'Gumagamit ng hipnotismo upang baguhin ang laban.',
    image: '/assets/character-06.jpg'
  },
  {
    id: 'pintuan',
    name: 'Pintuan',
    faction: 'MALAKAS',
    role: 'Trangkahan ng Tadhana',
    power: 'Pagmanipula ng Tadhana',
    symbol: 'Susi ng Kapalaran',
    description: 'Trangkahan na maaaring magmanipula ng tadhana.',
    image: '/assets/character-07.jpg'
  },
  {
    id: 'ling',
    name: 'Ling',
    faction: 'MABUTI',
    role: 'Tagapagpagaling',
    power: 'Paggaling at Panunumbalik',
    symbol: 'Ilaw sa Dilim',
    description: 'Naggagamot sa mga sugat ng lipunan.',
    image: '/assets/character-08.jpg'
  },
  {
    id: 'batid',
    name: 'Batid',
    faction: 'MABUTI',
    role: 'Edukasyon at Katotohanan',
    power: 'Karunungan at Kamalayan',
    symbol: 'Bukas na Libro',
    description: 'Kumakatawan sa edukasyon at kaalaman.',
    image: '/assets/character-09.jpg'
  },
  {
    id: 'tisa',
    name: 'Tisa',
    faction: 'MABUTI',
    role: 'Pagtatanim at Kaunlaran',
    power: 'Paglinang ng Lupa at Pag-asa',
    symbol: 'Usa at Binhi',
    description: 'Kumakatawan sa pagtatanim at buhay.',
    image: '/assets/character-10.jpg'
  },
  {
    id: 'subalit',
    name: 'Subalit',
    faction: 'MABUTI',
    role: 'Lider ng Paninindigan',
    power: 'Puso, Isip, at Kabutihan',
    symbol: 'Kalasag ng Katwiran',
    description: 'Lumalaban batay sa puso, isip, at kabutihan.',
    image: '/assets/character-11.jpg'
  }
];
