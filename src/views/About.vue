<script setup lang="ts">
function openContact() {
  const u = 'unrealcityproject'
  const d = 'gmail.com'
  window.location.href = 'mai' + 'lto:' + u + '@' + d
}
</script>

<template>
  <div class="about">
    <aside class="wall-label">
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
    </aside>

    <article class="prose">
      <header class="prose-header">
        <div class="prose-eyebrow">Curatorial note</div>
        <h1>The Last Frame</h1>
        <div class="credit-line">
          Founded 2024 <span class="dot">·</span>
          A non-commercial remembrance archive
        </div>
      </header>

      <section id="i" class="section">
        <div class="section-main">
          <div class="section-marker">I. On the project</div>
          <p class="lede">An archive of the last known photographs of public figures.</p>
          <p>Public figures are photographed constantly. Paparazzi, fans with phones, security cameras outside hotels, friends at backyard parties. The volume is staggering, and then one day it stops.</p>
          <p>Most of the photos in this collection are ordinary. A wave outside a restaurant. A drink at a party. A friend's phone catching someone mid-sentence. <strong>None of the people in them knew they were being photographed for the last time.</strong></p>
        </div>
        <aside class="section-margin">
          <figure class="pull-quote">
            <blockquote>The future's uncertain and the end is always near.</blockquote>
            <figcaption>Jim Morrison</figcaption>
          </figure>
          <figure class="pull-quote">
            <blockquote>The trouble is, you think you have time.</blockquote>
            <figcaption>Buddha</figcaption>
          </figure>
        </aside>
      </section>

      <section id="ii" class="section">
        <div class="section-main">
          <div class="section-marker">II. On presence</div>
          <p>These photos were unremarkable at the time. They only became significant because of what came next, or because of what didn't.</p>
          <p>Most of them aren't dramatic. A grocery store parking lot. A rehearsal break. Dinner with friends. There is nothing in the frame that warns you.</p>
          <p>This is an archive of the last ordinary minute.</p>
        </div>
        <aside class="section-margin">
          <figure class="pull-quote">
            <blockquote>Enjoy every sandwich.</blockquote>
            <figcaption>Warren Zevon</figcaption>
          </figure>
        </aside>
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
  </div>
</template>

<style scoped>
.about {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  column-gap: 72px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 72px 56px 112px;
  color: var(--fg);
}

/* Wall label — sticky left rail */
.wall-label {
  position: sticky;
  top: 120px;
  align-self: start;
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
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

.label-toc a {
  color: var(--fg-muted);
}

.label-toc a:hover {
  color: var(--fg);
}

/* Prose column */
.prose {
  min-width: 0;
}

.prose-header {
  padding-bottom: 48px;
  border-bottom: 1px solid var(--hairline-strong);
}

.prose-eyebrow {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--fg-dim);
  margin-bottom: 20px;
}

.prose h1 {
  font-family: var(--font-sans);
  font-size: 64px;
  font-weight: 300;
  letter-spacing: -1.8px;
  line-height: 1;
  margin: 0;
}

.credit-line {
  margin-top: 18px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--fg-dim);
}

.dot {
  opacity: 0.5;
  margin: 0 6px;
}

/* Sections — subgrid-ish: main reading column + margin rail */
.section {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 180px;
  column-gap: 48px;
  padding: 48px 0;
  border-bottom: 1px solid var(--hairline-soft);
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

.section-margin {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-top: 44px;
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
  color: var(--fg);
  border-bottom: 1px solid var(--hairline-strong);
  transition: border-color 0.2s;
}

.prose a:hover,
.contact-link:hover {
  border-bottom-color: var(--fg);
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

.colophon a {
  color: var(--fg-dim);
  border-bottom: 1px solid var(--hairline-strong);
}

.colophon a:hover {
  color: var(--fg);
  border-bottom-color: var(--fg);
}

/* Tablet: hide sidebar, keep margin quotes */
@media (max-width: 1024px) {
  .about {
    grid-template-columns: 1fr;
    column-gap: 0;
    padding: 48px 40px 80px;
  }
  .wall-label {
    position: static;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    padding-bottom: 40px;
    margin-bottom: 40px;
    border-bottom: 1px solid var(--hairline-strong);
  }
}

/* Mobile: single column, quotes inline below body */
@media (max-width: 720px) {
  .about {
    padding: 32px 24px 64px;
  }
  .wall-label {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .prose h1 {
    font-size: 44px;
    letter-spacing: -1.2px;
  }
  .section {
    grid-template-columns: 1fr;
    column-gap: 0;
    row-gap: 28px;
    padding: 36px 0;
  }
  .section-main {
    max-width: none;
  }
  .section-margin {
    padding-top: 0;
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
