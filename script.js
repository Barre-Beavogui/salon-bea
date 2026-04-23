import { firebaseConfig, hasFirebaseConfig, salonConfig } from './firebase-config.js';

const defaultData = {
  gallery: [
    {
      id: 'gallery-demo-1',
      type: 'photo',
      category: 'Signature',
      title: 'Tresses boho premium',
      description: 'Finition propre, mouvement souple et rendu premium pour cliente active.',
      url: 'assets/style-1.svg',
      createdAt: '2026-04-10T10:00:00.000Z'
    },
    {
      id: 'gallery-demo-2',
      type: 'photo',
      category: 'Silk press',
      title: 'Brushing lumineux',
      description: 'Texture lisse, volume maîtrisé et brillance photographique.',
      url: 'assets/style-2.svg',
      createdAt: '2026-04-12T10:00:00.000Z'
    },
    {
      id: 'gallery-demo-3',
      type: 'photo',
      category: 'Mariage',
      title: 'Chignon de cérémonie',
      description: 'Proposition élégante pour mariée, témoin ou grand événement.',
      url: 'assets/style-3.svg',
      createdAt: '2026-04-15T10:00:00.000Z'
    },
    {
      id: 'gallery-demo-4',
      type: 'video',
      category: 'Technique',
      title: 'Démonstration pose de mèches',
      description: 'Exemple de contenu vidéo utile pour vendre une prestation ou une formation.',
      url: 'assets/style-4.svg',
      createdAt: '2026-04-18T10:00:00.000Z'
    }
  ],
  articles: [
    {
      id: 'article-demo-1',
      category: 'Conseil',
      title: 'Préparer ses cheveux avant une pose protectrice',
      excerpt: 'Hydratation, nettoyage et diagnostic: les trois étapes qui changent le résultat final.',
      content:
        'Une pose protectrice réussie commence bien avant le rendez-vous.\n\nCommence par un nettoyage doux, puis un soin hydratant adapté à la texture. Si les pointes sont abîmées, une petite coupe de santé améliore le rendu et la tenue.\n\nAu salon, cette préparation permet une pose plus propre, plus confortable et plus durable.',
      coverUrl: 'assets/hero.svg',
      readTime: 2,
      createdAt: '2026-04-11T10:00:00.000Z'
    },
    {
      id: 'article-demo-2',
      category: 'Tendance',
      title: 'Les styles qui fonctionnent le mieux pour les cérémonies à Conakry',
      excerpt: 'Des coiffures qui tiennent, photographient bien et respectent le rythme de la journée.',
      content:
        'Pour une cérémonie, il faut penser esthétique et tenue.\n\nLes looks semi-attachés, chignons texturés et tresses sculptées sont très demandés parce qu ils restent élégants sous la chaleur et pendant les déplacements.\n\nLe bon style dépend de la tenue, du voile éventuel et du temps disponible avant l événement.',
      coverUrl: 'assets/style-3.svg',
      readTime: 3,
      createdAt: '2026-04-16T10:00:00.000Z'
    },
    {
      id: 'article-demo-3',
      category: 'Routine',
      title: 'Comment faire durer un brushing plus longtemps',
      excerpt: 'Des gestes simples à la maison pour garder le volume, la douceur et la brillance.',
      content:
        'Évite l humidité excessive, protège les cheveux la nuit et limite les manipulations inutiles.\n\nUn sérum léger sur les pointes et un enveloppement propre avant le coucher prolongent nettement la qualité du brushing.\n\nLe suivi maison fait partie de l expérience premium du salon.',
      coverUrl: 'assets/style-2.svg',
      readTime: 2,
      createdAt: '2026-04-19T10:00:00.000Z'
    }
  ],
  trainings: [
    {
      id: 'training-demo-1',
      title: 'Technique tresses premium',
      audience: 'Débutante motivée',
      duration: '5 jours',
      format: 'Présentiel',
      price: '950 000 GNF',
      nextSession: '2026-05-12',
      summary:
        'Apprendre les bases de séparation, tension, finition et posture de production pour les prestations les plus demandées.',
      coverUrl: 'assets/style-1.svg',
      createdAt: '2026-04-13T10:00:00.000Z'
    },
    {
      id: 'training-demo-2',
      title: 'Perfectionnement bridal glam',
      audience: 'Praticienne en activité',
      duration: '2 jours',
      format: 'Masterclass',
      price: '1 450 000 GNF',
      nextSession: '2026-05-25',
      summary:
        'Construire une offre cérémonie rentable avec diagnostic, préparation, fixation et présentation premium.',
      coverUrl: 'assets/style-3.svg',
      createdAt: '2026-04-17T10:00:00.000Z'
    },
    {
      id: 'training-demo-3',
      title: 'Soin et routine capillaire professionnelle',
      audience: 'Débutante et salon junior',
      duration: '3 jours',
      format: 'Workshop',
      price: '780 000 GNF',
      nextSession: '2026-06-03',
      summary:
        'Élaborer des protocoles de soin vendables et adaptés aux différentes textures rencontrées au salon.',
      coverUrl: 'assets/style-2.svg',
      createdAt: '2026-04-20T10:00:00.000Z'
    }
  ]
};

