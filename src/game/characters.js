export const characters = [
  {
    id: "peyudo",
    name: "Peyudo",
    faction: "Panginoon",
    role: "Pangunahing puwersa ng Panginoon",
    description: "Mabilis, mayaman, tanyag, at may kapangyarihan.",
    power: 88,
    trust: 34,
    humanity: 28,
    ability: "Influence",
    image: "/assets/character-01.jpg"
  },

  {
    id: "misteryo",
    name: "Misteryo",
    faction: "Panginoon",
    role: "Hustisya na dumadaan sa dahas",
    description: "Pumapatay at kumukuha ng hustisiya.",
    power: 62,
    trust: 38,
    humanity: 43,
    ability: "Shadow Strike",
    image: "/assets/character-02.jpg"
  },

  {
    id: "bangag",
    name: "Bangag",
    faction: "Panginoon",
    role: "Makapangyarihang pinuno",
    description: "Baliw, makapangyarihan, nakaupo, at mataba.",
    power: 94,
    trust: 25,
    humanity: 21,
    ability: "Authority",
    image: "/assets/character-03.jpg"
  },

  {
    id: "pula",
    name: "Pula",
    faction: "Panginoon",
    role: "Kamay na bakal",
    description: "May kamay na bakal at mga sinulid na pumupunit.",
    power: 82,
    trust: 31,
    humanity: 19,
    ability: "Control",
    image: "/assets/character-04.jpg"
  },

  {
    id: "tanikala",
    name: "Tanikala",
    faction: "Panginoon",
    role: "Tauhan ng Panginoon",
    description: "Kumakatawan sa pagkakadena at kontrol.",
    power: 76,
    trust: 27,
    humanity: 16,
    ability: "Bind",
    image: "/assets/character-05.jpg"
  },

  {
    id: "presyo",
    name: "Presyo",
    faction: "Malakas",
    role: "Manipulator",
    description: "Gumagamit ng hipnotismo.",
    power: 79,
    trust: 41,
    humanity: 37,
    ability: "Hypnotism",
    image: "/assets/character-06.jpg"
  },

  {
    id: "pintuan",
    name: "Pintuan",
    faction: "Malakas",
    role: "Tagapagbago ng tadhana",
    description: "Trangkahan na maaaring magmanipula ng tadhana.",
    power: 73,
    trust: 48,
    humanity: 51,
    ability: "Manipulate Fate",
    image: "/assets/character-07.jpg"
  },

  {
    id: "ling",
    name: "Ling",
    faction: "Mabuti",
    role: "Tagapagpagaling",
    description: "Gumagamot sa mga nasasaktan.",
    power: 51,
    trust: 84,
    humanity: 91,
    ability: "Heal",
    image: "/assets/character-08.jpg"
  },

  {
    id: "batid",
    name: "Batid",
    faction: "Mabuti",
    role: "Tagapagturo",
    description: "Kumakatawan sa edukasyon.",
    power: 46,
    trust: 87,
    humanity: 89,
    ability: "Knowledge",
    image: "/assets/character-09.jpg"
  },

  {
    id: "tisa",
    name: "Tisa",
    faction: "Mabuti",
    role: "Tagapagtanim",
    description: "Kumakatawan sa pagtatanim at pagkain.",
    power: 42,
    trust: 90,
    humanity: 94,
    ability: "Growth",
    image: "/assets/character-10.jpg"
  },

  {
    id: "subalit",
    name: "Subalit",
    faction: "Mabuti",
    role: "Tagapagtanggol",
    description: "Lumlalaban batay sa puso, isip, at kabutihan.",
    power: 68,
    trust: 82,
    humanity: 88,
    ability: "Resolve",
    image: "/assets/character-11.jpg"
  }
];

export function getCharacter(id) {
  return characters.find((character) => character.id === id);
}
