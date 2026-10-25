import { posts, getDecade, type Post } from './posts'

function parseDate(d: string | undefined | null): number | null {
  if (!d) return null
  const t = Date.parse(d.replace(/(\d+)(st|nd|rd|th)/g, '$1'))
  return isNaN(t) ? null : t
}

const HOUR = 1000 * 60 * 60

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

/** Hours between photo and death. Prefers a precise `interval` like "15m" or "2h" over day-level dates. */
export function intervalHours(p: Post): number | null {
  const iv = p.interval?.trim()
  if (iv) {
    const m = iv.match(/^(\d+(?:\.\d+)?)\s*(m|h|d)$/)
    if (m) return parseFloat(m[1]) * ({ m: 1 / 60, h: 1, d: 24 } as const)[m[2] as 'm' | 'h' | 'd']
    if (/^about an hour$/i.test(iv)) return 1
    if (/^about a day$/i.test(iv)) return 24
  }
  const photo = parseDate(p.date)
  const death = parseDate(p.deathDate)
  if (photo == null || death == null) return null
  return (death - photo) / HOUR
}

const US_STATES = /^(?:[A-Z]{2}(?: \d{5})?|D\.C\.|Iowa)$/
const UK_PARTS = /^(?:United Kingdom|England|Scotland|Wales|London|East Sussex)$|^London\b/

/** Country derived from the last part of a location name. */
export function countryOf(p: Post): string | null {
  const name = p.location?.name
  if (!name) return null
  const last = name.split(',').pop()!.trim()
  if (US_STATES.test(last)) return 'United States'
  if (UK_PARTS.test(last)) return 'United Kingdom'
  if (last === 'Paris') return 'France'
  return last
}

function median(nums: number[]): number {
  const s = [...nums].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2)
}

function countBy<T>(items: T[], key: (t: T) => string | null): Map<string, number> {
  const m = new Map<string, number>()
  for (const it of items) {
    const k = key(it)
    if (k != null) m.set(k, (m.get(k) || 0) + 1)
  }
  return m
}

/* ---------- Figures ---------- */

export const total = posts.length

const deathYears = posts.map(p => parseDate(p.deathDate)).filter((t): t is number => t != null).map(t => new Date(t).getUTCFullYear())
export const yearSpan = { from: Math.min(...deathYears), to: Math.max(...deathYears) }

export const ages = posts.map(p => p.age).filter((a): a is number => a != null)
export const ageStats = { min: Math.min(...ages), max: Math.max(...ages), median: median(ages) }
export const underThirty = ages.filter(a => a < 30).length
export const twentySeven = posts.filter(p => p.age === 27).map(p => p.name).sort()

export const ageBuckets: [string, number][] = (() => {
  const lo = Math.floor(ageStats.min / 10) * 10
  const hi = Math.floor(ageStats.max / 10) * 10
  const out: [string, number][] = []
  for (let d = lo; d <= hi; d += 10) out.push([`${d}s`, ages.filter(a => a >= d && a < d + 10).length])
  return out
})()

/** Records with a usable, non-negative interval. Negative ones are data errors and stay off the charts. */
export const intervals = posts
  .map(p => {
    const hours = intervalHours(p)
    // Day-level dates on the same day only say "sometime that day"
    const timeUnknown = hours === 0 && !p.interval
    return { post: p, hours, timeUnknown }
  })
  .filter((x): x is { post: Post; hours: number; timeUnknown: boolean } => x.hours != null && x.hours >= 0)

export const negativeIntervals = posts.filter(p => (intervalHours(p) ?? 0) < 0).map(p => p.name)

export const sameDay = intervals.filter(x => x.hours < 24).length
export const withinWeek = intervals.filter(x => x.hours < 24 * 7).length
export const overYear = intervals.filter(x => x.hours >= 24 * 365).length

export const intervalBuckets: [string, number][] = [
  ['Under 1 day', sameDay],
  ['1 to 7 days', withinWeek - sameDay],
  ['1 week to 1 month', intervals.filter(x => x.hours >= 24 * 7 && x.hours < 24 * 30).length],
  ['1 to 12 months', intervals.filter(x => x.hours >= 24 * 30 && x.hours < 24 * 365).length],
  ['Over 1 year', overYear],
]

const byHours = intervals.filter(x => !x.timeUnknown).sort((a, b) => a.hours - b.hours)
export const shortest = byHours[0]
export const longest = byHours[byHours.length - 1]

export function formatHours(h: number): string {
  if (h < 1) return `${Math.round(h * 60)} min`
  if (h < 48) return `${Math.round(h)} hr`
  if (h < 24 * 60) return `${Math.round(h / 24)} days`
  if (h < 24 * 730) return `${Math.round(h / (24 * 30))} months`
  return `${(h / (24 * 365)).toFixed(1)} years`
}