const state = {
  backend: null,
  mode: 'initialisation',
  user: null,
  gallery: defaultData.gallery,
  articles: defaultData.articles,
  trainings: defaultData.trainings,
  appointments: [],
  persisted: {
    gallery: [],
    articles: [],
    trainings: [],
    appointments: []
  },
  activeTab: 'media'
};

const elements = {
  galleryGrid: document.getElementById('galleryGrid'),
  articleGrid: document.getElementById('articleGrid'),
  trainingGrid: document.getElementById('trainingGrid'),
  appointmentForm: document.getElementById('appointmentForm'),
  appointmentFeedback: document.getElementById('appointmentFeedback'),
  appointmentBoard: document.getElementById('appointmentBoard'),
  adminLoginForm: document.getElementById('adminLoginForm'),
  adminResetBtn: document.getElementById('adminResetBtn'),
  authHint: document.getElementById('authHint'),
  adminAuthPanel: document.getElementById('adminAuthPanel'),
  adminWorkspace: document.getElementById('adminWorkspace'),
  adminIdentity: document.getElementById('adminIdentity'),
  logoutBtn: document.getElementById('logoutBtn'),
  modeBadge: document.getElementById('modeBadge'),
  modeCopy: document.getElementById('modeCopy'),
  adminFlash: document.getElementById('adminFlash'),
  mediaForm: document.getElementById('mediaForm'),
  mediaFile: document.getElementById('mediaFile'),
  articleForm: document.getElementById('articleForm'),
  articleFile: document.getElementById('articleFile'),
  trainingForm: document.getElementById('trainingForm'),
  trainingFile: document.getElementById('trainingFile'),
  galleryAdminList: document.getElementById('galleryAdminList'),
  articleAdminList: document.getElementById('articleAdminList'),
  trainingAdminList: document.getElementById('trainingAdminList'),
  segments: [...document.querySelectorAll('.segment')],
  panels: [...document.querySelectorAll('.tab-panel')],
  detailDialog: document.getElementById('detailDialog'),
  detailClose: document.getElementById('detailClose'),
  detailVisual: document.getElementById('detailVisual'),
  detailMeta: document.getElementById('detailMeta'),
  detailTitle: document.getElementById('detailTitle'),
  detailBody: document.getElementById('detailBody'),
  phoneLink: document.getElementById('phoneLink'),
  whatsappLink: document.getElementById('whatsappLink'),
  emailLink: document.getElementById('emailLink'),
  addressText: document.getElementById('addressText')
};

let unsubscribeContent = [];
let unsubscribeAppointments = () => {};

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeUrl(value = '') {
  const url = String(value).trim();
  if (
    url.startsWith('https://') ||
    url.startsWith('http://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:') ||
    url.startsWith('assets/')
  ) {
    return url;
  }
  return '';
}

function formatDate(value) {
  if (!value) return 'Date à définir';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

function paragraphize(text = '') {
  return escapeHtml(text)
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br />')}</p>`)
    .join('');
}

function isVideoAsset(item) {
  const url = safeUrl(item.url || item.coverUrl || '').toLowerCase();
  const extension = url.split('?')[0];
  const mimeType = String(item.mimeType || '').toLowerCase();
  return (
    mimeType.startsWith('video/') ||
    url.startsWith('data:video/') ||
    /\.(mp4|webm|ogg|mov|m4v)$/.test(extension)
  );
}

function extractYoutubeId(url) {
  const value = safeUrl(url);
  if (!value) return '';

  try {
    const parsed = new URL(value);
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.replace('/', '');
    }
    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v') || '';
    }
  } catch (error) {
    return '';
  }

  return '';
}

function mediaMarkup(item, className = '') {
  const url = safeUrl(item.url || item.coverUrl || '');
  const youtubeId = extractYoutubeId(url);
  const classes = className ? ` class="${className}"` : '';

  if (youtubeId) {
    return `<iframe${classes} src="https://www.youtube.com/embed/${escapeHtml(
      youtubeId
    )}" title="${escapeHtml(item.title || 'Vidéo salon')}" loading="lazy" allowfullscreen></iframe>`;
  }

  if (!url) {
    return `<div${classes}></div>`;
  }

  if (isVideoAsset(item)) {
    return `<video${classes} src="${escapeHtml(
      url
    )}" controls playsinline preload="metadata"></video>`;
  }

  return `<img${classes} src="${escapeHtml(url)}" alt="${escapeHtml(
    item.title || 'Visuel salon'
  )}" loading="lazy" />`;
}

