import React, { useState } from 'react';
import { useABTesting } from '@/hooks/useABTesting';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Beaker, 
  Play, 
  Pause, 
  Plus, 
  TrendingUp,
  Users,
  Target,
  BarChart3
} from 'lucide-react';

export const ABTestingDashboard = () => {
  const { 
    tests, 
    createTest, 
    startTest, 
    stopTest, 
    getTestStatistics,
    recordConversion 
  } = useABTesting();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTestName, setNewTestName] = useState('');
  const [newTestDescription, setNewTestDescription] = useState('');

  const handleCreateTest = () => {
    if (!newTestName.trim()) return;

    createTest({
      id: `test-${Date.now()}`,
      name: newTestName,
      description: newTestDescription,
      variants: [
        { id: 'control', name: 'Control', traffic: 50, config: {} },
        { id: 'variant-a', name: 'Variant A', traffic: 50, config: {} }
      ],
      status: 'draft'
    });

    setNewTestName('');
    setNewTestDescription('');
    setIsCreateDialogOpen(false);
  };

  const runningTests = tests.filter(t => t.status === 'running');
  const completedTests = tests.filter(t => t.status === 'completed');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Beaker className="h-6 w-6" />
          <h2 className="text-2xl font-semibold">A/B Testing Dashboard</h2>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Test
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New A/B Test</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="testName">Test Name</Label>
                <Input
                  id="testName"
                  value={newTestName}
                  onChange={(e) => setNewTestName(e.target.value)}
                  placeholder="Button Color Test"
                />
              </div>
              <div>
                <Label htmlFor="testDescription">Description</Label>
                <Input
                  id="testDescription"
                  value={newTestDescription}
                  onChange={(e) => setNewTestDescription(e.target.value)}
                  placeholder="Testing different button colors for conversion"
                />
              </div>
              <Button onClick={handleCreateTest} className="w-full">
                Create Test
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Beaker className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Tests</p>
              <p className="text-2xl font-bold">{tests.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Play className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Running Tests</p>
              <p className="text-2xl font-bold">{runningTests.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Completed Tests</p>
              <p className="text-2xl font-bold">{completedTests.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">Avg Improvement</p>
              <p className="text-2xl font-bold">+12.3%</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Tests</TabsTrigger>
          <TabsTrigger value="completed">Completed Tests</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid gap-4">
            {runningTests.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No active tests running</p>
              </Card>
            ) : (
              runningTests.map(test => {
                const stats = getTestStatistics(test.id);
                return (
                  <Card key={test.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{test.name}</h3>
                        <p className="text-sm text-muted-foreground">{test.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Running</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => stopTest(test.id)}
                        >
                          <Pause className="h-4 w-4" />
                          Stop
                        </Button>
                      </div>
                    </div>

                    {stats && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {stats.variants.map(variant => (
                          <div key={variant.variantId} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{variant.name}</h4>
                              <Badge variant="outline">
                                {(variant.conversionRate * 100).toFixed(1)}%
                              </Badge>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Users</span>
                                <span>{variant.users}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Conversions</span>
                                <span>{variant.conversions}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Confidence</span>
                                <span>{variant.confidence.toFixed(1)}%</span>
                              </div>
                              <Progress value={variant.confidence} className="h-2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid gap-4">
            {completedTests.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No completed tests</p>
              </Card>
            ) : (
              completedTests.map(test => {
                const stats = getTestStatistics(test.id);
                if (!stats) return null;

                const winner = stats.variants.reduce((prev, current) => 
                  current.conversionRate > prev.conversionRate ? current : prev
                );

                return (
                  <Card key={test.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{test.name}</h3>
                        <p className="text-sm text-muted-foreground">{test.description}</p>
                      </div>
                      <Badge variant="secondary">Completed</Badge>
                    </div>

                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-800">
                          Winner: {winner.name} ({(winner.conversionRate * 100).toFixed(1)}% conversion rate)
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {stats.variants.map(variant => (
                        <div 
                          key={variant.variantId} 
                          className={`p-4 border rounded-lg ${
                            variant.variantId === winner.variantId ? 'border-green-500 bg-green-50' : ''
                          }`}
                        >
                          <h4 className="font-medium mb-2">{variant.name}</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Users:</span>
                              <span>{variant.users}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Conversions:</span>
                              <span>{variant.conversions}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Rate:</span>
                              <span>{(variant.conversionRate * 100).toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Testing Analytics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">+23%</p>
                <p className="text-sm text-muted-foreground">Average Conversion Lift</p>
              </div>
              
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">94%</p>
                <p className="text-sm text-muted-foreground">Statistical Significance</p>
              </div>
              
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">8.2 days</p>
                <p className="text-sm text-muted-foreground">Average Test Duration</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};