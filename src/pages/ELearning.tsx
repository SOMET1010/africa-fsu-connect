import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  Play, 
  Clock, 
  Users, 
  Award, 
  BookOpen,
  Video,
  CheckCircle,
  Calendar,
  TrendingUp
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const ELearning = () => {
  const { t } = useTranslation();

  const courses = [
    {
      id: 1,
      title: "Régulation des Télécommunications",
      description: "Fondamentaux de la régulation FSU en Afrique",
      duration: "8h",
      modules: 12,
      enrolled: 234,
      progress: 65,
      level: "Intermédiaire",
      category: "Régulation"
    },
    {
      id: 2,
      title: "Gestion de Projets FSU",
      description: "Méthodologie et bonnes pratiques de gestion de projets",
      duration: "12h",
      modules: 18,
      enrolled: 189,
      progress: 30,
      level: "Avancé",
      category: "Projets"
    },
    {
      id: 3,
      title: "Analyse de Données Télécom",
      description: "Collecte, analyse et visualisation des données FSU",
      duration: "6h",
      modules: 8,
      enrolled: 156,
      progress: 0,
      level: "Débutant",
      category: "Data"
    },
    {
      id: 4,
      title: "Financement du Service Universel",
      description: "Mécanismes de financement et modèles économiques",
      duration: "10h",
      modules: 15,
      enrolled: 98,
      progress: 100,
      level: "Intermédiaire",
      category: "Financement"
    }
  ];

  const webinars = [
    {
      id: 1,
      title: "Innovation dans les FSU africains",
      date: "2026-02-15",
      time: "14:00 UTC",
      speaker: "Dr. Amara Diallo",
      organization: "UAT",
      registered: 156
    },
    {
      id: 2,
      title: "Connectivité rurale: défis et solutions",
      date: "2026-02-22",
      time: "10:00 UTC",
      speaker: "Mme. Fatou Sow",
      organization: "ANSUT",
      registered: 234
    },
    {
      id: 3,
      title: "Partenariats Public-Privé pour le FSU",
      date: "2026-03-05",
      time: "15:00 UTC",
      speaker: "M. Kofi Mensah",
      organization: "GSMA",
      registered: 189
    }
  ];

  const achievements = [
    { name: "Premier cours terminé", icon: CheckCircle, earned: true },
    { name: "5 webinaires suivis", icon: Video, earned: true },
    { name: "Expert Régulation", icon: Award, earned: false },
    { name: "Mentor communautaire", icon: Users, earned: false }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">E-Learning & Formation</h1>
          </div>
          <p className="text-muted-foreground">
            Développez vos compétences avec nos parcours métiers et certifications
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="px-3 py-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            4 cours en cours
          </Badge>
          <Badge className="px-3 py-1 bg-primary/10 text-primary border-primary/20">
            <Award className="h-3 w-3 mr-1" />
            2 badges obtenus
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Cours suivis", value: "12", icon: BookOpen, color: "text-blue-500" },
          { label: "Heures d'apprentissage", value: "48h", icon: Clock, color: "text-green-500" },
          { label: "Certifications", value: "3", icon: Award, color: "text-purple-500" },
          { label: "Rang communauté", value: "#42", icon: Users, color: "text-orange-500" }
        ].map((stat) => (
          <Card key={stat.label} className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="courses">Parcours</TabsTrigger>
          <TabsTrigger value="webinars">Webinaires</TabsTrigger>
          <TabsTrigger value="achievements">Badges</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="mb-2">{course.category}</Badge>
                    <Badge variant={course.progress === 100 ? "default" : "secondary"}>
                      {course.level}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {course.title}
                  </CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {course.modules} modules
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.enrolled}
                    </span>
                  </div>
                  
                  {course.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  )}
                  
                  <Button 
                    className="w-full" 
                    variant={course.progress > 0 ? "default" : "outline"}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {course.progress === 0 ? "Commencer" : course.progress === 100 ? "Revoir" : "Continuer"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webinars" className="space-y-4">
          <div className="space-y-4">
            {webinars.map((webinar) => (
              <Card key={webinar.id} className="hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{webinar.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(webinar.date).toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {webinar.time}
                        </span>
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">{webinar.speaker}</span>
                        <span className="text-muted-foreground"> • {webinar.organization}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">
                        <Users className="h-3 w-3 mr-1" />
                        {webinar.registered} inscrits
                      </Badge>
                      <Button>
                        <Video className="h-4 w-4 mr-2" />
                        S'inscrire
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.name} 
                className={`text-center p-6 ${
                  achievement.earned 
                    ? 'bg-primary/5 border-primary/20' 
                    : 'bg-muted/30 opacity-60'
                }`}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  achievement.earned ? 'bg-primary/10' : 'bg-muted'
                }`}>
                  <achievement.icon className={`h-8 w-8 ${
                    achievement.earned ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                </div>
                <p className="font-medium text-sm">{achievement.name}</p>
                {achievement.earned && (
                  <Badge className="mt-2 bg-green-500/10 text-green-600 border-green-500/20">
                    Obtenu
                  </Badge>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ELearning;