function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 48);
}

function computeReadTime(content = '') {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.ceil(words / 190));
}

function setFeedback(element, message, tone = '') {
  if (!element) return;
  element.textContent = message || '';
  element.classList.remove('is-error', 'is-success');
  if (tone) {
    element.classList.add(`is-${tone}`);
  }
}

function describeAuthError(error) {
  const code = String(error?.code || error?.message || '');

  if (code.includes('auth/invalid-credential') || code.includes('INVALID_LOGIN_CREDENTIALS')) {
    return "Email ou mot de passe incorrect. Utilise 'Mot de passe oublié' pour définir un nouveau mot de passe.";
  }

  if (code.includes('auth/too-many-requests')) {
    return 'Trop de tentatives. Attends quelques minutes puis réessaie.';
  }

  if (code.includes('auth/network-request-failed')) {
    return 'Connexion réseau impossible. Vérifie internet puis réessaie.';
  }

  if (code.includes('auth/user-disabled')) {
    return 'Ce compte a été désactivé dans Firebase Authentication.';
  }

  if (code.includes('auth/invalid-email')) {
    return "L'adresse email n'est pas valide.";
  }

  return error instanceof Error ? error.message : 'Connexion impossible.';
}

function setModeUI() {
  if (elements.modeBadge) {
    elements.modeBadge.textContent =
      state.mode === 'live' ? 'Firebase connecté' : 'Mode démo local';
    elements.modeBadge.classList.toggle('is-live', state.mode === 'live');
    elements.modeBadge.classList.toggle('is-demo', state.mode !== 'live');
  }

  if (elements.modeCopy) {
    elements.modeCopy.textContent =
      state.mode === 'live'
        ? 'Les contenus sont synchronisés avec Firebase Auth, Firestore et Storage.'
        : 'Le site reste utilisable sans configuration serveur. Ajoute ensuite tes clés Firebase pour la publication réelle.';
  }
}

function setAuthUI() {
  const isLoggedIn = Boolean(state.user);
  if (elements.adminAuthPanel) {
    elements.adminAuthPanel.hidden = isLoggedIn;
  }

  if (elements.adminWorkspace) {
    elements.adminWorkspace.hidden = !isLoggedIn;
  }

  if (elements.adminIdentity) {
    elements.adminIdentity.textContent = state.user?.email || 'Administrateur';
  }

  if (!isLoggedIn) {
    setFeedback(
      elements.authHint,
      state.mode === 'live'
        ? 'Connecte-toi avec le compte administrateur autorisé dans Firebase Auth.'
        : 'Mode démo actif. Le compte de démonstration est défini dans firebase-config.js.',
      ''
    );
  }

  renderAppointments();
}

function renderGallery() {
  if (!elements.galleryGrid) return;
  elements.galleryGrid.innerHTML = state.gallery
    .map(
      (item) => `
        <article class="gallery-card">
          <div class="gallery-media">
            ${mediaMarkup(item)}
          </div>
          <div class="gallery-copy">
            <span class="kicker">${escapeHtml(item.category || item.type || 'Réalisation')}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description || '')}</p>
          </div>
        </article>
      `
    )
    .join('');
}

function renderArticles() {
  if (!elements.articleGrid) return;
  elements.articleGrid.innerHTML = state.articles
    .map(
      (item) => `
        <article class="story-card">
          <div class="story-visual">
            ${mediaMarkup({ ...item, url: item.coverUrl || 'assets/hero.svg' })}
          </div>
          <div class="story-copy">
            <span class="kicker">${escapeHtml(item.category || 'Article')}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.excerpt || '')}</p>
            <div class="card-meta">
              <span>${formatDate(item.createdAt)}</span>
              <span>${escapeHtml(String(item.readTime || 2))} min</span>
            </div>
            <button class="card-action" type="button" data-view="article" data-id="${escapeHtml(
              item.id
            )}">
              Lire
            </button>
          </div>
        </article>
      `
    )
    .join('');
}

function renderTrainings() {
  if (!elements.trainingGrid) return;
  elements.trainingGrid.innerHTML = state.trainings
    .map(
      (item) => `
        <article class="training-card">
          <div class="training-visual">
            ${mediaMarkup({ ...item, url: item.coverUrl || 'assets/style-2.svg' })}
          </div>
          <div class="training-copy">
            <span class="kicker">${escapeHtml(item.audience || 'Formation')}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.summary || '')}</p>
            <div class="card-meta">
              <span>${escapeHtml(item.duration || '')}</span>
              <span>${escapeHtml(item.format || '')}</span>
              <span>${escapeHtml(item.price || '')}</span>
            </div>
            <button class="card-action" type="button" data-view="training" data-id="${escapeHtml(
              item.id
            )}">
              Voir le programme
            </button>
          </div>
        </article>
      `
    )
    .join('');
}

