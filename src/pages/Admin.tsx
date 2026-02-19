import { Users, FileText, MessageSquare, Calendar, Settings, Shield, BarChart3, AlertTriangle, Plus, Download } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { ModernButton } from "@/components/ui/modern-button";
import { GlassCard } from "@/components/ui/glass-card";
import { ModernInput, ModernSelect, ModernTextarea } from "@/components/forms";
import { ModernCardSkeleton } from "@/components/ui/modern-loading-states";
import { ModernModal, ModernModalFooter } from "@/components/ui/modern-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useAdminPage, AdminStat } from "./admin/hooks/useAdminPage";
import { AdminStatsGrid } from "./admin/components/AdminStatsGrid";
import { AdminUsersTab } from "./admin/components/AdminUsersTab";
import { AdminContentTab } from "./admin/components/AdminContentTab";

const Admin = () => {
  const {
    loading,
    setLoading,
    showUserModal,
    setShowUserModal,
    showContentModal,
    setShowContentModal,
    selectedUser,
    selectedContent,
    handleUserAction,
    handleContentAction,
  } = useAdminPage();

  const stats: AdminStat[] = [
    { title: "Utilisateurs Actifs", value: 1247, description: "+12% ce mois", icon: Users, color: "text-blue-600", trend: "up" },
    { title: "Documents Publiés", value: 856, description: "+5% cette semaine", icon: FileText, color: "text-green-600", trend: "up" },
    { title: "Discussions Forum", value: 234, description: "+18% cette semaine", icon: MessageSquare, color: "text-purple-600", trend: "up" },
    { title: "Événements Planifiés", value: 45, description: "3 ce mois", icon: Calendar, color: "text-orange-600", trend: "stable" }
  ];

  const recentUsers = [
    { id: 1, name: "Dr. Paul Mbeng", email: "paul.mbeng@camtel.cm", country: "Cameroun", role: "admin_pays", status: "pending", joinDate: "2024-01-15", avatar: "" },
    { id: 2, name: "Sarah Diallo", email: "sarah.diallo@artp.sn", country: "Sénégal", role: "editeur", status: "active", joinDate: "2024-01-14", avatar: "" },
    { id: 3, name: "Mohamed Al-Rashid", email: "m.rashid@ntra.gov.eg", country: "Égypte", role: "contributeur", status: "active", joinDate: "2024-01-13", avatar: "" }
  ];

  const pendingContent = [
    { id: 1, type: "Document", title: "Cadre Réglementaire FSU - Maroc 2024", author: "Ahmed Benali", country: "Maroc", submittedDate: "2024-01-15", status: "review" },
    { id: 2, type: "Forum Post", title: "Proposition d'harmonisation CEDEAO", author: "Dr. Fatima Touré", country: "Mali", submittedDate: "2024-01-14", status: "pending" },
    { id: 3, type: "Projet", title: "Extension 4G Zones Rurales", author: "Jean-Claude Ndong", country: "Gabon", submittedDate: "2024-01-13", status: "review" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen">
        <PageHeader title="Administration" description="Tableau de bord administrateur" badge="Administration" gradient />
        <PageContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => <ModernCardSkeleton key={i} />)}
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
          <AdminStatsGrid stats={stats} />

          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="inline-flex bg-transparent border border-border/50 rounded-lg p-1">
              <TabsTrigger value="users" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"><Users className="h-4 w-4 mr-2" />Utilisateurs</TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"><FileText className="h-4 w-4 mr-2" />Contenu</TabsTrigger>
              <TabsTrigger value="moderation" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"><Shield className="h-4 w-4 mr-2" />Modération</TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"><BarChart3 className="h-4 w-4 mr-2" />Analytiques</TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"><Settings className="h-4 w-4 mr-2" />Paramètres</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-6">
              <AdminUsersTab users={recentUsers} onUserAction={handleUserAction} onRefresh={() => setLoading(true)} />
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <AdminContentTab content={pendingContent} onContentAction={handleContentAction} onRefresh={() => setLoading(true)} />
            </TabsContent>

            <TabsContent value="moderation" className="space-y-6">
              <GlassCard variant="default" className="p-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Outils de Modération</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">Interface de modération avancée en cours de développement.</p>
                  <ModernButton>Découvrir bientôt</ModernButton>
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
                  <p className="text-muted-foreground max-w-md mx-auto">Tableaux de bord détaillés avec métriques en temps réel.</p>
                  <ModernButton>Voir les métriques</ModernButton>
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard variant="default" className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Configuration Plateforme</h3>
                  <div className="space-y-4">
                    <ModernButton variant="outline" className="w-full justify-start"><Settings className="h-4 w-4 mr-2" />Paramètres Généraux</ModernButton>
                    <ModernButton variant="outline" className="w-full justify-start"><Shield className="h-4 w-4 mr-2" />Sécurité & Permissions</ModernButton>
                    <ModernButton variant="outline" className="w-full justify-start"><AlertTriangle className="h-4 w-4 mr-2" />Maintenance</ModernButton>
                  </div>
                </GlassCard>
                <GlassCard variant="default" className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Actions Rapides</h3>
                  <div className="space-y-4">
                    <ModernButton className="w-full justify-start"><Users className="h-4 w-4 mr-2" />Exporter Utilisateurs</ModernButton>
                    <ModernButton className="w-full justify-start"><FileText className="h-4 w-4 mr-2" />Générer Rapport</ModernButton>
                    <ModernButton className="w-full justify-start"><Download className="h-4 w-4 mr-2" />Backup Données</ModernButton>
                  </div>
                </GlassCard>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>

      {/* User Modal */}
      <ModernModal isOpen={showUserModal} onClose={() => setShowUserModal(false)} title="Modifier l'utilisateur" description="Modifiez les informations de l'utilisateur">
        <div className="space-y-4">
          <ModernInput label="Nom" value={selectedUser?.name || ""} onChange={() => {}} />
          <ModernInput label="Email" value={selectedUser?.email || ""} onChange={() => {}} />
          <ModernSelect label="Rôle" value={selectedUser?.role || ""} onChange={() => {}} options={[
            { value: "super_admin", label: "Super Admin" },
            { value: "admin_pays", label: "Admin Pays" },
            { value: "editeur", label: "Éditeur" },
            { value: "contributeur", label: "Contributeur" },
          ]} />
        </div>
        <ModernModalFooter>
          <ModernButton variant="outline" onClick={() => setShowUserModal(false)}>Annuler</ModernButton>
          <ModernButton onClick={() => setShowUserModal(false)}>Enregistrer</ModernButton>
        </ModernModalFooter>
      </ModernModal>

      {/* Content Modal */}
      <ModernModal isOpen={showContentModal} onClose={() => setShowContentModal(false)} title="Réviser le contenu" description="Examinez et modifiez le contenu soumis">
        <div className="space-y-4">
          <ModernInput label="Titre" value={selectedContent?.title || ""} onChange={() => {}} />
          <ModernTextarea label="Notes de révision" placeholder="Ajoutez vos commentaires..." />
        </div>
        <ModernModalFooter>
          <ModernButton variant="outline" onClick={() => setShowContentModal(false)}>Annuler</ModernButton>
          <ModernButton variant="destructive">Rejeter</ModernButton>
          <ModernButton onClick={() => setShowContentModal(false)}>Approuver</ModernButton>
        </ModernModalFooter>
      </ModernModal>
    </div>
  );
};

export default Admin;
