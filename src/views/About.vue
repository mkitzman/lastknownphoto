<script setup lang="ts">
import PageTitle from '../components/PageTitle.vue'

function openContact() {
  const u = 'unrealcityproject'
  const d = 'gmail.com'
  window.location.href = 'mai' + 'lto:' + u + '@' + d
}
</script>

<template>
  <div class="about-page">
  <PageTitle eyebrow="Curatorial note">
    The Last Frame
    <template #credit>Founded 2024 <span class="dot">·</span> A non-commercial remembrance archive</template>
  </PageTitle>

  <div class="about">

    <article class="prose">
      <section id="i" class="section section-first">
        <div class="section-main">
          <div class="section-marker">I. On the project</div>
          <p class="lede">An archive of the last known photographs of public figures.</p>
          <p>Public figures are photographed constantly. Paparazzi, fans with phones, security cameras outside hotels, friends at backyard parties. The volume is staggering, and then one day it stops.</p>
          <p>Most of the photos in this collection are ordinary. A wave outside a restaurant. A drink at a party. A friend's phone catching someone mid-sentence. <strong>None of the people in them knew they were being photographed for the last time.</strong></p>
        </div>
      </section>

      <section id="ii" class="section">
        <div class="section-main">
          <div class="section-marker">II. On presence</div>
          <p>These photos were unremarkable at the time. They only became significant because of what came next, or because of what didn't.</p>
          <p>Most of them aren't dramatic. A grocery store parking lot. A rehearsal break. Dinner with friends. There is nothing in the frame that warns you.</p>
          <p>This is an archive of the last ordinary minute.</p>
        </div>
      </section>

      <section id="iii" class="section">
        <div class="section-main">
          <div class="section-marker">III. On image use &amp; attribution</div>
          <p>This is a non-commercial historical archive made for educational and documentary purposes. Photographs remain the property of their copyright holders and appear here under fair use (17 U.S.C. &sect; 107) for commentary, criticism, and historical documentation. Photographer credits are listed where known.</p>
          <p>If you hold rights to an image and would like it credited, modified, or removed, please <a href="#" class="contact-link" @click.prevent="openContact">get in touch</a>.</p>
        </div>
      </section>

      <footer class="prose-footer">
        <div class="colophon">
          <span>An Unreal City project</span>
          <span class="dot">·</span>
          <a href="https://www.michaelkitzman.com/" target="_blank" rel="noreferrer">michaelkitzman.com</a>
        </div>
      </footer>
    </article>

    <aside class="about-rail">
      <div class="wall-label">
        <div class="label-section">
          <div class="label-eyebrow">Object label</div>
          <dl class="label-meta">
            <dt>Est.</dt><dd>2024</dd>
            <dt>Medium</dt><dd>Digital photographs</dd>
            <dt>Scope</dt><dd>Public figures</dd>
            <dt>Status</dt><dd>Non-commercial</dd>
            <dt>Rights</dt><dd>Fair use · 17 U.S.C. &sect; 107</dd>
          </dl>
        </div>
        <div class="label-section">
          <div class="label-eyebrow">Contents</div>
          <ol class="label-toc">
            <li><a href="#i">I. On the project</a></li>
            <li><a href="#ii">II. On presence</a></li>
            <li><a href="#iii">III. On image use</a></li>
          </ol>
        </div>
      </div>
      <figure class="pull-quote">
        <blockquote>The future's uncertain and the end is always near.</blockquote>
        <figcaption>Jim Morrison</figcaption>
      </figure>
      <figure class="pull-quote">
        <blockquote>The trouble is, you think you have time.</blockquote>
        <figcaption>Buddha</figcaption>
      </figure>
      <figure class="pull-quote">
        <blockquote>Enjoy every sandwich.</blockquote>
        <figcaption>Warren Zevon</figcaption>
      </figure>
    </aside>
  </div>
  </div>
</template>

