/**
 * ElevenLabs voice roster for Ardenveil narration.
 *
 * SESSION_VOICE_ID is chosen randomly at module load time so every
 * playthrough gets a different narrator, but the voice never changes mid-session.
 *
 * @module voices
 */

export const VOICES = [
  { id: 'oR4uRy4fHDUGGISL0Rev', name: 'Custom'  },  // user-provided voice
  { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian'   },  // Epic Narrator — deep bass, powerful
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel'  },  // authoritative British male
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam'    },  // deep classic narrator
  { id: 'GBv7mTt0atIp3Br8iCZE', name: 'Thomas'  },  // calm, wise narrator
]

/** Randomly selected voice ID — fixed for the lifetime of this page load. */
export const SESSION_VOICE_ID = VOICES[Math.floor(Math.random() * VOICES.length)].id
