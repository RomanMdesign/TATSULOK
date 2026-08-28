export const MISSIONS = [
  {
    id: 'mission_01',
    title: 'MISYON 01: ANG UNANG PAGSULAT',
    description: 'Tuklasin ang ugat ng krisis sa pampublikong pasilidad.',
    objectives: [
      {
        id: 'm1_obj1',
        title: 'Pumunta sa Evacuation Center',
        location: { x: 0, z: -25 },
        isInterior: false,
        text: 'May mga residenteng stranded dahil sa baha. Ano ang iyong gagawin?',
        choices: [
          { label: 'TUMULONG SA PAGSULAT NG TALAAN', consequence: 'MABUTI', text: 'Nagtala ka ng mga pamilyang kailangan ng tulong.' },
          { label: 'MAGHANAP NG EBIDENSYA NG ANOMALYA', consequence: 'SECRET', text: 'Nakitang kulang ang naipamahaging ayuda.' }
        ]
      },
      {
        id: 'm1_obj2',
        title: 'Pumunta sa City Health Clinic',
        location: { x: 25, z: -10 },
        isInterior: false,
        text: 'Naghahanap ng gamot ang mga tao ngunit nakakandado ang bodega.',
        choices: [
          { label: 'SIRAAN ANG KANDADO AT KUMUHA NG GAMOT', consequence: 'MALAKAS', text: 'Nakuha ang gamot para sa masa ngunit may nasirang ari-arian.' },
          { label: 'KAUSAPIN ANG DOKTOR SA LOOB', consequence: 'MABUTI', text: 'Pumayag ang doktor na maglabas ng emergency supply.' }
        ]
      },
      {
        id: 'm1_obj3',
        title: 'Pumasok sa Municipal Hall (Interior)',
        location: { x: -20, z: -35 },
        isInterior: true, // Makakapasok sa loob
        interiorPos: { x: 0, z: -5 },
        text: 'Nasa loob ka na ng Municipal Hall. May nakatagong vault sa ilalim ng desk.',
        choices: [
          { label: 'BUKSAN ANG VAULT NG PONDO', consequence: 'SECRET', text: 'Nahanap mo ang ledger ng pampublikong badyet!' },
          { label: 'KUMUHA NG PERMIT sa ARCHIVE', consequence: 'MABUTI', text: 'Nakuha mo ang legal na dokumento para sa tulong.' }
        ]
      },
      {
        id: 'm1_obj4',
        title: 'Pumunta sa Broadcast Tower',
        location: { x: -35, z: 10 },
        isInterior: false,
        text: 'Oras na para ihayag ang katotohanan sa buong distrito.',
        choices: [
          { label: 'ISAPUBLIKO ANG NABULGAR NA KATOTOHANAN', consequence: 'MABUTI', text: 'Nalalaman ng lahat ang katotohanan. Kumalat ang pag-asa.' },
          { label: 'IPANIPULA ANG BALITA PARA SA SARILING PAKINABANG', consequence: 'PANGINOON', text: 'Pumabor sa iyo ang resulta ng balita.' }
        ]
      }
    ]
  },
  {
    id: 'mission_02',
    title: 'MISYON 02: ANG BAYAD NG LAKAS',
    description: 'Harapin ang puwersa ng merkado at hipnotismo sa komersyo.',
    objectives: [
      {
        id: 'm2_obj1',
        title: 'Siyasatin ang Central Market',
        location: { x: 15, z: 20 },
        isInterior: false,
        text: 'Masyadong mataas ang presyo ng mga pangunahing bilihin.',
        choices: [
          { label: 'KONTRAHIN ANG MANIPULASYON NG PRESYO', consequence: 'MABUTI', text: 'Nabawasan ang panggigipit sa mga mamimili.' },
          { label: 'MAKISOSYO SA NEGOSYANTE', consequence: 'PANGINOON', text: 'Kumita ka mula sa mataas na presyo.' }
        ]
      },
      {
        id: 'm2_obj2',
        title: 'Pumasok sa Bank Vault (Interior)',
        location: { x: 30, z: -25 },
        isInterior: true,
        interiorPos: { x: 0, z: -5 },
        text: 'Nasa loob ka ng bangko. Nakita mo ang mga pekeng kontrata.',
        choices: [
          { label: 'KUMUHA NG MGA KONTRATA', consequence: 'SECRET', text: 'May hawak ka nang ebidensya laban sa bangko.' },
          { label: 'I-SET OFF ANG ALARMA', consequence: 'MALAKAS', text: 'Nagkaroon ng kaguluhan at nakatakas ka.' }
        ]
      },
      {
        id: 'm2_obj3',
        title: 'Pumunta sa Underground Alley',
        location: { x: -10, z: 30 },
        isInterior: false,
        text: 'Nakatagpo mo ang mga tauhan ni Presyo.',
        choices: [
          { label: 'PUMALAG SA KANILANG PAGHIPNOTISMO', consequence: 'MABUTI', text: 'Napanatili mo ang malinaw na isip.' },
          { label: 'TANGGAPIN ANG KANILANG SUHOL', consequence: 'PANGINOON', text: 'Nakatanggap ka ng pondo ngunit nawalan ng prinsipyo.' }
        ]
      },
      {
        id: 'm2_obj4',
        title: 'Harapin ang Pintuan sa Dulo ng Distrito',
        location: { x: 40, z: 40 },
        isInterior: false,
        text: 'Nakatayo ang malaking trangkahan na nagdedesisyon sa tadhana.',
        choices: [
          { label: 'BUKSAN ANG PINTO TUNGO SA KAUNLARAN', consequence: 'MABUTI', text: 'Nagbukas ang bagong daan para sa lahat.' },
          { label: 'SURIIN ANG SULOK AT ISARA ITO', consequence: 'MALAKAS', text: 'Pinalakas mo ang depensa ng distrito.' }
        ]
      }
    ]
  },
  {
    id: 'mission_03',
    title: 'MISYON 03: MGA UYAYI SA DILIM',
    description: 'Ungkatin ang mga lihim sa ilalim ng kapangyarihan ng Panginoon.',
    objectives: [
      {
        id: 'm3_obj1',
        title: 'Maglakad sa Old Plaza',
        location: { x: -30, z: -10 },
        isInterior: false,
        text: 'May lihim na pagtitipon ang mga tauhan ng Panginoon.',
        choices: [
          { label: 'MAGSUOT NG MASKARA AT MAGMANMAN', consequence: 'SECRET', text: 'Narinig mo ang kanilang madilim na plano.' },
          { label: 'GUMAWANG INGAY PARA MABUWAG', consequence: 'MABUTI', text: 'Naglikha ka ng kagalitan at nagkanlong ang mga tao.' }
        ]
      },
      {
        id: 'm3_obj2',
        title: 'Pumasok sa Mansion Headquarters (Interior)',
        location: { x: -40, z: -40 },
        isInterior: true,
        interiorPos: { x: 0, z: -5 },
        text: 'Nasa loob ka ng mansyon ni Bangag. Sobrang marangya ang paligid.',
        choices: [
          { label: 'SURIIN ANG TRONO', consequence: 'PANGINOON', text: 'Naramdaman mo ang matinding tindi ng kapangyarihan.' },
          { label: 'HANAPIN ANG KANDENA NI TANIKALA', consequence: 'MABUTI', text: 'Nahanap mo ang susi para palayain ang mga bihag.' }
        ]
      },
      {
        id: 'm3_obj3',
        title: 'Pumunta sa Steel Factory',
        location: { x: 20, z: 35 },
        isInterior: false,
        text: 'Ginagamit ni Pula ang sinulid ng bakal upang gipitin ang mga manggagawa.',
        choices: [
          { label: 'PUTULIN ANG MGA SINULID', consequence: 'MABUTI', text: 'Nakalaya ang mga manggagawa sa pagkaalipin.' },
          { label: 'SABOTAHIN ANG MGA MAKINA', consequence: 'MALAKAS', text: 'Napatigil ang operasyon ng pabrika.' }
        ]
      },
      {
        id: 'm3_obj4',
        title: 'Magtungo sa Secret Archives',
        location: { x: 0, z: 45 },
        isInterior: false,
        text: 'Dito nakatago ang tunay na kasaysayan ng TATSULOK.',
        choices: [
          { label: 'KOPYAHIN AT IPAMAHAGI ANG MGA DOKUMENTO', consequence: 'MABUTI', text: 'Nabatid ng bayan ang katotohanan.' },
          { label: 'SUNUGIN ANG ARCHIVES PARA WALANG MAKASAMPA', consequence: 'PANGINOON', text: 'Nabaon sa limot ang nakaraan.' }
        ]
      }
    ]
  },
  {
    id: 'mission_04',
    title: 'MISYON 04: BALIKTARIN ANG TATSULOK',
    description: 'Ang huling pagtutuos sa pagitan ng Paninindigan at Kapangyarihan.',
    objectives: [
      {
        id: 'm4_obj1',
        title: 'Pumunta sa Community Farm',
        location: { x: 35, z: -35 },
        isInterior: false,
        text: 'Kailangan ng suporta at pagkain ng mga lumalaban.',
        choices: [
          { label: 'TUMULONG SA PAG-AANI KASAMA NI TISA', consequence: 'MABUTI', text: 'Nagkaroon ng sapat na supply ang komunidad.' },
          { label: 'MAGTAYO NG DEPENSA SA PALIGID', consequence: 'MALAKAS', text: 'Naging ligtas ang sakahan mula sa pag-atake.' }
        ]
      },
      {
        id: 'm4_obj2',
        title: 'Pumasok sa Academy Hall (Interior)',
        location: { x: -15, z: 25 },
        isInterior: true,
        interiorPos: { x: 0, z: -5 },
        text: 'Nasa loob ka ng silid-aklatan kasama si Batid.',
        choices: [
          { label: 'MAGSULAT NG MANIFESTO NG REPORMA', consequence: 'MABUTI', text: 'Naisulat ang bagong konstitusyon ng pag-asa.' },
          { label: 'MAGTAGO NG MGA MAHALAGANG AKLAT', consequence: 'SECRET', text: 'Naipreserba ang karunungan para sa hinaharap.' }
        ]
      },
      {
        id: 'm4_obj3',
        title: 'Pumunta sa Supreme Court Gates',
        location: { x: 0, z: -45 },
        isInterior: false,
        text: 'Nakalinya ang mga tagapagtanggol at mga sundalo ng Panginoon.',
        choices: [
          { label: 'MANGUNA SA MAPAYAPANG PROTESTA', consequence: 'MABUTI', text: 'Nagbago ang isip ng ilang mga guwardiya.' },
          { label: 'GUMAMIT NG LAKAS UPANG BUMUKSAN ANG TARANGKAHAN', consequence: 'MALAKAS', text: 'Pumasok nang pilit ang hukbo sa hukuman.' }
        ]
      },
      {
        id: 'm4_obj4',
        title: 'Harapin ang Tuktok ng Tatsulok',
        location: { x: 0, z: 0 },
        isInterior: false,
        text: 'Nasa mismong gitna ka na ng distrito. Handa ka na bang baliktarin ang Tatsulok?',
        choices: [
          { label: 'BALIKTARIN ANG TATSULOK (IPANALO ANG DEMOKRASYA)', consequence: 'MABUTI', text: 'Nagwagi ang paninindigan ng mamamayan!' },
          { label: 'ANGKININ ANG TRONO NG PANGINOON', consequence: 'PANGINOON', text: 'Ikaw na ang bagong namumuno sa Tatsulok.' }
        ]
      }
    ]
  }
];
