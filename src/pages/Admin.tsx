
import { useState } from "react";
import { Users, FileText, MessageSquare, Calendar, Settings, Shield, BarChart3, AlertTriangle, Plus, Download } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { ModernButton } from "@/components/ui/modern-button";
import { GlassCard } from "@/components/ui/glass-card";
import { ModernDataTable } from "@/components/system/ModernDataTable";
import { ModernModal, ModernModalFooter } from "@/components/ui/modern-modal";
import { ModernInput, ModernSelect, ModernTextarea } from "@/components/forms";
import { ModernCardSkeleton } from "@/components/ui/modern-loading-states";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedCounter } from "@/components/ui/animated-counter";

// Type-safe interfaces for admin data
interface AdminSelectedUser {
  id: number;
  name: string;
  email: string;
  country: string;
  role: string;
  status: string;
  joinDate: string;
  avatar: string;
}

interface AdminSelectedContent {
  id: number;
  type: string;
  title: string;
  author: string;
  country: string;
  submittedDate: string;
  status: string;
}

const Admin = () => {
  const [loading, setLoading] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminSelectedUser | null>(null);
  const [selectedContent, setSelectedContent] = useState<AdminSelectedContent | null>(null);

  const stats = [
    {
      title: "Utilisateurs Actifs",
      value: 1247,
      description: "+12% ce mois",
      icon: Users,
      color: "text-blue-600",
      trend: "up"
    },
    {
      title: "Documents Publiés",
      value: 856,
      description: "+5% cette semaine",
      icon: FileText,
      color: "text-green-600",
      trend: "up"
    },
    {
      title: "Discussions Forum",
      value: 234,
      description: "+18% cette semaine",
      icon: MessageSquare,
      color: "text-purple-600",
      trend: "up"
    },
    {
      title: "Événements Planifiés",
      value: 45,
      description: "3 ce mois",
      icon: Calendar,
      color: "text-orange-600",
      trend: "stable"
    }
  ];

  const recentUsers = [
    {
      id: 1,
      name: "Dr. Paul Mbeng",
      email: "paul.mbeng@camtel.cm",
      country: "Cameroun",
      role: "admin_pays",
      status: "pending",
      joinDate: "2024-01-15",
      avatar: ""
    },
    {
      id: 2,
      name: "Sarah Diallo",
      email: "sarah.diallo@artp.sn",
      country: "Sénégal",
      role: "editeur",
      status: "active",
      joinDate: "2024-01-14",
      avatar: ""
    },
    {
      id: 3,
      name: "Mohamed Al-Rashid",
      email: "m.rashid@ntra.gov.eg",
      country: "Égypte",
      role: "contributeur",
      status: "active",
      joinDate: "2024-01-13",
      avatar: ""
    }
  ];

  const pendingContent = [
    {
      id: 1,
      type: "Document",
      title: "Cadre Réglementaire FSU - Maroc 2024",
      author: "Ahmed Benali",
      country: "Maroc",
      submittedDate: "2024-01-15",
      status: "review"
    },
    {
      id: 2,
      type: "Forum Post",
      title: "Proposition d'harmonisation CEDEAO",
      author: "Dr. Fatima Touré",
      country: "Mali",
      submittedDate: "2024-01-14",
      status: "pending"
    },
    {
      id: 3,
      type: "Projet",
      title: "Extension 4G Zones Rurales",
      author: "Jean-Claude Ndong",
      country: "Gabon",
      submittedDate: "2024-01-13",
      status: "review"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      review: "bg-blue-100 text-blue-800 border-blue-200",
      inactive: "bg-gray-100 text-gray-800 border-gray-200"
    };
    
    const labels = {
      active: "Actif",
      pending: "En attente",
      review: "En révision",
      inactive: "Inactif"
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getRoleLabel = (role: string) => {
    const roles = {
      super_admin: "Super Admin",
      admin_pays: "Admin Pays",
      editeur: "Éditeur",
      contributeur: "Contributeur",
      lecteur: "Lecteur"
    };
    return roles[role as keyof typeof roles] || role;
  };

  const userColumns = [
    { key: "name", label: "Utilisateur", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "country", label: "Pays", sortable: true },
    { key: "role", label: "Rôle", sortable: true },
    { key: "status", label: "Statut", sortable: true },
    { key: "actions", label: "Actions" }
  ];

  const contentColumns = [
    { key: "title", label: "Titre", sortable: true },
    { key: "type", label: "Type", sortable: true },
    { key: "author", label: "Auteur", sortable: true },
    { key: "country", label: "Pays", sortable: true },
    { key: "status", label: "Statut", sortable: true },
    { key: "actions", label: "Actions" }
  ];

  const handleUserAction = (action: string, user: AdminSelectedUser) => {
    setSelectedUser(user);
    if (action === "edit") {
      setShowUserModal(true);
    }
  };

  const handleContentAction = (action: string, content: AdminSelectedContent) => {
    setSelectedContent(content);
    if (action === "edit") {
      setShowContentModal(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <PageHeader
          title="Administration"
          description="Tableau de bord administrateur pour la gestion de la plateforme"
          badge="Administration"
          gradient
        />
        <PageContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <ModernCardSkeleton key={i} />
            ))}
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Administration"
        description="Tableau de bord administrateur pour la gestion de la plateforme"
        badge="Administration"
        gradient
        actions={
          <>
            <ModernButton variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exporter rapport
            </ModernButton>
            <ModernButton size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau
            </ModernButton>
          </>
        }
      />
      
      <PageContainer>
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <GlassCard 
                  key={index}
                  variant="default" 
                  className="p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-foreground">
                          <AnimatedCounter value={stat.value} />
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {stat.description}
                        </Badge>
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Main Content */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="users">
                <Users className="h-4 w-4 mr-2" />
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger value="content">
                <FileText className="h-4 w-4 mr-2" />
                Contenu
              </TabsTrigger>
              <TabsTrigger value="moderation">
                <Shield className="h-4 w-4 mr-2" />
                Modération
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytiques
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-6">
              <ModernDataTable
                data={recentUsers}
                columns={userColumns.map(col => ({
                  ...col,
                  render: col.key === "name" ? (value: unknown, row: Record<string, unknown>) => {
                    const user = row as unknown as AdminSelectedUser;
                    return (
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{String(value)}</p>
                          <p className="text-sm text-muted-foreground">{user.country}</p>
                        </div>
                      </div>
                    );
                  } : col.key === "role" ? (value: unknown) => (
                    <Badge variant="outline">
                      {getRoleLabel(String(value))}
                    </Badge>
                  ) : col.key === "status" ? (value: unknown) => (
                    getStatusBadge(String(value))
                  ) : col.key === "actions" ? (_value: unknown, row: Record<string, unknown>) => {
                    const user = row as unknown as AdminSelectedUser;
                    return (
                      <div className="flex items-center space-x-2">
                        <ModernButton 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUserAction("edit", user)}
                        >
                          Modifier
                        </ModernButton>
                        {user.status === "pending" && (
                          <ModernButton 
                            size="sm"
                            onClick={() => handleUserAction("approve", user)}
                          >
                            Approuver
                          </ModernButton>
                        )}
                      </div>
                    );
                  } : undefined
                }))}
                title="Gestion des utilisateurs"
                subtitle="Gérez les comptes utilisateurs et leurs permissions"
                onRefresh={() => setLoading(true)}
              />
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <ModernDataTable
                data={pendingContent}
                columns={contentColumns.map(col => ({
                  ...col,
                  render: col.key === "title" ? (value: unknown, row: Record<string, unknown>) => {
                    const content = row as unknown as AdminSelectedContent;
                    return (
                      <div>
                        <p className="font-medium">{String(value)}</p>
                        <p className="text-sm text-muted-foreground">Par {content.author}</p>
                      </div>
                    );
                  } : col.key === "type" ? (value: unknown) => (
                    <Badge variant="outline">
                      {String(value)}
                    </Badge>
                  ) : col.key === "status" ? (value: unknown) => (
                    getStatusBadge(String(value))
                  ) : col.key === "actions" ? (_value: unknown, row: Record<string, unknown>) => {
                    const content = row as unknown as AdminSelectedContent;
                    return (
                      <div className="flex items-center space-x-2">
                        <ModernButton 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleContentAction("edit", content)}
                        >
                          Réviser
                        </ModernButton>
                        <ModernButton 
                          size="sm"
                          onClick={() => handleContentAction("approve", content)}
                        >
                          Approuver
                        </ModernButton>
                      </div>
                    );
                  } : undefined
                }))}
                title="Modération du contenu"
                subtitle="Révisez et approuvez le contenu soumis par les utilisateurs"
                onRefresh={() => setLoading(true)}
              />
            </TabsContent>

            <TabsContent value="moderation" className="space-y-6">
              <GlassCard variant="default" className="p-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Outils de Modération</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Interface de modération avancée en cours de développement avec détection automatique et outils de gestion communautaire.
                  </p>
                  <ModernButton>
                    Découvrir bientôt
                  </ModernButton>
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <GlassCard variant="default" className="p-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Analytiques Avancées</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Tableaux de bord détaillés avec métriques en temps réel, rapports personnalisés et insights comportementaux.
                  </p>
                  <ModernButton>
                    Voir les métriques
                  </ModernButton>
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard variant="default" className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Configuration Plateforme</h3>
                  <div className="space-y-4">
                    <ModernButton variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Paramètres Généraux
                    </ModernButton>
                    <ModernButton variant="outline" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      Sécurité & Permissions
                    </ModernButton>
                    <ModernButton variant="outline" className="w-full justify-start">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Maintenance
                    </ModernButton>
                  </div>
                </GlassCard>

                <GlassCard variant="default" className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Actions Rapides</h3>
                  <div className="space-y-4">
                    <ModernButton className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Exporter Utilisateurs
                    </ModernButton>
                    <ModernButton className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Rapport d'Activité
                    </ModernButton>
                    <ModernButton className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Statistiques Mensuelles
                    </ModernButton>
                  </div>
                </GlassCard>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>

      {/* Modal Utilisateur */}
      <ModernModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="Modifier l'utilisateur"
        description="Modifiez les informations et permissions de l'utilisateur"
        size="md"
      >
        <div className="space-y-4">
          <ModernInput
            label="Nom complet"
            value={selectedUser?.name || ""}
            onChange={() => {}}
          />
          <ModernInput
            label="Email"
            type="email"
            value={selectedUser?.email || ""}
            onChange={() => {}}
          />
          <ModernSelect
            label="Rôle"
            value={selectedUser?.role || ""}
            onChange={() => {}}
            options={[
              { value: "lecteur", label: "Lecteur" },
              { value: "contributeur", label: "Contributeur" },
              { value: "editeur", label: "Éditeur" },
              { value: "admin_pays", label: "Admin Pays" }
            ]}
          />
          <ModernSelect
            label="Statut"
            value={selectedUser?.status || ""}
            onChange={() => {}}
            options={[
              { value: "active", label: "Actif" },
              { value: "pending", label: "En attente" },
              { value: "inactive", label: "Inactif" }
            ]}
          />
        </div>
        <ModernModalFooter>
          <ModernButton variant="outline" onClick={() => setShowUserModal(false)}>
            Annuler
          </ModernButton>
          <ModernButton onClick={() => setShowUserModal(false)}>
            Enregistrer
          </ModernButton>
        </ModernModalFooter>
      </ModernModal>

      {/* Modal Contenu */}
      <ModernModal
        isOpen={showContentModal}
        onClose={() => setShowContentModal(false)}
        title="Réviser le contenu"
        description="Révisez et approuvez le contenu soumis"
        size="lg"
      >
        <div className="space-y-4">
          <ModernInput
            label="Titre"
            value={selectedContent?.title || ""}
            onChange={() => {}}
          />
          <ModernInput
            label="Auteur"
            value={selectedContent?.author || ""}
            disabled
          />
          <ModernTextarea
            label="Commentaires de révision"
            placeholder="Ajoutez vos commentaires..."
            rows={4}
          />
          <ModernSelect
            label="Décision"
            value=""
            onChange={() => {}}
            options={[
              { value: "approve", label: "Approuver" },
              { value: "reject", label: "Rejeter" },
              { value: "request_changes", label: "Demander des modifications" }
            ]}
          />
        </div>
        <ModernModalFooter>
          <ModernButton variant="outline" onClick={() => setShowContentModal(false)}>
            Annuler
          </ModernButton>
          <ModernButton onClick={() => setShowContentModal(false)}>
            Enregistrer
          </ModernButton>
        </ModernModalFooter>
      </ModernModal>
    </div>
  );
};

export default Admin;
