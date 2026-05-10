/**
 * HTML sanitiser — wraps DOMPurify with a strict allowlist.
 *
 * Only <em> and <strong> tags are permitted; all attributes are
 * stripped. This prevents XSS while preserving the light prose
 * formatting used in scene text.
 *
 * @module sanitize
 */

/** @type {import('dompurify').DOMPurify | null} */
let purify = null

async function getPurify() {
  if (purify) return purify
  // Loaded via importmap — DOMPurify ships a browser UMD, we import the ESM build
  const mod = await import('dompurify')
  purify = mod.default ?? mod
  return purify
}

/** Allowed tags and attributes — keep this minimal */
const ALLOWED_TAGS  = ['em', 'strong']
const ALLOWED_ATTR  = []   // no attributes on any tag

/**
 * Synchronous sanitise for use in rendering (relies on DOMPurify
 * being already loaded; safe to call after first async call).
 *
 * @param {string} dirty  - raw HTML string from scene data
 * @returns {string}      - sanitised HTML
 */
export function sanitizeHtml(dirty) {
  if (typeof dirty !== 'string') return ''
  if (!purify) {
    // Fallback: strip all tags until async load completes
    return dirty.replace(/<[^>]+>/g, '')
  }
  return purify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    FORBID_ATTR: ['style', 'class', 'id', 'on*'],
  })
}

/**
 * Strip all HTML — used for plain-text contexts (TTS, history log).
 * @param {string} html
 * @returns {string}
 */
export function stripHtml(html) {
  if (typeof html !== 'string') return ''
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Initialise DOMPurify — call once at app boot.
 * @returns {Promise<void>}
 */
export async function initSanitizer() {
  await getPurify()
}
