import { useState } from "react";
import { FileText, Upload, Send, Save, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Submit = () => {
  const [selectedType, setSelectedType] = useState("");

  const submissionTypes = [
    {
      id: "projet",
      title: "Fiche Projet FSU",
      description: "Soumettez un nouveau projet pour financement ou partage d'expérience",
      icon: FileText,
      fields: ["titre", "description", "budget", "timeline", "kpis", "documents"]
    },
    {
      id: "position",
      title: "Position Commune",
      description: "Contribuez à l'élaboration d'une position commune africaine",
      icon: User,
      fields: ["sujet", "position", "justification", "impact", "collaborateurs"]
    },
    {
      id: "regulation",
      title: "Proposition Réglementaire",
      description: "Proposez des améliorations au cadre réglementaire FSU",
      icon: FileText,
      fields: ["domaine", "proposition", "analyse", "recommandations"]
    },
    {
      id: "financement",
      title: "Demande de Financement",
      description: "Demandez un financement pour votre projet FSU",
      icon: Upload,
      fields: ["projet", "montant", "justification", "plan", "garanties"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Formulaires de Soumission
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Soumettez vos projets, positions communes, propositions réglementaires 
            ou demandes de financement à la communauté FSU africaine.
          </p>
        </div>

        <Tabs value={selectedType} onValueChange={setSelectedType} className="space-y-6">
          {/* Type Selection */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {submissionTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Card 
                  key={type.id} 
                  className={`cursor-pointer hover:shadow-lg transition-all ${
                    selectedType === type.id ? 'ring-2 ring-primary border-primary' : ''
                  }`}
                  onClick={() => setSelectedType(type.id)}
                >
                  <CardHeader className="text-center">
                    <Icon className="h-12 w-12 mx-auto text-primary mb-4" />
                    <CardTitle className="text-lg">{type.title}</CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* Forms */}
          <TabsContent value="projet" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fiche Projet FSU</CardTitle>
                <CardDescription>
                  Remplissez les informations de votre projet FSU pour soumission et évaluation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="titre">Titre du Projet</Label>
                    <Input id="titre" placeholder="Ex: Villages Connectés - Phase 2" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pays">Pays</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le pays" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ci">Côte d'Ivoire</SelectItem>
                        <SelectItem value="sn">Sénégal</SelectItem>
                        <SelectItem value="bf">Burkina Faso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description du Projet</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Décrivez les objectifs, la portée et les bénéficiaires de votre projet..."
                    className="min-h-32"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Total (USD)</Label>
                    <Input id="budget" type="number" placeholder="1000000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="debut">Date de Début</Label>
                    <Input id="debut" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fin">Date de Fin</Label>
                    <Input id="fin" type="date" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kpis">Indicateurs de Performance (KPIs)</Label>
                  <Textarea 
                    id="kpis" 
                    placeholder="Listez les indicateurs clés de mesure du succès du projet..."
                    className="min-h-24"
                  />
                </div>

                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Glissez-déposez vos documents ou cliquez pour sélectionner
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, DOC, XLS acceptés (max 50MB)
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer en Brouillon
                  </Button>
                  <Button className="flex-1 bg-primary hover:bg-primary/90">
                    <Send className="h-4 w-4 mr-2" />
                    Soumettre pour Révision
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="position" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Position Commune Africaine</CardTitle>
                <CardDescription>
                  Contribuez à l'élaboration d'une position commune sur les enjeux FSU
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="sujet">Sujet de la Position</Label>
                  <Input id="sujet" placeholder="Ex: Financement des infrastructures rurales" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contexte">Contexte et Enjeux</Label>
                  <Textarea 
                    id="contexte" 
                    placeholder="Décrivez le contexte et les enjeux liés à cette position..."
                    className="min-h-32"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position-text">Position Proposée</Label>
                  <Textarea 
                    id="position-text" 
                    placeholder="Formulez clairement la position africaine proposée..."
                    className="min-h-32"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="justification">Justification</Label>
                  <Textarea 
                    id="justification" 
                    placeholder="Justifiez cette position avec des arguments et données..."
                    className="min-h-24"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer en Brouillon
                  </Button>
                  <Button className="flex-1 bg-primary hover:bg-primary/90">
                    <Send className="h-4 w-4 mr-2" />
                    Soumettre pour Révision
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Placeholder content for other tabs */}
          <TabsContent value="regulation">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Proposition Réglementaire</h3>
                  <p className="text-muted-foreground mb-4">
                    Formulaire en cours de développement
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financement">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Demande de Financement</h3>
                  <p className="text-muted-foreground mb-4">
                    Formulaire en cours de développement
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {!selectedType && (
          <Card className="mt-8">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Send className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Sélectionnez un Type de Soumission</h3>
                <p className="text-muted-foreground">
                  Choisissez le type de document que vous souhaitez soumettre ci-dessus
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Submit;