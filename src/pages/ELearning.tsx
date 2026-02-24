import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHero } from "@/components/shared/PageHero";
import { GlassCard } from "@/components/ui/glass-card";
import { ModernButton } from "@/components/ui/modern-button";
import { 
  GraduationCap, 
  Play, 
  Clock, 
  Users, 
  Award, 
  BookOpen,
  Video,
  CheckCircle,
  Calendar
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useDirection } from "@/hooks/useDirection";

const ELearning = () => {
  const { t } = useTranslation();
  const { isRTL } = useDirection();

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

  const stats = [
    { label: t('elearning.stats.courses'), value: "12", icon: BookOpen, color: "text-[hsl(var(--nx-cyan))]" },
    { label: t('elearning.stats.hours'), value: "48h", icon: Clock, color: "text-green-400" },
    { label: t('elearning.stats.certs'), value: "3", icon: Award, color: "text-[hsl(var(--nx-gold))]" },
    { label: t('elearning.stats.rank'), value: "#42", icon: Users, color: "text-orange-400" }
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--nx-bg))]">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <PageHero
          badge={t('elearning.page.badge')}
          badgeIcon={GraduationCap}
          title={t('elearning.page.title')}
          subtitle={t('elearning.page.subtitle')}
        />

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
          {stats.map((stat) => (
            <GlassCard key={stat.label} className="p-4 bg-white/90 border border-border shadow-sm text-foreground">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color} opacity-80`} />
              </div>
            </GlassCard>
          ))}
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md bg-white/5">
            <TabsTrigger value="courses" className="data-[state=active]:bg-white/10">{t('elearning.tabs.courses')}</TabsTrigger>
            <TabsTrigger value="webinars" className="data-[state=active]:bg-white/10">{t('elearning.tabs.webinars')}</TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-white/10">{t('elearning.tabs.badges')}</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <GlassCard
                key={course.id}
                className="p-6 group transition-all duration-300 bg-white/90 border border-border shadow-sm text-foreground"
              >
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="outline" className="border-border text-foreground/70">{course.category}</Badge>
                  <Badge
                    variant={course.progress === 100 ? "default" : "secondary"}
                    className={course.progress === 100 ? "bg-green-500 text-white" : "bg-foreground/10 text-foreground/80"}
                  >
                    {course.level}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-[hsl(var(--nx-gold))] transition-colors mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-foreground/70 mb-4">{course.description}</p>
                
                <div className={`flex items-center gap-4 text-sm text-muted-foreground mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </span>
                  <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <BookOpen className="h-4 w-4" />
                    {course.modules} {t('elearning.modules')}
                  </span>
                  <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Users className="h-4 w-4" />
                    {course.enrolled}
                  </span>
                </div>
                
                {course.progress > 0 && (
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('elearning.course.progress')}</span>
                      <span className="font-medium text-foreground">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                )}
                
                <ModernButton 
                  className={`w-full ${isRTL ? 'flex-row-reverse' : ''}`}
                  variant={course.progress > 0 ? "default" : "outline"}
                >
                  <Play className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {course.progress === 0 
                    ? t('elearning.course.start') 
                    : course.progress === 100 
                      ? t('elearning.course.review') 
                      : t('elearning.course.continue')}
                </ModernButton>
              </GlassCard>
            ))}
          </div>
          </TabsContent>

          <TabsContent value="webinars" className="space-y-4 animate-fade-in">
            <div className="space-y-4">
              {webinars.map((webinar) => (
                <GlassCard
                  key={webinar.id}
                  className="p-6 transition-all duration-300 bg-white/90 border border-border shadow-sm text-foreground"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">{webinar.title}</h3>
                      <div className={`flex items-center gap-4 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Calendar className="h-4 w-4" />
                          {new Date(webinar.date).toLocaleDateString(isRTL ? 'ar-EG' : 'fr-FR', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </span>
                        <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Clock className="h-4 w-4" />
                          {webinar.time}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/70">
                        <span className="font-medium">{webinar.speaker}</span>
                        <span className="text-muted-foreground"> • {webinar.organization}</span>
                      </p>
                    </div>
                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Badge variant="outline" className={`border-border text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Users className={`h-3 w-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                        {webinar.registered} {t('elearning.enrolled')}
                      </Badge>
                      <ModernButton className={isRTL ? 'flex-row-reverse' : ''} variant="ghost">
                        <Video className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {t('elearning.register')}
                      </ModernButton>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((achievement) => (
                <GlassCard 
                  key={achievement.name} 
                  className={`p-6 text-center bg-white/90 border border-border shadow-sm ${
                    achievement.earned ? 'ring-2 ring-[hsl(var(--nx-gold)/0.25)]' : 'opacity-70'
                  }`}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    achievement.earned ? 'bg-[hsl(var(--nx-gold)/0.2)]' : 'bg-muted/40'
                  }`}>
                    <achievement.icon className={`h-8 w-8 ${
                      achievement.earned ? 'text-[hsl(var(--nx-gold))]' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <p className="font-medium text-sm text-foreground">{achievement.name}</p>
                  {achievement.earned && (
                    <Badge className="mt-2 bg-green-500/10 text-green-400 border-green-500/20">
                      {t('elearning.badge.earned')}
                    </Badge>
                  )}
                </GlassCard>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ELearning;
