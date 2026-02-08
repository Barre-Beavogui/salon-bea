import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js';

const firebaseConfig = {
  apiKey: 'AIzaSyDkyDlVMxasw8bWVG8x-JQ4ALv0pK77vhU',
  authDomain: 'salon-gn.firebaseapp.com',
  projectId: 'salon-gn',
  storageBucket: 'salon-gn.firebasestorage.app',
  messagingSenderId: '10386870785',
  appId: '1:10386870785:web:04894cb11e715eb798e600'
};

const ADMIN_EMAILS = ['eliebarresbeavogui3@gmail.com'];
const ADMIN_PHONES = ['+224629516388', '224629516388'];
const DEFAULT_POSTS = [
  {
    id: 'sample-1',
    type: 'photo',
    title: 'Tresses bohèmes',
    description: 'Style léger et élégant pour toutes les occasions.'
  },
  {
    id: 'sample-2',
    type: 'photo',
    title: 'Brushing soyeux',
    description: 'Finition naturelle et brillante.'
  },
  {
    id: 'sample-3',
    type: 'video',
    title: 'Pose de mèches',
    description: 'Étapes clés, rendu final spectaculaire.'
  }
];

const ui = {
  authScreen: document.getElementById('authScreen'),
  appScreen: document.getElementById('appScreen'),
  userBar: document.getElementById('userBar'),
  userName: document.getElementById('userName'),
  userRole: document.getElementById('userRole'),
  signOutBtn: document.getElementById('signOutBtn'),
  tabs: document.querySelectorAll('[data-auth-tab]'),
  panels: document.querySelectorAll('[data-auth-panel]'),
  loginForm: document.getElementById('loginForm'),
  signupForm: document.getElementById('signupForm'),
  resetPassword: document.getElementById('resetPassword'),
  googleSignIn: document.getElementById('googleSignIn'),
  phoneName: document.getElementById('phoneName'),
  phoneNumber: document.getElementById('phoneNumber'),
  sendCode: document.getElementById('sendCode'),
  codePanel: document.getElementById('codePanel'),
  smsCode: document.getElementById('smsCode'),
  verifyCode: document.getElementById('verifyCode'),
  postsGrid: document.getElementById('postsGrid'),
  postModal: document.getElementById('postModal'),
  openPostModal: document.getElementById('openPostModal'),
  closePostModal: document.getElementById('closePostModal'),
  postForm: document.getElementById('postForm'),
  appointmentForm: document.getElementById('appointmentForm'),
  clientAppointments: document.getElementById('clientAppointments'),
  adminAppointments: document.getElementById('adminAppointments'),
  clientMessageForm: document.getElementById('clientMessageForm'),
  clientMessages: document.getElementById('clientMessages'),
  threadList: document.getElementById('threadList'),
  threadHeader: document.getElementById('threadHeader'),
  threadMessages: document.getElementById('threadMessages'),
  adminMessageForm: document.getElementById('adminMessageForm'),
  toast: document.getElementById('toast')
};

const state = {
  user: null,
  isAdmin: false,
  confirmResult: null,
  unsubscribers: [],
  selectedThread: null
};

function showToast(message) {
  ui.toast.textContent = message;
  ui.toast.classList.remove('hidden');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => ui.toast.classList.add('hidden'), 3200);
}

function setAuthTab(tab) {
  ui.tabs.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.authTab === tab);
  });
  ui.panels.forEach((panel) => {
    panel.classList.toggle('hidden', panel.dataset.authPanel !== tab);
  });
}

function setViewAuthenticated(isAuthenticated) {
  ui.authScreen.classList.toggle('hidden', isAuthenticated);
  ui.appScreen.classList.toggle('hidden', !isAuthenticated);
  ui.userBar.classList.toggle('hidden', !isAuthenticated);
}

function normalizePhone(value) {
  if (!value) return '';
  return value.replace(/[^0-9+]/g, '');
}

function isAdminUser(user) {
  if (!user) return false;
  const email = user.email ? user.email.toLowerCase() : '';
  const phone = normalizePhone(user.phoneNumber);
  return ADMIN_EMAILS.includes(email) || ADMIN_PHONES.includes(phone);
}

function setAdminVisibility(isAdmin) {
  document.querySelectorAll('.admin-only').forEach((el) => {
    el.classList.toggle('hidden', !isAdmin);
  });
  ui.userRole.textContent = isAdmin ? 'Admin' : 'Client';
}

