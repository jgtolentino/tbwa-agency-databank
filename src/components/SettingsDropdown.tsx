import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Settings, Plug, User, Shield, Bell, 
  Palette, HelpCircle, LogOut, ChevronRight 
} from 'lucide-react';
import { IntegrationModal } from './IntegrationModal';
import { useToast } from '@/components/ui/use-toast';

export const SettingsDropdown: React.FC = () => {
  const { toast } = useToast();
  const [showIntegrations, setShowIntegrations] = useState(false);

  const handleSettingClick = (setting: string) => {
    if (setting === 'integrations') {
      setShowIntegrations(true);
    } else {
      toast({
        title: 'Coming soon',
        description: `${setting} settings will be available soon`,
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => handleSettingClick('integrations')}>
            <Plug className="mr-2 h-4 w-4" />
            <span>Integrations</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleSettingClick('profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleSettingClick('security')}>
            <Shield className="mr-2 h-4 w-4" />
            <span>Security</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleSettingClick('notifications')}>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleSettingClick('appearance')}>
            <Palette className="mr-2 h-4 w-4" />
            <span>Appearance</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => handleSettingClick('help')}>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleSettingClick('logout')}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Integration Modal */}
      <IntegrationModal
        open={showIntegrations}
        onOpenChange={setShowIntegrations}
      />
    </>
  );
};