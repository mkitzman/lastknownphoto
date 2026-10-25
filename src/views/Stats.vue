<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import PageTitle from '../components/PageTitle.vue'
import IntervalStrip from '../components/stats/IntervalStrip.vue'
import StatBars from '../components/stats/StatBars.vue'
import StatHBars from '../components/stats/StatHBars.vue'
import StatSplit from '../components/stats/StatSplit.vue'
import * as s from '../data/stats'

const { numberWord: word, listJoin, sharePhrase } = s

const decadeCount = s.decadeCounts.length
const pct = (n: number, d: number) => `${Math.round((n / d) * 100)}%`
const counted = s.intervals.length

const tags: [string, number][] = s.tagCounts.map(([t, n]) => [t[0].toUpperCase() + t.slice(1), n])

const compact = ref(false)
let mq: MediaQueryList | null = null
const onMq = () => { compact.value = !!mq?.matches }
onMounted(() => {
  mq = window.matchMedia('(max-width: 900px)')
  onMq()
  mq.addEventListener('change', onMq)
})
onBeforeUnmount(() => mq?.removeEventListener('change', onMq))
</script>

<template>
  <div class="stats-page">
  <PageTitle eyebrow="Statistical abstract">
    <span class="nowrap">{{ word(s.total, true) }} records,</span> <span class="nowrap">in numbers.</span>
    <template #credit>Computed from {{ s.total }} records <span class="dot">·</span> Updated {{ s.lastUpdated }}</template>
  </PageTitle>
  <div class="stats">
    <section class="hero">
      <div class="figures">
        <div class="big"><div class="n">{{ s.total }}</div><div class="label">Records</div></div>
        <div class="big"><div class="n">{{ s.yearSpan.from }}–{{ s.yearSpan.to }}</div><div class="label">Years covered · {{ decadeCount }} decades</div></div>
        <div class="big"><div class="n">{{ s.ageStats.median }}</div><div class="label">Median age at death</div></div>
        <div class="big"><div class="n">{{ pct(s.sameDay, counted) }}</div><div class="label">Taken the day they died</div></div>
        <div class="big"><div class="n">{{ pct(s.withinWeek, counted) }}</div><div class="label">Taken within a week</div></div>
      </div>
    </section>

    <section class="section">
      <div class="eyebrow"><span>Time between photo and death</span><span>01</span></div>
      <div class="intro">
        <h2 class="title">Most of these photographs were taken in the last week before death.</h2>
        <p class="note">
          {{ word(s.withinWeek, true) }} of the {{ word(counted) }} were made within seven days of death;
          {{ word(s.sameDay) }} on the day itself.
          <template v-if="s.overYear">{{ word(s.overYear, true) }} {{ s.overYear === 1 ? 'was' : 'were' }} taken more than a year before, after {{ s.overYear === 1 ? 'its subject' : 'their subjects' }} had withdrawn from public view.</template>
        </p>
      </div>
      <div class="chart-gap"><IntervalStrip :compact="compact" /></div>
      <div class="split-row interval-row">
        <StatHBars :label-width="140" :data="s.intervalBuckets" />
        <div class="pair">
          <div class="big small"><div class="n">{{ s.formatHoursShort(s.shortest.hours) }}</div><div class="label">Shortest · {{ s.shortest.post.name }}</div></div>
          <div class="big small"><div class="n">{{ s.formatHoursShort(s.longest.hours) }}</div><div class="label">Longest · {{ s.longest.post.name }}</div></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="eyebrow"><span>Who they were</span><span>02</span></div>
      <div class="intro">
        <h2 class="title">{{ word(s.underThirty, true) }} of them had not reached thirty.</h2>
        <p class="note">
          Ages at death run from {{ s.ageStats.min }} to {{ s.ageStats.max }}, with a median of {{ s.ageStats.median }}.
          <template v-if="s.twentySeven.length">{{ word(s.twentySeven.length, true) }} died at twenty-seven: {{ listJoin(s.twentySeven) }}.</template>
        </p>
      </div>
      <div class="split-row bottom">
        <div>
          <div class="eyebrow"><span>Age at death</span></div>
          <div class="chart-label-gap"><StatBars :height="180" :gap="10" :data="s.ageBuckets" /></div>
        </div>
        <div>
          <div class="eyebrow"><span>Most common tags</span></div>
          <div class="chart-label-gap"><StatHBars :label-width="110" :data="tags" /></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="eyebrow"><span>When they died</span><span>03</span></div>
      <div class="intro">
        <h2 class="title">{{ listJoin(s.monthExtremes.most) }} {{ s.monthExtremes.most.length === 1 ? 'holds' : 'hold' }} the most deaths; {{ listJoin(s.monthExtremes.fewest) }} the fewest.</h2>
        <p class="note">
          {{ listJoin(s.dayExtremes.most) }} {{ s.dayExtremes.most.length === 1 ? 'accounts' : 'each account' }} for {{ word(s.dayExtremes.mostCount) }} records,
          {{ listJoin(s.dayExtremes.fewest) }} for {{ word(s.dayExtremes.fewestCount) }}.
          The {{ listJoin(s.topDecades) }} have the most records of any decade.
        </p>
      </div>
      <div class="chart-gap">
        <div class="eyebrow"><span>By decade</span></div>
        <div class="chart-label-gap"><StatBars :height="140" labels="ends" :data="s.decadeCounts" /></div>
      </div>
      <div class="split-row">
        <div>
          <div class="eyebrow"><span>By month</span></div>
          <div class="chart-label-gap"><StatBars :height="120" :gap="8" :data="s.monthCounts" /></div>
        </div>
        <div>
          <div class="eyebrow"><span>By weekday</span></div>
          <div class="chart-label-gap"><StatBars :height="120" :gap="8" :data="s.weekdayCounts" /></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="eyebrow"><span>Where the photographs were taken</span><span>04</span></div>
      <div class="intro">
        <h2 class="title">{{ word(s.countryTotal, true) }} countries. {{ sharePhrase(s.usCount, s.total, 'fraction') }} of the records are American.</h2>
        <p class="note">
          <template v-if="s.singleCountries.length">{{ word(s.singleCountries.length, true) }} countries appear once each, among them {{ listJoin(s.singleCountries.slice(0, 5)) }}. </template>
          <RouterLink to="/map" class="inline-link">See every location on the map</RouterLink>.
        </p>
      </div>
      <div class="chart-gap countries">
        <StatHBars :label-width="110" :data="s.countryCounts" />
      </div>
    </section>

    <section class="section last">
      <div class="eyebrow"><span>The photographs themselves</span><span>05</span></div>
      <div class="intro">
        <h2 class="title">{{ sharePhrase(s.photographerCredited, s.total, 'in') }} carry a photographer's name.</h2>
        <p class="note">
          Each record is graded on how sure we can be that it's the last photograph.
          Level 5 was taken at the moment of death or minutes before. Level 1 is still disputed, with more than one photo claimed as the last.
        </p>
      </div>
      <div class="split-row even">
        <div>
          <div class="eyebrow"><span>Verification level</span></div>
          <div class="chart-label-gap"><StatSplit :parts="s.levelCounts" /></div>
        </div>
        <div>
          <div class="eyebrow"><span>Orientation</span></div>
          <div class="chart-label-gap"><StatSplit :parts="s.orientationCounts" /></div>
        </div>
      </div>
      <div class="figures four">
        <div class="big medium"><div class="n">{{ s.photographerCredited }}</div><div class="label">Photographer credited</div></div>
        <div class="big medium"><div class="n">{{ s.photographerUnknown }}</div><div class="label">Photographer unknown</div></div>
        <div class="big medium"><div class="n">{{ s.multiPhoto }}</div><div class="label">Records with more than one photo</div></div>
        <div class="big medium"><div class="n">{{ s.withLyrics }}</div><div class="label">Records that quote lyrics</div></div>
      </div>
    </section>
  </div>
  </div>
