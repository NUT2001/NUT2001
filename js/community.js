/* ===== COMMUNITY FEED (Firestore + Google Auth) ===== */
import {
  auth, db, googleProvider, OWNER_UID,
  signInWithPopup, signOut, onAuthStateChanged,
  collection, addDoc, deleteDoc, doc, updateDoc,
  arrayUnion, query, orderBy, onSnapshot, serverTimestamp
} from "./firebase-config.js";

let currentUser = null;
let cachedPosts = [];
const POSTS_COL = "posts";

function loginGoogle() {
  signInWithPopup(auth, googleProvider)
    .catch(err => alert("Login failed: " + err.message));
}

function logout() {
  signOut(auth);
}

onAuthStateChanged(auth, user => {
  currentUser = user;
  if (user) console.log("[forum] signed in. Your UID:", user.uid);
  renderAuthBar();
  renderFeed();
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
      <span class="auth-greeting">Signed in as <strong>${escHtml(name)}</strong>${isOwner ? ' <span class="owner-badge">OWNER</span>' : ''}</span>
      <button class="btn-secondary" onclick="logout()">Sign out</button>
    `;
    form.classList.remove('hidden');
    prompt.classList.add('hidden');
  } else {
    bar.innerHTML = '';
    form.classList.add('hidden');
    prompt.classList.remove('hidden');
  }
}

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

  if (file && file.size > 500 * 1024) {
    alert("Image is too large (>500KB). Pick a smaller image or skip it.");
    return;
  }

  let imageData = null;
  if (file) {
    imageData = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = ev => resolve(ev.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  try {
    await addDoc(collection(db, POSTS_COL), {
      author: currentUser.displayName || currentUser.email || 'anon',
      authorUid: currentUser.uid,
      text,
      image: imageData,
      comments: [],
      createdAt: serverTimestamp()
    });
    e.target.reset();
    const preview = document.getElementById('image-preview');
    preview.classList.add('hidden');
    preview.src = '';
  } catch (err) {
    alert("Post failed: " + err.message);
  }
}

async function deletePost(postId) {
  if (!confirm("Delete this post?")) return;
  try {
    await deleteDoc(doc(db, POSTS_COL, postId));
  } catch (err) {
    alert("Delete failed: " + err.message);
  }
}

async function addComment(postId) {
  if (!currentUser) { alert("Please sign in to comment"); return; }

  const input = document.getElementById('comment-input-' + postId);
  const text = input.value.trim();
  if (!text) return;

  try {
    await updateDoc(doc(db, POSTS_COL, postId), {
      comments: arrayUnion({
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

const q = query(collection(db, POSTS_COL), orderBy("createdAt", "desc"));
onSnapshot(q, snap => {
  cachedPosts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  renderFeed();
}, err => {
  console.error("[forum] feed error:", err);
});

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
    return `
    <section class="post-card">
      <div class="post-header">
        <div class="post-avatar">${escHtml(author.charAt(0).toUpperCase())}</div>
        <div class="post-byline">
          <strong class="post-author">${escHtml(author)}</strong>
          <span class="post-time">${escHtml(ts)}</span>
        </div>
        ${isOwner ? `<button class="btn-delete" onclick="deletePost('${post.id}')" title="Delete (owner)">🗑️</button>` : ''}
      </div>
      <p class="post-text">${escHtml(post.text || '')}</p>
      ${post.image ? `<img class="post-image" src="${post.image}" alt="post image" />` : ''}
      <div class="comment-section">
        <div class="comments-list">
          ${(post.comments || []).map(c => `
            <div class="comment">
              <strong class="comment-author">${escHtml(c.author || 'anon')}:</strong>
              <span class="comment-text">${escHtml(c.text)}</span>
              <span class="comment-time">${escHtml(c.timestamp ? new Date(c.timestamp).toLocaleString() : '')}</span>
            </div>
          `).join('')}
        </div>
        <div class="comment-input-row">
          <input
            type="text"
            id="comment-input-${post.id}"
            placeholder="Write a comment…"
            onkeydown="if(event.key==='Enter') addComment('${post.id}')"
          />
          <button onclick="addComment('${post.id}')">Reply</button>
        </div>
      </div>
    </section>
  `;
  }).join('');
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

window.loginGoogle = loginGoogle;
window.logout = logout;
window.previewImage = previewImage;
window.submitPost = submitPost;
window.addComment = addComment;
window.deletePost = deletePost;
