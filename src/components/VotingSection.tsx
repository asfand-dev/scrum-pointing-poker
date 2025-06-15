
import React from 'react';
import { Button } from '@/components/ui/button';
import PokerCard from '@/components/PokerCard';
import { SessionData } from '@/types';

const POKER_VALUES = ['0.5', '1', '2', '3', '5', '8', '13', '21', '34', '?'];

interface VotingSectionProps {
    session: SessionData;
    currentUserVote: string | null | undefined;
    onVote: (value: string) => void;
    onReveal: () => void;
    onReset: () => void;
}

const VotingSection: React.FC<VotingSectionProps> = ({ session, currentUserVote, onVote, onReveal, onReset }) => {
    return (
        <div className="md:col-span-2 flex flex-col items-center justify-center p-6 bg-background rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Choose your estimate</h2>
            <div className="flex flex-wrap gap-4 justify-center">
                {POKER_VALUES.map(value => (
                    <PokerCard
                        key={value}
                        value={value}
                        onVote={onVote}
                        isSelected={currentUserVote === value}
                    />
                ))}
            </div>
            <div className="mt-8 flex gap-4">
                <Button onClick={onReveal} size="lg" className="transition-transform active:scale-95">
                    {session.votes_revealed ? 'Hide' : 'Reveal'} Cards
                </Button>
                <Button onClick={onReset} variant="destructive" size="lg" className="transition-transform active:scale-95">
                    Reset Votes
                </Button>
            </div>
        </div>
    );
};

export default VotingSection;
