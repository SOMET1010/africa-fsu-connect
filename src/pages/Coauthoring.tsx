import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHero } from "@/components/shared/PageHero";
import { GlassCard } from "@/components/ui/glass-card";
import { ModernButton } from "@/components/ui/modern-button";
import { 
  PenTool, 
  FileText, 
  Users, 
  Clock, 
  MessageSquare,
  Plus,
  History,
  Eye,
  Edit3,
  CheckCircle,
  AlertCircle,
  GitBranch
} from "lucide-react";

const Coauthoring = () => {
  const documents = [
    {
      id: 1,
      title: "Position Commune sur la Connectivité Rurale",
      type: "Position",
      status: "En cours",
      lastModified: "2026-01-28T14:30:00",
      contributors: [
        { name: "Amara D.", avatar: null, initials: "AD" },
        { name: "Fatou S.", avatar: null, initials: "FS" },
        { name: "Kofi M.", avatar: null, initials: "KM" }
      ],
      comments: 12,
      version: "v2.3"
    },
    {
      id: 2,
      title: "Cadre Réglementaire FSU Harmonisé",
      type: "Réglementation",
      status: "En révision",
      lastModified: "2026-01-27T09:15:00",
      contributors: [
        { name: "Jean P.", avatar: null, initials: "JP" },
        { name: "Marie L.", avatar: null, initials: "ML" }
      ],
      comments: 8,
      version: "v1.5"
    },
    {
      id: 3,
      title: "Rapport Annuel UDC 2025",
      type: "Rapport",
      status: "Finalisé",
      lastModified: "2026-01-25T16:45:00",
      contributors: [
        { name: "Ibrahim K.", avatar: null, initials: "IK" },
        { name: "Aisha B.", avatar: null, initials: "AB" },
        { name: "Omar T.", avatar: null, initials: "OT" },
        { name: "Nadia R.", avatar: null, initials: "NR" }
      ],
      comments: 24,
      version: "v3.0"
    }
  ];

  const recentActivity = [
    { user: "Amara D.", action: "a modifié la section 2.3", document: "Position Commune", time: "Il y a 15 min" },
    { user: "Fatou S.", action: "a ajouté un commentaire", document: "Position Commune", time: "Il y a 1h" },
    { user: "Jean P.", action: "a soumis pour révision", document: "Cadre Réglementaire", time: "Il y a 3h" },
    { user: "Marie L.", action: "a approuvé les modifications", document: "Cadre Réglementaire", time: "Il y a 5h" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En cours": return "bg-[hsl(var(--nx-cyan)/0.1)] text-[hsl(var(--nx-cyan))] border-[hsl(var(--nx-cyan)/0.2)]";
      case "En révision": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "Finalisé": return "bg-green-500/10 text-green-400 border-green-500/20";
      default: return "bg-white/5 text-white/60";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "En cours": return <Edit3 className="h-3 w-3" />;
      case "En révision": return <AlertCircle className="h-3 w-3" />;
      case "Finalisé": return <CheckCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--nx-bg))]">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <PageHero
          badge="Co-rédaction"
          badgeIcon={PenTool}
          title="Édition Collaborative de Documents"
          subtitle="Édition collaborative de documents avec gestion des versions et commentaires"
          ctaLabel="Nouveau document"
          ctaIcon={Plus}
          onCtaClick={() => {}}
        />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
          {[
            { label: "Documents actifs", value: "8", icon: FileText, color: "text-[hsl(var(--nx-cyan))]" },
            { label: "Collaborateurs", value: "24", icon: Users, color: "text-green-400" },
            { label: "Commentaires", value: "156", icon: MessageSquare, color: "text-[hsl(var(--nx-gold))]" },
            { label: "Versions", value: "42", icon: GitBranch, color: "text-orange-400" }
          ].map((stat) => (
            <GlassCard key={stat.label} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/60">{stat.label}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color} opacity-80`} />
              </div>
            </GlassCard>
          ))}
        </div>

        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-white/5">
            <TabsTrigger value="documents" className="data-[state=active]:bg-white/10">Mes documents</TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-white/10">Activité récente</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-4 animate-fade-in">
            {documents.map((doc) => (
              <GlassCard key={doc.id} className="p-6 hover:bg-white/[0.08] transition-all duration-300">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="border-white/20 text-white/70">{doc.type}</Badge>
                      <Badge className={getStatusColor(doc.status)}>
                        {getStatusIcon(doc.status)}
                        <span className="ml-1">{doc.status}</span>
                      </Badge>
                      <Badge variant="secondary" className="text-xs bg-white/10 text-white/70">
                        {doc.version}
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white hover:text-[hsl(var(--nx-gold))] cursor-pointer transition-colors">
                      {doc.title}
                    </h3>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {doc.contributors.slice(0, 4).map((contributor, idx) => (
                          <Avatar key={idx} className="h-8 w-8 border-2 border-[hsl(var(--nx-night))]">
                            <AvatarImage src={contributor.avatar || ""} />
                            <AvatarFallback className="text-xs bg-[hsl(var(--nx-gold)/0.2)] text-[hsl(var(--nx-gold))]">
                              {contributor.initials}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {doc.contributors.length > 4 && (
                          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/70 border-2 border-[hsl(var(--nx-night))]">
                            +{doc.contributors.length - 4}
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-white/50">
                        {doc.contributors.length} contributeurs
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-white/50">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Modifié {new Date(doc.lastModified).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {doc.comments} commentaires
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex md:flex-col gap-2">
                    <ModernButton size="sm">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Éditer
                    </ModernButton>
                    <ModernButton variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Aperçu
                    </ModernButton>
                    <ModernButton variant="ghost" size="sm">
                      <History className="h-4 w-4 mr-2" />
                      Historique
                    </ModernButton>
                  </div>
                </div>
              </GlassCard>
            ))}
          </TabsContent>

          <TabsContent value="activity" className="space-y-4 animate-fade-in">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Activité récente</h3>
              <p className="text-sm text-white/60 mb-6">
                Dernières modifications et interactions sur vos documents
              </p>
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-[hsl(var(--nx-gold)/0.2)] text-[hsl(var(--nx-gold))]">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm text-white">
                        <span className="font-medium">{activity.user}</span>
                        <span className="text-white/60"> {activity.action}</span>
                      </p>
                      <p className="text-xs text-white/50">
                        {activity.document} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Coauthoring;