function appointmentItemMarkup(item, withAdminActions = false) {
  const phoneNumber = String(item.phone || '').replace(/\D/g, '');
  const canContact = phoneNumber.length > 0;
  const statusClass = item.status === 'Nouveau' ? ' is-pending' : '';

  return `
    <article class="list-item">
      <div class="list-head">
        <div>
          <strong>${escapeHtml(item.name || 'Cliente')}</strong>
          <div class="list-meta">${escapeHtml(item.service || 'Demande')} · ${formatDate(
            item.preferredDate
          )}</div>
        </div>
        <span class="status-chip${statusClass}">${escapeHtml(item.status || 'Nouveau')}</span>
      </div>
      <div class="list-text">${escapeHtml(item.message || 'Aucun message complémentaire.')}</div>
      <div class="list-meta">
        ${escapeHtml(item.phone || 'Téléphone non renseigné')}
        ${item.email ? ` · ${escapeHtml(item.email)}` : ''}
      </div>
      ${
        withAdminActions
          ? `<div class="list-actions">
              <button type="button" data-appointment-action="status" data-id="${escapeHtml(
                item.id
              )}" data-status="Confirmé">Confirmer</button>
              <button type="button" data-appointment-action="status" data-id="${escapeHtml(
                item.id
              )}" data-status="Traité">Traité</button>
              ${
                canContact
                  ? `<a href="https://wa.me/${escapeHtml(
                      phoneNumber
                    )}" target="_blank" rel="noopener">WhatsApp</a>`
                  : ''
              }
            </div>`
          : ''
      }
    </article>
  `;
}

function renderAppointments() {
  if (!elements.appointmentBoard) return;

  if (!state.user) {
    elements.appointmentBoard.innerHTML =
      '<div class="empty-state">Connecte-toi pour voir les demandes de rendez-vous reçues.</div>';
    return;
  }

  if (state.appointments.length === 0) {
    elements.appointmentBoard.innerHTML =
      '<div class="empty-state">Aucune demande enregistrée pour le moment.</div>';
    return;
  }

  elements.appointmentBoard.innerHTML = state.appointments
    .map((item) => appointmentItemMarkup(item, true))
    .join('');
}

function renderAdminList(container, items, type) {
  if (!container) return;

  if (!items.length) {
    container.innerHTML = '<div class="empty-state">Aucun élément publié pour le moment.</div>';
    return;
  }

  container.innerHTML = items
    .map((item) => {
      const label =
        type === 'gallery'
          ? item.category || item.type
          : type === 'articles'
            ? item.category
            : item.audience;
      const secondary =
        type === 'trainings'
          ? `${item.duration || ''} · ${item.price || ''}`
          : type === 'articles'
            ? `${item.readTime || 2} min`
            : item.type || 'media';

      return `
        <article class="list-item">
          <div class="list-head">
            <div>
              <strong>${escapeHtml(item.title)}</strong>
              <div class="list-meta">${escapeHtml(label || '')} · ${escapeHtml(secondary || '')}</div>
            </div>
          </div>
          <div class="list-text">${escapeHtml(
            item.description || item.excerpt || item.summary || item.content || ''
          )}</div>
          <div class="list-actions">
            <button type="button" data-delete-type="${escapeHtml(type)}" data-id="${escapeHtml(
              item.id
            )}">Supprimer</button>
          </div>
        </article>
      `;
    })
    .join('');
}

function renderAdminCollections() {
  renderAdminList(elements.galleryAdminList, state.persisted.gallery, 'gallery');
  renderAdminList(elements.articleAdminList, state.persisted.articles, 'articles');
  renderAdminList(elements.trainingAdminList, state.persisted.trainings, 'trainings');
}

