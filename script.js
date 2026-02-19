// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker Registered'))
            .catch(err => console.log('Service Worker Failed', err));
    });
}

const enableBtn = document.getElementById('enableBtn');
const testBtn = document.getElementById('testBtn');

// Request Permission
enableBtn.addEventListener('click', async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        alert("Success! You can now send notifications.");
    } else {
        alert("Permission denied. Check your browser settings.");
    }
});

// Trigger Notification
testBtn.addEventListener('click', async () => {
    if (Notification.permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        registration.showNotification('Hello from Vercel!', {
            body: 'This is a test notification from your web app.',
            icon: 'https://cdn-icons-png.flaticon.com/512/3119/3119338.png',
            vibrate: [200, 100, 200],
            badge: 'https://cdn-icons-png.flaticon.com/512/3119/3119338.png'
        });
    } else {
        alert("Please click 'Enable' first.");
    }
});