function clearSubscriptions() {
  state.unsubscribers.forEach((unsub) => unsub());
  state.unsubscribers = [];
}

function protectConfig() {
  if (firebaseConfig.apiKey === 'REPLACE_ME') {
    showToast('Configuration Firebase manquante.');
    throw new Error('Firebase config not set.');
  }
}

protectConfig();

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

ui.tabs.forEach((btn) => {
  btn.addEventListener('click', () => setAuthTab(btn.dataset.authTab));
});

ui.loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(ui.loginForm);
  try {
    await signInWithEmailAndPassword(
      auth,
      formData.get('email'),
      formData.get('password')
    );
  } catch (error) {
    showToast(error.message);
  }
});

ui.signupForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(ui.signupForm);
  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      formData.get('email'),
      formData.get('password')
    );
    await updateProfile(credential.user, {
      displayName: formData.get('name')
    });
    await ensureUserProfile(credential.user);
  } catch (error) {
    showToast(error.message);
  }
});

ui.resetPassword.addEventListener('click', async () => {
  const email = ui.loginForm.querySelector('input[name="email"]').value;
  if (!email) {
    showToast('Entrez votre email.');
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    showToast('Email de réinitialisation envoyé.');
  } catch (error) {
    showToast(error.message);
  }
});

ui.googleSignIn.addEventListener('click', async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  } catch (error) {
    showToast(error.message);
  }
});

let recaptchaVerifier;
ui.sendCode.addEventListener('click', async () => {
  try {
    if (!recaptchaVerifier) {
      recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal'
      });
    }
    const phoneNumber = ui.phoneNumber.value;
    state.confirmResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      recaptchaVerifier
    );
    ui.codePanel.classList.remove('hidden');
    showToast('Code envoyé.');
  } catch (error) {
    showToast(error.message);
  }
});

ui.verifyCode.addEventListener('click', async () => {
  try {
    if (!state.confirmResult) {
      showToast('Demandez un code d\'abord.');
      return;
    }
    const result = await state.confirmResult.confirm(ui.smsCode.value);
    const name = ui.phoneName.value.trim();
    if (name) {
      await updateProfile(result.user, { displayName: name });
    }
    await ensureUserProfile(result.user);
  } catch (error) {
    showToast(error.message);
  }
});

ui.signOutBtn.addEventListener('click', async () => {
  await signOut(auth);
  clearSubscriptions();
  setViewAuthenticated(false);
});

ui.openPostModal.addEventListener('click', () => {
  ui.postModal.classList.remove('hidden');
});

ui.closePostModal.addEventListener('click', () => {
  ui.postModal.classList.add('hidden');
});

ui.postModal.addEventListener('click', (event) => {
  if (event.target === ui.postModal) {
    ui.postModal.classList.add('hidden');
  }
});

