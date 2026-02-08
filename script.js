const SALON_WHATSAPP = '224629516388';
const SALON_EMAIL = 'contact@salon.com';

const postForm = document.getElementById('postForm');
const postsGrid = document.getElementById('postsGrid');
const appointmentForm = document.getElementById('appointmentForm');
const appointmentList = document.getElementById('appointmentList');
const contactForm = document.getElementById('contactForm');

const defaultPosts = [
  {
    id: 'p1',
    type: 'photo',
    title: 'Tresses bohèmes',
    description: 'Style léger et élégant pour toutes les occasions.',
    url: ''
  },
  {
    id: 'p2',
    type: 'photo',
    title: 'Brushing soyeux',
    description: 'Finition naturelle et brillante.',
    url: ''
  },
  {
    id: 'p3',
    type: 'video',
    title: 'Pose de mèches',
    description: 'Étapes clés, rendu final spectaculaire.',
    url: ''
  },
  {
    id: 'p4',
    type: 'photo',
    title: 'Chignon traditionnel',
    description: 'Un style classique revisité.',
    url: ''
  }
];

let posts = [];
let appointments = [];

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
      // ignore
    }
  }
};

function initPosts() {
  posts = storage.get('salon_posts', null);
  if (!Array.isArray(posts) || posts.length === 0) {
    posts = defaultPosts;
    storage.set('salon_posts', posts);
  }
  renderPosts();
}

function initAppointments() {
  appointments = storage.get('salon_appointments', []);
  if (!Array.isArray(appointments)) {
    appointments = [];
  }
  renderAppointments();
}

function renderPosts() {
  postsGrid.innerHTML = '';
  posts.forEach((post) => {
    const card = document.createElement('div');
    card.className = 'media-card';

    const preview = document.createElement('div');
    preview.className = 'media-preview';

    if (post.url) {
      if (post.type === 'video') {
        const video = document.createElement('video');
        video.src = post.url;
        video.controls = true;
        preview.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.src = post.url;
        img.alt = post.title;
        preview.appendChild(img);
      }
    } else {
      preview.textContent = post.type === 'video' ? 'Exemple vidéo' : 'Exemple photo';
    }

    const body = document.createElement('div');
    body.className = 'media-body';

    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = post.type === 'video' ? 'Vidéo' : 'Photo';

    const title = document.createElement('h3');
    title.textContent = post.title;

    const desc = document.createElement('p');
    desc.textContent = post.description || 'Description à ajouter.';

    const actions = document.createElement('div');
    actions.className = 'media-actions';

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.textContent = 'Supprimer';
    deleteBtn.dataset.action = 'delete-post';
    deleteBtn.dataset.id = post.id;

    const openBtn = document.createElement('button');
    openBtn.type = 'button';
    openBtn.textContent = 'Ouvrir';
    openBtn.dataset.action = 'open-post';
    openBtn.dataset.url = post.url || '';

    actions.appendChild(openBtn);
    actions.appendChild(deleteBtn);

    body.appendChild(tag);
    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(actions);

    card.appendChild(preview);
    card.appendChild(body);
    postsGrid.appendChild(card);
  });
}

function renderAppointments() {
  appointmentList.innerHTML = '';
  if (appointments.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'hint';
    empty.textContent = 'Aucun rendez-vous pour le moment.';
    appointmentList.appendChild(empty);
    return;
  }

  appointments.forEach((appointment) => {
    const card = document.createElement('div');
    card.className = 'appointment';

    const header = document.createElement('div');
    header.className = 'appointment-header';

    const title = document.createElement('div');
    title.innerHTML = `<strong>${appointment.name}</strong> • ${appointment.service}`;

    const status = document.createElement('span');
    status.className = 'status';
    status.textContent = appointment.status || 'Nouveau';

    header.appendChild(title);
    header.appendChild(status);

    const meta = document.createElement('div');
    meta.innerHTML = `${appointment.date} à ${appointment.time}`;

    const message = document.createElement('div');
    message.className = 'hint';
    message.textContent = appointment.message || 'Pas de message.';

    const actions = document.createElement('div');
    actions.className = 'appointment-actions';

    const confirmBtn = document.createElement('button');
    confirmBtn.type = 'button';
    confirmBtn.textContent = 'Confirmer';
    confirmBtn.dataset.action = 'status';
    confirmBtn.dataset.status = 'Confirmé';
    confirmBtn.dataset.id = appointment.id;

    const doneBtn = document.createElement('button');
    doneBtn.type = 'button';
    doneBtn.textContent = 'Terminé';
    doneBtn.dataset.action = 'status';
    doneBtn.dataset.status = 'Terminé';
    doneBtn.dataset.id = appointment.id;

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.textContent = 'Supprimer';
    deleteBtn.dataset.action = 'delete';
    deleteBtn.dataset.id = appointment.id;

    actions.appendChild(confirmBtn);
    actions.appendChild(doneBtn);

    if (appointment.phone) {
      const wa = document.createElement('a');
      wa.textContent = 'WhatsApp client';
      wa.href = `https://wa.me/${appointment.phone.replace(/\D/g, '')}`;
      wa.target = '_blank';
      wa.rel = 'noopener';
      actions.appendChild(wa);

      const call = document.createElement('a');
      call.textContent = 'Appeler';
      call.href = `tel:${appointment.phone}`;
      actions.appendChild(call);
    }

    if (appointment.email) {
      const mail = document.createElement('a');
      mail.textContent = 'Email client';
      mail.href = `mailto:${appointment.email}`;
      actions.appendChild(mail);
    }

    actions.appendChild(deleteBtn);

    card.appendChild(header);
    card.appendChild(meta);
    card.appendChild(message);
    card.appendChild(actions);

    appointmentList.appendChild(card);
  });
}

