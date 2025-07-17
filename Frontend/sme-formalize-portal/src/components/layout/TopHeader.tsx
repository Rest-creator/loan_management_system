import { Building2, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { currentOfficer, offices } from '@/data/mockData';
import coat_of_arms from '../../../assets/coat_of_arms.png'

export const TopHeader = () => {
  const currentOffice = offices.find(office => office.id === currentOfficer.officeId);
  
  const handleLogout = () => {
    // In a real app, this would clear authentication and redirect
    window.location.href = '/login';
  };

  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <img src={coat_of_arms} className='h-14'/>
          <div>
            <h1 className="text-xl font-bold text-primary">SMEPULSE</h1>
            <p className="text-xs text-muted-foreground">Government Portal</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">{currentOfficer.name}</p>
          <p className="text-xs text-muted-foreground">{currentOffice?.name} Officer</p>
        </div>
        
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">
            {currentOfficer.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
};