import { useState } from 'react';
import { useAudioAlert } from '@/hooks/useAudioAlert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Volume2, Loader2 } from 'lucide-react';

export function VoiceTest() {
  // Default text so the user can test immediately
  const [text, setText] = useState('Rest. Look away from your screen.');
  const { speak } = useAudioAlert();
  const [isLoading, setIsLoading] = useState(false);

  const handleTest = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    // The speak function is async, so we wait for it to start/finish
    await speak(text);
    setIsLoading(false);
  };

  return (
    <div className="flex w-full max-w-sm items-center space-x-2 p-4 rounded-lg bg-background/40 backdrop-blur-sm border border-border/50">
      <Input
        type="text"
        placeholder="Type something to speak..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="bg-background/50"
      />
      <Button 
        onClick={handleTest} 
        disabled={isLoading || !text.trim()}
        variant="secondary"
        size="icon"
        title="Test Voice"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