function openDetail(kind, id) {
  if (
    !elements.detailDialog ||
    !elements.detailVisual ||
    !elements.detailMeta ||
    !elements.detailTitle ||
    !elements.detailBody
  ) {
    return;
  }

  const source = kind === 'article' ? state.articles : state.trainings;
  const item = source.find((entry) => entry.id === id);
  if (!item) return;

  const meta =
    kind === 'article'
      ? `${item.category || 'Article'} · ${formatDate(item.createdAt)} · ${item.readTime || 2} min`
      : `${item.audience || 'Formation'} · ${item.duration || ''} · ${item.price || ''} · ${formatDate(
          item.nextSession
        )}`;

  const body =
    kind === 'article'
      ? paragraphize(item.content || item.excerpt || '')
      : paragraphize(
          `${item.summary || ''}\n\nFormat: ${item.format || ''}\nDurée: ${item.duration || ''}\nTarif: ${
            item.price || ''
          }\nProchaine session: ${formatDate(item.nextSession)}`
        );

  elements.detailMeta.textContent = meta;
  elements.detailTitle.textContent = item.title;
  elements.detailBody.innerHTML = body;
  elements.detailVisual.innerHTML = mediaMarkup({
    ...item,
    url: item.coverUrl || item.url || 'assets/hero.svg'
  });

  if (typeof elements.detailDialog.showModal === 'function') {
    elements.detailDialog.showModal();
  } else {
    elements.detailDialog.setAttribute('open', 'open');
  }
}

function closeDetail() {
  if (!elements.detailDialog) return;

  if (typeof elements.detailDialog.close === 'function') {
    elements.detailDialog.close();
  } else {
    elements.detailDialog.removeAttribute('open');
  }
}

function setActiveTab(tab) {
  state.activeTab = tab;
  elements.segments.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.tab === tab);
  });
  elements.panels.forEach((panel) => {
    const isVisible = panel.dataset.panel === tab;
    panel.classList.toggle('is-visible', isVisible);
    panel.hidden = !isVisible;
  });
}

function normalizeRecord(record) {
  const normalized = { ...record };
  ['createdAt', 'updatedAt', 'preferredDate'].forEach((field) => {
    const value = normalized[field];
    if (value && typeof value.toDate === 'function') {
      normalized[field] = value.toDate().toISOString();
    }
  });
  return normalized;
}

function createDemoStore() {
  const listeners = {
    auth: new Set(),
    gallery: new Set(),
    articles: new Set(),
    trainings: new Set(),
    appointments: new Set()
  };

  const storage = {
    get(key, fallback) {
      try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
      } catch (error) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        // ignore storage errors in demo mode
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        // ignore
      }
    }
  };

  const data = {
    gallery: storage.get('salon_demo_gallery', defaultData.gallery),
    articles: storage.get('salon_demo_articles', defaultData.articles),
    trainings: storage.get('salon_demo_trainings', defaultData.trainings),
    appointments: storage.get('salon_demo_appointments', [])
  };

  let session = storage.get('salon_demo_session', null);

  function emit(channel, payload) {
    listeners[channel].forEach((listener) => listener(payload));
  }

  function persist(channel) {
    storage.set(`salon_demo_${channel}`, data[channel]);
    emit(channel, [...data[channel]]);
  }

  function createId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  return {
    kind: 'demo',
    subscribeAuth(callback) {
      listeners.auth.add(callback);
      callback(session);
      return () => listeners.auth.delete(callback);
    },
    subscribeCollection(channel, callback) {
      listeners[channel].add(callback);
      callback([...data[channel]]);
      return () => listeners[channel].delete(callback);
    },
    async signIn(email, password) {
      if (
        email.trim().toLowerCase() !== salonConfig.demoAdminEmail.toLowerCase() ||
        password !== salonConfig.demoAdminPassword
      ) {
        throw new Error('Identifiants de démonstration invalides.');
      }

      session = {
        uid: 'demo-admin',
        email: salonConfig.demoAdminEmail
      };

      storage.set('salon_demo_session', session);
      emit('auth', session);
      return session;
    },
    async signOut() {
      session = null;
      storage.remove('salon_demo_session');
      emit('auth', null);
    },
    async sendPasswordReset(email) {
      if (email.trim().toLowerCase() !== salonConfig.demoAdminEmail.toLowerCase()) {
        throw new Error("Cet email n'est pas autorisé pour l'administration.");
      }
    },
    async createItem(channel, payload) {
      const item = {
        id: createId(channel),
        ...payload,
        createdAt: new Date().toISOString()
      };
      data[channel] = [item, ...data[channel]];
      persist(channel);
      return item;
    },
    async deleteItem(channel, id) {
      data[channel] = data[channel].filter((item) => item.id !== id);
      persist(channel);
    },
    async createAppointment(payload) {
      const item = {
        id: createId('appointment'),
        ...payload,
        status: 'Nouveau',
        createdAt: new Date().toISOString()
      };
      data.appointments = [item, ...data.appointments];
      persist('appointments');
      return item;
    },
    async updateAppointment(id, patch) {
      data.appointments = data.appointments.map((item) =>
        item.id === id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item
      );
      persist('appointments');
    },
    async uploadFile(file) {
      if (file.size > 1_800_000) {
        throw new Error(
          'En mode démo, utilise une URL média ou un fichier inférieur à 1.8 Mo.'
        );
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Impossible de lire le fichier.'));
        reader.readAsDataURL(file);
      });
    }
  };
}

