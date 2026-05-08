/* ===== FORUM (Firestore + Google Auth + likes + post detail routing) ===== */
import {
  auth, db, storage, googleProvider, OWNER_UID,
  signInWithPopup, signOut, onAuthStateChanged,
  collection, addDoc, deleteDoc, doc, updateDoc,
  arrayUnion, query, orderBy, onSnapshot, serverTimestamp,
  ref, uploadBytes, getDownloadURL, deleteObject
} from "./firebase-config.js";

const POSTS_COL = "posts";
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const TEASER_WORDS = 100;

let currentUser = null;
let cachedPosts = [];
let activePostId = null;

// ---------- AUTH ----------
function loginGoogle() {
  signInWithPopup(auth, googleProvider)
    .catch(err => alert("Login failed: " + err.message));
}
function logout() { signOut(auth); }

onAuthStateChanged(auth, user => {
  currentUser = user;
  if (user) console.log("[forum] signed in. Your UID:", user.uid);
  renderAuthBar();
  renderRoute();
});

function renderAuthBar() {
  const bar = document.getElementById('forum-auth-bar');
  const form = document.getElementById('post-form');
  const prompt = document.getElementById('login-prompt');
  if (!bar || !form || !prompt) return;

  if (currentUser) {
    const name = currentUser.displayName || currentUser.email || 'user';
    const isOwner = OWNER_UID && currentUser.uid === OWNER_UID;
    bar.innerHTML = `
      <span class="auth-greeting">Signed in as <strong>${escHtml(name)}</strong>${isOwner ? '<span class="owner-badge">Owner</span>' : ''}</span>
      <button class="btn-tertiary" onclick="logout()">Sign out</button>
    `;
    form.classList.remove('hidden');
    prompt.classList.add('hidden');
  } else {
    bar.innerHTML = '';
    form.classList.add('hidden');
    prompt.classList.remove('hidden');
  }
}

// ---------- ROUTING ----------
function parseHash() {
  const m = location.hash.match(/^#\/post\/([A-Za-z0-9_-]+)$/);
  return m ? m[1] : null;
}

function goToForumList() {
  history.pushState(null, '', location.pathname);
  activePostId = null;
  renderRoute();
}

function goToPost(id) {
  history.pushState(null, '', '#/post/' + id);
  activePostId = id;
  renderRoute();
}

window.addEventListener('hashchange', () => {
  activePostId = parseHash();
  renderRoute();
});
window.addEventListener('popstate', () => {
  activePostId = parseHash();
  renderRoute();
});

function renderRoute() {
  activePostId = parseHash();
  const listView = document.getElementById('forum-list-view');
  const detailView = document.getElementById('forum-detail-view');
  if (!listView || !detailView) return;

  if (activePostId) {
    listView.classList.add('hidden');
    detailView.classList.remove('hidden');
    if (window.showTab) window.showTab('forum');
    renderDetail(activePostId);
  } else {
    listView.classList.remove('hidden');
    detailView.classList.add('hidden');
    renderFeed();
  }
}

// ---------- POST FORM ----------
function previewImage(e) {
  const file = e.target.files[0];
  if (!file) return;
  const preview = document.getElementById('image-preview');
  preview.src = URL.createObjectURL(file);
  preview.classList.remove('hidden');
}

async function submitPost(e) {
  e.preventDefault();
  if (!currentUser) { alert("Please sign in first"); return; }

  const text = document.getElementById('post-text').value.trim();
  const file = document.getElementById('post-image').files[0];
  if (!text && !file) return;

  if (file && file.size > MAX_IMAGE_BYTES) {
    alert(`Image is too large (>${MAX_IMAGE_BYTES / 1024 / 1024}MB).`);
    return;
  }

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalLabel = submitBtn ? submitBtn.textContent : '';
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = file ? 'Uploading…' : 'Posting…'; }

  try {
    let imageURL = null;
    let imagePath = null;
    if (file) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      imagePath = `post-images/${currentUser.uid}/${Date.now()}-${safeName}`;
      const storageRef = ref(storage, imagePath);
      await uploadBytes(storageRef, file, { contentType: file.type });
      imageURL = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, POSTS_COL), {
      author: currentUser.displayName || currentUser.email || 'anon',
      authorUid: currentUser.uid,
      text,
      image: imageURL,
      imagePath,
      likes: {},
      comments: [],
      createdAt: serverTimestamp()
    });

    e.target.reset();
    const preview = document.getElementById('image-preview');
    preview.classList.add('hidden');
    preview.src = '';
  } catch (err) {
    alert("Post failed: " + err.message);
  } finally {
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel || 'Post'; }
  }
}

