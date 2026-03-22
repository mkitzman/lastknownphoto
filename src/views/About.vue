<script setup lang="ts">
</script>

<template>
  <div class="about">
    <div class="about-content">
      <h1>Last Known Photo</h1>
      <blockquote>
        "The future's uncertain and the end is always near"
        <cite>— Jim Morrison</cite>
      </blockquote>
      <blockquote>
        "Enjoy every sandwich"
        <cite>— Warren Zevon</cite>
      </blockquote>
      <p>
        A curated archive of the final known photographs of famous people before their deaths.
      </p>
      <p>
        Each entry captures that fleeting, often unknowing last moment — a concert, a candid shot,
        a press appearance — before the subject's life came to an end. Some knew their time was short.
        Most did not.
      </p>
      <p>
        This project is not about death itself, but about the weight of a moment that no one knew
        was the last. It's a reminder that every photograph could be the final one.
      </p>
      <blockquote>
        "The trouble is, you think you have time."
        <cite>— Buddha</cite>
      </blockquote>
      <div class="about-footer">
        <p>Originally curated on Tumblr. Rebuilt with Vue 3.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about {
  display: flex;
  justify-content: center;
  padding: 4rem 2rem;
}

.about-content {
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

h1 {
  font-size: 2.5rem;
  font-weight: 300;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

blockquote {
  border-left: 2px solid var(--accent);
  padding-left: 1.5rem;
  font-style: italic;
  color: var(--text-muted);
  font-size: 1.1rem;
  line-height: 1.8;
}

cite {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-dim);
}

p {
  color: var(--text-muted);
  line-height: 1.8;
  font-size: 0.95rem;
}

.about-footer {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
}

.about-footer p {
  font-size: 0.8rem;
  color: var(--text-dim);
}
</style>
