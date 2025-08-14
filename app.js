// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').then(reg => {
    console.log('SW registered', reg.scope);
  }).catch(err => console.warn('SW registration failed', err));
}

const permBtn = document.getElementById('requestPerm');
const testBtn = document.getElementById('testNotify');
const permStatus = document.getElementById('permStatus');

function updatePermText(){
  const p = Notification.permission;
  permStatus.textContent = `Notification permission: ${p}`;
}
updatePermText();

permBtn.addEventListener('click', async () => {
  const res = await Notification.requestPermission();
  updatePermText();
  if(res === 'granted') showTestNotification('Permission granted', 'Notifications are enabled.');
});

async function showTestNotification(title, body){
  if(Notification.permission !== 'granted') return;
  const reg = await navigator.serviceWorker.getRegistration();
  if(reg && reg.showNotification){
    reg.showNotification(title, {
      body,
      icon: 'icons-192.png',
      badge: 'icons-192.png'
    });
  } else {
    new Notification(title, {body, icon: 'icons-192.png'});
  }
}

testBtn.addEventListener('click', () => showTestNotification('Test', 'This is a test notification'));

// Install Prompt
let deferredPrompt;
const showInstall = document.getElementById('showInstall');
const installHint = document.getElementById('installHint');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installHint.textContent = 'App can be installed — click the button above.';
});

showInstall.addEventListener('click', async () => {
  if(deferredPrompt){
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    installHint.textContent = `Install choice: ${choice.outcome}`;
    deferredPrompt = null;
  } else {
    installHint.textContent = 'No install prompt available.';
  }
});