// ---------- LIKES ----------
async function toggleLike(postId, ev) {
  if (ev) ev.stopPropagation();
  if (!currentUser) { alert("Sign in to like posts"); return; }
  const post = cachedPosts.find(p => p.id === postId);
  if (!post) return;

  const liked = post.likes && post.likes[currentUser.uid];
  const update = {};
  update[`likes.${currentUser.uid}`] = liked ? null : true;
  // Firestore can't unset via plain object easily here without deleteField;
  // simplest: always set true on like, set false on unlike. We treat truthy as liked.
  update[`likes.${currentUser.uid}`] = liked ? false : true;

  try {
    await updateDoc(doc(db, POSTS_COL, postId), update);
  } catch (err) {
    alert("Like failed: " + err.message);
  }
}

function likeCount(post) {
  if (!post.likes) return 0;
  return Object.values(post.likes).filter(Boolean).length;
}

// ---------- COMMENTS ----------
async function addComment(postId) {
  if (!currentUser) { alert("Please sign in to comment"); return; }
  const input = document.getElementById('comment-input-' + postId);
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  try {
    await updateDoc(doc(db, POSTS_COL, postId), {
      comments: arrayUnion({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        author: currentUser.displayName || currentUser.email || 'anon',
        authorUid: currentUser.uid,
        text,
        timestamp: new Date().toISOString()
      })
    });
    input.value = '';
  } catch (err) {
    alert("Comment failed: " + err.message);
  }
}

async function deleteComment(postId, commentId) {
  if (!confirm("Delete this comment?")) return;
  const post = cachedPosts.find(p => p.id === postId);
  if (!post) return;
  const remaining = (post.comments || []).filter(c => c.id !== commentId);
  try {
    await updateDoc(doc(db, POSTS_COL, postId), { comments: remaining });
  } catch (err) {
    alert("Delete failed: " + err.message);
  }
}

// ---------- DELETE POST ----------
async function deletePost(postId, ev) {
  if (ev) ev.stopPropagation();
  if (!confirm("Delete this post?")) return;
  const post = cachedPosts.find(p => p.id === postId);
  try {
    if (post && post.imagePath) {
      try { await deleteObject(ref(storage, post.imagePath)); }
      catch (e) { console.warn("[forum] image delete failed (continuing):", e); }
    }
    await deleteDoc(doc(db, POSTS_COL, postId));
    if (activePostId === postId) goToForumList();
  } catch (err) {
    alert("Delete failed: " + err.message);
  }
}

// ---------- FEED SUBSCRIPTION ----------
const q = query(collection(db, POSTS_COL), orderBy("createdAt", "desc"));
onSnapshot(q, snap => {
  cachedPosts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  renderRoute();
}, err => {
  console.error("[forum] feed error:", err);
});

// ---------- LIST RENDER ----------
function renderFeed() {
  const feed = document.getElementById('post-feed');
  if (!feed) return;

  if (!cachedPosts.length) {
    feed.innerHTML = '<p class="empty-feed">No posts yet. Be the first!</p>';
    return;
  }

  const isOwner = currentUser && OWNER_UID && currentUser.uid === OWNER_UID;

  feed.innerHTML = cachedPosts.map(post => {
    const ts = post.createdAt && post.createdAt.toDate
      ? post.createdAt.toDate().toLocaleString()
      : '';
    const author = post.author || 'anon';
    const teaser = teaserOf(post.text || '', TEASER_WORDS);
    const liked = currentUser && post.likes && post.likes[currentUser.uid];
    const count = likeCount(post);
    return `
    <article class="post-card" data-id="${post.id}">
      <div class="post-head">
        <div class="post-avatar">${escHtml(author.charAt(0).toUpperCase())}</div>
        <div class="post-byline">
          <span class="post-author">${escHtml(author)}</span>
          <span class="post-time">${escHtml(ts)}</span>
        </div>
        ${isOwner ? `<button class="btn-delete" data-action="delete" title="Delete (owner)">🗑️</button>` : ''}
      </div>
      ${post.image ? `<img class="post-card-image" src="${post.image}" alt="post image" />` : ''}
      <p class="post-card-body">${escHtml(teaser)}</p>
      <div class="post-meta-row">
        <button class="like-btn ${liked ? 'liked' : ''}" data-action="like">
          <span>${liked ? '❤' : '♡'}</span>
          <span>${count}</span>
        </button>
        <span class="post-time">${(post.comments || []).length} comment${(post.comments || []).length === 1 ? '' : 's'}</span>
      </div>
    </article>
    `;
  }).join('');

  feed.querySelectorAll('.post-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]');
      if (action) {
        const a = action.dataset.action;
        const id = card.dataset.id;
        if (a === 'like') return toggleLike(id, e);
        if (a === 'delete') return deletePost(id, e);
      }
      goToPost(card.dataset.id);
    });
  });
}