<style scoped>
.about {
  /* Two independent columns: essay left, label and quotes right */
  --about-cols: minmax(0, 1fr) 440px;
  --about-gap: 96px;
  display: grid;
  grid-template-columns: var(--about-cols);
  column-gap: var(--about-gap);
  align-items: start;
  padding: 24px 56px 112px;
  color: var(--fg);
}

/* Wall label — top of the right column */
.wall-label {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.label-eyebrow {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--fg-dim);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--hairline-strong);
  margin-bottom: 14px;
}

.label-meta {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 14px;
  row-gap: 8px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

.label-meta dt {
  color: var(--fg-dim);
}

.label-meta dd {
  margin: 0;
  color: var(--fg);
}

.label-toc {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

/* 24px rows keep each link a comfortable tap target */
.label-toc a {
  display: flex;
  align-items: center;
  min-height: 24px;
  color: var(--link);
}

.label-toc a:hover {
  color: var(--fg);
}

/* The label sits inside .prose, so opt out of its underline-at-rest link style */
.wall-label .label-toc a {
  text-decoration: none;
}

.wall-label .label-toc a:hover,
.wall-label .label-toc a:focus-visible {
  text-decoration: underline;
  text-decoration-color: currentColor;
}

/* Prose column */
.prose {
  min-width: 0;
}

/* Sections — subgrid-ish: main reading column + margin rail */
.section {
  padding: 48px 0;
}

.section-first {
  padding-top: 0;
}

.wall-label + .pull-quote {
  margin-top: 16px;
}

.section:last-of-type {
  border-bottom: none;
}

.section-main {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 560px;
}

.section-marker {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--fg-dim);
  margin-bottom: 10px;
}

.prose .lede {
  font-size: 20px;
  line-height: 1.45;
  font-weight: 300;
  letter-spacing: -0.3px;
  color: var(--fg);
  opacity: 1;
}

.prose p {
  font-family: var(--font-sans);
  color: var(--fg);
  line-height: 1.65;
  font-size: 16px;
  font-weight: 300;
  opacity: 0.85;
}

.prose p strong {
  font-weight: 500;
  opacity: 1;
}

.about-rail {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.pull-quote {
  margin: 0;
  padding-top: 12px;
  border-top: 1px solid var(--hairline-strong);
}

.pull-quote blockquote {
  font-family: var(--font-sans);
  font-style: italic;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 300;
  color: var(--fg-muted);
  margin: 0;
  padding: 0;
}

.pull-quote figcaption {
  margin-top: 10px;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--fg-dim);
}

.contact-link,
.prose a {
  color: var(--link);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  text-decoration-color: var(--link-underline);
  transition: color 0.2s, text-decoration-color 0.2s;
}

.prose a:hover,
.contact-link:hover {
  color: var(--fg);
  text-decoration-color: var(--fg);
}

.prose-footer {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--hairline-strong);
}

.colophon {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--fg-dim);
}

.colophon .dot {
  opacity: 0.5;
  margin: 0 6px;
}

.colophon a {
  color: var(--link);
}

.colophon a:hover {
  color: var(--fg);
}

/* Tablet: hide sidebar, keep margin quotes */
@media (max-width: 1100px) {
  .about {
    --about-cols: minmax(0, 1fr) 280px;
    --about-gap: 56px;
    padding: 20px 40px 80px;
  }
}

/* Mobile: single column, quotes inline below body */
@media (max-width: 720px) {
  .about {
    --about-cols: minmax(0, 1fr);
    padding: 16px 24px 64px;
  }
  .about {
    row-gap: 40px;
  }
  .wall-label {
    gap: 24px;
  }
  .section {
    padding: 36px 0;
  }
  .section-main {
    max-width: none;
  }
  .about-rail {
    gap: 20px;
  }
  .pull-quote {
    padding-top: 10px;
  }
  .prose .lede {
    font-size: 18px;
  }
}
</style>
