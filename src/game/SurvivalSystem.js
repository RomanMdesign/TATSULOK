export const SAVE_KEY = "tatsulok-survival-v1";

export const defaultSurvival = {
  hp: 100,
  food: 88,
  stam: 100,
  scrap: 0,
  wood: 0,
  cloth: 0,
  slots: ["HATCHET", "TORCH", "", "", "BOW"],
  unlocks: { spear: false, bow: true, smg: false, bed: false },
  safehouse: false
};

export function loadSurvival() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { ...defaultSurvival, slots: [...defaultSurvival.slots] };
    return { ...defaultSurvival, ...JSON.parse(raw) };
  } catch {
    return { ...defaultSurvival, slots: [...defaultSurvival.slots] };
  }
}

export function saveSurvival(state) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch {}
}

export const recipes = [
  { id: "spear", title: "WOODEN SPEAR", need: { wood: 10 }, unlock: "spear" },
  { id: "bow", title: "WOODEN BOW", need: { wood: 16, scrap: 8 }, unlock: "bow" },
  { id: "bed", title: "SLEEPING BAG", need: { cloth: 8, wood: 6 }, unlock: "bed" },
  { id: "smg", title: "MAKESHIFT SMG", need: { scrap: 40, wood: 8 }, unlock: "smg" },
  { id: "med", title: "MEDKIT", need: { scrap: 12 } }
];

export function canCraft(state, recipe) {
  return Object.entries(recipe.need).every(([k, v]) => (state[k] || 0) >= v);
}

export function applyCraft(state, recipe) {
  if (!canCraft(state, recipe)) return { ok: false, state, message: "Kulang ang materials" };
  const next = { ...state, slots: [...state.slots], unlocks: { ...state.unlocks } };
  Object.entries(recipe.need).forEach(([k, v]) => { next[k] -= v; });
  if (recipe.id === "med") next.hp = Math.min(100, next.hp + 25);
  if (recipe.id === "spear") next.slots[2] = "SPEAR";
  if (recipe.id === "bow") next.slots[4] = "BOW";
  if (recipe.id === "smg") { next.slots[3] = "SMG"; next.unlocks.smg = true; }
  if (recipe.id === "bed") next.unlocks.bed = true;
  if (recipe.unlock) next.unlocks[recipe.unlock] = true;
  return { ok: true, state: next, message: recipe.title + " ready" };
}
