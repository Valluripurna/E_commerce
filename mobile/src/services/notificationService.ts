import { Alert, Platform } from 'react-native';

export interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
}

class NotificationService {
  private deviceToken: string | null = null;

  public async requestPermission(): Promise<boolean> {
    // In production, invoke @react-native-firebase/messaging or Expo Notifications
    console.log('[NotificationService] Requesting notification permissions...');
    return true;
  }

  public async getDeviceToken(): Promise<string> {
    if (!this.deviceToken) {
      this.deviceToken = 'demo_fcm_token_' + Math.random().toString(36).substring(7);
    }
    return this.deviceToken;
  }

  public handleForegroundNotification(notification: PushNotificationPayload) {
    Alert.alert(notification.title, notification.body, [{ text: 'OK' }]);
  }

  public handleBackgroundNotificationOpen(notification: PushNotificationPayload, navigation?: any) {
    if (notification.data?.order_id && navigation) {
      navigation.navigate('OrderTracking', { orderId: notification.data.order_id });
    }
  }
}

export const notificationService = new NotificationService();
