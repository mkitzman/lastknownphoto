#!/usr/bin/env node
/* eslint-disable no-console */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const POSTS_DIR = path.resolve(__dirname, '..', 'content', 'posts')

const RANKED_RECORDS = [
  { subject: 'Aaliyah', raw_score: 98, level: 4 },
  { subject: 'Abraham Lincoln', raw_score: 99, level: 4 },
  { subject: 'Alan Rickman', raw_score: 90, level: 2 },
  { subject: 'Albert Einstein', raw_score: 88, level: 2 },
  { subject: 'Amy Winehouse', raw_score: 90, level: 2 },
  { subject: 'Andrei Karlov', raw_score: 100, level: 5 },
  { subject: 'Benazir Bhutto', raw_score: 100, level: 5 },
  { subject: 'Bob Marley', raw_score: 95, level: 3 },
  { subject: 'Bradley Nowell', raw_score: 98, level: 4 },
  { subject: 'Brent Hinds', raw_score: 95, level: 3 },
  { subject: 'Brian Jones', raw_score: 90, level: 2 },
  { subject: 'Buddy Holly', raw_score: 85, level: 1 },
  { subject: 'Carrie Fisher', raw_score: 93, level: 3 },
  { subject: 'Chester Bennington', raw_score: 99, level: 4 },
  { subject: 'Chris Benoit', raw_score: 98, level: 4 },
  { subject: 'Chris Cornell', raw_score: 98, level: 4 },
  { subject: 'Chuck Norris', raw_score: 95, level: 3 },
  { subject: 'Cliff Burton', raw_score: 92, level: 2 },
  { subject: 'Dale Earnhardt', raw_score: 97, level: 4 },
  { subject: 'David Bowie', raw_score: 92, level: 2 },
  { subject: 'Diana, Princess of Wales', raw_score: 100, level: 5 },
  { subject: "Dolores O'Riordan", raw_score: 98, level: 4 },
  { subject: 'Elvis Presley', raw_score: 95, level: 3 },
  { subject: 'Franklin D. Roosevelt', raw_score: 99, level: 4 },
  { subject: 'Freddie Mercury', raw_score: 98, level: 4 },
  { subject: 'George Harrison', raw_score: 97, level: 4 },
  { subject: 'Gerald Ford', raw_score: 97, level: 4 },
  { subject: 'Henry Fonda', raw_score: 92, level: 2 },
  { subject: 'Ian Curtis', raw_score: 95, level: 3 },
  { subject: 'James Dean', raw_score: 97, level: 4 },
  { subject: 'James Gandolfini', raw_score: 98, level: 4 },
  { subject: 'Janis Joplin', raw_score: 89, level: 2 },
  { subject: 'Jeff Buckley', raw_score: 98, level: 4 },
  { subject: 'Jenni Rivera', raw_score: 99, level: 4 },
  { subject: 'Jim Morrison', raw_score: 100, level: 5 },
  { subject: 'Jimi Hendrix', raw_score: 99, level: 4 },
  { subject: 'Jimmy Buffett', raw_score: 93, level: 3 },
  { subject: 'Joan Marie Laurer (Chyna)', raw_score: 98, level: 4 },
  { subject: 'John Belushi', raw_score: 94, level: 3 },
  { subject: 'John F. Kennedy', raw_score: 99, level: 4 },
  { subject: 'John Gotti', raw_score: 99, level: 4 },
  { subject: 'John Lennon', raw_score: 99, level: 4 },
  { subject: 'Johnny Carson', raw_score: 95, level: 3 },
  { subject: 'Johnny Cash', raw_score: 99, level: 4 },
  { subject: 'Keith Moon', raw_score: 97, level: 4 },
  { subject: 'Kim Jong-il', raw_score: 97, level: 4 },
  { subject: 'Kobe Bryant', raw_score: 96, level: 3 },
  { subject: 'Korey Stringer', raw_score: 99, level: 4 },
  { subject: 'Kris Kristofferson', raw_score: 99, level: 4 },
  { subject: 'Kurt Cobain', raw_score: 80, level: 1 },
  { subject: 'Layne Staley', raw_score: 80, level: 1 },
  { subject: 'Lucille Ball', raw_score: 99, level: 4 },
  { subject: 'Lyndon B. Johnson', raw_score: 96, level: 3 },
  { subject: 'Mac Miller', raw_score: 99, level: 4 },
  { subject: 'Marilyn Monroe', raw_score: 85, level: 1 },
  { subject: 'Mark Twain', raw_score: 90, level: 2 },
  { subject: 'Matthew Perry', raw_score: 95, level: 3 },
  { subject: 'Michael Hutchence', raw_score: 98, level: 4 },
  { subject: 'Nancy Spungen', raw_score: 93, level: 3 },
  { subject: 'Paramahansa Yogananda', raw_score: 99, level: 4 },
  { subject: 'Paul Walker', raw_score: 98, level: 4 },
  { subject: 'Phil Hartman', raw_score: 98, level: 4 },
  { subject: 'Prince', raw_score: 98, level: 4 },
  { subject: 'Queen Elizabeth II', raw_score: 97, level: 4 },
  { subject: 'RMS Titanic', raw_score: 97, level: 4 },
  { subject: 'Robin Williams', raw_score: 95, level: 3 },
  { subject: 'Ronald Reagan', raw_score: 95, level: 3 },
  { subject: 'Ryan Dunn', raw_score: 99, level: 4 },
  { subject: 'Scott Weiland', raw_score: 98, level: 4 },
  { subject: 'Sean Connery', raw_score: 95, level: 3 },
  { subject: 'Shannon Hoon', raw_score: 97, level: 4 },
  { subject: 'Sharon Tate', raw_score: 90, level: 2 },
  { subject: "Sinéad O'Connor", raw_score: 90, level: 2 },
  { subject: 'Space Shuttle Challenger Crew', raw_score: 97, level: 4 },
  { subject: 'Steve Irwin', raw_score: 99, level: 4 },
  { subject: 'Steve Jobs', raw_score: 98, level: 4 },
  { subject: 'Steve McQueen', raw_score: 90, level: 2 },
  { subject: 'The Ultimate Warrior', raw_score: 96, level: 3 },
  { subject: 'Tim Russert', raw_score: 98, level: 4 },
  { subject: 'Tiny Tim', raw_score: 99, level: 4 },
  { subject: 'Tupac Shakur', raw_score: 98, level: 4 },
  { subject: 'Waylon Jennings', raw_score: 93, level: 3 },
  { subject: 'Whitney Houston', raw_score: 97, level: 4 },
]