async function createFirebaseStore() {
  const version = '12.7.0';
  const [appModule, authModule, firestoreModule, storageModule] = await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${version}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${version}/firebase-auth.js`),
    import(`https://www.gstatic.com/firebasejs/${version}/firebase-firestore.js`),
    import(`https://www.gstatic.com/firebasejs/${version}/firebase-storage.js`)
  ]);

  const app = appModule.initializeApp(firebaseConfig);
  const auth = authModule.getAuth(app);
  const db = firestoreModule.getFirestore(app);
  const storage = storageModule.getStorage(app);
  const collections = {
    gallery: 'galleryItems',
    articles: 'articles',
    trainings: 'trainings',
    appointments: 'appointments'
  };

  return {
    kind: 'firebase',
    subscribeAuth(callback) {
      return authModule.onAuthStateChanged(auth, callback);
    },
    subscribeCollection(channel, callback) {
      const query = firestoreModule.query(
        firestoreModule.collection(db, collections[channel]),
        firestoreModule.orderBy('createdAt', 'desc')
      );

      return firestoreModule.onSnapshot(
        query,
        (snapshot) => {
          callback(snapshot.docs.map((doc) => normalizeRecord({ id: doc.id, ...doc.data() })));
        },
        (error) => {
          console.error(error);
          callback([]);
        }
      );
    },
    async signIn(email, password) {
      const credentials = await authModule.signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      return credentials.user;
    },
    async signOut() {
      await authModule.signOut(auth);
    },
    async sendPasswordReset(email) {
      await authModule.sendPasswordResetEmail(auth, email.trim());
    },
    async createItem(channel, payload) {
      await firestoreModule.addDoc(firestoreModule.collection(db, collections[channel]), {
        ...payload,
        createdAt: firestoreModule.serverTimestamp()
      });
    },
    async deleteItem(channel, id) {
      await firestoreModule.deleteDoc(firestoreModule.doc(db, collections[channel], id));
    },
    async createAppointment(payload) {
      await firestoreModule.addDoc(firestoreModule.collection(db, collections.appointments), {
        ...payload,
        status: 'Nouveau',
        source: 'site',
        createdAt: firestoreModule.serverTimestamp()
      });
    },
    async updateAppointment(id, patch) {
      await firestoreModule.updateDoc(firestoreModule.doc(db, collections.appointments, id), {
        ...patch,
        updatedAt: firestoreModule.serverTimestamp()
      });
    },
    async uploadFile(file, folder) {
      const fileName = `${Date.now()}-${slugify(file.name || 'media')}`;
      const fileRef = storageModule.ref(storage, `site/${folder}/${fileName}`);
      await storageModule.uploadBytes(fileRef, file, file.type ? { contentType: file.type } : {});
      return storageModule.getDownloadURL(fileRef);
    }
  };
}

function hydrateContactInfo() {
  if (elements.phoneLink) {
    elements.phoneLink.textContent = salonConfig.phoneDisplay;
    elements.phoneLink.href = `tel:${salonConfig.phoneDigits}`;
  }

  if (elements.whatsappLink) {
    elements.whatsappLink.href = `https://wa.me/${salonConfig.whatsappDigits}`;
  }

  if (elements.emailLink) {
    elements.emailLink.textContent = salonConfig.email;
    elements.emailLink.href = `mailto:${salonConfig.email}`;
  }

  if (elements.addressText) {
    elements.addressText.textContent = salonConfig.address;
  }
}

function handleCollection(channel, items) {
  state.persisted[channel] = items;
  if (channel === 'appointments') {
    state.appointments = items;
    renderAppointments();
    return;
  }

  state[channel] = items.length ? items : defaultData[channel];
  renderGallery();
  renderArticles();
  renderTrainings();
  renderAdminCollections();
}

function handleAuthChange(user) {
  state.user = user;
  setAuthUI();
  unsubscribeAppointments();
  unsubscribeAppointments = () => {};
  handleCollection('appointments', []);

  if (user) {
    unsubscribeAppointments = state.backend.subscribeCollection('appointments', (items) => {
      handleCollection('appointments', items);
    });
  }
}

async function resolveAssetUrl(form, fileInput, urlFieldName, folder) {
  const file = fileInput?.files?.[0];
  const url = String(form.get(urlFieldName) || '').trim();

  if (file) {
    return state.backend.uploadFile(file, folder);
  }

  if (url) {
    return url;
  }

  throw new Error('Ajoute un fichier ou une URL.');
}

