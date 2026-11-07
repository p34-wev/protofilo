/**
 * Admin Dashboard JavaScript
 * Handles: login/logout, project CRUD, message management
 */

const API_BASE = 'http://localhost:8080/api';

/* ================================================================
   AUTH
   ================================================================ */
let authToken = sessionStorage.getItem('admin_token') ?? null;

function getHeaders(json = true) {
  const h = { Authorization: `Bearer ${authToken}` };
  if (json) h['Content-Type'] = 'application/json';
  return h;
}

function isLoggedIn() { return !!authToken; }

function logout() {
  authToken = null;
  sessionStorage.removeItem('admin_token');
  showLogin();
}

function showLogin() {
  document.getElementById('loginOverlay').hidden = false;
  document.getElementById('dashboard').hidden    = true;
}

function showDashboard() {
  document.getElementById('loginOverlay').hidden = true;
  document.getElementById('dashboard').hidden    = false;
  loadProjects();
  loadUnreadCount();
}

/* ---- Login Form ---- */
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn    = document.getElementById('loginBtn');
  const status = document.getElementById('loginStatus');
  btn.disabled = true;
  btn.textContent = 'Logging in…';
  status.className = 'form-status';
  status.textContent = '';

  try {
    const res  = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: document.getElementById('adminUsername').value.trim(),
        password: document.getElementById('adminPassword').value,
      }),
    });
    const body = await res.json();

    if (res.ok && body.success) {
      authToken = body.data.token;
      sessionStorage.setItem('admin_token', authToken);
      showDashboard();
    } else {
      status.className = 'form-status error';
      status.textContent = body.message ?? 'Login failed. Check your credentials.';
    }
  } catch (err) {
    status.className = 'form-status error';
    status.textContent = 'Cannot connect to the server.';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Login';
  }
});

document.getElementById('logoutBtn').addEventListener('click', logout);

/* ================================================================
   TABS
   ================================================================ */
document.querySelectorAll('.sidebar-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const tab = link.dataset.tab;

    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    document.querySelectorAll('.tab-content').forEach(el => el.hidden = true);
    document.getElementById(`tab-${tab}`).hidden = false;

    if (tab === 'messages') loadMessages(0);
    if (tab === 'projects') loadProjects();
  });
});

/* ================================================================
   PROJECTS
   ================================================================ */
async function loadProjects() {
  try {
    const res  = await fetch(`${API_BASE}/projects`, { headers: getHeaders(false) });
    const body = await res.json();
    renderProjectsTable(body.data ?? []);
  } catch {
    document.getElementById('projectsTbody').innerHTML =
      `<tr><td colspan="6" class="text-center">Failed to load projects.</td></tr>`;
  }
}

