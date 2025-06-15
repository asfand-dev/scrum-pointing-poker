
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

interface SessionHeaderProps {
  onShare: () => void;
  onLeave: () => void;
}

const SessionHeader: React.FC<SessionHeaderProps> = ({ onShare, onLeave }) => {
  const { setTheme, theme } = useTheme();

  return (
    <div className="w-full flex justify-between items-center">
      <h1 className="text-2xl font-bold text-primary">Scrum Poker</h1>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Button onClick={onShare} variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" /> Share
        </Button>
        <Button onClick={onLeave} variant="destructive" size="sm">
          <LogOut className="mr-2 h-4 w-4" /> Leave Session
        </Button>
      </div>
    </div>
  );
};

export default SessionHeader;
