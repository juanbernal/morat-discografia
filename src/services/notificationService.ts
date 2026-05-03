type NotificationCallback = (release: { name: string; artistName: string }) => void;

type NotificationOptionsWithActions = NotificationOptions & {
    actions?: { action: string; title: string }[];
};

let notificationCallback: NotificationCallback | null = null;

export async function requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return false;
    }

    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;

    const permission = await Notification.requestPermission();
    return permission === 'granted';
}

export async function enableNotifications(
    onNewRelease?: NotificationCallback
): Promise<boolean> {
    const granted = await requestNotificationPermission();
    if (granted) {
        if (onNewRelease) notificationCallback = onNewRelease;
        localStorage.setItem('dmg_notifications_v1', 'true');
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.ready;
            await registration.showNotification('Diosmasgym Records', {
                body: '¡Notificaciones activadas! Te avisaremos de nuevos lanzamientos.',
                icon: '/diosmasgym_profile.jpg',
                badge: '/diosmasgym_profile.jpg',
                tag: 'notification-enabled',
            });
        }
    }
    return granted;
}

export function disableNotifications(): void {
    localStorage.setItem('dmg_notifications_v1', 'false');
    if ('serviceWorker' in navigator && Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(registration => {
            registration.getNotifications().then(notifications => {
                notifications.forEach(n => n.close());
            });
        });
    }
}

export function notifyNewRelease(name: string, artistName: string): void {
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(registration => {
            const options: NotificationOptionsWithActions = {
                body: `${artistName} acaba de lanzar nueva música. ¡Escúchalo ahora!`,
                icon: '/diosmasgym_profile.jpg',
                badge: '/diosmasgym_profile.jpg',
                tag: `release-${name}`,
                requireInteraction: true,
                actions: [
                    { action: 'open', title: 'Escuchar ahora' },
                    { action: 'close', title: 'Cerrar' },
                ],
            };

            registration.showNotification(`Nuevo Estreno: ${name}`, options);
        });
    }
    if (notificationCallback) {
        notificationCallback({ name, artistName });
    }
}

export function getNotificationStatus(): boolean {
    return localStorage.getItem('dmg_notifications_v1') === 'true';
}