function buildSalonMessage(appointment) {
  const parts = [
    `Bonjour, je souhaite un rendez-vous.`,
    `Nom: ${appointment.name}`,
    `Service: ${appointment.service}`,
    `Date: ${appointment.date} à ${appointment.time}`,
    `Téléphone: ${appointment.phone}`
  ];

  if (appointment.email) {
    parts.push(`Email: ${appointment.email}`);
  }

  if (appointment.message) {
    parts.push(`Message: ${appointment.message}`);
  }

  return parts.join('\n');
}

postForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(postForm);
  const post = {
    id: `p${Date.now()}`,
    type: formData.get('type'),
    title: formData.get('title').trim() || 'Sans titre',
    description: formData.get('description').trim(),
    url: formData.get('url').trim()
  };

  posts.unshift(post);
  storage.set('salon_posts', posts);
  renderPosts();
  postForm.reset();
});

postsGrid.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const action = button.dataset.action;
  if (action === 'delete-post') {
    posts = posts.filter((post) => post.id !== button.dataset.id);
    storage.set('salon_posts', posts);
    renderPosts();
  }

  if (action === 'open-post') {
    const url = button.dataset.url;
    if (url) {
      window.open(url, '_blank', 'noopener');
    }
  }
});

appointmentForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const submitter = event.submitter;
  const sendType = submitter ? submitter.dataset.send : 'whatsapp';
  const formData = new FormData(appointmentForm);

  const appointment = {
    id: `a${Date.now()}`,
    name: formData.get('name').trim(),
    phone: formData.get('phone').trim(),
    email: formData.get('email').trim(),
    service: formData.get('service'),
    date: formData.get('date'),
    time: formData.get('time'),
    message: formData.get('message').trim(),
    status: 'Nouveau'
  };

  appointments.unshift(appointment);
  storage.set('salon_appointments', appointments);
  renderAppointments();

  if (sendType === 'whatsapp') {
    const message = buildSalonMessage(appointment);
    const url = `https://wa.me/${SALON_WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener');
  }

  if (sendType === 'email') {
    const message = buildSalonMessage(appointment);
    const mailto = `mailto:${SALON_EMAIL}?subject=Rendez-vous%20Salon&body=${encodeURIComponent(message)}`;
    window.location.href = mailto;
  }

  appointmentForm.reset();
});

appointmentList.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === 'delete') {
    appointments = appointments.filter((appointment) => appointment.id !== id);
    storage.set('salon_appointments', appointments);
    renderAppointments();
    return;
  }

  if (action === 'status') {
    appointments = appointments.map((appointment) => {
      if (appointment.id === id) {
        return { ...appointment, status: button.dataset.status };
      }
      return appointment;
    });
    storage.set('salon_appointments', appointments);
    renderAppointments();
  }
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const submitter = event.submitter;
  const sendType = submitter ? submitter.dataset.send : 'whatsapp';
  const formData = new FormData(contactForm);
  const name = formData.get('name').trim();
  const message = formData.get('message').trim();
  const finalMessage = `Bonjour, je m'appelle ${name}.\n${message}`;

  if (sendType === 'whatsapp') {
    const url = `https://wa.me/${SALON_WHATSAPP}?text=${encodeURIComponent(finalMessage)}`;
    window.open(url, '_blank', 'noopener');
  }

  if (sendType === 'email') {
    const mailto = `mailto:${SALON_EMAIL}?subject=Message%20Salon&body=${encodeURIComponent(finalMessage)}`;
    window.location.href = mailto;
  }

  contactForm.reset();
});

initPosts();
initAppointments();