ui.postForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!state.isAdmin) {
    showToast('Accès admin requis.');
    return;
  }

  const formData = new FormData(ui.postForm);
  let mediaUrl = formData.get('mediaUrl').trim();
  const file = formData.get('mediaFile');

  try {
    if (file && file.size > 0) {
      const path = `media/${state.user.uid}/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      mediaUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, 'posts'), {
      type: formData.get('type'),
      title: formData.get('title'),
      description: formData.get('description'),
      mediaUrl,
      createdAt: serverTimestamp(),
      createdBy: state.user.uid
    });

    ui.postForm.reset();
    ui.postModal.classList.add('hidden');
    showToast('Publication ajoutée.');
  } catch (error) {
    showToast(error.message);
  }
});

ui.appointmentForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!state.user) return;
  const formData = new FormData(ui.appointmentForm);
  try {
    await addDoc(collection(db, 'appointments'), {
      clientId: state.user.uid,
      clientName: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      service: formData.get('service'),
      date: formData.get('date'),
      time: formData.get('time'),
      message: formData.get('message'),
      status: 'Nouveau',
      createdAt: serverTimestamp()
    });
    ui.appointmentForm.reset();
    showToast('Rendez-vous envoyé.');
  } catch (error) {
    showToast(error.message);
  }
});

ui.clientMessageForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!state.user) return;
  const formData = new FormData(ui.clientMessageForm);
  const threadRef = doc(db, 'threads', state.user.uid);
  try {
    await setDoc(
      threadRef,
      {
        clientName: state.user.displayName || 'Cliente',
        clientEmail: state.user.email || '',
        clientPhone: state.user.phoneNumber || '',
        updatedAt: serverTimestamp(),
        lastMessage: formData.get('subject')
      },
      { merge: true }
    );
    await addDoc(collection(threadRef, 'messages'), {
      fromUid: state.user.uid,
      fromRole: 'client',
      subject: formData.get('subject'),
      text: formData.get('text'),
      createdAt: serverTimestamp()
    });
    ui.clientMessageForm.reset();
  } catch (error) {
    showToast(error.message);
  }
});

ui.adminMessageForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!state.isAdmin || !state.selectedThread) return;
  const formData = new FormData(ui.adminMessageForm);
  const threadRef = doc(db, 'threads', state.selectedThread);
  try {
    await setDoc(
      threadRef,
      {
        updatedAt: serverTimestamp(),
        lastMessage: formData.get('text')
      },
      { merge: true }
    );
    await addDoc(collection(threadRef, 'messages'), {
      fromUid: state.user.uid,
      fromRole: 'admin',
      text: formData.get('text'),
      createdAt: serverTimestamp()
    });
    ui.adminMessageForm.reset();
  } catch (error) {
    showToast(error.message);
  }
});

function renderPosts(posts) {
  ui.postsGrid.innerHTML = '';
  const items = posts.length ? posts : DEFAULT_POSTS;
  items.forEach((post) => {
    const card = document.createElement('div');
    card.className = 'media-card';

    const preview = document.createElement('div');
    preview.className = 'media-preview';

    if (post.mediaUrl) {
      if (post.type === 'video') {
        const video = document.createElement('video');
        video.src = post.mediaUrl;
        video.controls = true;
        preview.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.src = post.mediaUrl;
        img.alt = post.title;
        preview.appendChild(img);
      }
    } else {
      preview.textContent = post.type === 'video' ? 'Vidéo' : 'Photo';
    }

    const body = document.createElement('div');
    body.className = 'media-body';

    const title = document.createElement('h3');
    title.textContent = post.title;

    const desc = document.createElement('p');
    desc.textContent = post.description || '';

    const actions = document.createElement('div');
    actions.className = 'media-actions';

    if (state.isAdmin && post.id && !post.id.startsWith('sample')) {
      const del = document.createElement('button');
      del.textContent = 'Supprimer';
      del.addEventListener('click', async () => {
        await deleteDoc(doc(db, 'posts', post.id));
      });
      actions.appendChild(del);
    }

    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(actions);

    card.appendChild(preview);
    card.appendChild(body);
    ui.postsGrid.appendChild(card);
  });
}

function renderAppointments(target, items, isAdmin) {
  target.innerHTML = '';
  if (items.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'hint';
    empty.textContent = 'Aucun rendez-vous pour le moment.';
    target.appendChild(empty);
    return;
  }

  items.forEach((appointment) => {
    const card = document.createElement('div');
    card.className = 'appointment';

    const header = document.createElement('div');
    header.className = 'appointment-header';

    const title = document.createElement('div');
    title.innerHTML = `<strong>${appointment.clientName}</strong> • ${appointment.service}`;

    const status = document.createElement('span');
    status.className = 'status';
    status.textContent = appointment.status || 'Nouveau';

    header.appendChild(title);
    header.appendChild(status);

    const meta = document.createElement('div');
    meta.textContent = `${appointment.date} à ${appointment.time}`;

    const message = document.createElement('div');
    message.className = 'hint';
    message.textContent = appointment.message || 'Pas de message.';

    const actions = document.createElement('div');
    actions.className = 'appointment-actions';

    if (isAdmin) {
      ['Confirmé', 'Terminé'].forEach((statusValue) => {
        const btn = document.createElement('button');
        btn.textContent = statusValue;
        btn.addEventListener('click', async () => {
          await updateDoc(doc(db, 'appointments', appointment.id), {
            status: statusValue
          });
        });
        actions.appendChild(btn);
      });
    } else {
      const cancel = document.createElement('button');
      cancel.textContent = 'Annuler';
      cancel.addEventListener('click', async () => {
        await updateDoc(doc(db, 'appointments', appointment.id), {
          status: 'Annulé'
        });
      });
      actions.appendChild(cancel);
    }

    if (appointment.phone) {
      const wa = document.createElement('a');
      wa.textContent = 'WhatsApp';
      wa.href = `https://wa.me/${appointment.phone.replace(/\D/g, '')}`;
      wa.target = '_blank';
      wa.rel = 'noopener';
      actions.appendChild(wa);
    }

    if (appointment.email) {
      const mail = document.createElement('a');
      mail.textContent = 'Email';
      mail.href = `mailto:${appointment.email}`;
      actions.appendChild(mail);
    }

    card.appendChild(header);
    card.appendChild(meta);
    card.appendChild(message);
    card.appendChild(actions);

    target.appendChild(card);
  });
}