/** Compact form for the big figures: "15 min", "4.3 yr". */
export function formatHoursShort(h: number): string {
  if (h < 1) return `${Math.round(h * 60)} min`
  if (h < 48) return `${Math.round(h)} hr`
  if (h < 24 * 60) return `${Math.round(h / 24)} d`
  if (h < 24 * 730) return `${Math.round(h / (24 * 30))} mo`
  return `${(h / (24 * 365)).toFixed(1)} yr`
}

export const tagCounts: [string, number][] = [...countBy(posts.flatMap(p => p.tags), t => t)]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 8)

export const decadeCounts: [string, number][] = (() => {
  const m = countBy(posts, getDecade)
  const years = [...m.keys()].map(k => parseInt(k))
  const out: [string, number][] = []
  for (let y = Math.min(...years); y <= Math.max(...years); y += 10) out.push([`${y}s`, m.get(`${y}s`) || 0])
  return out
})()

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const deathDates = posts.map(p => parseDate(p.deathDate)).filter((t): t is number => t != null).map(t => new Date(t))
const monthTotals = MONTHS.map((_, i) => deathDates.filter(d => d.getUTCMonth() === i).length)
const dayTotals = DAYS.map((_, i) => deathDates.filter(d => (d.getUTCDay() + 6) % 7 === i).length)

export const monthCounts: [string, number][] = MONTHS.map((m, i) => [m, monthTotals[i]])
export const weekdayCounts: [string, number][] = DAYS.map((d, i) => [d, dayTotals[i]])

function extremes(totals: number[], names: string[]) {
  const max = Math.max(...totals)
  const min = Math.min(...totals)
  return {
    most: names.filter((_, i) => totals[i] === max),
    mostCount: max,
    fewest: names.filter((_, i) => totals[i] === min),
    fewestCount: min,
  }
}
export const monthExtremes = extremes(monthTotals, MONTH_NAMES)
export const dayExtremes = extremes(dayTotals, DAY_NAMES)
export const topDecades = [...decadeCounts].sort((a, b) => b[1] - a[1]).slice(0, 2).map(d => d[0])

const countryMap = countBy(posts, countryOf)
export const countryTotal = countryMap.size
export const usCount = countryMap.get('United States') || 0
const countrySorted = [...countryMap].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
export const singleCountries = countrySorted.filter(c => c[1] === 1).map(c => c[0])
export const countryCounts: [string, number][] = [
  ...countrySorted.filter(c => c[1] > 1),
  ...(singleCountries.length ? [[`${numberWord(singleCountries.length, true)} others`, singleCountries.length] as [string, number]] : []),
]

export const levelCounts: [string, number][] = [5, 4, 3, 2, 1].map(l => [`Level ${l}`, posts.filter(p => p.level === l).length])
export const orientationCounts: [string, number][] = (['landscape', 'square', 'portrait'] as const)
  .map(a => [a[0].toUpperCase() + a.slice(1), posts.filter(p => p.aspectRatio === a).length])

export const photographerCredited = posts.filter(p => p.photoCredit && p.photoCredit !== 'Unknown').length
export const photographerUnknown = total - photographerCredited
export const multiPhoto = posts.filter(p => p.additionalImages?.length).length
export const withLyrics = posts.filter(p => p.lyrics).length

export const lastUpdated = (() => {
  const t = Math.max(...posts.map(p => parseDate(p.createdAt) ?? 0))
  const d = new Date(t)
  return `${String(d.getUTCMonth() + 1).padStart(2, '0')}.${String(d.getUTCDate()).padStart(2, '0')}.${String(d.getUTCFullYear()).slice(-2)}`
})()

/* ---------- Prose helpers ---------- */

/** Spell out 0–999 the way the copy does: "sixty-one", "ninety-eight". */
export function numberWord(n: number, capital = false): string {
  let w: string
  if (n < 20) w = ONES[n]
  else if (n < 100) w = TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : '')
  else if (n < 1000) w = `${ONES[Math.floor(n / 100)]} hundred` + (n % 100 ? ` and ${numberWord(n % 100)}` : '')
  else w = String(n)
  return capital ? w[0].toUpperCase() + w.slice(1) : w
}

/** "a, b and c" */
export function listJoin(items: string[]): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

/** Nearest plain-English share: "Two thirds", "Three in four". */
export function sharePhrase(part: number, whole: number, style: 'fraction' | 'in'): string {
  const r = part / whole
  const options: [number, string, string][] = [
    [1 / 3, 'A third', 'One in three'],
    [1 / 2, 'Half', 'One in two'],
    [2 / 3, 'Two thirds', 'Two in three'],
    [3 / 4, 'Three quarters', 'Three in four'],
    [4 / 5, 'Four in five', 'Four in five'],
    [9 / 10, 'Nine in ten', 'Nine in ten'],
  ]
  const best = options.reduce((a, b) => (Math.abs(b[0] - r) < Math.abs(a[0] - r) ? b : a))
  return style === 'fraction' ? best[1] : best[2]
}
