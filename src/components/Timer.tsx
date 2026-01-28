import { useTimer, TimerState } from '@/hooks/useTimer';
import { Play, Pause, Square, Bell, BellOff, Eye } from 'lucide-react';
// 1. Add this import
import { VoiceTest } from './VoiceTest'; 

// ... (Keep TimerDisplay, StateLabel, and ControlButton as they are) ...

export function Timer() {
  const {
    minutes,
    seconds,
    state,
    isRunning,
    start,
    pause,
    stop,
    requestNotificationPermission,
    notificationPermission,
  } = useTimer();

  const handleNotificationToggle = async () => {
    if (notificationPermission !== 'granted') {
      await requestNotificationPermission();
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-500 ${
      state === 'rest' ? 'bg-gradient-rest' : 'bg-gradient-work'
    }`}>
      {/* ... (Keep Header and Main content as they are) ... */}

      {/* Controls */}
      <footer className="relative z-10 fixed bottom-0 left-0 right-0 p-6 pb-8 bg-gradient-to-t from-background via-background/95 to-transparent flex flex-col items-center gap-6">
        
        {/* 2. Add the VoiceTest component here */}
        <div className="w-full flex justify-center mb-2">
           <VoiceTest />
        </div>

        <div className="flex items-center justify-center gap-6">
          <ControlButton
            onClick={stop}
            variant="stop"
            disabled={state === 'idle'}
          >
            <Square className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" />
          </ControlButton>

          <ControlButton
            onClick={isRunning ? pause : start}
            variant="primary"
          >
            {isRunning ? (
              <Pause className="w-7 h-7 sm:w-8 sm:h-8" fill="currentColor" />
            ) : (
              <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1" fill="currentColor" />
            )}
          </ControlButton>

          {/* Placeholder for symmetry */}
          <div className="w-16 h-16 sm:w-20 sm:h-20" />
        </div>
        
        {/* Notification hint */}
        {notificationPermission !== 'granted' && (
          <p className="text-center text-muted-foreground text-xs mt-4">
            Enable notifications to get alerts when the timer is in the background
          </p>
        )}
      </footer>
    </div>
  );
}