function renderMessages(target, messages, isMe) {
  target.innerHTML = '';
  messages.forEach((msg) => {
    const bubble = document.createElement('div');
    bubble.className = 'message';
    if (isMe(msg)) {
      bubble.classList.add('me');
    }
    bubble.textContent = msg.subject ? `${msg.subject} — ${msg.text}` : msg.text;
    target.appendChild(bubble);
  });
}

async function ensureUserProfile(user) {
  if (!user) return;
  const profileRef = doc(db, 'users', user.uid);
  await setDoc(
    profileRef,
    {
      name: user.displayName || 'Cliente',
      email: user.email || '',
      phone: user.phoneNumber || '',
      role: 'client',
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    },
    { merge: true }
  );
}

function subscribeData() {
  const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  state.unsubscribers.push(
    onSnapshot(postsQuery, (snapshot) => {
      const posts = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      renderPosts(posts);
    })
  );

  if (state.user) {
    const clientQuery = query(
      collection(db, 'appointments'),
      where('clientId', '==', state.user.uid)
    );
    state.unsubscribers.push(
      onSnapshot(clientQuery, (snapshot) => {
        const appointments = snapshot.docs
          .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
          .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        renderAppointments(ui.clientAppointments, appointments, false);
      })
    );

    const threadRef = doc(db, 'threads', state.user.uid);
    const messagesQuery = query(
      collection(threadRef, 'messages'),
      orderBy('createdAt', 'asc')
    );
    state.unsubscribers.push(
      onSnapshot(messagesQuery, (snapshot) => {
        const messages = snapshot.docs.map((docSnap) => docSnap.data());
        renderMessages(ui.clientMessages, messages, (msg) => msg.fromUid === state.user.uid);
      })
    );
  }

  if (state.isAdmin) {
    const adminQuery = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
    state.unsubscribers.push(
      onSnapshot(adminQuery, (snapshot) => {
        const appointments = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        renderAppointments(ui.adminAppointments, appointments, true);
      })
    );

    const threadQuery = query(collection(db, 'threads'), orderBy('updatedAt', 'desc'));
    state.unsubscribers.push(
      onSnapshot(threadQuery, (snapshot) => {
        const threads = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
        renderThreads(threads);
      })
    );
  }
}

function renderThreads(threads) {
  ui.threadList.innerHTML = '';
  threads.forEach((thread) => {
    const item = document.createElement('div');
    item.className = 'thread-item';
    item.textContent = thread.clientName || 'Cliente';
    if (state.selectedThread === thread.id) {
      item.classList.add('active');
    }
    item.addEventListener('click', () => selectThread(thread));
    ui.threadList.appendChild(item);
  });
}

function selectThread(thread) {
  state.selectedThread = thread.id;
  ui.threadHeader.textContent = `${thread.clientName || 'Cliente'} • ${thread.clientEmail || ''}`;
  ui.adminMessageForm.classList.remove('hidden');

  const messagesQuery = query(
    collection(doc(db, 'threads', thread.id), 'messages'),
    orderBy('createdAt', 'asc')
  );

  state.unsubscribers.push(
    onSnapshot(messagesQuery, (snapshot) => {
      const messages = snapshot.docs.map((docSnap) => docSnap.data());
      renderMessages(ui.threadMessages, messages, (msg) => msg.fromRole === 'admin');
    })
  );
}

onAuthStateChanged(auth, async (user) => {
  clearSubscriptions();
  state.user = user;
  state.isAdmin = isAdminUser(user);

  if (user) {
    await ensureUserProfile(user);
    ui.userName.textContent = user.displayName || user.email || 'Utilisateur';
    setAdminVisibility(state.isAdmin);
    setViewAuthenticated(true);
    subscribeData();
  } else {
    setViewAuthenticated(false);
  }
});

const today = new Date().toISOString().split('T')[0];
const dateInput = ui.appointmentForm.querySelector('input[name="date"]');
if (dateInput) {
  dateInput.min = today;
}