async function boot() {
  hydrateContactInfo();
  setModeUI();
  if (elements.segments.length) {
    setActiveTab(state.activeTab);
  }

  try {
    state.backend = hasFirebaseConfig ? await createFirebaseStore() : createDemoStore();
    state.mode = state.backend.kind === 'firebase' ? 'live' : 'demo';
  } catch (error) {
    console.error(error);
    state.backend = createDemoStore();
    state.mode = 'demo';
    setFeedback(
      elements.authHint,
      'Firebase est indisponible pour le moment. Le mode démo local reste actif.',
      'error'
    );
  }

  setModeUI();

  unsubscribeContent.forEach((dispose) => dispose());
  unsubscribeContent = ['gallery', 'articles', 'trainings'].map((channel) =>
    state.backend.subscribeCollection(channel, (items) => handleCollection(channel, items))
  );

  state.backend.subscribeAuth(handleAuthChange);
}

if (elements.appointmentForm) {
  elements.appointmentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = event.submitter;
    submitButton?.setAttribute('disabled', 'disabled');
    setFeedback(elements.appointmentFeedback, 'Envoi en cours...');

    try {
      const formData = new FormData(elements.appointmentForm);
      await state.backend.createAppointment({
        name: String(formData.get('name') || '').trim(),
        phone: String(formData.get('phone') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        service: String(formData.get('service') || '').trim(),
        preferredDate: String(formData.get('preferredDate') || '').trim(),
        message: String(formData.get('message') || '').trim()
      });

      elements.appointmentForm.reset();
      setFeedback(
        elements.appointmentFeedback,
        'La demande a bien été envoyée.',
        'success'
      );
    } catch (error) {
      setFeedback(
        elements.appointmentFeedback,
        error instanceof Error ? error.message : 'Impossible d envoyer la demande.',
        'error'
      );
    } finally {
      submitButton?.removeAttribute('disabled');
    }
  });
}

if (elements.adminLoginForm) {
  elements.adminLoginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = event.submitter;
    submitButton?.setAttribute('disabled', 'disabled');
    setFeedback(elements.authHint, 'Connexion en cours...');

    try {
      const formData = new FormData(elements.adminLoginForm);
      await state.backend.signIn(
        String(formData.get('email') || '').trim(),
        String(formData.get('password') || '')
      );
      elements.adminLoginForm.reset();
      setFeedback(elements.authHint, '');
    } catch (error) {
      setFeedback(
        elements.authHint,
        describeAuthError(error),
        'error'
      );
    } finally {
      submitButton?.removeAttribute('disabled');
    }
  });
}

if (elements.adminResetBtn && elements.adminLoginForm) {
  elements.adminResetBtn.addEventListener('click', async () => {
    const emailField = elements.adminLoginForm.querySelector('input[name="email"]');
    const email = String(emailField?.value || '').trim();

    if (!email) {
      setFeedback(
        elements.authHint,
        "Entre d'abord l'email administrateur, puis relance la réinitialisation.",
        'error'
      );
      emailField?.focus();
      return;
    }

    elements.adminResetBtn.setAttribute('disabled', 'disabled');
    setFeedback(elements.authHint, 'Envoi du lien de réinitialisation...');

    try {
      await state.backend.sendPasswordReset(email);
      setFeedback(
        elements.authHint,
        'Lien de réinitialisation envoyé. Vérifie la boîte mail et les spams.',
        'success'
      );
    } catch (error) {
      setFeedback(elements.authHint, describeAuthError(error), 'error');
    } finally {
      elements.adminResetBtn.removeAttribute('disabled');
    }
  });
}

if (elements.logoutBtn) {
  elements.logoutBtn.addEventListener('click', async () => {
    try {
      await state.backend.signOut();
      setFeedback(elements.adminFlash, 'Déconnexion effectuée.', 'success');
    } catch (error) {
      setFeedback(
        elements.adminFlash,
        error instanceof Error ? error.message : 'Déconnexion impossible.',
        'error'
      );
    }
  });
}

elements.segments.forEach((button) => {
  button.addEventListener('click', () => setActiveTab(button.dataset.tab || 'media'));
});

if (elements.mediaForm) {
  elements.mediaForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!state.user) return;

    const submitButton = event.submitter;
    submitButton?.setAttribute('disabled', 'disabled');
    setFeedback(elements.adminFlash, 'Publication du média...');

    try {
      const formData = new FormData(elements.mediaForm);
      const url = await resolveAssetUrl(formData, elements.mediaFile, 'url', 'gallery');

      await state.backend.createItem('gallery', {
        type: String(formData.get('type') || 'photo'),
        category: String(formData.get('category') || '').trim(),
        title: String(formData.get('title') || '').trim(),
        description: String(formData.get('description') || '').trim(),
        url,
        mimeType: elements.mediaFile.files?.[0]?.type || ''
      });

      elements.mediaForm.reset();
      setFeedback(elements.adminFlash, 'Média publié.', 'success');
    } catch (error) {
      setFeedback(
        elements.adminFlash,
        error instanceof Error ? error.message : 'Publication impossible.',
        'error'
      );
    } finally {
      submitButton?.removeAttribute('disabled');
    }
  });
}

