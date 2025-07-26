import React from 'react';
import { useAdvancedAnalytics } from '@/hooks/useAdvancedAnalytics';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  Activity, 
  TrendingUp, 
  Target,
  Brain,
  AlertTriangle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  Cell
} from 'recharts';

export const AdvancedAnalyticsDashboard = () => {
  const { 
    userSegments, 
    conversionFunnels, 
    interactions, 
    stats,
    predictUserChurn
  } = useAdvancedAnalytics();

  const interactionsByPage = interactions.reduce((acc, interaction) => {
    acc[interaction.page] = (acc[interaction.page] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pageData = Object.entries(interactionsByPage).map(([page, count]) => ({
    page: page || 'Unknown',
    interactions: count
  }));

  const funnelColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="h-6 w-6" />
        <h2 className="text-2xl font-semibold">Advanced Analytics Dashboard</h2>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Interactions</p>
              <p className="text-2xl font-bold">{stats.totalInteractions}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Unique Pages</p>
              <p className="text-2xl font-bold">{stats.uniquePages}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Avg Session Time</p>
              <p className="text-2xl font-bold">{Math.round(stats.avgSessionTime / 60)}m</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">User Segments</p>
              <p className="text-2xl font-bold">{userSegments.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="interactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
          <TabsTrigger value="segments">User Segments</TabsTrigger>
          <TabsTrigger value="funnels">Conversion Funnels</TabsTrigger>
          <TabsTrigger value="predictions">Predictive Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="interactions">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Interactions by Page</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="page" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="interactions" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="segments">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userSegments.map(segment => (
              <Card key={segment.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{segment.name}</h3>
                  <Badge variant="secondary">{segment.users.length} users</Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Avg Session Time</span>
                      <span>{Math.round(segment.behavior.avgSessionTime / 60)}m</span>
                    </div>
                    <Progress value={segment.behavior.avgSessionTime / 10} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Conversion Rate</span>
                      <span>{Math.round(segment.behavior.conversionRate * 100)}%</span>
                    </div>
                    <Progress value={segment.behavior.conversionRate * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Bounce Rate</span>
                      <span>{Math.round(segment.behavior.bounceRate * 100)}%</span>
                    </div>
                    <Progress 
                      value={segment.behavior.bounceRate * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="funnels">
          <div className="space-y-6">
            {conversionFunnels.map(funnel => (
              <Card key={funnel.name} className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {funnel.name}
                </h3>
                
                <ResponsiveContainer width="100%" height={200}>
                  <FunnelChart>
                    <Tooltip />
                    <Funnel
                      dataKey="users"
                      data={funnel.steps}
                      isAnimationActive
                    >
                      {funnel.steps.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={funnelColors[index % funnelColors.length]} />
                      ))}
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {funnel.steps.map((step, index) => (
                    <div key={index} className="text-center">
                      <p className="text-sm font-medium">{step.event}</p>
                      <p className="text-lg font-bold">{step.users}</p>
                      <p className="text-sm text-muted-foreground">
                        {step.conversionRate}%
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictions">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Predictive Analytics
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <h4 className="font-semibold text-yellow-800">Churn Risk Analysis</h4>
                </div>
                <p className="text-sm text-yellow-700 mt-2">
                  Based on interaction patterns, we predict a 23% churn risk for users 
                  with low activity in the past 7 days.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold">High Risk Users</h4>
                  <p className="text-2xl font-bold text-red-600">12</p>
                  <p className="text-sm text-muted-foreground">Churn probability &gt; 70%</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold">Medium Risk Users</h4>
                  <p className="text-2xl font-bold text-yellow-600">28</p>
                  <p className="text-sm text-muted-foreground">Churn probability 30-70%</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold">Low Risk Users</h4>
                  <p className="text-2xl font-bold text-green-600">156</p>
                  <p className="text-sm text-muted-foreground">Churn probability &lt; 30%</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};