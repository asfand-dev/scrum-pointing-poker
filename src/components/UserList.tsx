
import React from 'react';
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, HelpCircle, Wifi, WifiOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UserListProps {
  users: User[];
  votesRevealed: boolean;
  currentUserId: string | null;
  onlineUserIds: string[];
}

const UserList: React.FC<UserListProps> = ({ users, votesRevealed, currentUserId, onlineUserIds }) => {
  if (!currentUserId) return null;

  const displayedUsers = users.filter(user => onlineUserIds.includes(user.id) || user.id === currentUserId);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Participants ({displayedUsers.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {displayedUsers.map((user) => {
            const isOnline = onlineUserIds.includes(user.id);
            return (
              <li key={user.id} className="flex items-center justify-between p-2 rounded-md bg-secondary">
                <div className="flex items-center gap-2">
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger>
                        {isOnline ? (
                          <Wifi size={16} className="text-green-500" />
                        ) : (
                          <WifiOff size={16} className="text-muted-foreground" />
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isOnline ? 'Online' : 'Offline'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span className={`font-medium ${user.id === currentUserId ? 'text-primary' : ''} ${!isOnline ? 'text-muted-foreground italic' : ''}`}>
                    {user.name} {user.id === currentUserId && '(You)'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {votesRevealed ? (
                    <span className="font-bold text-lg text-primary">{user.vote || <HelpCircle size={20} className="text-muted-foreground" />}</span>
                  ) : (
                    user.vote ? <CheckCircle size={20} className="text-green-500" /> : <HelpCircle size={20} className="text-muted-foreground" />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default UserList;
