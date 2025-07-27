import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { Recommendation } from '../hooks/useUserRecommendations';

interface RecommendationCardProps {
  recommendations: Recommendation[];
}

export function RecommendationCard({ recommendations }: RecommendationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          Recommandations pour vous
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((recommendation) => {
            const Icon = recommendation.icon;
            return (
              <div key={recommendation.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-start space-x-3">
                  <Icon className={`h-5 w-5 ${recommendation.iconColor} mt-1`} />
                  <div>
                    <h4 className="font-medium">{recommendation.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {recommendation.description}
                    </p>
                    <Link to={recommendation.action.href}>
                      <Button size="sm" variant="outline">
                        {recommendation.action.text}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}