import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Zap, Target, CheckCircle, ArrowRight } from 'lucide-react';
import { DailyMission } from '../hooks/useDailyMissions';

interface DailyMissionsListProps {
  missions: DailyMission[];
  completedCount: number;
}

export function DailyMissionsList({ missions, completedCount }: DailyMissionsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Vos missions du jour
          <Badge variant="secondary">{missions.length - completedCount} restantes</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {missions.slice(0, 3).map((mission) => (
            <div
              key={mission.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                mission.completed 
                  ? 'bg-green-50 border-green-200 opacity-75' 
                  : 'bg-card hover:shadow-sm cursor-pointer'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  mission.completed ? 'bg-green-100' : 'bg-primary/10'
                }`}>
                  {mission.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Target className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div>
                  <p className={`font-medium ${mission.completed ? 'text-green-700' : 'text-foreground'}`}>
                    {mission.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {mission.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="text-xs">
                  +{mission.points} pts
                </Badge>
                {!mission.completed && (
                  <Link to={mission.action.target}>
                    <Button size="sm" variant="outline">
                      Faire
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}