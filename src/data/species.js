/**
 * @typedef {Object} Species
 * @property {string} name
 * @property {string} icon
 * @property {string} trait
 * @property {number} bonus   - combat dice bonus
 * @property {number} maxHp
 * @property {string} desc
 */

/** @type {Record<string, Species>} */
export const SPECIES = {
  human: {
    name: 'Human', icon: '⚔️',
    trait: 'Silver Tongue', bonus: 0, maxHp: 5,
    desc: 'Your charm opens doors others cannot. Earn bonus gold and unlock persuasion options others miss.'
  },
  elf: {
    name: 'High Elf', icon: '✨',
    trait: 'Arcane Sense', bonus: 1, maxHp: 5,
    desc: 'You sense magical artifacts instinctively and can read texts others find indecipherable.'
  },
  dragonborn: {
    name: 'Dragonborn', icon: '🐉',
    trait: "Dragon's Blood", bonus: 1, maxHp: 5,
    desc: 'Fire cannot harm you easily, and cultists of the flame think twice before challenging you.'
  },
  tiefling: {
    name: 'Tiefling', icon: '😈',
    trait: 'Hellsight', bonus: 0, maxHp: 5,
    desc: 'You see what others cannot, and the Sandshade Brotherhood has heard of your kind before.'
  },
  goliath: {
    name: 'Goliath', icon: '🏔️',
    trait: 'Ironhide', bonus: 2, maxHp: 7,
    desc: 'Your constitution is legendary. You begin with more health and hit harder in every fight.'
  },
}

/** @param {string} speciesKey @returns {number} */
export const getSpeciesBonus = (speciesKey) =>
  speciesKey ? (SPECIES[speciesKey]?.bonus ?? 0) : 0