// Aliases bridge ranking data subjects to existing post `name` values when they differ.
const SUBJECT_ALIASES = {
  'Joan Marie Laurer (Chyna)': 'Joan Marie Laurer aka Chyna',
}

function applyAlias(subject) {
  return SUBJECT_ALIASES[subject] || subject
}

function loadPosts() {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.json'))
  const byName = new Map()
  const all = []
  for (const file of files) {
    const fullPath = path.join(POSTS_DIR, file)
    const post = JSON.parse(fs.readFileSync(fullPath, 'utf-8'))
    byName.set(post.name, { fullPath, post })
    all.push(post.name)
  }
  return { byName, all }
}

function writePost(fullPath, post) {
  fs.writeFileSync(fullPath, JSON.stringify(post, null, 2) + '\n')
}

function main() {
  const { byName, all: allNames } = loadPosts()
  const matched = []
  const unmatched = []

  for (const record of RANKED_RECORDS) {
    const targetName = applyAlias(record.subject)
    const entry = byName.get(targetName)
    if (!entry) {
      unmatched.push(record.subject)
      continue
    }
    entry.post.raw_score = record.raw_score
    entry.post.level = record.level
    writePost(entry.fullPath, entry.post)
    matched.push(record.subject)
  }

  const rankedNames = new Set(RANKED_RECORDS.map((r) => applyAlias(r.subject)))
  const postsWithoutRanking = allNames.filter((n) => !rankedNames.has(n))

  console.log(`Matched and updated: ${matched.length}`)
  console.log(`Unmatched ranking subjects (no post found): ${unmatched.length}`)
  if (unmatched.length) {
    for (const s of unmatched) console.log(`  - ${s}`)
  }
  console.log(`Existing posts without ranking data: ${postsWithoutRanking.length}`)
  if (postsWithoutRanking.length) {
    for (const n of postsWithoutRanking) console.log(`  - ${n}`)
  }
}

main()
