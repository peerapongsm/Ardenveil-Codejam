/**
 * Quest registry — metadata for every available adventure.
 *
 * Each entry is keyed by questId and contains display metadata plus
 * a lazy loader that returns the scene map for that quest.
 *
 * Adding a new quest:
 *   1. Create src/data/scenes_<id>.js exporting a SCENES object.
 *   2. Add an entry here referencing it.
 *
 * @module quests
 */

import { SCENES as CHROMATIC_SCENES } from './scenes.js'
import { SCENES as EMBER_SCENES }     from './scenes_ember.js'

/** @typedef {{ questId: string, title: string, subtitle: string, region: string, regionIcon: string, difficulty: string, estimatedTime: string, description: string, icon: string, art: string, scenes: Object, startScene: string }} QuestMeta */

/** @type {QuestMeta[]} */
export const QUESTS = [
  {
    questId:       'chromatic',
    title:         'The Chromatic Seal',
    subtitle:      'Quest I',
    region:        'Eryndor & Beyond',
    regionIcon:    '🏰',
    difficulty:    'Moderate',
    estimatedTime: '~1 hour',
    description:   'Five ancient dragons. One stolen artifact. The Chromatic Seal has kept the great dragons bound to their territories since the age of legend. Three nights ago, it was stolen — and the dragons are stirring.',
    icon:          '🐉',
    art:           '  ·  *  ·  *  ·\n~  SEAL OF FIVE  ~\n  ·  *  ·  *  ·',
    scenes:        CHROMATIC_SCENES,
    startScene:    'title',
  },
  {
    questId:       'ember',
    title:         'The Ember Crown of Kundorath',
    subtitle:      'Quest II',
    region:        'Kundorath — The Forge Kingdom',
    regionIcon:    '🌋',
    difficulty:    'Challenging',
    estimatedTime: '~1 hour',
    description:   'The ancient Ember Crown — channeler of volcanic fire, heartbeat of a dwarven kingdom — has vanished from its sacred vault. The forges of Kundorath stand cold. Three suspects. One truth. An adventure in fire and iron.',
    icon:          '🔥',
    art:           '  ⚒  *  ⚒  *  ⚒\n~  FORGE & FLAME  ~\n  ⚒  *  ⚒  *  ⚒',
    scenes:        EMBER_SCENES,
    startScene:    'ember_title',
  },
]

/**
 * Look up a quest by its questId.
 * @param {string} questId
 * @returns {QuestMeta | undefined}
 */
export function getQuest(questId) {
  return QUESTS.find(q => q.questId === questId)
}
