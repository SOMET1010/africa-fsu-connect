import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { WorkspaceCard } from '../hooks/useWorkspaceData';

interface WorkspaceGridProps {
  workspaces: WorkspaceCard[];
}

export function WorkspaceGrid({ workspaces }: WorkspaceGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {workspaces.map((workspace) => {
        const Icon = workspace.icon;
        return (
          <Card key={workspace.id} className={`${workspace.color} hover:shadow-lg transition-all duration-200 cursor-pointer group`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg">{workspace.title}</CardTitle>
                </div>
                {workspace.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {workspace.badge}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{workspace.description}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {workspace.items.map((item, index) => (
                <Link 
                  key={index} 
                  to={item.href}
                  className="flex items-center justify-between p-2 rounded hover:bg-white/50 transition-colors"
                >
                  <span className="text-sm font-medium">{item.title}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {item.count}
                    </Badge>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
              
              <Link to={workspace.href} className="block">
                <Button variant="ghost" className="w-full mt-2 group-hover:bg-white/30">
                  Voir tout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}