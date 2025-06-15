import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SessionData, User } from '@/types';
import UserList from '@/components/UserList';
import Spinner from '@/components/Spinner';
import { toast } from "sonner";
import _ from 'lodash';
import NamePromptDialog from '@/components/NamePromptDialog';
import SessionHeader from '@/components/SessionHeader';
import VotingSection from '@/components/VotingSection';
import Confetti from 'react-confetti';

const Session = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<SessionData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<{ id: string, name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNamePromptOpen, setIsNamePromptOpen] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const storedSessionId = localStorage.getItem('sessionId');

    if (userId && userName && sessionId === storedSessionId) {
      setCurrentUser({ id: userId, name: userName });
    } else {
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('sessionId');
      setIsNamePromptOpen(true);
    }
  }, [sessionId]);

  const fetchSessionData = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      if (sessionError) throw sessionError;
      if (!sessionData) throw new Error("Session not found");
      setSession(sessionData);

      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .eq('session_id', sessionId);
      if (usersError) throw usersError;
      setUsers(_.sortBy(usersData, 'created_at'));
    } catch (error) {
      console.error('Error fetching session data:', error);
      toast.error("Failed to load session. It might not exist.");
      localStorage.clear();
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [sessionId, navigate]);

  useEffect(() => {
    if (!sessionId || !currentUser) return;

    fetchSessionData();

    const channel = supabase.channel(`session-${sessionId}`, {
      config: {
        presence: {
          key: currentUser.id,
        },
      },
    });

    channel
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${sessionId}` }, (payload) => {
        const newSession = payload.new as SessionData;
        setSession(prevSession => {
          if (newSession.votes_revealed && !prevSession?.votes_revealed) {
            toast.info("Votes have been revealed!");
          }
          return newSession;
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users', filter: `session_id=eq.${sessionId}` }, (payload) => {
        const anyPayload = payload as any; 
        switch (payload.eventType) {
          case 'INSERT':
            toast.info(`${(payload.new as User).name} has joined the session.`);
            setUsers(currentUsers => _.sortBy([...currentUsers, payload.new as User], 'created_at'));
            break;
          case 'UPDATE':
            setUsers(currentUsers => _.sortBy(currentUsers.map(u => u.id === payload.new.id ? payload.new as User : u), 'created_at'));
            break;
          case 'DELETE':
            if (anyPayload.old.name) {
              toast.info(`${anyPayload.old.name} has left the session.`);
            }
            setUsers(currentUsers => currentUsers.filter(u => u.id !== payload.old.id));
            break;
        }
      })
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState<{ user_id: string }>();
        const ids = Object.values(newState).flat().map(p => p.user_id);
        setOnlineUserIds(Array.from(new Set(ids)));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user_id: currentUser.id, name: currentUser.name });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, currentUser, fetchSessionData]);

  const handleNameSubmit = async (name: string) => {
    if (!sessionId) return;
    setIsNamePromptOpen(false);
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([{ session_id: sessionId, name }])
        .select()
        .single();
      if (userError) throw userError;
      if (!userData) throw new Error("Failed to create user");
      localStorage.setItem('sessionId', sessionId);
      localStorage.setItem('userId', userData.id);
      localStorage.setItem('userName', name);
      setCurrentUser({ id: userData.id, name });
    } catch (error: any) {
      console.error('Error joining session:', error);
      toast.error(`Failed to join session: ${error.message}`);
      navigate('/');
    }
  };

  const handleVote = async (value: string) => {
    if (!currentUser) return;
    const { error } = await supabase
      .from('users')
      .update({ vote: value })
      .eq('id', currentUser.id);
    if (error) toast.error("Failed to cast vote.");
  };
  
  const handleReveal = async () => {
    if (!sessionId || !session) return;
    const shouldReveal = !session.votes_revealed;
    const { error } = await supabase
      .from('sessions')
      .update({ votes_revealed: shouldReveal })
      .eq('id', sessionId);
    
    if (error) {
      toast.error("Failed to update reveal state.");
    } else if (shouldReveal) {
      setShowConfetti(true);
    }
  };

  const handleReset = async () => {
    if (!sessionId) return;
    await supabase.from('sessions').update({ votes_revealed: false }).eq('id', sessionId);
    const { error } = await supabase.from('users').update({ vote: null }).eq('session_id', sessionId);
    if (error) toast.error("Failed to reset votes.");
    else toast.success("Votes have been reset.");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Session link copied to clipboard!");
  };

  const handleLeave = async () => {
    if (!currentUser) return;
    const { error } = await supabase.from('users').delete().eq('id', currentUser.id);
    if (error) {
      toast.error("Failed to leave session.");
    } else {
      toast.success("You have left the session.");
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('sessionId');
      navigate('/');
    }
  };

  if (isNamePromptOpen) {
    return (
      <NamePromptDialog
        open={isNamePromptOpen}
        onOpenChange={(open) => {
          if (!open) {
            if (!currentUser) {
              toast.error("You must enter a name to join a session.");
              navigate('/');
            }
          }
        }}
        onNameSubmit={handleNameSubmit}
        title="Join Session"
        description="Please enter your name to join this session."
      />
    );
  }

  if (loading || !session || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const currentUserVote = users.find(u => u.id === currentUser.id)?.vote;

  return (
    <div className="min-h-screen bg-muted/40 p-4 sm:p-8">
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={500}
          onConfettiComplete={() => setShowConfetti(false)}
          className="!fixed"
        />
      )}
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
        <SessionHeader onShare={handleShare} onLeave={handleLeave} />
        
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          <VotingSection
            session={session}
            currentUserVote={currentUserVote}
            onVote={handleVote}
            onReveal={handleReveal}
            onReset={handleReset}
          />
          <div className="md:col-span-1">
            <UserList users={users} votesRevealed={session.votes_revealed} currentUserId={currentUser.id} onlineUserIds={onlineUserIds} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Session;
