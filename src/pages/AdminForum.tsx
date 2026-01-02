import { Search, Pin, Lock, Trash2, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHero } from "@/components/shared/PageHero";
import { GlassCard } from "@/components/ui/glass-card";
import { ModernButton } from "@/components/ui/modern-button";

import { useAdminForumPage } from "./admin-forum/hooks/useAdminForumPage";
import { ForumStatsCards } from "./admin-forum/components/ForumStatsCards";
import { ForumPostCard } from "./admin-forum/components/ForumPostCard";

const AdminForum = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedPosts,
    isNewCategoryOpen,
    setIsNewCategoryOpen,
    newCategoryName,
    setNewCategoryName,
    newCategoryDescription,
    setNewCategoryDescription,
    newCategoryColor,
    setNewCategoryColor,
    categories,
    loading,
    forumStats,
    reportedPosts,
    filteredPosts,
    handlePostAction,
    handleBulkAction,
    handleCreateCategory,
    togglePostSelection,
  } = useAdminForumPage();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Hero */}
        <PageHero
          badge="Modération"
          badgeIcon={MessageSquare}
          title="Modération du Forum"
          subtitle="Gérez les discussions, modérez le contenu et administrez les catégories du forum"
        />

        <ForumStatsCards stats={forumStats} />

        <Tabs defaultValue="posts" className="space-y-4">
          <TabsList className="bg-white/5">
            <TabsTrigger value="posts" className="data-[state=active]:bg-white/10">Tous les Posts</TabsTrigger>
            <TabsTrigger value="reported" className="data-[state=active]:bg-white/10">Posts Signalés</TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-white/10">Catégories</TabsTrigger>
          </TabsList>

          {/* Posts Management */}
          <TabsContent value="posts" className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-4 w-4" />
                  <Input
                    placeholder="Rechercher dans les posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px] bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Toutes catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPosts.length > 0 && (
              <GlassCard className="p-4 border-dashed border-[hsl(var(--nx-gold))]">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">{selectedPosts.length} post(s) sélectionné(s)</span>
                  <div className="flex gap-2">
                    <ModernButton variant="outline" size="sm" onClick={() => handleBulkAction("Épingler")}>
                      <Pin className="h-4 w-4 mr-1" />Épingler
                    </ModernButton>
                    <ModernButton variant="outline" size="sm" onClick={() => handleBulkAction("Verrouiller")}>
                      <Lock className="h-4 w-4 mr-1" />Verrouiller
                    </ModernButton>
                    <ModernButton variant="destructive" size="sm" onClick={() => handleBulkAction("Supprimer")}>
                      <Trash2 className="h-4 w-4 mr-1" />Supprimer
                    </ModernButton>
                  </div>
                </div>
              </GlassCard>
            )}

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8"><div className="text-white/60">Chargement des posts...</div></div>
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <ForumPostCard
                    key={post.id}
                    post={post}
                    isSelected={selectedPosts.includes(post.id)}
                    onToggleSelection={togglePostSelection}
                    onAction={handlePostAction}
                  />
                ))
              ) : (
                <GlassCard className="p-6 text-center">
                  <div className="text-white/60">Aucun post trouvé.</div>
                </GlassCard>
              )}
            </div>
          </TabsContent>

          {/* Reported Posts */}
          <TabsContent value="reported" className="space-y-4 animate-fade-in">
            {reportedPosts.length > 0 ? (
              reportedPosts.map((report) => (
                <GlassCard key={report.id} className="p-6 border-red-500/20">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                        <h3 className="text-lg font-semibold text-white">{report.title}</h3>
                        <Badge variant="destructive">{report.reportCount} signalement(s)</Badge>
                      </div>
                      <p className="text-sm text-white/60 mb-2">Auteur: {report.author} • Catégorie: {report.category}</p>
                      <p className="text-sm text-white/50">Raison: {report.reportReason} • {report.reportedAt}</p>
                    </div>
                    <div className="flex gap-2">
                      <ModernButton variant="outline" size="sm">Approuver</ModernButton>
                      <ModernButton variant="destructive" size="sm">Supprimer</ModernButton>
                    </div>
                  </div>
                </GlassCard>
              ))
            ) : (
              <GlassCard className="p-6 text-center">
                <div className="text-white/60">Aucun post signalé.</div>
              </GlassCard>
            )}
          </TabsContent>

          {/* Categories Management */}
          <TabsContent value="categories" className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Gestion des Catégories</h3>
              <Dialog open={isNewCategoryOpen} onOpenChange={setIsNewCategoryOpen}>
                <DialogTrigger asChild>
                  <ModernButton>Nouvelle Catégorie</ModernButton>
                </DialogTrigger>
                <DialogContent className="bg-[hsl(var(--nx-night))] border-white/10">
                  <DialogHeader>
                    <DialogTitle className="text-white">Créer une Nouvelle Catégorie</DialogTitle>
                    <DialogDescription className="text-white/60">Ajoutez une nouvelle catégorie pour organiser les discussions.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category-name" className="text-white/80">Nom de la catégorie</Label>
                      <Input id="category-name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Ex: Innovation Technologique" className="bg-white/5 border-white/10 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category-description" className="text-white/80">Description</Label>
                      <Textarea id="category-description" value={newCategoryDescription} onChange={(e) => setNewCategoryDescription(e.target.value)} placeholder="Description de la catégorie..." className="bg-white/5 border-white/10 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category-color" className="text-white/80">Couleur</Label>
                      <div className="flex gap-2">
                        <Input id="category-color" type="color" value={newCategoryColor} onChange={(e) => setNewCategoryColor(e.target.value)} className="w-16 h-10 p-1 bg-white/5 border-white/10" />
                        <Input value={newCategoryColor} onChange={(e) => setNewCategoryColor(e.target.value)} placeholder="#3B82F6" className="bg-white/5 border-white/10 text-white" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <ModernButton variant="outline" onClick={() => setIsNewCategoryOpen(false)}>Annuler</ModernButton>
                      <ModernButton onClick={handleCreateCategory}>Créer</ModernButton>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <GlassCard key={category.id} className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color || '#3B82F6' }} />
                    <h4 className="font-medium text-white">{category.name}</h4>
                  </div>
                  <p className="text-sm text-white/60">{category.description || 'Pas de description'}</p>
                </GlassCard>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminForum;
