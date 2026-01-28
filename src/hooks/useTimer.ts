import { useState, useEffect, useCallback, useRef } from 'react';

export type TimerState = 'idle' | 'work' | 'rest';

interface UseTimerReturn {
  minutes: number;
  seconds: number;
  state: TimerState;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  stop: () => void;
  requestNotificationPermission: () => Promise<boolean>;
  notificationPermission: NotificationPermission | 'default';
}

const WORK_DURATION = 20 * 60; // 20 minutes in seconds
const REST_DURATION = 20; // 20 seconds

export function useTimer(): UseTimerReturn {
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [state, setState] = useState<TimerState>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const sendNotification = useCallback((title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/icon-192.png',
        tag: 'eye-rest-timer',
      });
    }
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      return false;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    return permission === 'granted';
  }, []);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (state === 'work') {
            setState('rest');
            sendNotification('👀 Time to Rest!', 'Look at something 20 feet away for 20 seconds');
            return REST_DURATION;
          } else {
            setState('work');
            sendNotification('💪 Back to Work!', 'Your 20 second eye break is over');
            return WORK_DURATION;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, state, sendNotification]);

  const start = useCallback(() => {
    if (state === 'idle') {
      setState('work');
      setTimeLeft(WORK_DURATION);
    }
    setIsRunning(true);
  }, [state]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    setState('idle');
    setTimeLeft(WORK_DURATION);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return {
    minutes,
    seconds,
    state,
    isRunning,
    start,
    pause,
    stop,
    requestNotificationPermission,
    notificationPermission,
  };
}