if (elements.articleForm) {
  elements.articleForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!state.user) return;

    const submitButton = event.submitter;
    submitButton?.setAttribute('disabled', 'disabled');
    setFeedback(elements.adminFlash, 'Publication de l article...');

    try {
      const formData = new FormData(elements.articleForm);
      let coverUrl = String(formData.get('coverUrl') || '').trim();

      if (elements.articleFile.files?.[0]) {
        coverUrl = await state.backend.uploadFile(elements.articleFile.files[0], 'articles');
      }

      const content = String(formData.get('content') || '').trim();

      await state.backend.createItem('articles', {
        category: String(formData.get('category') || '').trim(),
        title: String(formData.get('title') || '').trim(),
        excerpt: String(formData.get('excerpt') || '').trim(),
        content,
        coverUrl,
        readTime: computeReadTime(content)
      });

      elements.articleForm.reset();
      setFeedback(elements.adminFlash, 'Article publié.', 'success');
    } catch (error) {
      setFeedback(
        elements.adminFlash,
        error instanceof Error ? error.message : 'Publication impossible.',
        'error'
      );
    } finally {
      submitButton?.removeAttribute('disabled');
    }
  });
}

if (elements.trainingForm) {
  elements.trainingForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!state.user) return;

    const submitButton = event.submitter;
    submitButton?.setAttribute('disabled', 'disabled');
    setFeedback(elements.adminFlash, 'Ajout de la formation...');

    try {
      const formData = new FormData(elements.trainingForm);
      let coverUrl = String(formData.get('coverUrl') || '').trim();

      if (elements.trainingFile.files?.[0]) {
        coverUrl = await state.backend.uploadFile(elements.trainingFile.files[0], 'trainings');
      }

      await state.backend.createItem('trainings', {
        title: String(formData.get('title') || '').trim(),
        audience: String(formData.get('audience') || '').trim(),
        duration: String(formData.get('duration') || '').trim(),
        format: String(formData.get('format') || '').trim(),
        price: String(formData.get('price') || '').trim(),
        nextSession: String(formData.get('nextSession') || '').trim(),
        summary: String(formData.get('summary') || '').trim(),
        coverUrl
      });

      elements.trainingForm.reset();
      setFeedback(elements.adminFlash, 'Formation ajoutée.', 'success');
    } catch (error) {
      setFeedback(
        elements.adminFlash,
        error instanceof Error ? error.message : 'Ajout impossible.',
        'error'
      );
    } finally {
      submitButton?.removeAttribute('disabled');
    }
  });
}

function bindDeleteList(container) {
  if (!container) return;

  container.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-delete-type]');
    if (!button || !state.user) return;

    const type = button.dataset.deleteType;
    const id = button.dataset.id;
    if (!type || !id) return;

    try {
      await state.backend.deleteItem(type, id);
      setFeedback(elements.adminFlash, 'Élément supprimé.', 'success');
    } catch (error) {
      setFeedback(
        elements.adminFlash,
        error instanceof Error ? error.message : 'Suppression impossible.',
        'error'
      );
    }
  });
}

bindDeleteList(elements.galleryAdminList);
bindDeleteList(elements.articleAdminList);
bindDeleteList(elements.trainingAdminList);

if (elements.appointmentBoard) {
  elements.appointmentBoard.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-appointment-action="status"]');
    if (!button || !state.user) return;

    try {
      await state.backend.updateAppointment(button.dataset.id || '', {
        status: button.dataset.status || 'Confirmé'
      });
      setFeedback(elements.adminFlash, 'Statut mis à jour.', 'success');
    } catch (error) {
      setFeedback(
        elements.adminFlash,
        error instanceof Error ? error.message : 'Mise à jour impossible.',
        'error'
      );
    }
  });
}

if (elements.articleGrid) {
  elements.articleGrid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-view="article"]');
    if (!button) return;
    openDetail('article', button.dataset.id || '');
  });
}

if (elements.trainingGrid) {
  elements.trainingGrid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-view="training"]');
    if (!button) return;
    openDetail('training', button.dataset.id || '');
  });
}

if (elements.detailClose) {
  elements.detailClose.addEventListener('click', closeDetail);
}

if (elements.detailDialog) {
  elements.detailDialog.addEventListener('click', (event) => {
    const bounds = elements.detailDialog.getBoundingClientRect();
    const clickedOutside =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;

    if (clickedOutside) {
      closeDetail();
    }
  });
}

boot();
