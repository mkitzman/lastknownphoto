<script setup lang="ts">
</script>

<template>
  <div class="about">
    <div class="about-content">
      <h1>The Last Frame</h1>

      <blockquote>
        "The future's uncertain and the end is always near"
        <cite>— Jim Morrison</cite>
      </blockquote>

      <blockquote>
        "The trouble is, you think you have time."
        <cite>— Buddha</cite>
      </blockquote>

      <p>
        A curated archive of the final known photographs of public figures.
      </p>

      <p>
        We live in an era of infinite documentation. For those in the public eye, life is a series of thousands of frames captured by strangers and fans alike. But eventually, the shutter clicks for the last time.
      </p>

      <p>
        These aren't dramatic finales. They are candid moments at a party or a wave outside a hotel. <strong>They represent a Tuesday that looked like every other Tuesday—until it wasn't.</strong> Most people in these images had no idea they were being photographed for the last time.
      </p>

      <p>
        These images were once unremarkable. They only became significant in the absence of everything that followed. That is the point.
      </p>

      <p>
        This project is a curated study of those final moments. By focusing on "ordinary" last photos—taken in grocery stores, on sidewalks, or during rehearsals—we strip away the spectacle of "the end" to find the humanity that remains.
      </p>

      <p>
        This isn't an archive of tragedy; it is an archive of presence. These photos serve as a reminder that the "insignificant" moments of our lives are often the most precious.
      </p>

      <blockquote>
        "Enjoy every sandwich"
        <cite>— Warren Zevon</cite>
      </blockquote>

      <div class="about-footer">
        <p>We hope these images encourage you to look at your own "unremarkable" day with a little more attention.</p>
        <p class="studio-credit">
          <a href="https://www.michaelkitzman.com/" target="_blank" rel="noreferrer">An Unreal City project</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about {
  display: flex;
  justify-content: center;
  padding: 5rem 2rem;
}

.about-content {
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  text-align: center;
}

h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

blockquote {
  border-left: none;
  padding: 1rem 0;
  font-family: 'Playfair Display', Georgia, serif;
  font-style: italic;
  color: var(--text-muted);
  font-size: 1.1rem;
  line-height: 1.8;
}

cite {
  display: block;
  margin-top: 0.5rem;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 0.85rem;
  color: var(--text-dim);
}

p {
  font-family: 'Playfair Display', Georgia, serif;
  color: var(--text-muted);
  line-height: 2;
  font-size: 1.05rem;
}

p strong {
  color: var(--text);
  font-weight: 700;
}

.about-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
}

.about-footer p {
  font-size: 0.9rem;
  color: var(--text-dim);
  font-style: italic;
}

.studio-credit {
  margin-top: 2rem;
}

.studio-credit a {
  color: var(--text-dim);
  text-decoration: none;
  border-bottom: 1px solid var(--border);
  transition: color 0.2s;
}

.studio-credit a:hover {
  color: var(--text);
}
</style>
