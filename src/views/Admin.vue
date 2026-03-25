<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { posts, type Post } from '../data/posts'

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

const mode = ref<'list' | 'add' | 'edit'>('list')
const editingPost = ref<Post | null>(null)
const searchQuery = ref('')

const emptyPost = (): Post => ({
  id: crypto.randomUUID().slice(0, 8),
  slug: '',
  name: '',
  title: '',
  imageUrl: '',
  date: '',
  deathDate: '',
  age: null,
  tags: [],
  sourceUrl: null,
  sourceLabel: null,
  description: '',
  bio: '',
  photoCredit: null,
  createdAt: new Date().toISOString().split('T')[0]
})

const form = reactive<Post>(emptyPost())
const tagInput = ref('')

const filteredPosts = computed(() => {
  if (!searchQuery.value) return posts
  const q = searchQuery.value.toLowerCase()
  return posts.filter(p => p.name.toLowerCase().includes(q) || p.title.toLowerCase().includes(q))
})

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function autoSlug() {
  if (!editingPost.value) {
    form.slug = slugify(form.name)
  }
}

const bioLoading = ref(false)

async function fetchBio() {
  if (!form.name) return
  bioLoading.value = true
  try {
    const name = form.name.replace(/ /g, '_')
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`)
    if (!res.ok) throw new Error('Not found')
    const data = await res.json()
    if (data.extract) {
      form.bio = data.extract
    }
  } catch {
    form.bio = ''
    alert('Could not find a Wikipedia article for "' + form.name + '". Try a different spelling.')
  }
  bioLoading.value = false
}

function addTag() {
  const tag = tagInput.value.trim().toLowerCase()
  if (tag && !form.tags.includes(tag)) {
    form.tags.push(tag)
  }
  tagInput.value = ''
}

function removeTag(tag: string) {
  form.tags = form.tags.filter(t => t !== tag)
}

function startAdd() {
  Object.assign(form, emptyPost())
  editingPost.value = null
  mode.value = 'add'
}

function startEdit(post: Post) {
  Object.assign(form, JSON.parse(JSON.stringify(post)))
  editingPost.value = post
  mode.value = 'edit'
}

const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)

function handleImageUpload(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
  const ext = file.name.split('.').pop() || 'jpg'
  const slug = form.slug || slugify(form.name) || 'image'
  form.imageUrl = `/images/${slug}.${ext}`
}

function downloadImage() {
  if (!imageFile.value) return
  const url = URL.createObjectURL(imageFile.value)
  const a = document.createElement('a')
  a.href = url
  const ext = imageFile.value.name.split('.').pop() || 'jpg'
  const slug = form.slug || slugify(form.name) || 'image'
  a.download = `${slug}.${ext}`
  a.click()
  URL.revokeObjectURL(url)
}

function downloadPost() {
  const json = JSON.stringify(form, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${form.slug}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function downloadAll() {
  const allPosts = posts.map(p => JSON.stringify(p, null, 2))
  const blob = new Blob([allPosts.join('\n---\n')], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'all-posts.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <!-- Not available in production -->
  <div class="admin-login" v-if="!isLocal">
    <div class="login-box">
      <h2>Admin</h2>
      <p>Admin panel is only available on localhost.</p>
    </div>
  </div>

  <!-- Admin Panel -->
  <div class="admin" v-else>
    <div class="admin-header">
      <h2>Admin Panel</h2>
      <div class="admin-actions">
        <button @click="startAdd" class="btn-primary">+ Add Post</button>
        <button @click="downloadAll" class="btn-secondary">Export All</button>
      </div>
    </div>

    <!-- Post list -->
    <div v-if="mode === 'list'" class="post-list">
      <input v-model="searchQuery" placeholder="Search posts..." class="search-input" />
      <div class="post-row" v-for="post in filteredPosts" :key="post.id" @click="startEdit(post)">
        <img :src="post.imageUrl" :alt="post.name" class="post-thumb" />
        <div class="post-row-info">
          <strong>{{ post.name }}</strong>
          <span class="post-row-meta">{{ post.tags.join(', ') }}</span>
        </div>
      </div>
      <p v-if="!filteredPosts.length" class="empty">No posts found</p>
    </div>

    <!-- Add/Edit form -->
    <div v-else class="post-form">
      <button @click="mode = 'list'" class="btn-back">&larr; Back to list</button>
      <h3>{{ mode === 'add' ? 'Add New Post' : `Edit: ${form.name}` }}</h3>

      <div class="form-grid">
        <div class="form-group">
          <label>Name</label>
          <input v-model="form.name" @input="autoSlug" placeholder="Subject's name" />
        </div>
        <div class="form-group">
          <label>Slug</label>
          <input v-model="form.slug" placeholder="url-slug" />
        </div>
        <div class="form-group full">
          <label>Title / Caption</label>
          <textarea v-model="form.title" rows="3" placeholder="Brief caption about the photo"></textarea>
        </div>
        <div class="form-group full">
          <label>Description</label>
          <textarea v-model="form.description" rows="4" placeholder="Full description"></textarea>
        </div>
        <div class="form-group full">
          <label>Image</label>
          <div class="image-upload-row">
            <label class="upload-btn btn-secondary">
              Choose File
              <input type="file" accept="image/*" @change="handleImageUpload" hidden />
            </label>
            <span class="upload-or">or</span>
            <input v-model="form.imageUrl" placeholder="/images/filename.jpg or https://..." class="image-url-input" />
          </div>
          <div class="image-upload-preview" v-if="imagePreview || form.imageUrl">
            <img :src="imagePreview || form.imageUrl" :alt="form.name" />
            <span class="image-path">{{ form.imageUrl }}</span>
          </div>
        </div>
        <div class="form-group">
          <label>Photo Date</label>
          <input v-model="form.date" placeholder="e.g., January 14, 2018" />
        </div>
        <div class="form-group">
          <label>Death Date</label>
          <input v-model="form.deathDate" placeholder="e.g., January 15, 2018" />
        </div>
        <div class="form-group">
          <label>Age at Death</label>
          <input v-model.number="form.age" type="number" placeholder="46" />
        </div>
        <div class="form-group">
          <label>Tags</label>
          <div class="tag-input-row">
            <input v-model="tagInput" @keydown.enter.prevent="addTag" placeholder="Add tag..." />
            <button @click="addTag" type="button">+</button>
          </div>
          <div class="tag-list">
            <span v-for="tag in form.tags" :key="tag" class="tag" @click="removeTag(tag)">
              {{ tag }} &times;
            </span>
          </div>
        </div>
        <div class="form-group">
          <label>Source URL</label>
          <input v-model="form.sourceUrl" placeholder="https://..." />
        </div>
        <div class="form-group">
          <label>Source Label</label>
          <input v-model="form.sourceLabel" placeholder="e.g., Wikipedia" />
        </div>
        <div class="form-group">
          <label>Photo Credit</label>
          <input v-model="form.photoCredit" placeholder="Photographer name" />
        </div>
        <div class="form-group full">
          <label>Bio</label>
          <div class="bio-row">
            <textarea v-model="form.bio" rows="3" placeholder="1-2 sentence bio of the person"></textarea>
            <button @click="fetchBio" type="button" class="btn-secondary bio-btn" :disabled="bioLoading || !form.name">
              {{ bioLoading ? 'Loading...' : 'Fetch from Wikipedia' }}
            </button>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <div class="form-actions-row">
          <button @click="downloadPost" class="btn-primary">Download JSON</button>
          <button v-if="imageFile" @click="downloadImage" class="btn-secondary">Download Image</button>
        </div>
        <p class="form-help">
          Place JSON in <code>content/posts/{{ form.slug }}.json</code>
          <span v-if="imageFile"> and image in <code>public{{ form.imageUrl }}</code></span>,
          then commit and redeploy.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.login-box {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-box h2 {
  font-weight: 400;
  font-size: 1.5rem;
}

.login-box form {
  display: flex;
  gap: 0.5rem;
}

.login-box input {
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-family: var(--font);
  font-size: 0.9rem;
  outline: none;
}

.login-box input:focus {
  border-color: var(--accent);
}

.login-box button {
  background: var(--accent);
  color: var(--bg);
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-family: var(--font);
  font-weight: 500;
}

.error {
  color: #e55;
  font-size: 0.85rem;
}

.admin {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.admin-header h2 {
  font-weight: 400;
}

.admin-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-primary {
  background: var(--accent);
  color: var(--bg);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-family: var(--font);
  font-size: 0.85rem;
  font-weight: 500;
}

.btn-secondary {
  background: var(--bg-card);
  color: var(--text-muted);
  border: 1px solid var(--border);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-family: var(--font);
  font-size: 0.85rem;
  transition: all 0.2s;
}

.btn-secondary:hover {
  border-color: var(--border-light);
  color: var(--text);
}

.btn-back {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-family: var(--font);
  font-size: 0.85rem;
  padding: 0;
  margin-bottom: 1rem;
}

.btn-back:hover {
  color: var(--text);
}

.search-input {
  width: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 0.7rem 1rem;
  border-radius: 6px;
  font-family: var(--font);
  font-size: 0.9rem;
  outline: none;
  margin-bottom: 1rem;
}

.search-input:focus {
  border-color: var(--accent);
}

.post-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.post-row:hover {
  background: var(--bg-card);
}

.post-thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
}

.post-row-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.post-row-info strong {
  font-size: 0.9rem;
}

.post-row-meta {
  font-size: 0.75rem;
  color: var(--text-dim);
}

.post-form h3 {
  font-weight: 400;
  margin-bottom: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group.full {
  grid-column: 1 / -1;
}

.form-group label {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-dim);
  margin-bottom: 0.4rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  font-family: var(--font);
  font-size: 0.85rem;
  outline: none;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--accent);
}

.image-upload-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.upload-btn {
  cursor: pointer;
  white-space: nowrap;
}

.upload-or {
  font-size: 0.75rem;
  color: var(--text-dim);
}

.image-url-input {
  flex: 1;
}

.image-upload-preview {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.image-upload-preview img {
  max-width: 200px;
  border-radius: 6px;
}

.image-path {
  font-size: 0.7rem;
  color: var(--text-dim);
  font-family: monospace;
}

.form-actions-row {
  display: flex;
  gap: 0.5rem;
}

.bio-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.bio-btn {
  align-self: flex-start;
}

.bio-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.tag-input-row {
  display: flex;
  gap: 0.5rem;
}

.tag-input-row button {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.5rem;
}

.tag {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  background: var(--bg-elevated);
  border-radius: 3px;
  color: var(--accent);
  cursor: pointer;
}

.tag:hover {
  background: var(--border-light);
}

.form-preview {
  margin-top: 1.5rem;
}

.form-preview h4 {
  font-size: 0.8rem;
  color: var(--text-dim);
  margin-bottom: 0.5rem;
  font-weight: 400;
}

.form-preview img {
  max-width: 300px;
  border-radius: 6px;
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-help {
  font-size: 0.8rem;
  color: var(--text-dim);
}

.form-help code {
  background: var(--bg-elevated);
  padding: 0.15rem 0.4rem;
  border-radius: 3px;
  font-size: 0.75rem;
}

.empty {
  text-align: center;
  color: var(--text-dim);
  padding: 3rem;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .admin {
    padding: 1rem;
  }
}
</style>
