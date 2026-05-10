/**
 * Scene graph for "The Ember Crown of Kundorath"
 *
 * Setting: Kundorath — the volcanic dwarf kingdom carved into a mountain,
 * whose legendary forges are powered by an ancient magical artifact.
 *
 * Story: The Ember Crown has been stolen. The forges are cold. Three
 * suspects, three investigation paths, and a hidden truth that changes
 * everything.
 *
 * Scene schema follows the same format as scenes.js (the Chromatic Seal).
 *
 * @typedef {import('./gameReducer').GameState} GameState
 */

export const SCENES = {

// ══════════════════════════════════════════════════════════
// OPENING
// ══════════════════════════════════════════════════════════

ember_title: {
  loc: '', icon: '',
  title: 'The Ember Crown of Kundorath',
  image: '🔥',
  art: '  ⚒  *  ·  *  ⚒\n~  EMBER CROWN  ~\n  ⚒  *  ·  *  ⚒',
  text: [
    '<em>An Ardenveil Choice Adventure</em>',
    'The forges of <strong>Kundorath</strong> have gone cold for the first time in three centuries.',
    'The ancient <strong>Ember Crown</strong> — channeler of volcanic fire, heartbeat of an entire kingdom — has vanished from its sacred vault.',
    'High Lord Brannakk has sent desperate word to the Adventure Guild. You answered the call.',
    '<em>Three suspects. One truth. And something buried beneath a thousand years of dwarven history that no one was supposed to find.</em>',
  ],
  choices: [
    { text: 'Answer the Call', next: 'ember_species' },
  ],
},

ember_species: {
  loc: 'The Adventure Guild, Eryndor', icon: '⚔️',
  title: 'Who Are You?',
  image: '🎭',
  art: '  ·  *  ·  *  ·\n~  YOUR PATH  ~\n  ·  *  ·  *  ·',
  text: [
    'Before you depart for Kundorath, you prepare for what lies ahead.',
    'The road to a volcanic dwarf-kingdom demands more than courage. <em>Who are you, and what do you bring to this fire?</em>',
  ],
  speciesSelect: true,
  speciesNext: 'ember_approach',
},

// ══════════════════════════════════════════════════════════
// ACT 1 — ARRIVAL
// ══════════════════════════════════════════════════════════

ember_approach: {
  loc: 'The Gates of Kundorath', icon: '🌋',
  title: 'Gates of the Forge-Kingdom',
  image: '🏔️',
  art: '  ≋  ≋  🌋  ≋  ≋\n  THE VOLCANIC GATES\n  ≋  ≋  🌋  ≋  ≋',
  text: [
    'The air grows thick with sulfur as Kundorath rises before you — a city carved into the living rock of a volcano. Rivers of magma glow through great iron channels built by dwarf engineers centuries ago.',
    'But something is deeply wrong. The great forges that normally thunder day and night are <strong>silent</strong>. No smoke billows. No hammer rings. The streets are lined with idle smiths, their faces grey with worry.',
    'A guard at the gate recognizes the Adventure Guild emblem and waves you through immediately. "High Lord Brannakk is waiting," he mutters. "Third day without fire. The food stores won\'t hold much longer without trade."',
  ],
  choices: [
    { text: 'Ask the guard what happened', next: 'ember_guard_talk' },
    { text: 'Head straight to the throne room', next: 'ember_throne' },
  ],
},

ember_guard_talk: {
  loc: 'Kundorath City Gates', icon: '🏰',
  title: 'A Kingdom in Crisis',
  image: '😰',
  art: '',
  text: [
    'The guard\'s voice drops. "Three nights ago, the Ember Crown vanished from the Sacred Vault. We\'ve kept it for over a thousand years — it channels the volcano\'s heat directly into the forge-channels. It doesn\'t just warm the forges. <em>It is</em> the forges."',
    '"Without it, the volcano\'s heat dissipates. No Crown, no heat. No heat, no smithing. No smithing, no trade. And our food comes from Eryndor through trade contracts — which we cannot fulfil without steel to sell."',
    'He glances around nervously. "High Lord Brannakk suspects treachery. He\'s not wrong. But <em>who?</em> That\'s the question killing us."',
  ],
  choices: [
    { text: 'Thank the guard and head to the throne room', next: 'ember_throne' },
  ],
},

// ══════════════════════════════════════════════════════════
// ACT 1 — THE THRONE ROOM
// ══════════════════════════════════════════════════════════

ember_throne: {
  loc: 'The Throne of Hammers, Kundorath', icon: '👑',
  title: 'High Lord Brannakk',
  image: '⚒️',
  art: '  ⚒  FORGE THRONE  ⚒\n    OF KUNDORATH\n  ⚒  ═══════════  ⚒',
  text: [
    'High Lord Brannakk is a dwarf of immense stature — red-bearded and iron-ringed, built like the mountain itself. He stands before a cold, dark throne room. The great fire-sconces are unlit; torches hastily placed to compensate.',
    '"Welcome, adventurer." His voice is granite-heavy. "Three nights ago, the <strong>Ember Crown</strong> was taken from our Sacred Vault. The door shows no forced entry. No alarm was triggered. It simply vanished."',
    '"We have possibilities," he continues. "But possibilities don\'t light forges. I offer 100 gold and a weapon from our greatest smith\'s final collection — to whoever returns the Crown."',
  ],
  choices: [
    {
      text: 'Accept and ask about suspects',
      next: 'ember_suspects',
      action: d => { d.flags.quest_accepted = true },
    },
    {
      text: 'Accept and examine the vault immediately',
      next: 'ember_vault',
      action: d => { d.flags.quest_accepted = true },
    },
    {
      text: '<em>(Human — Silver Tongue)</em> Negotiate for more gold',
      condition: s => s.species === 'human',
      req: 'Human — Silver Tongue',
      next: 'ember_negotiate',
      action: d => { d.flags.quest_accepted = true },
    },
  ],
},

ember_negotiate: {
  loc: 'The Throne of Hammers, Kundorath', icon: '👑',
  title: 'A Better Deal',
  image: '💰',
  art: '',
  text: [
    'You hold Brannakk\'s gaze steadily. "High Lord, your own investigators have had three days and found nothing. I\'m your best chance. I\'ll need 150 gold."',
    'A long silence. His advisors shift uncomfortably.',
    'Then Brannakk lets out a short bark of laughter — the sound of stone splitting. "Dwarven nerve on a surface-walker. Fine. 150 gold if you return the Crown within two days. Now — let me tell you what we know."',
  ],
  onEnter: d => { d.gold += 50; d.flags.negotiated = true },
  choices: [
    { text: 'Listen to the briefing', next: 'ember_suspects' },
  ],
},

ember_suspects: {
  loc: 'The Throne of Hammers, Kundorath', icon: '👑',
  title: 'Three Shadows',
  image: '🔍',
  art: '',
  text: [
    'Brannakk lowers his voice. "We have three theories."',
    '"First — our scouts found <strong>scorch marks near the vault</strong> that don\'t match our forges. Wild fire, living fire. Something drew the Crown into the deep mines."',
    '"Second — a coin was found near the vault entrance. Stamped with the <strong>mark of the Sandshade Brotherhood</strong>. Surface criminals extending their reach into dwarven territory."',
    '"Third — the vault lock was opened with an enchanted key. Only two people hold such a key: myself, and <strong>Thane Durrak of House Ironvault</strong>." His fist tightens. "His House has been struggling financially."',
    '"Any of them could be the thief. I leave the investigation to you."',
  ],
  onEnter: d => { d.flags.suspects_briefed = true },
  choices: [
    { text: 'Examine the Sacred Vault first', next: 'ember_vault' },
  ],
},

// ══════════════════════════════════════════════════════════
// THE VAULT INVESTIGATION
// ══════════════════════════════════════════════════════════

ember_vault: {
  loc: 'The Sacred Vault, Kundorath', icon: '🔐',
  title: 'The Sacred Vault',
  image: '🕯️',
  art: '  ━━━━━━━━━━━━━━━\n  THE SACRED VAULT\n  ━━━━━━━━━━━━━━━',
  text: [
    'The Sacred Vault is a circular chamber carved deep into the mountain, its walls inlaid with ancient dwarven runes. In the center stands an empty altar — a perfect circular indentation where the Ember Crown rested for a thousand years.',
    'The stone around the altar is scorched in a starburst pattern. The vault door shows no damage — it was opened cleanly, by someone who knew how.',
    'Three things catch your eye. What do you examine?',
  ],
  choices: [
    {
      text: 'Examine the scorch marks on the altar',
      condition: s => !s.flags.clue_elemental,
      next: 'ember_clue_tracks',
    },
    {
      text: 'Search near the vault entrance',
      condition: s => !s.flags.clue_sandshade,
      next: 'ember_clue_coin',
    },
    {
      text: 'Inspect the door lock mechanism',
      condition: s => !s.flags.clue_noble,
      next: 'ember_clue_door',
    },
    {
      text: '<em>(High Elf — Arcane Sense)</em> Scan for magical residue',
      condition: s => s.species === 'elf' && !s.flags.clue_arcane,
      req: 'High Elf — Arcane Sense',
      next: 'ember_clue_arcane',
    },
    {
      text: 'I have enough. Begin the investigation.',
      condition: s => s.flags.clue_elemental || s.flags.clue_sandshade || s.flags.clue_noble || s.flags.clue_arcane,
      next: 'ember_choose_path',
    },
  ],
},

ember_clue_tracks: {
  loc: 'The Sacred Vault, Kundorath', icon: '🔐',
  title: 'Trail of Living Fire',
  image: '🔥',
  art: '',
  text: [
    'You kneel beside the altar. The scorch marks radiate outward from where the Crown rested — but they\'re <em>directional</em>. Something moved from the altar toward the far wall, and the scorching follows it.',
    'These burns have a distinctive organic pattern. Forge fire burns in controlled channels. This fire moved <strong>freely</strong> — as if heat itself was alive and purposeful.',
    'You trace the marks to a small ventilation shaft in the far wall. The shaft leads down toward the deep mines.',
  ],
  onEnter: d => { d.flags.clue_elemental = true },
  choices: [
    { text: 'Examine more clues in the vault', next: 'ember_vault' },
    { text: 'Head straight to the deep mines', next: 'ember_mines_path' },
  ],
},

ember_clue_coin: {
  loc: 'The Sacred Vault, Kundorath', icon: '🔐',
  title: 'A Calling Card',
  image: '🪙',
  art: '',
  text: [
    'Near the entrance, half-hidden under a loose stone, you find a small coin. At first glance it looks like standard currency. Then you see the mark on its reverse — not a mint stamp.',
    'A desert dune with a snake coiled on its crest. Your Guild training supplies the name: the mark of the <strong>Sandshade Brotherhood</strong>, the criminal network that grew from the deserts of Amarun and has been spreading its reach across Ardenveil.',
    'Could be a genuine trail. Could be deliberately planted. The Brotherhood is known for misdirection as much as theft. You\'ll need to investigate in the market district where their operatives tend to operate.',
  ],
  onEnter: d => { d.flags.clue_sandshade = true },
  choices: [
    { text: 'Examine more clues in the vault', next: 'ember_vault' },
    { text: 'Head to the market district now', next: 'ember_market_path' },
  ],
},

ember_clue_door: {
  loc: 'The Sacred Vault, Kundorath', icon: '🔐',
  title: 'An Honest Lock',
  image: '🗝️',
  art: '',
  text: [
    'The vault door is masterwork dwarven engineering — a rotating mechanism with a dozen deadbolts that only disengage when an enchanted key is turned. No scratches. No signs of picking.',
    'But your close examination reveals something in the mechanism: it shows a <strong>second key operation</strong> within the last week. The vault was opened, and then properly re-locked afterward. A clean job by someone authorized.',
    'According to a logbook in a nearby alcove: only two enchanted keys exist. High Lord Brannakk holds one. The other belongs to <strong>Thane Durrak of House Ironvault</strong>, hereditary keepers of the vault since its founding.',
  ],
  onEnter: d => { d.flags.clue_noble = true },
  choices: [
    { text: 'Examine more clues in the vault', next: 'ember_vault' },
    { text: 'Find Thane Durrak immediately', next: 'ember_noble_path' },
  ],
},

ember_clue_arcane: {
  loc: 'The Sacred Vault, Kundorath', icon: '🔐',
  title: 'Layered Echoes',
  image: '✨',
  art: '',
  text: [
    'You close your eyes and extend your High Elven senses into the arcane. The vault hums with ancient protective magic — centuries of dwarven enchantment laid over each other.',
    'But beneath it all, three distinct signatures linger from three nights ago: <strong>elemental fire magic</strong>, raw and hungry; <strong>shadow-weave</strong>, the cloaking technique favored by professional thieves; and a <strong>noble\'s personal arcane seal</strong> — unique to its owner, brushed lightly against the lock as if with a familiar hand.',
    'All three were here. All three left traces. The question is which came first — and which is the hand that truly took the Crown.',
  ],
  onEnter: d => {
    d.flags.clue_arcane = true
    d.flags.clue_elemental = true
    d.flags.clue_sandshade = true
    d.flags.clue_noble = true
  },
  choices: [
    { text: 'You have all the information you need', next: 'ember_choose_path' },
  ],
},

ember_choose_path: {
  loc: 'The Sacred Vault, Kundorath', icon: '🔐',
  title: 'The Investigation Begins',
  image: '🗺️',
  art: '',
  text: [
    'You\'ve gathered what the vault can tell you. Three trails lead forward.',
    '<strong>The deep mines</strong> — where wild scorch marks end at a ventilation shaft leading into the volcanic depths.',
    '<strong>The market district</strong> — where Sandshade Brotherhood operatives lurk, traceable through merchants and informants.',
    '<strong>House Ironvault</strong> — where Thane Durrak holds the second vault key and answers to no one but the High Lord.',
    '<em>You may follow one, investigate others later, or pursue multiple leads. Where do you go first?</em>',
  ],
  choices: [
    { text: 'Descend to the deep mines', next: 'ember_mines_path' },
    { text: 'Investigate the market district', next: 'ember_market_path' },
    { text: 'Confront Thane Durrak', next: 'ember_noble_path' },
  ],
},

// ══════════════════════════════════════════════════════════
// PATH A — THE FIRE ELEMENTAL
// ══════════════════════════════════════════════════════════

ember_mines_path: {
  loc: 'The Deep Mines, Kundorath', icon: '⛏️',
  title: 'Into the Volcanic Deep',
  image: '🌋',
  art: '  ⛏  INTO THE DEEP  ⛏\n  MINES OF KUNDORATH\n  ⛏  ═════════════  ⛏',
  text: [
    'A service tunnel descends steeply from the vault\'s ventilation shaft into the mountain\'s heart. The temperature rises with every step. Workers have abandoned this section entirely — tools left where they dropped them.',
    'The scorch trail burns directly into the stone floor. Still warm. You pass a miner heading upward at speed.',
    '"Don\'t go further," she gasps. "Something made of fire is down there. And it was carrying something golden — glowing like a second sun."',
    '<em>The Crown is in the deep mines.</em>',
  ],
  choices: [
    { text: 'Press deeper into the mines', next: 'ember_elemental_approach' },
    { text: 'Ask the miner for more details', next: 'ember_miner_details' },
  ],
},

ember_miner_details: {
  loc: 'The Deep Mines, Kundorath', icon: '⛏️',
  title: 'The Miner\'s Account',
  image: '👩',
  art: '',
  text: [
    '"It wasn\'t like any bound elemental I\'ve seen," she says. "Guild mages use Fire Elementals for the deep furnaces — but those are controlled, leashed. This one moved like it had <em>purpose</em>."',
    '"It went toward the Old Collapsed Shaft — we haven\'t worked that section in fifty years. There\'s a natural magma chamber down there. If something alive wanted to nest, that\'s where."',
    '"It didn\'t attack anyone. Just walked through. But it was <em>searching</em> for something. Or maybe..." she frowns. "Maybe it had already found it."',
  ],
  choices: [
    { text: 'Head to the Old Collapsed Shaft', next: 'ember_elemental_approach' },
  ],
},

ember_elemental_approach: {
  loc: 'Old Collapsed Shaft, Kundorath Depths', icon: '🔥',
  title: 'The Burning Chamber',
  image: '😤',
  art: '  🔥  THE BURNING  🔥\n     CHAMBER BELOW\n  🔥  ═══════════  🔥',
  text: [
    'The old shaft opens into a natural magma chamber — a cathedral of molten rock whose ceiling is lost in heat-shimmer. In the center, standing on an obsidian platform above a lake of lava, is a being of living fire.',
    'It is <strong>massive</strong>, far larger than any summoned elemental. Its form shifts and churns. And there, held aloft in its burning hands, is the Ember Crown — trailing ribbons of fire like a second sun.',
    'The elemental has not noticed you yet. The heat is almost unbearable.',
  ],
  choices: [
    {
      text: '<em>(Dragonborn — Dragon\'s Blood)</em> Speak to it in the Ancient Tongue',
      condition: s => s.species === 'dragonborn',
      req: "Dragonborn — Dragon's Blood",
      next: 'ember_elemental_speak',
    },
    { text: 'Watch it carefully before acting', next: 'ember_elemental_observe' },
    { text: 'Challenge it and demand the Crown', next: 'ember_elemental_combat_setup' },
  ],
},

ember_elemental_observe: {
  loc: 'Old Collapsed Shaft, Kundorath Depths', icon: '🔥',
  title: 'The Prisoner\'s Cry',
  image: '👁️',
  art: '',
  text: [
    'You observe from the shadows. The elemental holds the Crown close — not like a thief with loot, but like someone cradling something precious. Mourning.',
    'Within the Crown\'s golden metal, you notice a faint contained glow. Not external fire — something <em>inside</em> the Crown itself. And every time the elemental holds it close, that inner glow responds, pulses. Like recognition.',
    '<em>Something is trapped inside the Crown.</em>',
    'This changes things entirely.',
  ],
  onEnter: d => { d.flags.elemental_truth_seen = true },
  choices: [
    { text: 'Try to communicate with the elemental', next: 'ember_elemental_speak_attempt' },
    { text: '<em>(High Elf — Arcane Sense)</em> Attempt an arcane translation spell', condition: s => s.species === 'elf', req: 'High Elf — Arcane Sense', next: 'ember_elemental_elf_translate' },
    { text: 'The Crown must return regardless — fight', next: 'ember_elemental_combat_setup' },
  ],
},

ember_elemental_speak_attempt: {
  loc: 'Old Collapsed Shaft, Kundorath Depths', icon: '🔥',
  title: 'An Attempt at Words',
  image: '🗣️',
  art: '',
  text: [
    'You step into the open and call out. The elemental whirls — a blast of heat like an open furnace door. For a moment it rears up, vast and furious.',
    'Then it pauses. It can see you\'re not a dwarf. Not here to take by force. Its fire dims slightly, curious.',
    'But without the right language, you cannot reach it. It shakes with something like frustration and raises its guard again.',
  ],
  choices: [
    { text: 'Fight for the Crown', next: 'ember_elemental_combat_setup' },
    { text: 'Carefully back away and try another approach', next: 'ember_retreat_mines' },
  ],
},

ember_elemental_elf_translate: {
  loc: 'Old Collapsed Shaft, Kundorath Depths', icon: '🔥',
  title: 'Tongues of Fire',
  image: '✨',
  art: '',
  text: [
    'You draw on your Elven mastery of languages, weaving a translation cantrip your tutors in Eldarvein taught you — designed for communicating with bound magical entities.',
    'The elemental\'s roar resolves into words: <em>"Release her. She burns in the cold. She has burned for a thousand years."</em>',
    'The imprisoned spirit within the Crown. The elemental didn\'t steal the Crown to harm Kundorath. It came to <em>rescue someone.</em>',
  ],
  onEnter: d => { d.flags.elemental_truth_known = true },
  choices: [
    { text: 'Learn the full story', next: 'ember_elemental_truth_full' },
  ],
},

ember_elemental_speak: {
  loc: 'Old Collapsed Shaft, Kundorath Depths', icon: '🔥',
  title: 'Voice of Dragon-Blood',
  image: '🐉',
  art: '',
  text: [
    'You breathe deeply and let the words come from somewhere ancestral — the resonant tongue that dragons and their kin share with elemental fire. It feels like speaking with your bones.',
    'The elemental freezes. Then slowly, its roaring dims to a voice like forge-bellows.',
    '<em>"Dragon-blood. You speak the old tongue. Then hear me. Inside this Crown — a prison. One of my kin, a fire spirit, has been trapped within its gold for a thousand years. The dwarves never knew. They thought the Crown merely channeled their volcano\'s heat."</em>',
    '<em>"They were wrong. It channels her pain."</em>',
  ],
  onEnter: d => { d.flags.elemental_truth_known = true },
  choices: [
    { text: 'Ask what it wants you to do', next: 'ember_elemental_truth_full' },
  ],
},

ember_elemental_truth_full: {
  loc: 'Old Collapsed Shaft, Kundorath Depths', icon: '🔥',
  title: 'A Prison of Gold',
  image: '⛓️',
  art: '',
  text: [
    'The elemental speaks slowly, its fire subdued. A thousand years ago, it says, a dwarf wizard sought to permanently bind volcanic heat to his kingdom\'s forges. He captured a young fire spirit and sealed her inside a golden crown — her life-force sustaining the warmth forever.',
    '"She cannot die. Cannot escape. She simply burns and burns, serving a kingdom that does not even know she exists."',
    '"I am her elder. I sensed her pain across the centuries. I came to free her." The elemental hesitates. "To free her — the Crown must be destroyed. Melted in a fire hotter than any forge."',
    '<em>If you free the spirit, the Crown is gone. Kundorath\'s forges stay cold. If you take it back, she remains imprisoned for another thousand years.</em>',
    '<em>Or perhaps there is a third way.</em>',
  ],
  choices: [
    {
      text: 'Free the spirit — destroy the Crown',
      next: 'ember_end_truth_elemental',
      action: d => { d.flags.freed_spirit = true },
    },
    {
      text: 'You cannot condemn Kundorath — take the Crown back',
      next: 'ember_take_crown_from_elemental',
    },
    {
      text: 'Promise to tell the High Lord the truth — and find another way',
      next: 'ember_elemental_compromise',
      action: d => { d.flags.elemental_deal = true },
    },
  ],
},

ember_elemental_combat_setup: {
  loc: 'Old Collapsed Shaft, Kundorath Depths', icon: '🔥',
  title: 'Combat in the Magma Chamber',
  image: '⚔️',
  art: '',
  text: [
    'The elemental roars and raises the Crown high. Pillars of fire erupt from the magma lake below. The battle is joined.',
  ],
  combat: {
    enemy: 'The Ancient Fire Elemental',
    difficulty: 7,
    hp_cost: 3,
    win: 'ember_elemental_defeated',
    lose: 'ember_elemental_retreat',
    desc: 'A being of living fire — immense and ancient. It hurls columns of flame and waves of superheated air!',
  },
  choices: [],
},

ember_elemental_defeated: {
  loc: 'Old Collapsed Shaft, Kundorath Depths', icon: '🔥',
  title: 'The Elemental Falls',
  image: '💨',
  art: '',
  text: [
    'The elemental dissipates with a sound like a forge going cold — a long sighing rush of steam and silence. The Ember Crown clatters to the obsidian platform.',
    'As you reach for it, you feel it: a faint pulse from within the gold. A presence. Something that has waited for a very long time.',
    'The elemental is gone. But the truth it carried lingers in the cooling air. A spirit lives inside the Crown — and she will continue to burn.',
    '<em>You pick up the Crown. Kundorath\'s fires will be lit again. The cost is hidden, as it has always been.</em>',
  ],
  onEnter: d => { d.items.push('Ember Crown') },
  choices: [
    { text: 'Return to the High Lord', next: 'ember_return_crown' },
  ],
},

ember_elemental_retreat: {
  loc: 'The Deep Mines, Kundorath', icon: '⛏️',
  title: 'A Narrow Escape',
  image: '💨',
  art: '',
  text: [
    'The elemental\'s power is too great. Battered and singed, you retreat through the mine tunnels as sheets of fire chase your heels.',
    'You collapse at the main tunnel entrance, gasping. The Crown is still down there.',
    'You need a different approach.',
  ],
  choices: [
    { text: 'Try the market district instead', next: 'ember_market_path' },
    { text: 'Seek Thane Durrak instead', next: 'ember_noble_path' },
    { text: 'Rest briefly and try the elemental again', next: 'ember_elemental_approach' },
  ],
},

ember_take_crown_from_elemental: {
  loc: 'Old Collapsed Shaft, Kundorath Depths', icon: '🔥',
  title: 'The Weight of the Choice',
  image: '😔',
  art: '',
  text: [
    '"I\'m sorry," you tell the elemental. "I understand the injustice. But a kingdom\'s lives depend on this Crown. I cannot leave Kundorath to starve."',
    'A long, terrible silence. The fire of the elemental\'s form drops low.',
    '<em>"Then know what you carry,"</em> it says. <em>"And carry it with the knowledge of what it is."</em>',
    'It lowers the Crown into your hands and steps back into the lava. Gone.',
    'You hold the Crown. The hidden spirit\'s pulse is barely perceptible beneath the gold. Something that has suffered for a thousand years continues to suffer.',
  ],
  onEnter: d => { d.items.push('Ember Crown'); d.flags.knows_the_truth = true },
  choices: [
    { text: 'Return the Crown to Brannakk', next: 'ember_return_crown' },
  ],
},

ember_elemental_compromise: {
  loc: 'Old Collapsed Shaft, Kundorath Depths', icon: '🔥',
  title: 'A Dragon\'s Oath',
  image: '🤝',
  art: '',
  text: [
    '"Give me the Crown," you say quietly. "And I will tell the High Lord everything. Kundorath must find another way to power their forges — I will not let this stay buried. I promise you."',
    'The elemental regards you for a long moment. Then, very slowly, its fire settles.',
    '<em>"Adventurers make many promises,"</em> it says. <em>"But you carry dragon-blood. I hold you to a dragon\'s oath — unbreakable, witnessed by fire."</em>',
    'It lowers the Crown into your hands. Within the gold, the imprisoned spirit pulses once — a flutter, like recognition, or gratitude. Then the elemental sinks into the lava and is gone.',
  ],
  onEnter: d => { d.items.push('Ember Crown'); d.flags.elemental_deal = true; d.flags.knows_the_truth = true },
  choices: [
    { text: 'Return to the High Lord — and keep your oath', next: 'ember_return_crown' },
  ],
},

ember_retreat_mines: {
  loc: 'The Deep Mines, Kundorath', icon: '⛏️',
  title: 'Retreating for Now',
  image: '🚪',
  art: '',
  text: [
    'Discretion wins out. You back away carefully from the chamber. The elemental watches but does not pursue.',
    'Back in the main tunnel, you take stock. Direct confrontation or shouted words won\'t work here. You need more information — or a different angle entirely.',
  ],
  choices: [
    { text: 'Head to the market district', next: 'ember_market_path' },
    { text: 'Find Thane Durrak', next: 'ember_noble_path' },
    { text: 'Return to the elemental with a different approach', next: 'ember_elemental_approach' },
  ],
},

// ══════════════════════════════════════════════════════════
// PATH B — THE SANDSHADE BROTHERHOOD
// ══════════════════════════════════════════════════════════

ember_market_path: {
  loc: 'The Market District, Kundorath', icon: '🏪',
  title: 'Under the Mountain\'s Shadow',
  image: '🕵️',
  art: '  ◆  MARKET DISTRICT  ◆\n    OF KUNDORATH\n  ◆  ═════════════  ◆',
  text: [
    'Kundorath\'s market district is normally the busiest place in the kingdom. Today it\'s half-empty. Without the forges, half the merchants have nothing to sell. Those remaining speak in low voices, casting nervous glances at the cold forge-towers.',
    'The Sandshade Brotherhood operates through networks of informants, fence-merchants, and professional cut-outs. If Brotherhood operatives were here recently, someone saw them.',
    '<em>How do you proceed?</em>',
  ],
  choices: [
    {
      text: 'Bribe an informant (5 gold)',
      condition: s => s.gold >= 5 && !s.flags.informant_paid,
      next: 'ember_informant',
      action: d => { d.gold -= 5; d.flags.informant_paid = true },
    },
    {
      text: '<em>(Tiefling — Hellsight)</em> Scan the market for deception magic',
      condition: s => s.species === 'tiefling' && !s.flags.hellsight_used,
      req: 'Tiefling — Hellsight',
      next: 'ember_hellsight_market',
    },
    {
      text: '<em>(Goliath — Ironhide)</em> Make someone talk through intimidation',
      condition: s => s.species === 'goliath' && !s.flags.goliath_intimidated,
      req: 'Goliath — Ironhide',
      next: 'ember_goliath_intimidate',
    },
    { text: 'Ask around openly', next: 'ember_market_ask' },
  ],
},

ember_informant: {
  loc: 'The Market District, Kundorath', icon: '🏪',
  title: 'The Fence Talks',
  image: '🤫',
  art: '',
  text: [
    'A gem-fence behind a merchant stall accepts your gold and speaks fast. "Three Sandshade operatives came through two nights ago. Desert cloaks, Amarun sand still on their boots. They had cargo they wouldn\'t show me — but it was <em>warm</em>. The crate glowed around the seams."',
    '"They\'re using the Old Bathhouse in the Lower District. Abandoned thirty years. They\'ve set up in the lower chambers. That\'s all I know." He pockets the coin. "Don\'t say I told you."',
  ],
  onEnter: d => { d.flags.hideout_known = true },
  choices: [
    { text: 'Head to the Old Bathhouse', next: 'ember_sandshade_hideout' },
  ],
},

ember_hellsight_market: {
  loc: 'The Market District, Kundorath', icon: '🏪',
  title: 'Seeing Through the Veil',
  image: '😈',
  art: '',
  text: [
    'You open your Tiefling sight — the hellborn perception that lets you see through illusion as if it were glass.',
    'The market resolves into a map of emotional truth. Most people here radiate honest fear. But near the butcher\'s stall, one man\'s aura is entirely <em>wrong</em> — layered over with a concealment enchantment, watching you.',
    'Sandshade operative. He clocks your attention and slips back into the crowd.',
  ],
  onEnter: d => { d.flags.hellsight_used = true },
  choices: [
    { text: 'Chase him', next: 'ember_sandshade_chase' },
  ],
},

ember_goliath_intimidate: {
  loc: 'The Market District, Kundorath', icon: '🏪',
  title: 'The Direct Approach',
  image: '🏔️',
  art: '',
  text: [
    'You don\'t waste time with subtlety. You find the most well-connected looking merchant — a gemstone dealer with rings on every finger — and lift him off the ground by his collar.',
    '"Sandshade Brotherhood. Where are they operating."',
    'It\'s not a question. The merchant\'s composure crumbles. "Old Bathhouse! Lower District! Please don\'t bend the rings."',
    'You set him down.',
  ],
  onEnter: d => { d.flags.hideout_known = true; d.flags.goliath_intimidated = true },
  choices: [
    { text: 'Head to the Old Bathhouse', next: 'ember_sandshade_hideout' },
  ],
},

ember_market_ask: {
  loc: 'The Market District, Kundorath', icon: '🏪',
  title: 'Open Questions',
  image: '🤷',
  art: '',
  text: [
    'You ask openly about strangers and suspicious activity. Most merchants shrug or look away. One spice trader mentions "three surface-folk in desert cloaks" seen two nights ago.',
    'But your open questioning has a cost. A young man at the market edge catches your eye — then turns and walks away. Too quickly. His boots are wrong for a laborer: quality leather, desert-tanned.',
    'Sandshade operative. And now he knows you\'re looking.',
  ],
  choices: [
    { text: 'Chase him', next: 'ember_sandshade_chase' },
    { text: 'Let him go and try a different tactic', next: 'ember_market_path' },
  ],
},

ember_sandshade_chase: {
  loc: 'The Market District, Kundorath', icon: '🏪',
  title: 'The Chase',
  image: '🏃',
  art: '',
  text: [
    'You sprint after the operative. He\'s fast and knows every shortcut — vaulting a spice cart, cutting through a jeweler\'s stall. But the market\'s narrow passages eventually close the gap.',
    'He turns and draws a short blade.',
  ],
  combat: {
    enemy: 'Sandshade Operative',
    difficulty: 4,
    hp_cost: 1,
    win: 'ember_sandshade_captured',
    lose: 'ember_sandshade_escaped',
    desc: 'A quick, dangerous professional — trained by the Brotherhood!',
  },
  choices: [],
},

ember_sandshade_captured: {
  loc: 'The Market District, Kundorath', icon: '🏪',
  title: 'Interrogation',
  image: '😤',
  art: '',
  text: [
    'You pin him against the wall. He\'s practical rather than brave.',
    '"Old Bathhouse, Lower District, basement level. Three of my colleagues and the Crown. We have a deadline — pickup is tonight." He meets your eyes. "Someone hired us. We don\'t ask who. But take me there and you\'ll only face two instead of three."',
    '<em>He\'s offering to help you take down his own operation. Possibly loyalty, possibly self-preservation.</em>',
  ],
  onEnter: d => { d.flags.operative_captured = true; d.flags.hideout_known = true },
  choices: [
    { text: 'Bring him along to the Bathhouse', next: 'ember_sandshade_hideout' },
    { text: 'Leave him tied up and go alone', next: 'ember_sandshade_hideout' },
  ],
},

ember_sandshade_escaped: {
  loc: 'The Market District, Kundorath', icon: '🏪',
  title: 'Lost in the Tunnels',
  image: '😔',
  art: '',
  text: [
    'He slips into a drain tunnel too small for comfortable pursuit. But in his flight, he dropped something — a folded note.',
    '<em>"Confirm cargo secure. If not heard from by dawn, abort and follow Dunestrider protocol."</em> An address in the Lower District follows. The Old Bathhouse.',
  ],
  onEnter: d => { d.flags.hideout_known = true },
  choices: [
    { text: 'Head to the Old Bathhouse', next: 'ember_sandshade_hideout' },
  ],
},

ember_sandshade_hideout: {
  loc: 'Old Bathhouse, Lower District, Kundorath', icon: '🏚️',
  title: 'The Hidden Lair',
  image: '🗡️',
  art: '  ◆  OLD BATHHOUSE  ◆\n    LOWER DISTRICT\n  ◆  ════════════  ◆',
  text: [
    'The abandoned bathhouse is a maze of cracked tile and empty pools. In the lowest chamber — once a steam room — three Sandshade agents wait in the dark. The Ember Crown sits in a lead-lined crate, its heat muffled but unmistakable.',
    'One agent looks up as you enter. "Outsider. You have ten seconds to leave before this goes badly for you."',
  ],
  choices: [
    {
      text: '<em>(Human — Silver Tongue)</em> Talk your way to the Crown',
      condition: s => s.species === 'human',
      req: 'Human — Silver Tongue',
      next: 'ember_sandshade_deal',
    },
    {
      text: 'Show them their captured colleague',
      condition: s => s.flags.operative_captured,
      next: 'ember_sandshade_leverage',
    },
    { text: 'Fight the Brotherhood agents', next: 'ember_sandshade_combat' },
  ],
},

ember_sandshade_deal: {
  loc: 'Old Bathhouse, Lower District, Kundorath', icon: '🏚️',
  title: 'Fast Talk',
  image: '💬',
  art: '',
  text: [
    '"Before anyone does anything they\'ll regret," you say pleasantly, "let me offer you a better deal than whoever hired you."',
    '"You\'re holding a priceless magical artifact in a city with no functioning forges. That means the dwarven Guard has nothing to do but patrol. Your exit window is closing by the hour."',
    'You watch the math work itself across the lead agent\'s face.',
    '"Walk away now — job simply never happened. Or fight a Guild investigator in a city that\'s already looking for any excuse to arrest anyone suspicious." You pause. "Your call."',
    'A long silence. Then the lead agent sets down the Crown\'s crate. "Who hired us?"',
    '"That\'s what I\'m going to find out. But first — the Crown."',
  ],
  onEnter: d => { d.flags.sandshade_deal_made = true },
  choices: [
    { text: 'Take the Crown', next: 'ember_sandshade_victory' },
  ],
},

ember_sandshade_leverage: {
  loc: 'Old Bathhouse, Lower District, Kundorath', icon: '🏚️',
  title: 'An Inside Advantage',
  image: '🃏',
  art: '',
  text: [
    'You step aside. Your captive operative gives a small, resigned shrug at his colleagues.',
    '"Ryn," says the lead agent. "You led them here."',
    '"Job\'s burned anyway," Ryn says. "Deal\'s better this way."',
    'After a tense moment, the lead agent sets down the Crown\'s crate. "We were hired anonymously. Desert courier, pre-paid in Amarun coin. That\'s all we were given. Smelled like a political contract." He steps back. "We\'re done here."',
  ],
  onEnter: d => { d.flags.sandshade_hired_anonymous = true; d.flags.conspiracy_hint = true },
  choices: [
    { text: 'Take the Crown', next: 'ember_sandshade_victory' },
  ],
},

ember_sandshade_combat: {
  loc: 'Old Bathhouse, Lower District, Kundorath', icon: '🏚️',
  title: 'Brotherhood Brawl',
  image: '⚔️',
  art: '',
  text: [
    'The three Sandshade agents are professionals — fast, coordinated, covering every angle in the tight space.',
  ],
  combat: {
    enemy: 'Sandshade Brotherhood Agents',
    difficulty: 5,
    hp_cost: 2,
    win: 'ember_sandshade_victory',
    lose: 'ember_sandshade_captured_player',
  },
  choices: [],
},

ember_sandshade_victory: {
  loc: 'Old Bathhouse, Lower District, Kundorath', icon: '🏚️',
  title: 'The Crown Recovered',
  image: '✨',
  art: '',
  text: [
    'The Ember Crown gleams from within its lead-lined crate — beaten gold set with volcanic gems, flames sculpted around its rim. It pulses with something that might be warmth, or might be a heartbeat.',
    'Among the Brotherhood\'s supplies you find a folded note: <em>"Phase One complete. Hold Crown until further instruction. Phase Two to follow once chaos reaches threshold. — Dunestrider."</em>',
    '<strong>Phase Two.</strong> Someone is using this theft as the opening move in a larger plan.',
  ],
  onEnter: d => { d.items.push('Ember Crown'); d.flags.conspiracy_note = true },
  choices: [
    { text: 'Return the Crown to High Lord Brannakk', next: 'ember_return_crown' },
  ],
},

ember_sandshade_captured_player: {
  loc: 'Old Bathhouse, Lower District, Kundorath', icon: '🏚️',
  title: 'Taken Down',
  image: '😵',
  art: '',
  text: [
    'Three against one in a closed space proves too much. You\'re disarmed and bound.',
    'The lead agent crouches in front of you. "You\'re better than you look. Someone\'s paying you well. But the Crown is leaving tonight, and you\'re not stopping it."',
    'They leave you tied but alive — a professional courtesy. And they didn\'t check your boot-knife.',
    'It takes time. But you get free. The Crown is gone, but you overheard them mention the eastern trade gate.',
  ],
  choices: [
    { text: 'Race to intercept them at the eastern gate', next: 'ember_sandshade_chase_again' },
    { text: 'Regroup and investigate Thane Durrak instead', next: 'ember_noble_path' },
  ],
},

ember_sandshade_chase_again: {
  loc: 'Eastern Trade Gate, Kundorath', icon: '🏚️',
  title: 'One Last Chance',
  image: '🌑',
  art: '',
  text: [
    'You sprint through Kundorath\'s tunnels. The Brotherhood has a heavy crate and a lead. But Kundorath\'s internal routes are confusing for outsiders — and you know a shortcut through the old furnace tunnels.',
    'You arrive at the eastern gate just ahead of them.',
  ],
  combat: {
    enemy: 'Fleeing Brotherhood Agents',
    difficulty: 4,
    hp_cost: 1,
    win: 'ember_sandshade_victory',
    lose: 'ember_sandshade_lost_crown',
  },
  choices: [],
},

ember_sandshade_lost_crown: {
  loc: 'Eastern Gate, Kundorath', icon: '🏚️',
  title: 'The Crown is Gone',
  image: '😟',
  art: '',
  text: [
    'They make it through the gate before you can stop them. The Crown is out of Kundorath.',
    'You return to the High Lord with grim news — but also the Brotherhood\'s note about "Phase Two." This theft was the opening move of something larger.',
  ],
  onEnter: d => { d.flags.crown_lost = true; d.flags.conspiracy_note = true },
  choices: [
    { text: 'Report everything to High Lord Brannakk', next: 'ember_end_partial' },
  ],
},

// ══════════════════════════════════════════════════════════
// PATH C — THE NOBLE BETRAYAL
// ══════════════════════════════════════════════════════════

ember_noble_path: {
  loc: 'House Ironvault Manor, Kundorath', icon: '🏰',
  title: 'The House of Iron',
  image: '🏛️',
  art: '  ⚒  HOUSE IRONVAULT  ⚒\n    KUNDORATH MANOR\n  ⚒  ═══════════  ⚒',
  text: [
    'House Ironvault\'s manor sits in the upper district — ancient status, though the stonework shows deferred maintenance. Windows that should glow with enchanted light are dark.',
    'A butler at the door turns you away with a curt: "Thane Durrak is not receiving visitors."',
    'The door starts to close.',
  ],
  choices: [
    {
      text: '<em>(High Elf — Arcane Sense)</em> Scan the manor for magical anomalies',
      condition: s => s.species === 'elf' && !s.flags.elf_manor_scan,
      req: 'High Elf — Arcane Sense',
      next: 'ember_elf_manor_scan',
      action: d => { d.flags.elf_manor_scan = true },
    },
    { text: 'Show the Adventure Guild charter and demand entry', next: 'ember_noble_guild_demand' },
    { text: 'Watch the manor from outside', next: 'ember_noble_observe' },
    { text: 'Push past the butler by force', next: 'ember_noble_force_entry' },
  ],
},

ember_elf_manor_scan: {
  loc: 'House Ironvault Manor, Kundorath', icon: '🏰',
  title: 'What the Walls Hide',
  image: '✨',
  art: '',
  text: [
    'You extend your senses beyond the closed door. Protective wards — standard for a noble house.',
    'But deeper, beneath the wards: the residue of a recent <strong>Disintegrate spell</strong>, cast in the lower floors. Something was destroyed. And near a loading dock: fresh Eryndorian trade-seal enchantments — the kind used to mark authorized shipments.',
    'Durrak already moved something. Very recently. The Crown may still be in the building, or already heading for the surface.',
  ],
  onEnter: d => { d.flags.elf_manor_scan = true; d.flags.cargo_moved = true },
  choices: [
    { text: 'Force entry immediately', next: 'ember_noble_force_entry' },
    { text: 'Watch the loading dock from outside', next: 'ember_noble_observe' },
  ],
},

ember_noble_observe: {
  loc: 'Outside House Ironvault Manor, Kundorath', icon: '🏰',
  title: 'Watching and Waiting',
  image: '👁️',
  art: '',
  text: [
    'You find a shadowed alcove and watch. An hour passes. Then, in the small hours, the manor\'s loading dock opens. Three figures in Eryndorian merchant cloaks emerge, carrying a heavy crate marked with trade seals.',
    'The crate is warm. You can see heat shimmer rising off it even in the cold tunnel air.',
    '<em>They\'re moving the Crown. Right now.</em>',
  ],
  onEnter: d => { d.flags.cargo_seen = true },
  choices: [
    { text: 'Intercept them at the loading dock immediately', next: 'ember_noble_loading_dock' },
    { text: 'Follow them to their destination', next: 'ember_eryndor_merchants' },
  ],
},

ember_noble_loading_dock: {
  loc: 'House Ironvault Loading Dock, Kundorath', icon: '🏰',
  title: 'Caught in the Act',
  image: '📦',
  art: '',
  text: [
    'You block the loading dock exit. The three Eryndorian merchants freeze, the warm crate between them.',
    '"Adventure Guild," you announce. "I\'ll need to examine that crate."',
    'A moment\'s calculation passes across the lead merchant\'s face. Then he nods to his colleagues.',
  ],
  combat: {
    enemy: 'Eryndorian Smugglers',
    difficulty: 5,
    hp_cost: 2,
    win: 'ember_crown_intercepted',
    lose: 'ember_merchants_escape',
  },
  choices: [],
},

ember_eryndor_merchants: {
  loc: 'Kundorath Trade Tunnels', icon: '🏰',
  title: 'Following the Crate',
  image: '🚶',
  art: '',
  text: [
    'You shadow the merchants through the trade tunnels. They\'re heading for the Eryndorian caravan staging area near the eastern gate. If they reach the surface with the Crown, it\'ll be in Danseleif within days.',
    '<em>Now or never.</em>',
  ],
  combat: {
    enemy: 'Eryndorian Smugglers',
    difficulty: 5,
    hp_cost: 2,
    win: 'ember_crown_intercepted',
    lose: 'ember_merchants_escape',
  },
  choices: [],
},

ember_crown_intercepted: {
  loc: 'Kundorath Trade Tunnels', icon: '🏰',
  title: 'The Crown Reclaimed',
  image: '✨',
  art: '',
  text: [
    'The merchants go down. The crate opens. The Ember Crown lies before you — warm and steadily pulsing.',
    'Among the merchants\' papers: a trading manifest. <em>"Delivery of \'historical artifact — private collection\' to the Lord-Patron of the Danseleif Trade Council, c/o House Eryndor Commerce Authority."</em>',
    'Someone inside Eryndor\'s government — or at least its merchant class — wanted this Crown. This goes all the way to the Noble Houses.',
  ],
  onEnter: d => { d.items.push('Ember Crown'); d.flags.conspiracy_eryndor = true },
  choices: [
    { text: 'Confront Thane Durrak now', next: 'ember_noble_confront_after' },
    { text: 'Return directly to High Lord Brannakk', next: 'ember_return_crown' },
  ],
},

ember_merchants_escape: {
  loc: 'Kundorath Trade Tunnels', icon: '🏰',
  title: 'They Got Away',
  image: '😔',
  art: '',
  text: [
    'The merchants are better fighters than merchants should be. They scatter. The one carrying the Crown makes it to the surface before you can stop them.',
    'But you captured one. Under pressure, he confirms the delivery is bound for Danseleif — for someone on Eryndor\'s Trade Council who commissioned this theft.',
    'The Crown is gone from Kundorath. But the conspiracy is exposed.',
  ],
  onEnter: d => { d.flags.crown_lost = true; d.flags.conspiracy_eryndor = true },
  choices: [
    { text: 'Report everything to High Lord Brannakk', next: 'ember_end_partial' },
  ],
},

ember_noble_force_entry: {
  loc: 'House Ironvault Manor, Kundorath', icon: '🏰',
  title: 'Forcing the Issue',
  image: '💥',
  art: '',
  text: [
    'You put your shoulder to the door. The butler shouts. Two manor guards appear at the end of the entrance hall.',
  ],
  combat: {
    enemy: 'Manor Guards',
    difficulty: 3,
    hp_cost: 1,
    win: 'ember_noble_inside',
    lose: 'ember_noble_thrown_out',
  },
  choices: [],
},

ember_noble_guild_demand: {
  loc: 'House Ironvault Manor, Kundorath', icon: '🏰',
  title: 'The Guild\'s Authority',
  image: '📜',
  art: '',
  text: [
    'You produce your Adventure Guild charter — which, in Kundorath as in all nations with a Guild presence, grants investigators authority to pursue active contracts without obstruction.',
    '"I am here on behalf of High Lord Brannakk regarding the theft of the Ember Crown. Obstruction of an active Guild investigation is a criminal offense in Kundorath. I suggest you stand aside."',
    'The butler\'s face cycles through several expressions. Then he steps back.',
  ],
  choices: [
    { text: 'Enter and find Thane Durrak', next: 'ember_noble_inside' },
  ],
},

ember_noble_inside: {
  loc: 'House Ironvault Manor, Kundorath', icon: '🏰',
  title: 'Inside the Iron House',
  image: '🏠',
  art: '',
  text: [
    'The manor tells a story of slow decline. Fine tapestries faded and unreplaced. Empty wine racks. Furniture that was magnificent, now unpolished.',
    'Thane Durrak meets you in the great hall. He is perhaps two hundred years old, grey-bearded, and exhausted in a way that has nothing to do with sleep. He does not look like a triumphant thief.',
    'He looks like a man who has been waiting for someone to come.',
    '"You\'re from the Guild," he says. "Brannakk sent you." It\'s not a question.',
  ],
  choices: [
    { text: 'Confront him directly — you know about the key', next: 'ember_noble_confronted' },
    { text: 'Let him speak first — he clearly wants to', next: 'ember_noble_speaks' },
  ],
},

ember_noble_thrown_out: {
  loc: 'Outside House Ironvault Manor, Kundorath', icon: '🏰',
  title: 'Thrown Out',
  image: '😤',
  art: '',
  text: [
    'The guards are capable. You\'re thrown back into the street, bruised.',
    'But in the scuffle you noticed something: a crate in the manor\'s entrance hall, marked with Eryndorian trade seals. And it was warm.',
    'The Crown may still be inside. Or it may already be moving.',
  ],
  choices: [
    { text: 'Watch the loading dock from outside', next: 'ember_noble_observe' },
    { text: 'Try the Guild charter approach instead', next: 'ember_noble_guild_demand' },
    { text: 'Investigate the market district instead', next: 'ember_market_path' },
  ],
},

ember_noble_confronted: {
  loc: 'House Ironvault Manor, Kundorath', icon: '🏰',
  title: 'The Accusation',
  image: '⚖️',
  art: '',
  text: [
    '"You hold the second vault key, Thane. The lock was used within the last week. Tell me what you did with the Ember Crown."',
    'Durrak closes his eyes. His shoulders drop.',
    '"I didn\'t want to," he says. Very quietly. "I never wanted any of this."',
    'He sits heavily in an ancient chair. "I\'ll tell you everything."',
  ],
  choices: [
    { text: 'Listen to the full confession', next: 'ember_noble_confession' },
  ],
},

ember_noble_speaks: {
  loc: 'House Ironvault Manor, Kundorath', icon: '🏰',
  title: 'An Old Dwarf\'s Burden',
  image: '😔',
  art: '',
  text: [
    'Durrak pours two cups of something amber and sets one in front of you without asking. He drinks his in one go.',
    '"I know why you\'re here. I\'ve been expecting someone for three days. I thought it would be Brannakk\'s soldiers." He refills his cup. "A Guild investigator is almost better. It means there\'s still a process."',
    '"I\'ll tell you everything. I\'ve been waiting to tell someone." He looks at the empty hearth. "It started eight months ago, with a debt."',
  ],
  choices: [
    { text: 'Listen to his story', next: 'ember_noble_confession' },
  ],
},

ember_noble_confront_after: {
  loc: 'House Ironvault Manor, Kundorath', icon: '🏰',
  title: 'Confronting the Thane',
  image: '⚖️',
  art: '',
  text: [
    'You find Durrak still in his great hall, waiting. When you set the recovered manifest on the table before him, he doesn\'t even look surprised.',
    '"You stopped the shipment." He exhales. "I hoped someone would."',
    '"Tell me everything," you say. "Starting with who Varic is."',
    'And Durrak talks.',
  ],
  choices: [
    { text: 'Hear the confession', next: 'ember_noble_confession' },
  ],
},

ember_noble_confession: {
  loc: 'House Ironvault Manor, Kundorath', icon: '🏰',
  title: 'House Ironvault\'s Fall',
  image: '📜',
  art: '',
  text: [
    'Eight months ago, House Ironvault\'s last profitable mine collapsed. Durrak borrowed heavily from Eryndorian trading houses to cover the shortfall.',
    '"Then a man named Varic came. Representative of the Eryndor Commerce Authority. He knew about the debts in detail — more detail than was publicly available." Durrak\'s voice is steady but hollow. "He offered to clear every coin owed. In exchange for the Ember Crown."',
    '"I told myself it was temporary. That I could manage the fallout." A short, bitter sound. "I used the key. I took the Crown. I handed it to his merchants."',
    'He meets your eyes. "I would not do it again. But I cannot undo it. I can only tell you everything about Varic."',
  ],
  onEnter: d => {
    d.flags.noble_confessed = true
    d.flags.conspiracy_eryndor = true
    d.flags.varic_named = true
  },
  choices: [
    {
      text: 'The merchants may not have left yet — intercept them',
      condition: s => !s.flags.crown_lost && !s.items.includes('Ember Crown'),
      next: 'ember_noble_loading_dock',
    },
    {
      text: 'Ask Durrak about Varic before anything else',
      next: 'ember_noble_varic_info',
    },
    {
      text: 'You already have the Crown — tell him what comes next',
      condition: s => s.items.includes('Ember Crown'),
      next: 'ember_return_crown',
    },
    {
      text: 'The Crown is gone — report the conspiracy to Brannakk',
      condition: s => s.flags.crown_lost,
      next: 'ember_end_partial',
    },
  ],
},

ember_noble_varic_info: {
  loc: 'House Ironvault Manor, Kundorath', icon: '🏰',
  title: 'The Man Called Varic',
  image: '🕵️',
  art: '',
  text: [
    '"Tell me everything about Varic."',
    '"Tall, Eryndorian, House crest of the Silverfang trade consortium. He knew things about the vault that only someone with Guild-level intelligence access could know." Durrak thinks. "He said this was part of \'stabilizing trade agreements\'. Meaningless words."',
    '"He also said something strange. That Kundorath\'s temporary weakness would \'serve the realignment\'. That this was only Phase One." Durrak shakes his head. "I did not ask what Phase Two meant. I should have."',
    '<strong>Phase One.</strong> The same language as the Brotherhood\'s note, if you found it.',
  ],
  onEnter: d => { d.flags.phase_one_known = true; d.flags.conspiracy_note = true },
  choices: [
    {
      text: 'Intercept the merchants before they leave Kundorath',
      condition: s => !s.flags.crown_lost && !s.items.includes('Ember Crown'),
      next: 'ember_noble_loading_dock',
    },
    {
      text: 'Return directly to the High Lord with everything you know',
      next: 'ember_end_partial',
      condition: s => s.flags.crown_lost,
    },
    {
      text: 'Return to the High Lord — you have the Crown and the truth',
      condition: s => s.items.includes('Ember Crown'),
      next: 'ember_return_crown',
    },
  ],
},

// ══════════════════════════════════════════════════════════
// RESOLUTION
// ══════════════════════════════════════════════════════════

ember_return_crown: {
  loc: 'The Throne of Hammers, Kundorath', icon: '👑',
  title: 'The Return',
  image: '🔥',
  art: '  ⚒  THE CROWN  ⚒\n    RETURNS HOME\n  ⚒  ══════════  ⚒',
  text: [
    'High Lord Brannakk\'s face when you set the Ember Crown on his throne-table is something you will not forget. Relief, fury, and grief — a dwarf\'s mountain-weight of emotion, barely held.',
    'He lifts the Crown. The moment it leaves your hands, the forge-channels in the walls begin to glow faintly orange. Warmth returns to the throne room in a slow, grateful tide.',
    '"You have done Kundorath a service that will not be forgotten," he says. "Your reward, as promised."',
    'He looks at you carefully. "But you have something else to tell me. I can see it."',
  ],
  onEnter: d => { d.gold += 100 },
  choices: [
    {
      text: 'Tell him about the conspiracy — Phase One, Phase Two',
      condition: s => s.flags.conspiracy_note || s.flags.conspiracy_eryndor || s.flags.varic_named,
      next: 'ember_end_conspiracy',
    },
    {
      text: 'Tell him the Crown holds an imprisoned spirit',
      condition: s => s.flags.knows_the_truth || s.flags.elemental_deal,
      next: 'ember_end_revelation',
    },
    { text: 'Say nothing beyond what he needs to know', next: 'ember_end_simple' },
  ],
},

// ══════════════════════════════════════════════════════════
// ENDINGS
// ══════════════════════════════════════════════════════════

ember_end_simple: {
  loc: 'Kundorath', icon: '🏆',
  title: 'The Forge-Fire Returns',
  image: '🔥',
  art: '  ⚒  ★  ENDING  ★  ⚒\n   THE FORGE-FIRE\n      RETURNS\n  ⚒  ══════════  ⚒',
  endingType: 'hero',
  endingLabel: '⚒ Forge-Keeper',
  text: [
    'The forge-channels of Kundorath blaze back to life within the hour. The sound of hammers returns before nightfall — first one, then ten, then the full chorus that makes the mountain itself vibrate.',
    'High Lord Brannakk presses into your hands the final work of Master Smith Aldrak, who died last winter, and 100 gold above the agreed fee.',
    '"You asked for what we agreed and delivered what we needed," he says. "In Kundorath, that is considered a rare honor among any folk."',
    'As you leave the mountain city, the forges roar behind you. Whatever questions you chose not to ask — whatever price is buried in the Crown\'s gold — Kundorath lives. The fire burns.',
    '<em>The Adventure Guild marks your record: Quest Complete. The Ember Crown returned. One kingdom saved by one adventurer who knew when not to ask too many questions.</em>',
  ],
  choices: [
    { text: 'Play Again', next: '__replay__' },
  ],
},

ember_end_conspiracy: {
  loc: 'Kundorath', icon: '🔍',
  title: 'The Thread Unravels',
  image: '🕵️',
  art: '  ★  ENDING  ★\n  THE THREAD\n   UNRAVELS\n  ★★★★★★  ★',
  endingType: 'truth',
  endingLabel: '🔍 Truth-Seeker',
  text: [
    'You lay everything before the High Lord: the Brotherhood\'s note about "Phase One" and "Phase Two," the Eryndorian merchant connection, the name Varic of House Silverfang, the implications of an organized plot to destabilize Kundorath\'s trade position.',
    'Brannakk\'s expression hardens to volcanic rock. "This is not a theft. This is the opening move of something larger."',
    'Within a day, Kundorath\'s spymasters are in motion. Word goes to the Adventure Guild headquarters in Eryndor. A diplomatic crisis unfolds when Eryndor\'s King publicly distances himself from House Silverfang — Varic, it emerges, was operating without royal sanction.',
    'The conspiracy unravels. Varic disappears before he can be fully questioned. The Brotherhood\'s role goes officially uninvestigated — they were hired, not architects.',
    '"Phase Two" is never enacted. Whatever it was designed to achieve, your investigation prevented it before it could begin.',
    '<em>The Guild promotes you one rank. Kundorath names you an Honorary Smith — a title that has never before been given to someone who isn\'t a dwarf.</em>',
  ],
  choices: [
    { text: 'Play Again', next: '__replay__' },
  ],
},

ember_end_revelation: {
  loc: 'Kundorath', icon: '⛓️',
  title: 'The Spirit Set Free',
  image: '✨',
  art: '  ★  ENDING  ★\n  THE SPIRIT\n   SET FREE\n  ★★★★★★  ★',
  endingType: 'neutral',
  endingLabel: '✨ The Liberator',
  text: [
    'You tell the High Lord everything: the fire elemental, the imprisoned spirit, the thousand years of suffering baked unknowing into the foundation of Kundorath\'s prosperity.',
    'Brannakk holds the Crown and stares at it for a very long time.',
    '"A thousand years," he says finally. "We built our kingdom on a thousand years of pain we never knew existed." Another silence. "We cannot unknow this now."',
    'He calls his senior mages and the elder priests of the Forge-God. After three days of debate — the forges burning cold, the kingdom enduring — he makes his decision.',
    'The Crown is brought to the magma chamber. The spirit is freed.',
    'Her release is like a second sunrise: light pouring through Kundorath\'s tunnels, warm and golden and grateful. The dwarves who witness it speak of it for generations.',
    'It takes two years of hard work with Eldarvein\'s mages to engineer a new method for channeling volcanic heat. Two difficult, cold years. But a new tradition is born — one built on knowledge and partnership rather than captivity.',
    '<em>Kundorath\'s new forge-method becomes the most celebrated engineering achievement of the current century. And its origin — the adventurer who told the truth when silence was easier — is remembered long after the gold of your reward is spent.</em>',
  ],
  choices: [
    { text: 'Play Again', next: '__replay__' },
  ],
},

ember_end_truth_elemental: {
  loc: 'Old Collapsed Shaft, Kundorath Depths', icon: '✨',
  title: 'A Fire Set Free',
  image: '🌟',
  art: '  ★  ENDING  ★\n   A FIRE SET\n      FREE\n  ★★★★★★  ★',
  endingType: 'truth',
  endingLabel: '🕊️ The Liberator',
  text: [
    'You choose the spirit over the kingdom\'s convenience.',
    'The elemental carries the Crown into the magma lake. The fire that takes it is white-hot — beyond anything Kundorath\'s forges have ever produced. The gold is gone in moments.',
    'What rises from the lava is not fire. It is <em>light</em> — a figure of pure luminance, young and confused and grateful and free. The fire spirit, released after a thousand years, looks at you with eyes like contained stars.',
    'She says nothing in any language you speak. But the warmth she radiates in that one brief moment — before she ascends through the mountain and out into open sky — is nothing like forge-heat.',
    'It feels like being forgiven for something you didn\'t do.',
    'You return to Brannakk with no Crown. The explanation takes a long time. The kingdom faces hard months ahead.',
    'But a fire spirit flies free above Ardenveil for the first time in a thousand years. And when the sun rises over Kundorath the next morning, its light is somehow warmer than it was before.',
    '<em>The Guild marks your record: Unconventional Outcome. No monetary reward. One spirit freed. One kingdom changed forever.</em>',
  ],
  choices: [
    { text: 'Play Again', next: '__replay__' },
  ],
},

ember_end_partial: {
  loc: 'Kundorath', icon: '📜',
  title: 'The Truth Must Be Enough',
  image: '🌋',
  art: '  ★  ENDING  ★\n  THE TRUTH\n   MUST SUFFICE\n  ★★★★★★  ★',
  endingType: 'chaos',
  endingLabel: '📜 The Witness',
  text: [
    'The Crown is gone. You could not recover it in time.',
    'But what you bring to High Lord Brannakk is arguably more valuable: the full accounting of a conspiracy. Names, connections, a paper trail that the Guild\'s political arm can use.',
    'Kundorath faces two difficult months. Eryndorian mages work with Eldarvein scholars to engineer a temporary forge-heat solution. Trade suffers. The kingdom does not fall — dwarven resilience being what it is — but it is strained and angry.',
    'The Crown resurfaces at auction in Danseleif, purchased by an anonymous buyer. By then, diplomatic pressure has made it impossible to use openly. It is recovered quietly, two years later, through channels you put in motion today.',
    'Not the victory you wanted. But the truth you found may prevent the next theft. And the one after that.',
    '<em>The Guild marks your record: Partial Success. Information recovered. Crown temporarily lost. Investigation ongoing. Your reward: whatever satisfaction truth brings — and a note of commendation from the High Lord himself.</em>',
  ],
  choices: [
    { text: 'Play Again', next: '__replay__' },
  ],
},

} // end SCENES
