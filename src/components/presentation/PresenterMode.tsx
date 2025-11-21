import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { speakerNotes } from '@/data/speaker-notes';
import { PresentationTimer } from './PresentationTimer';
import { Badge } from '@/components/ui/badge';

interface PresenterModeProps {
  currentSection: number;
  totalSections: number;
  sections: Array<{ id: string; title: string }>;
  duration?: number;
}

export const PresenterMode = ({
  currentSection,
  totalSections,
  sections,
  duration = 30,
}: PresenterModeProps) => {
  const currentNotes = speakerNotes[sections[currentSection]?.id] || null;
  const nextNotes = currentSection < totalSections - 1 ? speakerNotes[sections[currentSection + 1]?.id] : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-screen p-4 bg-background">
      {/* Left: Current & Next Sections Preview */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Section Actuelle</h2>
          <PresentationTimer duration={duration} />
        </div>
        
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="default">{currentSection + 1} / {totalSections}</Badge>
            <h3 className="text-xl font-semibold">{sections[currentSection]?.title}</h3>
          </div>
          
          {currentNotes && (
            <div className="text-sm text-muted-foreground">
              Durée recommandée : {currentNotes.duration} minutes
            </div>
          )}
        </Card>

        {nextNotes && (
          <Card className="p-6 bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">Suivant</Badge>
              <h4 className="font-semibold">{sections[currentSection + 1]?.title}</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Points clés : {nextNotes.keyPoints.slice(0, 2).join(', ')}
            </p>
          </Card>
        )}
      </div>

      {/* Right: Speaker Notes */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Notes du Présentateur</h2>
        
        {currentNotes ? (
          <Tabs defaultValue="points" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="points">Points</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="qa">Q&A</TabsTrigger>
            </TabsList>
            
            <TabsContent value="points">
              <ScrollArea className="h-[calc(100vh-300px)]">
                <Card className="p-4 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Points Clés</h4>
                    <ul className="space-y-2">
                      {currentNotes.keyPoints.map((point, i) => (
                        <li key={i} className="flex gap-2 text-sm">
                          <span className="text-primary">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">Conseil</h4>
                    <p className="text-sm text-muted-foreground">{currentNotes.tips}</p>
                  </div>
                </Card>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="stats">
              <ScrollArea className="h-[calc(100vh-300px)]">
                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Statistiques à Mentionner</h4>
                  <ul className="space-y-3">
                    {currentNotes.statistics.map((stat, i) => (
                      <li key={i} className="p-3 bg-primary/10 rounded-lg text-sm font-medium">
                        {stat}
                      </li>
                    ))}
                  </ul>
                </Card>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="qa">
              <ScrollArea className="h-[calc(100vh-300px)]">
                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Questions Anticipées</h4>
                  <ul className="space-y-3">
                    {currentNotes.questions.map((question, i) => (
                      <li key={i} className="p-3 border-l-2 border-primary pl-3 text-sm">
                        {question}
                      </li>
                    ))}
                  </ul>
                </Card>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="p-6">
            <p className="text-muted-foreground">Aucune note disponible pour cette section.</p>
          </Card>
        )}
      </div>
    </div>
  );
};
