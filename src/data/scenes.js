/**
 * Scene graph for "The Chromatic Seal"
 *
 * Each scene:
 *   loc, icon       – location name + emoji for banner
 *   title           – heading displayed in card
 *   image           – large decorative emoji
 *   art             – ASCII art header (rendered in <pre>, monospace)
 *   text            – array of HTML strings (only <em>/<strong> allowed, sanitised at render)
 *   speciesSelect   – if true, renders species-select UI instead of choices
 *   endingType      – 'neutral'|'chaos'|'traitor'|'hero'|'truth'
 *   endingLabel     – badge text
 *   onEnter(draft)  – Immer draft mutator called when entering scene
 *   combat          – combat config { enemy, difficulty, hp_cost, win, lose, desc }
 *   choices[]       – array of choice objects
 *
 * Choice objects:
 *   text            – HTML string for button label
 *   condition(s)    – optional predicate(state) → bool
 *   action(draft)   – optional Immer draft mutator run when choice is selected
 *   next            – scene key to navigate to (or '__replay__')
 *   req             – optional requirement hint string
 */

/** @typedef {import('./gameReducer').GameState} GameState */

export const SCENES = {

// ══════════════════════════════════════════════════════════
// TITLE + INTRO
// ══════════════════════════════════════════════════════════

title: {
  loc: '', icon: '',
  title: 'The Chromatic Seal',
  image: '🐉',
  art: '  ·  *  ·  *  ·  *  ·\n ~  THE CHROMATIC SEAL  ~\n  ·  *  ·  *  ·  *  ·',
  text: [
    '<em>An Ardenveil Choice Adventure</em>',
    'Five ancient dragons. One stolen artifact. The fate of an entire world balanced on a single decision.',
    'The <strong>Chromatic Seal</strong> has kept the great dragons bound to their territories since the age of legend. Three nights ago, it was stolen from beneath the Great Cathedral of Eryndor.',
    'Guildmaster Ottari has summoned you personally. That has never happened before.',
    '<em>This is not a normal contract.</em>',
  ],
  choices: [
    { text: 'Begin your adventure →', next: 'species_select' },
  ],
},

species_select: {
  loc: 'Eryndor — Guild Hall', icon: '⚜️',
  title: 'Who Are You?',
  image: '🪞',
  art: '╔════ YOUR HERITAGE ═════╗\n║  Heritage shapes fate   ║\n╚═════════════════════════╝',
  text: [
    "Before you answer Ottari's summons, take a moment. You've been in Eryndor long enough to know that who you are changes everything — what doors open, what threats you can survive, what truths you can uncover.",
    '<em>Choose your heritage. It will matter.</em>',
  ],
  speciesSelect: true,
  choices: [],
},

intro_ottari: {
  loc: "Eryndor — Guildmaster's Office", icon: '⚜️',
  title: 'A Private Summons',
  image: '🕯️',
  art: ' ─── THE GUILD HALL ─────\n [   OAK  &  IRON DOOR  ]\n ────────────────────────',
  text: [
    "The door is heavy oak reinforced with iron bands. Two Guild sentries flank it — not the usual bored door-wardens, but veterans with hands near their blades. <em>Whatever this is, it's serious.</em>",
    'Guildmaster <strong>Ottari</strong> stands at her desk, back to you, staring at a map of Ardenveil. She is a compact woman of late middle age, Halfling heritage on her mother\'s side, Guild tattoos up both forearms. She does not turn when you enter.',
    '"Shut the door," she says. "And lock it."',
    "You do. The room smells of old parchment, cooling wax, and something metallic — the kind of smell that reminds you of blood, though you cannot see any.",
  ],
  choices: [
    { text: '"What\'s happened, Guildmaster?" Speak plainly.', next: 'guild_briefing', action: draft => { draft.flags.direct = true } },
    { text: 'Say nothing. Wait for her to explain on her own terms.', next: 'guild_briefing', action: draft => { draft.flags.patient = true } },
  ],
},

guild_briefing: {
  loc: "Eryndor — Guildmaster's Office", icon: '⚜️',
  title: 'The Stolen Seal',
  image: '📜',
  art: '  ≡  ≡  ≡  ≡  ≡  ≡  ≡\n  §   THREE NIGHTS AGO\n  ≡  ≡  ≡  ≡  ≡  ≡  ≡',
  text: [
    "Ottari finally turns. Her eyes are hard and tired — the eyes of someone who hasn't slept.",
    '"Three nights ago, the <strong>Chromatic Seal</strong> was stolen from the vault beneath the Great Cathedral," she says. "The Seal is not a legend. I\'ve seen it. The Church has been keeping it for four hundred years, and the High Priest just sent me his regrets and a list of impossible demands that I clean up his mess."',
    'She slides a sealed document across the desk. "The Seal binds the five Chromatic Dragons to their territories. Without it, the binding is not immediate — but it is deteriorating. We estimate <em>three weeks</em> before the first dragon tests its border. Perhaps less."',
    '"I have three leads. Three directions. I can only send one person quietly, without raising panic. I am sending <em>you</em>." She looks you over. "The thief\'s trail points toward Danseleif\'s harbour district. An Elven contact in Eldarvein may know what the artifact actually does. And... there have been strange reports from the road to Kundorath — cultists, near Pyrrhagon\'s volcano." Her jaw tightens. "<em>Pick one. Move tonight.</em>"',
  ],
  choices: [
    {
      text: 'Head to <strong>Danseleif</strong> — Follow the harbour smugglers.',
      next: 'danseleif_arrive',
      action: draft => { draft.flags.path = 'danseleif'; draft.notifications.push('Path: The Harbour Road') },
    },
    {
      text: 'Head to <strong>Eldarvein</strong> — Seek the Elven archivist.',
      next: 'eldarvein_arrive',
      action: draft => { draft.flags.path = 'eldarvein'; draft.notifications.push('Path: The Forest Road') },
    },
    {
      text: 'Head to <strong>Kundorath</strong> — Investigate the cultists directly.',
      next: 'kundorath_arrive',
      action: draft => { draft.flags.path = 'kundorath'; draft.notifications.push('Path: The Mountain Road') },
    },
  ],
},

// ══════════════════════════════════════════════════════════
// DANSELEIF PATH
// ══════════════════════════════════════════════════════════

danseleif_arrive: {
  loc: 'Danseleif — The Harbour District', icon: '⚓',
  title: 'Salt and Secrets',
  image: '🌊',
  art: '  ~   ~   ~   ~   ~   ~\n  ≈   DANSELEIF DOCKS  ≈\n  ~   ~   ~   ~   ~   ~',
  text: [
    "<strong>Danseleif</strong> never truly sleeps. Even at the hour you arrive, the docks are alive with lantern-light and the creak of ropes, dockhands unloading night-shipments, customs officers looking the other way for the right number of coins.",
    "You show Ottari's sealed letter to the harbourmaster — a nervous Dwarf named <strong>Belwick</strong> who sweats too much for the mild evening. He confirms it: a small vessel left the night the Seal was stolen, bound for no registered destination.",
    '"The captain was asking about buyers," Belwick says, not meeting your eyes. "There\'s a tavern. The <strong>Crimson Lantern</strong>. In the market quarter. That\'s all I know." He slides your letter back with a shaking hand.',
    "He's lying. But that part is probably true.",
  ],
  choices: [
    { text: 'Go to the Crimson Lantern immediately.', next: 'crimson_lantern' },
    { text: 'Follow Belwick when he leaves his post.', next: 'follow_belwick' },
  ],
},

follow_belwick: {
  loc: 'Danseleif — The Back Streets', icon: '⚓',
  title: 'The Nervous Harbourmaster',
  image: '🌙',
  art: '  .   .   .   .   .   .\n  [   DARK  STREETS   ]\n  .   .   .   .   .   .',
  text: [
    "You wait. Three minutes after your conversation, Belwick locks his office and moves quickly through the winding streets behind the dockyard — not toward home, but toward the market quarter.",
    "He leads you straight to the <strong>Crimson Lantern</strong>, enters through the back, and does not come out.",
    "But you've learned something useful: whoever is inside already <em>knows you're here</em>.",
  ],
  choices: [
    { text: 'Enter the front door as if you own the place.', next: 'crimson_lantern', action: draft => { draft.flags.warned = true } },
    { text: 'Watch from outside and wait for Belwick to re-emerge.', next: 'crimson_lantern_wait' },
  ],
},

crimson_lantern_wait: {
  loc: 'Danseleif — Market Quarter', icon: '⚓',
  title: 'Patience Rewarded',
  image: '🕰️',
  art: '  -   -   -   -   -   -\n  [   THE LONG  VIGIL  ]\n  -   -   -   -   -   -',
  text: [
    "You wait in the shadow of a chandler's stall for almost an hour. When Belwick finally emerges, he's pale and moving fast. He's clutching a folded note.",
    'You intercept him in the alley. He doesn\'t fight — he just crumbles. "They\'ll kill me," he whispers. "They\'re <em>Brotherhood</em>."',
    "He shows you the note. It's a rendezvous address: a warehouse on Pier Seven, midnight. <em>The Seal will be moved then.</em>",
    "You have a few hours — and now you know exactly where the handoff happens. You also now have a cooperating witness who knows the Brotherhood's local faces.",
  ],
  onEnter: draft => {
    draft.items.push('Rendezvous Note')
    draft.flags.belwick_helped = true
    draft.notifications.push('+Item: Rendezvous Note')
  },
  choices: [
    { text: 'Go directly to Pier Seven warehouse.', next: 'brotherhood_warehouse', action: draft => { draft.flags.warehouse_early = true } },
    { text: 'Enter the Crimson Lantern first — get more information.', next: 'crimson_lantern' },
  ],
},

brotherhood_warehouse: {
  loc: 'Danseleif — Pier Seven', icon: '⚓',
  title: 'The Handoff',
  image: '🏭',
  art: '╔══════ PIER  SEVEN ══════╗\n║    midnight  handoff    ║\n╚═════════════════════════╝',
  text: [
    "The warehouse is exactly where the note said. You arrive two hours before midnight, which gives you time to position yourself among the stacked crates near the loading door.",
    "They arrive on schedule: four figures in sand-coloured sashes, carrying a locked iron case. They don't have the Seal — <em>this</em> is the pickup, not the dropoff. Someone else is bringing it.",
    "At midnight, a second group arrives. And the Seal changes hands ten metres from where you're crouching.",
    "<em>You know where it's going now. Kundorath. You heard the word clearly. And you know which road they'll take.</em>",
  ],
  onEnter: draft => {
    draft.flags.knows_tunnel = true
    draft.items.push('Brotherhood Map')
    draft.flags.brotherhood_allied = true
    draft.notifications.push('+Item: Brotherhood Map | Overheard: Kundorath route')
  },
  choices: [
    { text: 'Follow them to Kundorath.', next: 'volcano_road_d' },
  ],
},

crimson_lantern: {
  loc: 'Danseleif — The Crimson Lantern', icon: '⚓',
  title: 'The Tavern of Hidden Things',
  image: '🏮',
  art: '╔════════════════════╗\n║  CRIMSON  LANTERN  ║\n║  ·  ·  ·  ·  ·  · ║\n╚════════════════════╝',
  text: [
    "The Crimson Lantern is neither as welcoming as its name suggests nor as threatening as it probably should be. The clientele are the kind of people who have learned not to look directly at strangers — a skill that requires extensive practice.",
    'A one-eyed Human woman behind the bar slides you a drink without being asked. "You\'re from the Guild," she says. It is not a question. "The people you want are upstairs. Room three. They\'re expecting <em>someone</em> — not sure if it\'s you specifically, but they\'re armed either way."',
    'She leans closer. "There\'s a second way up. The storeroom ladder. Slow, but quiet." She holds out her palm for the coin she clearly expects.',
    "<em>She's selling information to everyone who walks in. That's fine. It still saves you time.</em>",
  ],
  choices: [
    {
      text: "Pay her and use the quiet storeroom route. (Costs 3 gold)",
      next: 'brotherhood_found',
      condition: s => s.gold >= 3,
      action: draft => { draft.gold -= 3; draft.flags.stealthy = true; draft.notifications.push('-3g — Paid for information') },
      req: 'Requires 3 gold',
    },
    { text: "Walk straight up the main stairs. You're done being subtle.", next: 'brotherhood_found' },
    {
      text: '[TIEFLING] Give her a look she\'ll remember. No coin needed.',
      condition: s => s.species === 'tiefling',
      next: 'brotherhood_found',
      action: draft => { draft.flags.stealthy = true; draft.notifications.push("[Hellsight] She flinched. She's seen what you are before.") },
    },
  ],
},

brotherhood_found: {
  loc: 'Danseleif — The Crimson Lantern, Room 3', icon: '⚓',
  title: 'The Brotherhood',
  image: '🗡️',
  art: ' ─────────────────────\n [     ROOM  THREE    ]\n  §    SANDSHADE §\n ─────────────────────',
  text: [
    "Three of them. Around a table covered in nautical charts and trade ledgers that are definitely not about legitimate trade. <strong>One Halfling, one Human, one Tiefling</strong> — all wearing the sand-coloured sash of the <em>Sandshade Brotherhood</em> under their coats.",
    "The Halfling — clearly the one in charge — looks at you with complete calm. \"Guild,\" she says. \"We wondered when Ottari would send someone. Sit down.\" Her hand hasn't moved toward her weapon. That's either a good sign or a very bad one.",
    '"We didn\'t steal the Seal," she says. "But we know who did. And we know where it\'s going. We\'ve been tracking this ourselves — there\'s a <em>Cult of the Flame</em> moving it to Pyrrhagon\'s volcano. If those fools crack the Seal open, the dragons roam free, civilization crumbles, and our trade network dies with it. We have self-interest in stopping this."',
    'She slides a map across the table. "The Seal moves through the volcano pass at dawn, four days from now. We share what we know — you share what Ottari knows. Or..." She shrugs. "We can do this the hard way, and nobody wins."',
  ],
  choices: [
    {
      text: "Accept the deal. Share intelligence, take the map. The Brotherhood wants the same outcome.",
      next: 'brotherhood_deal',
      action: draft => { draft.items.push('Brotherhood Map'); draft.flags.brotherhood_allied = true; draft.notifications.push('+Item: Brotherhood Map') },
    },
    { text: "Demand the map without giving anything in return.", next: 'brotherhood_fight' },
    {
      text: "[HUMAN] Appeal to their business sense — offer a future Guild contract instead of information.",
      condition: s => s.species === 'human',
      next: 'brotherhood_deal',
      action: draft => {
        draft.items.push('Brotherhood Map')
        draft.flags.brotherhood_allied = true
        draft.flags.guild_contract = true
        draft.gold += 5
        draft.notifications.push('+Item: Brotherhood Map | +5g — Silver Tongue')
      },
    },
  ],
},

brotherhood_fight: {
  loc: 'Danseleif — The Crimson Lantern', icon: '⚓',
  title: 'The Hard Way',
  image: '⚔️',
  art: '  * *  SWORDS  DRAWN  * *\n  [    THE  STAIR    ]\n  * * * * * * * * * * *',
  text: ['The Halfling sighs with what sounds like genuine disappointment. "I told them it was a Guild type," she says. Then her colleagues are already moving.'],
  combat: { enemy: 'Brotherhood Enforcers', difficulty: 8, hp_cost: 2, win: 'brotherhood_fight_win', lose: 'brotherhood_fight_lose', desc: 'Two armed Brotherhood operatives against you — fast, experienced, fighting dirty.' },
  choices: [],
},

brotherhood_fight_win: {
  loc: 'Danseleif — The Crimson Lantern', icon: '⚓',
  title: 'Convincing Argument',
  image: '🩹',
  art: ' ◆ ──────────────── ◆\n      HARD  WON\n ◆ ──────────────── ◆',
  text: [
    "They're not dead — just decisively discouraged. The Halfling hasn't moved. She's looking at you with a new expression: <em>reassessment</em>.",
    '"Alright," she says. "Take the map. You\'ve earned it." She doesn\'t add anything else. The Brotherhood gives respect through silence.',
  ],
  onEnter: draft => { draft.items.push('Brotherhood Map'); draft.flags.brotherhood_wary = true; draft.notifications.push('+Item: Brotherhood Map') },
  choices: [{ text: 'Take the map and head for Kundorath.', next: 'volcano_road_d' }],
},

brotherhood_fight_lose: {
  loc: 'Danseleif — Back Alley', icon: '⚓',
  title: 'A Lesson in Humility',
  image: '💊',
  art: '  .   .   .   .   .   .\n  [   THE  BACK ALLEY  ]\n  .   .   .   .   .   .',
  text: [
    "You wake up in the alley behind the Lantern. Your coin purse is lighter, but you're alive — they could have killed you and chose not to. <em>Deliberate.</em> There's a folded note pinned to your coat.",
    '"The Seal goes through Kundorath pass at dawn in four days. We\'ll be there too — whether you trust us or not. — The Dunestrider\'s people"',
    "You drag yourself upright, map the bruises, and decide the only direction left is forward.",
  ],
  onEnter: draft => { draft.gold = Math.max(0, draft.gold - 4); draft.flags.brotherhood_enemy = true; draft.notifications.push('-4g — Coin taken while unconscious') },
  choices: [{ text: 'Head for Kundorath. The note tells you enough.', next: 'volcano_road_d' }],
},

brotherhood_deal: {
  loc: 'Danseleif — The Crimson Lantern', icon: '⚓',
  title: 'An Unlikely Alliance',
  image: '🤝',
  art: '  ════ AN ALLIANCE ═════\n  [  sealed  by  word  ]\n  ════════════════════',
  text: [
    "The Halfling tells you what they know: <em>The Cult of the Flame</em> is a splinter sect of Kundorath's fire-worship tradition, radicalised into believing the Chromatic Dragons are divine entities being unjustly imprisoned. Their leader, a Dwarf who calls himself <strong>Cindervast</strong>, has been planning this theft for years.",
    '"They have twelve cultists, at least two wizards, and a fire elemental they\'ve managed to bind. And..." She hesitates. "They believe cracking the Seal will cause the dragons to revere them. They\'re wrong. Pyrrhagon doesn\'t revere <em>anything</em>."',
    'She hands over the map. "Kundorath pass. Dawn. Four days. Don\'t die before you get there — you\'ll want every advantage you can carry."',
  ],
  choices: [{ text: 'Thank her and depart for Kundorath immediately.', next: 'volcano_road_d' }],
},

volcano_road_d: {
  loc: 'Road to Kundorath', icon: '🏔️',
  title: 'Three Days and a Mountain',
  image: '🌋',
  art: '      /\\    /\\\n     /  \\  /  \\\n    /  THE PASS  \\\n   /──────────────\\',
  text: [
    "The road to Kundorath climbs through increasingly barren terrain. By the second day the air has changed — drier, hotter, carrying a faint sulphurous note on the wind.",
    "A Dwarven mining patrol stops you near the pass. Their sergeant, a scarred woman named <strong>Brokk</strong>, looks at your Guild emblem and then at the map in your pack with an unreadable expression.",
    '"Cult activity near the upper caldera has been reported for a month," she says. "We were told to stay away from the volcano proper. Political sensitivity." She says the last two words with profound contempt. "If you\'re going up there — and I can see you are — there\'s an old maintenance tunnel on the eastern face. Bypasses the main cultist camp. Sword-work at the end of it, mind."',
    'She wishes you luck with her eyes if not her words, and her patrol moves on.',
  ],
  onEnter: draft => { draft.flags.knows_tunnel = true },
  choices: [
    { text: 'Take the eastern tunnel — stealth approach.', next: 'lava_tunnels' },
    { text: 'Go through the main cultist camp directly.', next: 'cultist_camp', action: draft => { draft.flags.direct_approach = true } },
  ],
},

// ══════════════════════════════════════════════════════════
// ELDARVEIN PATH
// ══════════════════════════════════════════════════════════

eldarvein_arrive: {
  loc: 'Eldarvein — The Forest Gate', icon: '🌿',
  title: 'The City of Ancient Light',
  image: '✨',
  art: ' | | | | | | | | | | |\n   *   ELDARVEIN   *\n | | | | | | | | | | |',
  text: [
    "<strong>Eldarvein</strong>. Even after centuries of cautious openness, most non-Elves feel it when they cross the boundary — a faint pressure behind the eyes, the sense of being assessed by something patient and very old. The trees here are five hundred years at minimum. They remember things.",
    "The Gate Warden — a High Elf who has spent probably three centuries perfecting a particular expression of polite disdain — examines your Guild credentials and Ottari's letter. He says nothing. He allows you through.",
    "The Arcane Archive is at the city's centre: a spire of pale stone that hums with contained magic. <strong>Chief Archivist Therindal</strong> was the name Ottari gave you. Something in how she said it suggested he would already know you were coming.",
    '<em>That thought is not entirely comforting.</em>',
  ],
  choices: [
    { text: 'Go to the Archive immediately. Time matters.', next: 'archive_halls' },
    {
      text: "[ELF] Speak to the Gate Warden in High Elvish first. There's something he's not saying.",
      condition: s => s.species === 'elf',
      next: 'elf_gate_secret',
      action: draft => { draft.flags.elf_warned = true },
    },
  ],
},

elf_gate_secret: {
  loc: 'Eldarvein — The Forest Gate', icon: '🌿',
  title: 'What the Warden Knows',
  image: '👁️',
  art: ' ─── THE FOREST GATE ────\n [   words  unspoken   ]\n ─────────────────────────',
  text: [
    "You address him in Old High Elvish — the formal register, not the casual tongue. He blinks. <em>He didn't expect that.</em>",
    'He says, very quietly: <em>"Therindal has been expecting a Guild visitor since the Seal was taken. He sent a message himself — but did not tell the Council he had done so. There is a reason for that. Be careful with how much you tell him, and how much you let him tell you."</em>',
    "He returns to his polite disdain as if the conversation never happened. But his warning sits with you as you walk toward the Archive.",
  ],
  choices: [{ text: 'Head to the Archive, armed with that knowledge.', next: 'archive_halls' }],
},

archive_halls: {
  loc: 'Eldarvein — The Arcane Archive', icon: '🌿',
  title: 'Among the Stacks',
  image: '📚',
  art: '╔═════ THE ARCHIVE ══════╗\n║ ≡≡   THE STACKS   ≡≡  ║\n╚════════════════════════╝',
  text: [
    "The Archive is <em>vast</em>. Thousands of years of accumulated magical scholarship, indexed by a system that no non-Elf has ever fully understood. Mana-lights float at reading height, adjusting their brightness as you move.",
    "You find <strong>Chief Archivist Therindal</strong> at his desk — a tall Elf of apparently mid-age (which means he could be eight hundred years old) with sharp cheekbones and ink-stained fingers. He looks at your credentials, then at you, and nods slowly.",
    '"The Chromatic Seal," he says. "Yes. I know why you\'re here." He doesn\'t look surprised. He looks... <em>relieved</em>.',
    '"I need to show you something before I tell you what I know. Something that the Church of Eryndor has been very careful to keep out of the literature." He stands. "Come. Quietly. Not everyone in this Archive should hear what I am about to say."',
  ],
  choices: [
    { text: 'Follow him deeper into the stacks.', next: 'archivist_secret' },
    {
      text: "[ELF] You sense a faint but distinct trace of fear-magic on him. Ask about it directly.",
      condition: s => s.species === 'elf',
      next: 'archivist_secret',
      action: draft => { draft.flags.elf_sensed_fear = true; draft.notifications.push("[Arcane Sense] He's being watched. Or he thinks he is.") },
    },
  ],
},

archivist_secret: {
  loc: 'Eldarvein — The Restricted Stacks', icon: '🌿',
  title: "The Seal's True History",
  image: '🔮',
  art: '  .   .   .   .   .   .\n  [  RESTRICTED STACKS ]\n  §   truth  within §\n  .   .   .   .   .   .',
  text: [
    "The room he leads you to has no windows and a door reinforced with warding glyphs. He opens a locked case and removes a scroll — old enough that it predates the Erydian Calendar.",
    '"The Chromatic Seal was not forged <em>to bind the dragons</em>," Therindal says. "It was forged to <em>convince everyone else</em> that the dragons were bound." He unrolls the scroll carefully. "The dragons occupy their territories because they <em>choose</em> to. Pyrrhagon is ancient and patient. Nivalis prefers isolation. The Seal is a symbol — a piece of theatre that has kept <em>people</em> from doing something catastrophically stupid for four hundred years."',
    '"If the Seal is destroyed," he continues, "nothing changes about the dragons. But human civilization — Eryndor, Amarun, Kundorath — they will believe the binding is broken. They will <em>panic</em>. They will make terrible decisions. And <em>that</em>," he says, "is what the Cult of the Flame actually wants. Not to free the dragons. To fracture the political order."',
    '<em>The Seal is a lie. But the lie is load-bearing.</em>',
  ],
  onEnter: draft => {
    draft.flags.knows_truth = true
    draft.items.push("Scholar's Notes")
    draft.notifications.push("+Item: Scholar's Notes | [TRUTH UNLOCKED]")
  },
  choices: [
    { text: '"Where is the Seal now?" Focus on retrieval.', next: 'eldarvein_lead' },
    { text: '"Who sent you the warning? Someone in Eryndor?"', next: 'archivist_contact' },
  ],
},

archivist_contact: {
  loc: 'Eldarvein — The Restricted Stacks', icon: '🌿',
  title: 'The Informant',
  image: '📨',
  art: ' ──── THE  INFORMANT ────\n  §   BROTHER ALDRIC §\n ───────────────────────',
  text: [
    '"A Church scholar who has since — disappeared," Therindal says carefully. "He sent me the original theft report through unofficial channels. He believed certain factions within the Church itself may have <em>allowed</em> the theft. A Seal that is stolen is a Seal that can be \'recovered\' with great ceremony, and that recovery would greatly increase the Church\'s political authority." He pauses. "I do not say they orchestrated it. I say they did not stop it when they could have."',
    "He gives you a name: <strong>Brother Aldric</strong>. Now missing. Last seen near the Kundorath road.",
    '"The Seal is moving toward Pyrrhagon\'s volcano. I believe the Cult has it. And I believe there are people who would rather you didn\'t retrieve it — on <em>both sides</em> of this conflict."',
  ],
  onEnter: draft => { draft.flags.church_complicit = true },
  choices: [{ text: 'Head for Kundorath with this knowledge.', next: 'eldarvein_lead' }],
},

eldarvein_lead: {
  loc: 'Eldarvein — Southern Gate', icon: '🌿',
  title: 'The Forest Road South',
  image: '🌲',
  art: '  ═══ THE FOREST ROAD ═══\n  [   heading  south   ]\n  ═════════════════════',
  text: [
    "Therindal gives you the last piece: a sketch map from the missing Brother Aldric's correspondence, showing a maintenance route into the volcanic caldera that the cultists would not know about.",
    '"The Seal moves at dawn in four days," he says. "After that — I\'m not certain what happens. The cult may have the knowledge to use it, or they may simply destroy it. Either outcome is bad."',
    'He holds the door open. "One more thing. Whatever you choose to <em>do</em> with the Seal when you find it — remember what I told you. The truth is yours. What you decide to do with the truth is yours as well."',
    '<em>You have never been given a more uncomfortable gift.</em>',
  ],
  onEnter: draft => { draft.flags.knows_tunnel = true },
  choices: [{ text: 'Ride for Kundorath. You have three days.', next: 'lava_tunnels' }],
},

// ══════════════════════════════════════════════════════════
// KUNDORATH PATH
// ══════════════════════════════════════════════════════════

kundorath_arrive: {
  loc: 'Kundorath — The Mountain City', icon: '⚒️',
  title: 'Under the Volcano',
  image: '🌋',
  art: '       /\\\n      /  \\\n     /FIRE\\\n    /──────\\\n   /KUNDORATH\\',
  text: [
    "<strong>Kundorath</strong> is built into the side of an active volcano, and its citizens have made their peace with this in the way people make peace with facts that cannot be changed: they worship it. The forge-temples ring every hour. The air tastes like hot iron. Lava channels run through the lower city like irrigation for industry.",
    "The Guild contact here is a retired adventurer named <strong>Gorveld</strong> — a one-armed Dwarf who runs a weapons maintenance shop and pretends he's retired to everyone's face. He reads Ottari's letter and his expression flickers from professional neutrality to something like fear.",
    '"Cult activity," he says. "I\'ve seen it. Not cultists — Cult. Capital C. <em>Cindervast\'s people</em>." He says the name like it tastes bad. "They\'re up at the caldera. I\'ve had three of my own contacts go up there in the last week and not come back." He pulls out a cured leather roll containing a map. "I\'ll give you the maintenance tunnel route. Free. Because I want these people stopped and I want them stopped by someone who has all their limbs and a fighting chance."',
  ],
  choices: [
    { text: '"Tell me everything about Cindervast and the cult."', next: 'kundorath_intel' },
    {
      text: '"I need to move quickly. Just give me the tunnel map."',
      next: 'kundorath_quick',
      action: draft => { draft.flags.skipped_intel = true },
    },
  ],
},

kundorath_quick: {
  loc: "Kundorath — Gorveld's Shop", icon: '⚒️',
  title: 'Every Hour Counts',
  image: '⏱️',
  art: '  ═══ THE FORGE CITY ════\n  [  GORVELD\'S  SHOP  ]\n  ═══════════════════════',
  text: [
    'Gorveld nods tightly and hands over the map without another word. He respects directness. "Eastern maintenance shaft. The heat wards are old but they still work. Follow the orange-painted markers — Dwarven survey marks from forty years back." He pauses at the door. "Kill Cindervast if you can. That man is <em>wrong in the head</em> about what dragons are."',
    "You're already moving.",
  ],
  onEnter: draft => { draft.items.push('Tunnel Map'); draft.flags.knows_tunnel = true; draft.notifications.push('+Item: Tunnel Map') },
  choices: [{ text: 'Head for the eastern maintenance shaft.', next: 'lava_tunnels' }],
},

kundorath_intel: {
  loc: "Kundorath — Gorveld's Shop", icon: '⚒️',
  title: 'Know Your Enemy',
  image: '🔍',
  art: ' ─── KNOW  THINE  ENEMY ──\n [     CINDERVAST      ]\n ─────────────────────────',
  text: [
    "Gorveld pours two cups of something volcanic-tasting and begins.",
    '"<strong>Cindervast</strong> was a senior priest of the Forge Temple. Respected man. Three years ago something changed in his theology — he became convinced that the Chromatic Dragons were divine beings we had unjustly imprisoned, and that freeing them would bring a new age of fire and rebirth." Gorveld\'s expression makes clear what he thinks of this. "He gathered followers. Real believers. About fourteen of them, plus hired muscle."',
    '"The dangerous ones are his two casters — a Human wizard called <strong>Scalder</strong> and an Elf who won\'t give a name. Scalder can call fire elementals. The Elf is the one who actually knows how to interact with the Seal — that\'s who you need to watch."',
    '"They also..." He hesitates. "They have a <em>captive</em>. A Church scholar they took from the road. A Brother Aldric. I don\'t know if he\'s still alive."',
    'He hands over the map and a vial of <em>heat-resist salve</em>. "That\'ll help in the deep tunnels. Don\'t lose it."',
  ],
  onEnter: draft => {
    draft.items.push('Tunnel Map')
    draft.items.push('Heat-Resist Salve')
    draft.flags.knows_tunnel = true
    draft.flags.knows_aldric = true
    draft.notifications.push('+Tunnel Map, +Heat-Resist Salve')
  },
  choices: [{ text: "Head for the eastern maintenance shaft. You know what you're facing.", next: 'lava_tunnels' }],
},

// ══════════════════════════════════════════════════════════
// CONVERGENCE
// ══════════════════════════════════════════════════════════

cultist_camp: {
  loc: 'Kundorath — Upper Caldera', icon: '🌋',
  title: 'Through the Front Door',
  image: '🔥',
  art: ' * *  CALDERA  CAMP  * * *\n [    RING OF ALTARS    ]\n * * * * * * * * * * * * *',
  text: [
    "The main camp is a ring of tents and fire-altars, arranged around the caldera's western edge with the casual confidence of people who believe the volcano is on their side. Fifteen cultists visible. Two in robes — probably the casters Gorveld mentioned.",
    "You've been spotted. There is no hiding now.",
    "A Dwarf in ceremonial ash-painted armour raises a hand — and twelve cultists begin to close around you.",
    '<em>Cindervast himself. He looks at you with genuine pity.</em>',
    '"Another Guild dog," he says. "I expected this. You cannot stop what the flame demands — but I will offer you the mercy of a quick end."',
  ],
  combat: { enemy: 'Cult Vanguard', difficulty: 10, hp_cost: 3, win: 'cultist_camp_win', lose: 'cultist_camp_lose', desc: 'Six cultists with iron clubs and fire-blessed blades. Cindervast watches. He wants to see how you fight.' },
  choices: [],
},

cultist_camp_win: {
  loc: 'Kundorath — Upper Caldera', icon: '🌋',
  title: "Cindervast's Retreat",
  image: '🏃',
  art: ' ◆ ──── RETREAT ──── ◆\n   CINDERVAST  FLEES\n ◆ ────────────────── ◆',
  text: [
    "Six cultists down. The rest retreat. Cindervast is gone — he moved while you fought, deeper into the caldera. <em>Of course.</em>",
    "You've earned the hard path forward and bought yourself time. The cult knows you're coming. But so do you.",
  ],
  choices: [{ text: 'Press forward into the caldera mouth.', next: 'lava_tunnels' }],
},

cultist_camp_lose: {
  loc: 'Kundorath — Upper Caldera — Captive', icon: '🌋',
  title: 'The Prisoner',
  image: '⛓️',
  art: '  .   .   .   .   .   .\n  [    THE  PRISONER   ]\n  .   .   .   .   .   .',
  text: [
    "You wake up bound to a stake near the central fire altar. A robed figure with kind, frightened eyes is bound to the stake beside you — a Human man in the tattered remnants of Church vestments. <em>Brother Aldric.</em>",
    '"You\'re Guild," he breathes. "Thank all the gods." He\'s been here for days — weak, but clear-headed. "I know the Seal\'s history," he says urgently. "It\'s not what anyone thinks. <em>The binding is symbolic</em> — destroying it doesn\'t free the dragons, it destroys the <em>belief</em> that holds civilization together." He looks toward the altar. "Cindervast doesn\'t know this. He genuinely believes he\'s freeing divine beings. He is <em>wrong</em>."',
    "In their confidence, the cultists have left you poorly guarded. The rope is thick but old.",
  ],
  onEnter: draft => {
    draft.flags.aldric_rescued = true
    draft.flags.knows_truth = true
    draft.items.push("Scholar's Notes")
    draft.notifications.push("+Item: Scholar's Notes | [TRUTH UNLOCKED]")
  },
  choices: [{ text: 'Work the ropes loose and escape toward the inner caldera.', next: 'lava_tunnels', action: draft => { draft.hp = Math.max(1, draft.hp) } }],
},

lava_tunnels: {
  loc: 'Kundorath — Maintenance Tunnels', icon: '🌋',
  title: 'Into the Deep',
  image: '🔥',
  art: ' .:.:.:.:.:.:.:.:.:.:.\n [      THE  DEEP     ]\n [    heat  below     ]\n .:.:.:.:.:.:.:.:.:.:.',
  text: [
    "The maintenance tunnels are exactly as described: old, functional, and deeply uncomfortable. Heat radiates from the stone walls. The air shimmers at the edge of breathability. Orange survey marks from a Dwarven survey forty years ago lead you forward.",
    "You pass the remains of a rope camp — three Guild adventurers who came up here a week ago and didn't report back. Their equipment has been neatly stacked to the side of the tunnel. <em>Not looted. The cultists left it as a warning.</em>",
    "At the tunnel's end: a rough-hewn archway, and beyond it, heat-light and the sound of chanting.",
  ],
  choices: [{ text: 'Move through the archway. Cautiously.', next: 'seal_chamber_approach' }],
},

// ══════════════════════════════════════════════════════════
// SEAL CHAMBER
// ══════════════════════════════════════════════════════════

seal_chamber_approach: {
  loc: 'Kundorath — The Caldera Vault', icon: '🌋',
  title: 'The Chamber of the Seal',
  image: '💎',
  art: '╔══════ THE  VAULT ═══════╗\n║ ◆   CALDERA  DEEP   ◆  ║\n╚═════════════════════════╝',
  text: [
    "The vault is a natural chamber carved by ancient eruption, reinforced by Dwarven hands centuries ago. <strong>Cindervast</strong> stands at the centre, surrounded by seven chanting cultists. In his hands — raised above a cracked stone altar — is the <strong>Chromatic Seal</strong>.",
    "It is smaller than you imagined. A disc of black stone the size of a large plate, carved with the five Chromatic symbols, faintly luminescent with old, old magic. Beautiful. And apparently, if Therindal was right, almost entirely <em>symbolic</em>.",
    "Cindervast hasn't seen you. The chanting masks the sound of your approach. The Elven caster stands apart, watching the ritual with an expression you cannot read. <em>Not devotion. Something else.</em>",
    "One of Cindervast's assistants holds a <strong>large iron hammer</strong>, waiting for the signal to shatter the Seal.",
    '<em>You have perhaps thirty seconds before the ritual reaches its completion.</em>',
  ],
  choices: [
    { text: 'Attack immediately — kill the hammer-wielder first.', next: 'combat_cultist_guard' },
    { text: 'Call out to Cindervast. Stop him with words.', next: 'confront_cindervast' },
    {
      text: '[DRAGONBORN] Walk into the light and let Cindervast see exactly what you are.',
      condition: s => s.species === 'dragonborn',
      next: 'dragonborn_intimidate',
    },
    {
      text: '[KNOWS TRUTH] Tell Cindervast what the Seal actually is. Right now.',
      condition: s => s.flags.knows_truth === true,
      next: 'truth_confrontation',
    },
  ],
},

dragonborn_intimidate: {
  loc: 'Kundorath — The Caldera Vault', icon: '🌋',
  title: 'The Dragon-Blooded Speaks',
  image: '🐉',
  art: ' ══════ DRACONIC ══════\n  [   old  tongue   ]\n  [   old  power    ]\n ══════════════════════',
  text: [
    "You step into the light and spread your arms. The chanting stops. Every cultist in the room is staring at you.",
    'You speak in Draconic — the old tongue, the language of flame and scale. "<em>You invoke the dragons as gods. I carry their blood. Tell me — do your gods know your name?</em>"',
    "Cindervast stares. His hammer-man's arms are shaking. <em>In Draconic, his answer — I serve them — sounds small even to him.</em>",
    '"The dragons do not care who frees them," you say, switching back to Common. "Pyrrhagon is two hundred metres above us. If you crack that Seal and he decides to come down and see what the noise was about, your prayer will be the last thing you ever say."',
    "Three cultists break and run. The Elven caster has gone very still. <em>Cindervast is wavering.</em>",
  ],
  onEnter: draft => { draft.flags.cindervast_shaken = true },
  choices: [
    { text: 'Press the advantage — demand he put the Seal down.', next: 'seal_taken' },
    { text: 'Give him a moment. Let him think.', next: 'confront_cindervast' },
  ],
},

confront_cindervast: {
  loc: 'Kundorath — The Caldera Vault', icon: '🌋',
  title: 'Talking to a True Believer',
  image: '🕯️',
  art: ' ──────  FACE TO FACE ──────\n  §   a  true  believer §\n ────────────────────────',
  text: [
    "Cindervast turns to face you. He is older than you expected — weathered, with a hundred-yard stare. He does not look like a villain. He looks like a man who has followed his conviction to the edge of a volcano.",
    '"The Guild," he says, without surprise. "I prayed you would come in time to witness this. Not to stop it — to <em>witness</em>. The dragons have been slaves to human fear for four centuries. Tonight that ends."',
    '"They are not enslaved," you say. "They choose their territories. Ask any Eldarvein archivist."',
    "A flicker of something — not doubt, but a hairline crack in certainty. \"The Seal—\"",
    '"—is four hundred years old," you continue. "Whatever it was supposed to do — ask yourself who wrote the history of what it does. And who benefits from that history."',
  ],
  choices: [
    {
      text: 'Wait for him to reply. Let the doubt grow.',
      next: 'cindervast_doubts',
      condition: s => s.flags.cindervast_shaken || s.flags.knows_truth,
    },
    { text: "He's not listening. Take the Seal by force.", next: 'combat_cultist_guard' },
    {
      text: "[KNOWS TRUTH] Give him the Scholar's Notes. Let him read it himself.",
      condition: s => s.flags.knows_truth && s.items.includes("Scholar's Notes"),
      next: 'truth_confrontation',
    },
  ],
},

cindervast_doubts: {
  loc: 'Kundorath — The Caldera Vault', icon: '🌋',
  title: 'The Crack Widens',
  image: '💡',
  art: '  .   .   .   .   .   .\n  [  THE  CRACK  WIDENS ]\n  .   .   .   .   .   .',
  text: [
    "Cindervast is quiet for a long moment. The chanting has stopped. His followers watch him — waiting, as true believers watch, for certainty to reassert itself.",
    'Then, quietly: "If the Seal is symbolic... then why did the Church guard it? Why was it worth stealing?"',
    '"Because of exactly what you\'re about to do," you say. "Not to the dragons. To the people who believe in it." You hold out your hand. "Give it to me, Cindervast. Not for the Church. For the people who will panic when it\'s gone."',
    "He looks at the Seal for a long moment. Then at you. Then at his followers — and perhaps, for the first time, he is seeing them as people who trusted him with their lives, rather than instruments of a divine plan.",
    "He hands it over.",
    "<em>Just like that. A life's conviction, set down gently on the altar.</em>",
  ],
  onEnter: draft => { draft.items.push('The Chromatic Seal'); draft.flags.seal_taken_peacefully = true; draft.notifications.push('+Item: The Chromatic Seal') },
  choices: [{ text: 'Take the Seal and decide what to do with it.', next: 'final_choice' }],
},

truth_confrontation: {
  loc: 'Kundorath — The Caldera Vault', icon: '🌋',
  title: 'The Truth, Spoken Aloud',
  image: '📜',
  art: ' ══ TRUTH  SPOKEN ALOUD ══\n [   in  fire  &  stone  ]\n ═════════════════════════',
  text: [
    "You pull out the Scholar's Notes — Therindal's transcription of the original founding scroll — and begin to read aloud. In the vault, your voice carries.",
    "The Seal was not forged to bind the dragons. It was forged by the first Eryndor king and three Elf scholars to give human civilization something to believe in. A focal point for the idea that the world could be made safe. The dragons had already agreed — informally, through proxies — to remain in their territories, in exchange for being left alone.",
    "The binding was a <em>story</em>. A very useful, very important story.",
    "Cindervast's hammer-man drops his hammer. The chanting stops. The Elven caster — the one who knew — turns and walks out of the chamber without a word.",
    "Cindervast stands with the Seal in his hands. He looks at it. He looks at you. He looks at the men and women who followed him here and whom he has just led into a desert of meaning.",
    '"I..." He sets the Seal down on the altar. He doesn\'t hand it to you. He doesn\'t try to destroy it. He just sets it down and sits on the floor. <em>His followers, slowly, do the same.</em>',
  ],
  onEnter: draft => {
    draft.items.push('The Chromatic Seal')
    draft.flags.truth_revealed = true
    draft.flags.seal_taken_peacefully = true
    draft.notifications.push('+Item: The Chromatic Seal | [TRUTH ENDING AVAILABLE]')
  },
  choices: [{ text: 'Take the Seal from the altar. Decide what happens next.', next: 'final_choice' }],
},

combat_cultist_guard: {
  loc: 'Kundorath — The Caldera Vault', icon: '🌋',
  title: 'The Altar Fight',
  image: '⚔️',
  art: ' * * *   THE  ALTAR   * * *\n [    swords  &  flame   ]\n * * * * * * * * * * * * *',
  text: ['No more words. The hammer comes up and the cultists surge forward. The heat is immense. The stone underfoot is hot enough to feel through your boots.'],
  combat: { enemy: 'Cult Zealots', difficulty: 9, hp_cost: 2, win: 'seal_taken', lose: 'seal_fight_lose', desc: 'Seven armed cultists in a burning vault. Cindervast watches, Seal raised. Defeat them before he brings that hammer down.' },
  choices: [],
},

seal_fight_lose: {
  loc: 'Kundorath — The Caldera Vault', icon: '🌋',
  title: 'Not Enough',
  image: '💊',
  art: '  .   .   .   .   .   .\n  [    NOT  ENOUGH    ]\n  .   .   .   .   .   .',
  text: [
    "They overwhelm you — not with skill but with numbers and the heat that's draining you as fast as the blows. You go down.",
    "When you wake, Cindervast is standing over you. The Seal is still intact in his hands. He looks tired.",
    '"You fought for the Guild\'s lie," he says. "I suppose that\'s honourable, in its way." He sets the Seal on the altar beside you, and for reasons you don\'t fully understand, walks out of the chamber with his followers.',
    "<em>He didn't break it. He just... left.</em>",
    "You drag yourself upright. The Seal is right there.",
  ],
  onEnter: draft => { draft.items.push('The Chromatic Seal'); draft.notifications.push('+Item: The Chromatic Seal') },
  choices: [{ text: 'Take the Seal. Go.', next: 'final_choice' }],
},

seal_taken: {
  loc: 'Kundorath — The Caldera Vault', icon: '🌋',
  title: 'The Seal is Yours',
  image: '💎',
  art: ' ◆ ─── SEAL  SECURED ─── ◆\n    victory  in  the  vault\n ◆ ──────────────────── ◆',
  text: [
    "The cultists scatter. Cindervast faces you alone, Seal still in his raised hands. He looks at your face. He looks at the Seal. He looks at the door.",
    "Then he sets it down and walks out. You hear his footsteps echo in the tunnel, slower than you expected.",
    "<em>You have the Chromatic Seal. It is smaller than you expected. It is heavier than it looks.</em>",
    "Now you have to decide what to do with it.",
  ],
  onEnter: draft => { draft.items.push('The Chromatic Seal'); draft.notifications.push('+Item: The Chromatic Seal') },
  choices: [{ text: 'Decide what to do.', next: 'final_choice' }],
},

// ══════════════════════════════════════════════════════════
// FINAL CHOICE
// ══════════════════════════════════════════════════════════

final_choice: {
  loc: 'Kundorath — The Caldera Vault', icon: '🌋',
  title: 'The Weight of It',
  image: '⚖️',
  art: ' ══════════════════════\n §   THE WEIGHT OF IT §\n §    your  decision  §\n ══════════════════════',
  text: [
    "You stand in the vault with the <strong>Chromatic Seal</strong> in your hands. The iron hammer is on the floor nearby. The chanting is gone. It is very quiet except for the deep, geological sound of the volcano breathing.",
    "Above you, two hundred metres of rock and fire, <strong>Pyrrhagon the Infernal King</strong> sleeps or does not sleep — you have never been sure if dragons sleep.",
    "You have the Seal. You know what it is — or at least you know what everyone else believes it is. You know what shattering it would do. You know what returning it would do. You know what the Brotherhood offered, and what Therindal said, and what Ottari asked for.",
    "<em>Nobody told you what the right answer is. That's probably because there isn't one.</em>",
  ],
  choices: [
    { text: 'Return the Seal to the Guild for safekeeping. Do the job you were given.', next: 'ending_neutral' },
    { text: 'Shatter the Seal yourself. Let the truth be known — the binding was always a lie.', next: 'ending_chaos' },
    {
      text: 'Deliver the Seal to the Sandshade Brotherhood. They protected it once; they can do so again.',
      condition: s => s.flags.brotherhood_allied || s.flags.belwick_helped || s.items.includes('Brotherhood Map'),
      next: 'ending_traitor',
      req: 'Requires Brotherhood contact',
    },
    {
      text: "[KNOWS TRUTH] Take the Seal back to Ottari — and tell her the truth. All of it.",
      condition: s => s.flags.knows_truth === true,
      next: 'ending_truth',
    },
    {
      text: '[DRAGONBORN] Carry the Seal to the volcano mouth and speak directly to Pyrrhagon.',
      condition: s => s.species === 'dragonborn',
      next: 'ending_hero',
    },
  ],
},

// ══════════════════════════════════════════════════════════
// ENDINGS
// ══════════════════════════════════════════════════════════

ending_neutral: {
  loc: 'Eryndor — Guild Hall', icon: '⚜️',
  title: 'The Contract Fulfilled',
  image: '📦',
  endingType: 'neutral', endingLabel: 'Ending: The Dutiful',
  art: ' ◆ ───── ERYNDOR ───── ◆\n       THE DUTIFUL\n ◆ ─────────────────── ◆',
  text: [
    "You bring the Seal back to Ottari. She receives it without fanfare, locks it in a new vault with three more locks than the old one, and pours you a drink.",
    '"Well done," she says. That\'s all she says. For Ottari, it is a great deal.',
    "The Seal goes back into hiding. The Cult of the Flame disbands — Cindervast is not heard from again, though rumour says he was seen in Jejonuova, running a small fire-shrine with no political ambitions.",
    "The dragons remain where they are. Pyrrhagon's smoke rises on calm mornings as it always has. The people of Ardenveil sleep easier for knowing the Seal is safe.",
    "<em>You know something they don't. But sometimes the gift you give people is the gift of not knowing.</em>",
    "<em>The world is not fixed. But it is, for now, held together.</em>",
  ],
  choices: [{ text: 'Play again', next: '__replay__' }],
},

ending_chaos: {
  loc: 'Kundorath — Caldera Edge', icon: '🌋',
  title: 'Let it Be Known',
  image: '💥',
  endingType: 'chaos', endingLabel: 'Ending: The Iconoclast',
  art: ' * *   THE ICONOCLAST   * *\n  [    let  it  burn    ]\n * * * * * * * * * * * * *',
  text: [
    "You raise the Seal above the lava channel at the vault's edge.",
    "<em>You know this will not free the dragons. The dragons do not need to be freed. You are doing something else.</em>",
    "You are freeing the <em>truth</em>.",
    "The Seal shatters. The pieces fall into the lava and are gone within seconds.",
    "What follows is not fire. It is paperwork. Letters. Panicked dispatches from the Church to every city in Ardenveil. Counter-letters from scholars who have apparently been waiting for someone to do exactly this.",
    "Pyrrhagon does not move. Neither do the others. This is barely noticed in the chaos.",
    "<em>You have been correct about something in a way that cost everyone around you enormously. Welcome to iconoclasm.</em>",
  ],
  choices: [{ text: 'Play again', next: '__replay__' }],
},

ending_traitor: {
  loc: 'Danseleif — Brotherhood Safehouse', icon: '⚓',
  title: 'The Better Custodians',
  image: '🗡️',
  endingType: 'traitor', endingLabel: 'Ending: The Pragmatist',
  art: ' ─── THE  PRAGMATIST ─────\n  [    new  loyalties   ]\n ─────────────────────────',
  text: [
    "The Brotherhood contact takes the Seal without ceremony, wraps it in oilcloth, and places it in an iron case.",
    '"We\'ve kept bigger secrets than this," the Halfling says. She is not wrong.',
    "You never work for the Guild again — Ottari knows, or suspects, and the summons never comes. You don't starve. The Brotherhood are generous employers for those who have proven themselves pragmatic about loyalty.",
    "The Seal sits in a Brotherhood vault, location unknown. Three different factions spend decades trying to find it.",
    "<em>In a strange way, it may be safer here than it ever was under the Cathedral.</em>",
    "<em>You made the deal that made sense. You will spend a long time deciding if it was the right one.</em>",
  ],
  choices: [{ text: 'Play again', next: '__replay__' }],
},

ending_hero: {
  loc: "Kundorath — The Volcano's Mouth", icon: '🌋',
  title: 'Blood Speaks to Blood',
  image: '🐉',
  endingType: 'hero', endingLabel: "Ending: The Dragonborn's Compact",
  art: '╔═════ DRAGONBORN ══════╗\n║  blood  speaks  to   ║\n║       blood          ║\n╚═══════════════════════╝',
  text: [
    "You climb to where the rock ends and the caldera begins. The heat here is absolute. You stand at the edge of the world's most expensive way to die and you speak in Draconic.",
    "You tell the truth — what the Seal is, what it was for, what the cult tried to do, what you decided not to do. You hold it up.",
    "<em>For a long time, nothing happens.</em>",
    'Then the rock shifts. Not an eruption. Something deliberate. And from the caldera, a voice like grinding tectonic plates speaks back in Draconic — older Draconic, formal, the kind that has not been used conversationally since before the Erydian Calendar.',
    'You do not hear all of it. What you hear is this: <em>"We were never bound. We chose. The object in your hands is a promise. Return it to the ones who need it most — not the ones who would use it, but the ones who would believe in it. The believing is the binding."</em>',
    "Pyrrhagon says nothing else. The heat shifts and becomes merely extreme.",
    "You bring the Seal back to Eryndor. Not to the Church. Not to the Guild. You give it to the City Archive, in the public square, behind glass, with a placard that says only: <em>\"A Promise, Kept.\"</em>",
    "<em>The dragons remain where they are. The people remain who they are. You are the only one who knows what the volcano said, and you have decided that is enough.</em>",
  ],
  choices: [{ text: 'Play again', next: '__replay__' }],
},

ending_truth: {
  loc: 'Eryndor — Guild Hall, Midnight', icon: '⚜️',
  title: 'The Most Dangerous Thing',
  image: '💡',
  endingType: 'truth', endingLabel: 'Ending: The Honest',
  art: ' ◆ ──── THE  HONEST ──── ◆\n      truth  above  all\n ◆ ────────────────────── ◆',
  text: [
    "You give Ottari the Seal. Then you give her Therindal's notes. Then you tell her everything — the Church's possible complicity, the Brotherhood's self-interested assistance, what Cindervast actually believed, what the Seal actually is.",
    "Ottari reads the notes in silence. Then she reads them again.",
    '"How many people know this?" she asks.',
    '"Therindal. The Elven caster who walked out. Possibly the Brotherhood." You pause. "And now you."',
    "She is quiet for a very long time. Outside, Eryndor's morning bells begin — the ones the Church rings to mark safe nights and protected days.",
    '"This information," she says finally, "is the most dangerous thing in this room. More dangerous than the Seal." She looks at you. "What do you want me to do with it?"',
    "This is the question no one else has asked you. Everyone else has told you what the truth is, or asked you to keep it, or used it as a tool. Ottari is asking what <em>you</em> believe should be done.",
    "You tell her.",
    "<em>What you say is not recorded here. That answer is yours. Whatever it was, Ottari listened. That matters more than you know, and differently than you expected.</em>",
    "<em>That might be the best anyone has ever done with the truth in the whole long history of Ardenveil.</em>",
  ],
  choices: [{ text: 'Play again', next: '__replay__' }],
},

} // end SCENES