</template>

<style scoped>
.stats {
  color: var(--fg);
}

.hero {
  padding: 45px 56px 56px;
  border-bottom: 1px solid var(--hairline);
}

.hero .figures {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

.figures {
  display: grid;
  grid-template-columns: repeat(5, auto);
  justify-content: space-between;
  gap: 32px;
  margin-top: 56px;
  padding-top: 28px;
  border-top: 1px solid rgba(232, 225, 212, 0.12);
}

.figures.four {
  grid-template-columns: repeat(4, 1fr);
  justify-content: stretch;
}

.big .n {
  font-family: 'Young Serif', Georgia, serif;
  font-size: 56px;
  line-height: 1;
  letter-spacing: -1px;
  white-space: nowrap;
}

.big.medium .n {
  font-size: 48px;
}

.big.small .n {
  font-size: 40px;
}

.label,
.eyebrow {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--fg-label);
}

.label {
  margin-top: 10px;
}

.section {
  padding: 72px 56px;
  border-bottom: 1px solid var(--hairline);
}

.section.last {
  border-bottom: none;
}

.eyebrow {
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.intro {
  display: grid;
  grid-template-columns: 1fr 440px;
  gap: 96px;
  align-items: start;
}

.title {
  font-family: 'Young Serif', Georgia, serif;
  font-size: 40px;
  line-height: 1.05;
  letter-spacing: -0.6px;
  font-weight: 400;
  margin: 14px 0 0;
  max-width: 560px;
}

.note {
  font-size: 15px;
  line-height: 1.6;
  color: rgba(232, 225, 212, 0.65);
  margin: 18px 0 0;
  max-width: 480px;
  font-weight: 400;
  text-wrap: pretty;
}

.inline-link {
  color: var(--link);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  text-decoration-color: var(--link-underline);
  transition: color 0.2s, text-decoration-color 0.2s;
}

.inline-link:hover {
  color: var(--fg);
  text-decoration-color: var(--fg);
}

.chart-gap {
  margin-top: 56px;
}

.chart-label-gap {
  margin-top: 18px;
}

.split-row {
  margin-top: 56px;
  display: grid;
  grid-template-columns: 1fr 440px;
  gap: 96px;
}

.split-row.bottom {
  align-items: end;
}

.split-row.even {
  grid-template-columns: 1fr 1fr;
}

.interval-row {
  margin-top: 64px;
  align-items: end;
}

.pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.countries {
  max-width: 720px;
}

@media (max-width: 1100px) {
  .hero,
  .section {
    padding-left: 40px;
    padding-right: 40px;
  }
  .intro,
  .split-row {
    grid-template-columns: 1fr 340px;
    gap: 56px;
  }
  .figures {
    grid-template-columns: repeat(3, auto);
    justify-content: start;
    column-gap: 56px;
    row-gap: 40px;
  }
}

@media (max-width: 900px) {
  .intro,
  .split-row,
  .split-row.even {
    grid-template-columns: minmax(0, 1fr);
    gap: 40px;
  }
  .intro {
    gap: 0;
  }
  .section {
    padding-top: 56px;
    padding-bottom: 56px;
  }
}

@media (max-width: 640px) {
  .hero,
  .section {
    padding-left: 24px;
    padding-right: 24px;
  }
  .figures,
  .figures.four {
    grid-template-columns: repeat(2, 1fr);
  }
  .big .n {
    font-size: 40px;
  }
  .big.medium .n,
  .big.small .n {
    font-size: 36px;
  }
  .title {
    font-size: 32px;
  }
}
</style>
