/* ===== COMMUNITY FEED (localStorage) ===== */

function getPosts() {
  return JSON.parse(localStorage.getItem('nut2001_posts') || '[]');
}

function savePosts(posts) {
  localStorage.setItem('nut2001_posts', JSON.stringify(posts));
}

function previewImage(e) {
  const file = e.target.files[0];
  if (!file) return;
  const preview = document.getElementById('image-preview');
  preview.src = URL.createObjectURL(file);
  preview.classList.remove('hidden');
}

function submitPost(e) {
  e.preventDefault();
  const author = document.getElementById('post-author').value.trim();
  const text   = document.getElementById('post-text').value.trim();
  const file   = document.getElementById('post-image').files[0];

  const saveAndRender = (imageData) => {
    const posts = getPosts();
    posts.unshift({
      id: Date.now(),
      author,
      text,
      image: imageData || null,
      timestamp: new Date().toLocaleString(),
      comments: []
    });
    savePosts(posts);
    renderFeed();

    // Reset form
    e.target.reset();
    document.getElementById('image-preview').classList.add('hidden');
    document.getElementById('image-preview').src = '';
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = ev => saveAndRender(ev.target.result);
    reader.readAsDataURL(file);
  } else {
    saveAndRender(null);
  }
}

function addComment(postId) {
  const input = document.getElementById('comment-input-' + postId);
  const text  = input.value.trim();
  if (!text) return;

  const posts   = getPosts();
  const post    = posts.find(p => p.id === postId);
  if (!post) return;

  post.comments.push({ text, timestamp: new Date().toLocaleString() });
  savePosts(posts);
  renderFeed();
}

function renderFeed() {
  const feed  = document.getElementById('post-feed');
  const posts = getPosts();

  if (!posts.length) {
    feed.innerHTML = '<p class="empty-feed">No posts yet. Be the first!</p>';
    return;
  }

  feed.innerHTML = posts.map(post => `
    <section class="post-card">
      <div class="post-header">
        <div class="post-avatar">${post.author.charAt(0).toUpperCase()}</div>
        <div>
          <strong class="post-author">${escHtml(post.author)}</strong>
          <span class="post-time">${post.timestamp}</span>
        </div>
      </div>
      <p class="post-text">${escHtml(post.text)}</p>
      ${post.image ? `<img class="post-image" src="${post.image}" alt="post image" />` : ''}
      <div class="comment-section">
        <div class="comments-list">
          ${post.comments.map(c => `
            <div class="comment">
              <span class="comment-text">${escHtml(c.text)}</span>
              <span class="comment-time">${c.timestamp}</span>
            </div>
          `).join('')}
        </div>
        <div class="comment-input-row">
          <input
            type="text"
            id="comment-input-${post.id}"
            placeholder="Write a comment…"
            onkeydown="if(event.key==='Enter') addComment(${post.id})"
          />
          <button onclick="addComment(${post.id})">Reply</button>
        </div>
      </div>
    </section>
  `).join('');
}

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Initial render on load
document.addEventListener('DOMContentLoaded', renderFeed);
