import { useTimer, TimerState } from '@/hooks/useTimer';
import { Play, Pause, Square, Bell, BellOff, Eye } from 'lucide-react';

function TimerDisplay({ minutes, seconds, state }: { minutes: number; seconds: number; state: TimerState }) {
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return (
    <div className="relative flex flex-col items-center">
      {/* Glow effect behind timer */}
      <div 
        className={`absolute inset-0 blur-3xl opacity-30 rounded-full transition-colors duration-500 ${
          state === 'rest' ? 'bg-success' : 'bg-primary'
        }`} 
      />
      
      <div className="timer-display relative z-10">
        <span className={state === 'rest' ? 'text-success' : 'text-primary'}>
          {formattedMinutes}:{formattedSeconds}
        </span>
      </div>
    </div>
  );
}

function StateLabel({ state }: { state: TimerState }) {
  const labels: Record<TimerState, { text: string; subtext: string }> = {
    idle: { text: 'Ready', subtext: 'Press play to start' },
    work: { text: 'Work', subtext: 'Focus on your screen' },
    rest: { text: 'Rest', subtext: 'Look 20ft away' },
  };

  const { text, subtext } = labels[state];

  return (
    <div className="text-center space-y-2">
      <p className={`timer-label transition-colors duration-500 ${
        state === 'rest' ? 'text-success' : state === 'work' ? 'text-primary' : 'text-muted-foreground'
      }`}>
        {text}
      </p>
      <p className="text-muted-foreground text-sm sm:text-base">{subtext}</p>
    </div>
  );
}

function ControlButton({ 
  onClick, 
  variant, 
  children,
  disabled = false,
}: { 
  onClick: () => void; 
  variant: 'primary' | 'secondary' | 'stop';
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const variantClasses = {
    primary: 'control-button-primary',
    secondary: 'control-button-secondary',
    stop: 'control-button-stop',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`control-button ${variantClasses[variant]} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

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
      {/* Background glow */}
      <div className="fixed inset-0 bg-gradient-glow pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-6 h-6 text-primary" />
          <span className="font-semibold text-lg">20-20-20</span>
        </div>
        
        <button
          onClick={handleNotificationToggle}
          className="p-3 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/50 transition-colors"
          title={notificationPermission === 'granted' ? 'Notifications enabled' : 'Enable notifications'}
        >
          {notificationPermission === 'granted' ? (
            <Bell className="w-5 h-5 text-primary" />
          ) : (
            <BellOff className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-32">
        {/* Timer ring */}
        <div className={`relative p-8 sm:p-12 rounded-full mb-8 ${
          isRunning ? 'animate-pulse' : ''
        }`}>
          {/* Animated ring when running */}
          {isRunning && (
            <div className={`pulse-ring border-2 ${
              state === 'rest' ? 'border-success/30' : 'border-primary/30'
            }`} />
          )}
          
          <div className={`relative rounded-full p-8 sm:p-12 border-2 transition-colors duration-500 ${
            state === 'rest' 
              ? 'border-success/30 bg-success/5' 
              : 'border-primary/30 bg-primary/5'
          }`}>
            <TimerDisplay minutes={minutes} seconds={seconds} state={state} />
          </div>
        </div>

        <StateLabel state={state} />
      </main>

      {/* Controls */}
      <footer className="relative z-10 fixed bottom-0 left-0 right-0 p-6 pb-8 bg-gradient-to-t from-background via-background/95 to-transparent">
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