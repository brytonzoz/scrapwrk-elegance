import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface FloatingTimerProps {
  timeRemaining: number | null;
  className?: string;
}

const FloatingTimer = ({ timeRemaining, className }: FloatingTimerProps) => {
  const [timeString, setTimeString] = useState('00:00');
  const [color, setColor] = useState('text-green-400');
  const [isAnimating, setIsAnimating] = useState(false);

  // Format time remaining
  const formatTimeRemaining = (ms: number | null): string => {
    if (ms === null) return "00:00";
    
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get timer color based on time remaining
  const getTimerColor = (ms: number | null): string => {
    if (ms === null) return "text-gray-400";
    
    // Less than 1 minute - red
    if (ms < 60000) return "text-red-500";
    // Less than 5 minutes - yellow
    if (ms < 300000) return "text-yellow-400";
    // Otherwise - green
    return "text-green-400";
  };

  useEffect(() => {
    setTimeString(formatTimeRemaining(timeRemaining));
    setColor(getTimerColor(timeRemaining));

    // Add animation when time is getting lower
    if (timeRemaining !== null && timeRemaining < 60000) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [timeRemaining]);

  // Don't render if there's no time
  if (!timeRemaining) return null;

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 right-0 ios19-glass px-4 py-2",
        "border-b border-white/20 backdrop-blur-xl z-[60] shadow-lg",
        isAnimating && "animate-pulse",
        className
      )}
    >
      <div className={cn("flex items-center justify-center gap-2", color)}>
        <Clock className="w-4 h-4" />
        <span className="font-mono text-sm font-bold">Reserved for: {timeString}</span>
      </div>
    </div>
  );
};

export default FloatingTimer; 