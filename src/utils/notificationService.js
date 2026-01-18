/**
 * System Notification Service
 * Provides native browser notifications for device management operations
 */

class NotificationService {
  constructor() {
    this.permission = 'default';
    this.listeners = new Set();
    this.init();
  }

  /**
   * Subscribe to notification events (for in-app notifications)
   */
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners
   */
  notifyListeners(notification) {
    this.listeners.forEach(listener => listener(notification));
  }

  /**
   * Initialize the notification service and request permission
   */
  async init() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications');
      return false;
    }

    // Request permission if not already granted
    if (Notification.permission === 'default') {
      this.permission = await Notification.requestPermission();
    } else {
      this.permission = Notification.permission;
    }

    return this.permission === 'granted';
  }

  /**
   * Check if notifications are supported and enabled
   */
  isSupported() {
    return 'Notification' in window && this.permission === 'granted';
  }

  /**
   * Request notification permission
   */
  async requestPermission() {
    if (!('Notification' in window)) {
      return false;
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission === 'granted';
  }

  /**
   * Show a system notification
   * @param {string} title - Notification title
   * @param {object} options - Notification options
   */
  async show(title, options = {}) {
    // Notify in-app listeners
    this.notifyListeners({
      title,
      severity: options.severity || 'info',
      message: options.body || '',
      timestamp: new Date()
    });

    // If permission not granted, request it
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) {
        console.warn('Notification permission denied');
        // Only in-app notification will be shown
        return null;
      }
    }

    // Default options
    const defaultOptions = {
      icon: options.icon || '/favicons/android-chrome-192x192.png',
      badge: options.badge || '/favicons/android-chrome-192x192.png',
      vibrate: [200, 100, 200],
      requireInteraction: false,
      ...options
    };

    try {
      const notification = new Notification(title, defaultOptions);

      // Auto-close after specified duration (default 5 seconds)
      const duration = options.duration || 5000;
      setTimeout(() => {
        notification.close();
      }, duration);

      // Handle click event
      notification.onclick = () => {
        window.focus();
        if (options.onClick) {
          options.onClick();
        }
        notification.close();
      };

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  }

  /**
   * Show success notification for device added
   */
  async notifyDeviceAdded(deviceData) {
    const title = 'Device Added Successfully';
    const body = `${deviceData.name || deviceData.assetNo} has been added to the system`;
    
    return this.show(title, {
      body,
      severity: 'success',
      icon: '/favicons/android-chrome-192x192.png',
      tag: 'device-added',
      data: deviceData,
      actions: [
        { action: 'view', title: 'View Device' },
        { action: 'close', title: 'Dismiss' }
      ]
    });
  }

  /**
   * Show success notification for device modified
   */
  async notifyDeviceModified(deviceData) {
    const title = 'Device Updated Successfully';
    const body = `${deviceData.name || deviceData.assetNo} has been updated`;
    
    return this.show(title, {
      body,
      severity: 'success',
      icon: '/favicons/android-chrome-192x192.png',
      tag: 'device-modified',
      data: deviceData,
      actions: [
        { action: 'view', title: 'View Device' },
        { action: 'close', title: 'Dismiss' }
      ]
    });
  }

  /**
   * Show error notification
   */
  async notifyError(message) {
    const title = 'Operation Failed';
    
    return this.show(title, {
      body: message,
      severity: 'error',
      icon: '/favicons/android-chrome-192x192.png',
      tag: 'error',
      requireInteraction: true,
      duration: 7000
    });
  }

  /**
   * Show custom notification
   */
  async notifyCustom(title, message, options = {}) {
    return this.show(title, {
      body: message,
      ...options
    });
  }
}

// Create and export singleton instance
const notificationService = new NotificationService();
export default notificationService;