// ---------- DETAIL RENDER ----------
function renderDetail(postId) {
  const host = document.getElementById('post-detail');
  if (!host) return;
  const post = cachedPosts.find(p => p.id === postId);
  if (!post) {
    host.innerHTML = '<p class="empty-feed">Post not found (it may have been deleted).</p>';
    return;
  }

  const ts = post.createdAt && post.createdAt.toDate
    ? post.createdAt.toDate().toLocaleString()
    : '';
  const author = post.author || 'anon';
  const liked = currentUser && post.likes && post.likes[currentUser.uid];
  const count = likeCount(post);
  const isOwner = currentUser && OWNER_UID && currentUser.uid === OWNER_UID;
  const canSignedComment = !!currentUser;

  host.innerHTML = `
    <article class="post-detail-card">
      <div class="post-head">
        <div class="post-avatar">${escHtml(author.charAt(0).toUpperCase())}</div>
        <div class="post-byline">
          <span class="post-author">${escHtml(author)}</span>
          <span class="post-time">${escHtml(ts)}</span>
        </div>
        ${isOwner ? `<button class="btn-delete" id="detail-delete-btn" title="Delete (owner)">🗑️</button>` : ''}
      </div>
      ${post.image ? `<img class="post-card-image" src="${post.image}" alt="post image" />` : ''}
      <div class="post-detail-text">${escHtml(post.text || '')}</div>
      <div class="post-meta-row">
        <button class="like-btn ${liked ? 'liked' : ''}" id="detail-like-btn">
          <span>${liked ? '❤' : '♡'}</span>
          <span>${count}</span>
          <span style="margin-left:4px">like${count === 1 ? '' : 's'}</span>
        </button>
      </div>

      <div class="comments-section">
        <h3>Comments (${(post.comments || []).length})</h3>
        <div class="comments-list">
          ${(post.comments || []).map(c => `
            <div class="comment">
              <span class="comment-author">${escHtml(c.author || 'anon')}:</span>
              <span class="comment-text">${escHtml(c.text)}</span>
              <span class="comment-time">${escHtml(c.timestamp ? new Date(c.timestamp).toLocaleString() : '')}</span>
              ${isOwner && c.id ? `<button class="btn-delete" data-comment-id="${escHtml(c.id)}" title="Delete (owner)" style="float:right">🗑️</button>` : ''}
            </div>
          `).join('') || '<p class="empty-feed" style="margin:0;padding:16px">No comments yet.</p>'}
        </div>
        ${canSignedComment ? `
        <div class="comment-input-row">
          <input type="text" id="comment-input-${post.id}" placeholder="Write a comment…" />
          <button class="btn-primary" id="comment-submit">Reply</button>
        </div>` : `
        <p class="empty-feed" style="margin:8px 0;padding:12px">Sign in on the Forum tab to comment.</p>`}
      </div>
    </article>
  `;

  const likeBtn = document.getElementById('detail-like-btn');
  if (likeBtn) likeBtn.addEventListener('click', () => toggleLike(post.id));
  const delBtn = document.getElementById('detail-delete-btn');
  if (delBtn) delBtn.addEventListener('click', () => deletePost(post.id));
  const commentBtn = document.getElementById('comment-submit');
  if (commentBtn) commentBtn.addEventListener('click', () => addComment(post.id));
  const commentInput = document.getElementById('comment-input-' + post.id);
  if (commentInput) commentInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addComment(post.id);
  });
  host.querySelectorAll('[data-comment-id]').forEach(b => {
    b.addEventListener('click', () => deleteComment(post.id, b.dataset.commentId));
  });
}

// ---------- HELPERS ----------
function teaserOf(text, n) {
  const words = text.trim().split(/\s+/);
  if (words.length <= n) return text;
  return words.slice(0, n).join(' ') + '…';
}

function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

window.loginGoogle = loginGoogle;
window.logout = logout;
window.previewImage = previewImage;
window.submitPost = submitPost;
window.goToForumList = goToForumList;
