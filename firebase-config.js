export const firebaseConfig = {
  apiKey: 'AIzaSyDkyDlVMxasw8bWVG8x-JQ4ALv0pK77vhU',
  authDomain: 'salon-gn.firebaseapp.com',
  projectId: 'salon-gn',
  storageBucket: 'salon-gn.firebasestorage.app',
  messagingSenderId: '10386870785',
  appId: '1:10386870785:web:04894cb11e715eb798e600'
};

export const salonConfig = {
  phoneDigits: '+224629516388',
  phoneDisplay: '+224 629 51 63 88',
  whatsappDigits: '224629516388',
  email: 'barre.beavogui@icloud.com',
  address: 'Yimbaya, Conakry, Guinée',
  adminEmails: [
    'barre.beavogui@icloud.com',
    'eliebarresbeavogui3@gmail.com'
  ],
  demoAdminEmail: 'barre.beavogui@icloud.com',
  demoAdminPassword: 'SalonDemo2026!'
};

export const hasFirebaseConfig = Object.values(firebaseConfig).every(
  (value) => value && !String(value).startsWith('YOUR_')
);
