
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import NamePromptDialog from '@/components/NamePromptDialog';
import { supabase } from '@/integrations/supabase/client';
import Spinner from '@/components/Spinner';
import { toast } from 'sonner';
import { BackgroundLines } from '@/components/ui/background-lines';

const Index = () => {
  const [rejoinSessionId, setRejoinSessionId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<'start' | 'rejoin' | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedSessionId = localStorage.getItem('sessionId');
    if (savedSessionId) {
      setRejoinSessionId(savedSessionId);
    }
  }, []);

  const handleOpenDialog = (action: 'start' | 'rejoin') => {
    setDialogAction(action);
    setIsDialogOpen(true);
  };

  const handleNameSubmit = async (name: string) => {
    setLoading(true);
    setIsDialogOpen(false);
    
    let sessionId = dialogAction === 'rejoin' ? rejoinSessionId : null;

    try {
      if (dialogAction === 'start') {
        const { data: sessionData, error: sessionError } = await supabase
          .from('sessions')
          .insert([{}])
          .select()
          .single();
        if (sessionError || !sessionData) throw sessionError || new Error("Failed to create session");
        sessionId = sessionData.id;
      }

      if (!sessionId) throw new Error("Session ID not found");

      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([{ session_id: sessionId, name }])
        .select()
        .single();
      if (userError || !userData) throw userError || new Error("Failed to create user");
      
      localStorage.setItem('sessionId', sessionId);
      localStorage.setItem('userId', userData.id);
      localStorage.setItem('userName', name);

      navigate(`/session/${sessionId}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error joining session:', error);
      toast.error(`Failed to join session: ${errorMessage}`);
      setLoading(false);
    }
  };

  return (
    <BackgroundLines>
      <div className="min-h-screen flex items-center justify-center bg-background">      
        <div className="text-center p-8 z-20">
          <h1 className="text-5xl font-bold mb-4">Scrum Poker</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Real-time pointing for agile teams.
          </p>
          {loading ? (
            <Spinner />
          ) : (
            <div className="space-x-4">
              <Button size="lg" onClick={() => handleOpenDialog('start')}>
                Start New Session
              </Button>
              {rejoinSessionId && (
                <Button size="lg" variant="outline" onClick={() => handleOpenDialog('rejoin')}>
                  Rejoin Last Session
                </Button>
              )}
            </div>
          )}
        </div>
        <NamePromptDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onNameSubmit={handleNameSubmit}
          title={dialogAction === 'start' ? 'Start a New Session' : 'Rejoin Session'}
          description="Please enter your name to join the session."
        />
      </div>
    </BackgroundLines>
  );
};

export default Index;
