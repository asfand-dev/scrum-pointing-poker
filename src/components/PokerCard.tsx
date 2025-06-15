
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PokerCardProps {
  value: string;
  onVote: (value: string) => void;
  isSelected: boolean;
}

const PokerCard: React.FC<PokerCardProps> = ({ value, onVote, isSelected }) => {
  return (
    <Button
      variant={isSelected ? 'default' : 'outline'}
      className={cn(
        "h-32 w-24 text-4xl font-bold transition-all duration-300 ease-in-out shadow-md hover:shadow-lg hover:-translate-y-1",
        isSelected ? "transform scale-105 -translate-y-2 shadow-xl" : "hover:bg-accent"
      )}
      onClick={() => onVote(value)}
    >
      {value}
    </Button>
  );
};

export default PokerCard;