function renderProjectsTable(projects) {
  const tbody = document.getElementById('projectsTbody');
  if (projects.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="color:var(--clr-text-muted)">No projects yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = projects.map((p, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${escHtml(p.title)}</td>
      <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
        ${escHtml(p.techStack)}</td>
      <td>${p.featured ? '✅' : '—'}</td>
      <td>${p.displayOrder}</td>
      <td>
        <div class="action-btns">
          <button class="btn btn-outline btn-sm" onclick="openEditProject(${p.id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProject(${p.id}, '${escHtml(p.title)}')">Delete</button>
        </div>
      </td>
    </tr>`).join('');
}

/* ---- Project Modal ---- */
const projectModal   = document.getElementById('projectModal');
const projectForm    = document.getElementById('projectForm');
const projectStatus  = document.getElementById('projectFormStatus');

document.getElementById('addProjectBtn').addEventListener('click', () => openAddProject());
document.getElementById('modalClose').addEventListener('click', closeProjectModal);
document.getElementById('modalCancelBtn').addEventListener('click', closeProjectModal);

function openAddProject() {
  projectForm.reset();
  document.getElementById('projectId').value = '';
  document.getElementById('modalTitle').textContent = 'Add Project';
  projectStatus.className = 'form-status';
  projectStatus.textContent = '';
  projectModal.hidden = false;
}

async function openEditProject(id) {
  try {
    const res  = await fetch(`${API_BASE}/projects/${id}`, { headers: getHeaders(false) });
    const body = await res.json();
    const p = body.data;

    document.getElementById('projectId').value = p.id;
    document.getElementById('pTitle').value    = p.title ?? '';
    document.getElementById('pDesc').value     = p.description ?? '';
    document.getElementById('pTech').value     = p.techStack ?? '';
    document.getElementById('pGithub').value   = p.githubUrl ?? '';
    document.getElementById('pLive').value     = p.liveUrl ?? '';
    document.getElementById('pImage').value    = p.imageUrl ?? '';
    document.getElementById('pFeatured').checked = p.featured ?? false;
    document.getElementById('pOrder').value    = p.displayOrder ?? 0;
    document.getElementById('modalTitle').textContent = 'Edit Project';
    projectStatus.className = 'form-status';
    projectStatus.textContent = '';
    projectModal.hidden = false;
  } catch {
    alert('Could not load project details.');
  }
}

function closeProjectModal() {
  projectModal.hidden = true;
}

projectForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id      = document.getElementById('projectId').value;
  const isEdit  = !!id;
  const saveBtn = document.getElementById('saveProjectBtn');
  saveBtn.disabled = true;
  saveBtn.textContent = 'Saving…';

  const payload = {
    title:        document.getElementById('pTitle').value.trim(),
    description:  document.getElementById('pDesc').value.trim(),
    techStack:    document.getElementById('pTech').value.trim(),
    githubUrl:    document.getElementById('pGithub').value.trim() || null,
    liveUrl:      document.getElementById('pLive').value.trim()   || null,
    imageUrl:     document.getElementById('pImage').value.trim()  || null,
    featured:     document.getElementById('pFeatured').checked,
    displayOrder: parseInt(document.getElementById('pOrder').value, 10) || 0,
  };

  try {
    const url    = isEdit ? `${API_BASE}/projects/${id}` : `${API_BASE}/projects`;
    const method = isEdit ? 'PUT' : 'POST';
    const res    = await fetch(url, {
      method, headers: getHeaders(), body: JSON.stringify(payload),
    });

    if (res.status === 401) { logout(); return; }

    const body = await res.json();

    if (res.ok && body.success) {
      projectStatus.className = 'form-status success';
      projectStatus.textContent = isEdit ? 'Project updated!' : 'Project created!';
      loadProjects();
      setTimeout(closeProjectModal, 1000);
    } else {
      projectStatus.className = 'form-status error';
      projectStatus.textContent = body.message ?? 'Save failed.';
    }
  } catch {
    projectStatus.className = 'form-status error';
    projectStatus.textContent = 'Network error.';
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save';
  }
});

async function deleteProject(id, title) {
  if (!confirm(`Delete project "${title}"? This cannot be undone.`)) return;
  try {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE', headers: getHeaders(false),
    });
    if (res.status === 401) { logout(); return; }
    loadProjects();
  } catch {
    alert('Failed to delete project.');
  }
}

/* ================================================================
   MESSAGES
   ================================================================ */
let currentPage = 0;

async function loadMessages(page = 0) {
  currentPage = page;
  try {
    const res  = await fetch(
      `${API_BASE}/contact?page=${page}&size=20&sort=createdAt,desc`,
      { headers: getHeaders(false) });
    if (res.status === 401) { logout(); return; }
    const body = await res.json();
    renderMessagesTable(body.data?.content ?? []);
    renderPagination(body.data);
    loadUnreadCount();
  } catch {
    document.getElementById('messagesTbody').innerHTML =
      `<tr><td colspan="6" class="text-center">Failed to load messages.</td></tr>`;
  }
}

function renderMessagesTable(messages) {
  const tbody = document.getElementById('messagesTbody');
  if (messages.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="color:var(--clr-text-muted)">No messages yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = messages.map((m, i) => `
    <tr class="${m.isRead ? '' : 'unread-row'}">
      <td>${currentPage * 20 + i + 1}</td>
      <td>${escHtml(m.name)}</td>
      <td>${escHtml(m.email)}</td>
      <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
        ${escHtml(m.subject)}</td>
      <td>${new Date(m.createdAt).toLocaleDateString()}</td>
      <td>
        <div class="action-btns">
          <button class="btn btn-outline btn-sm" onclick="viewMessage(${m.id})">View</button>
          ${!m.isRead ? `<button class="btn btn-outline btn-sm" onclick="markRead(${m.id})">Mark Read</button>` : ''}
          <button class="btn btn-danger btn-sm" onclick="deleteMessage(${m.id})">Delete</button>
        </div>
      </td>
    </tr>`).join('');
}

function renderPagination(page) {
  const container = document.getElementById('messagePagination');
  if (!page || page.totalPages <= 1) { container.innerHTML = ''; return; }

  let html = `<button ${page.first ? 'disabled' : ''}
               onclick="loadMessages(${page.number - 1})">‹ Prev</button>`;
  for (let i = 0; i < page.totalPages; i++) {
    html += `<button class="${i === page.number ? 'active' : ''}"
              onclick="loadMessages(${i})">${i + 1}</button>`;
  }
  html += `<button ${page.last ? 'disabled' : ''}
            onclick="loadMessages(${page.number + 1})">Next ›</button>`;
  container.innerHTML = html;
}

async function loadUnreadCount() {
  try {
    const res  = await fetch(`${API_BASE}/contact/unread-count`, { headers: getHeaders(false) });
    if (!res.ok) return;
    const body = await res.json();
    const badge = document.getElementById('unreadBadge');
    const count = body.data?.count ?? 0;
    badge.textContent = count;
    badge.dataset.count = count;
  } catch { /* silent */ }
}

async function viewMessage(id) {
  try {
    const res  = await fetch(`${API_BASE}/contact/${id}`, { headers: getHeaders(false) });

    // If direct fetch isn't exposed, load from the list cache
    const list = await fetch(
      `${API_BASE}/contact?page=${currentPage}&size=20`,
      { headers: getHeaders(false) });
    const body = await list.json();
    const msg  = (body.data?.content ?? []).find(m => m.id === id);
    if (!msg) { alert('Message not found.'); return; }

    document.getElementById('messageDetail').innerHTML = `
      <p><strong>From:</strong> ${escHtml(msg.name)} &lt;${escHtml(msg.email)}&gt;</p>
      <p><strong>Subject:</strong> ${escHtml(msg.subject)}</p>
      <p><strong>Date:</strong> ${new Date(msg.createdAt).toLocaleString()}</p>
      <p><strong>Message:</strong></p>
      <div class="msg-body">${escHtml(msg.message)}</div>`;

    document.getElementById('messageModal').hidden = false;

    if (!msg.isRead) markRead(id);
  } catch {
    alert('Could not load message.');
  }
}

document.getElementById('msgModalClose').addEventListener('click', () => {
  document.getElementById('messageModal').hidden = true;
});

async function markRead(id) {
  try {
    await fetch(`${API_BASE}/contact/${id}/read`, {
      method: 'PATCH', headers: getHeaders(false),
    });
    loadMessages(currentPage);
  } catch { /* silent */ }
}

async function deleteMessage(id) {
  if (!confirm('Delete this message? This cannot be undone.')) return;
  try {
    const res = await fetch(`${API_BASE}/contact/${id}`, {
      method: 'DELETE', headers: getHeaders(false),
    });
    if (res.status === 401) { logout(); return; }
    loadMessages(currentPage);
  } catch {
    alert('Failed to delete message.');
  }
}

/* ================================================================
   HELPERS
   ================================================================ */
function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str ?? '';
  return d.innerHTML;
}

/* ================================================================
   INIT
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  if (isLoggedIn()) {
    showDashboard();
  } else {
    showLogin();
  }
});
