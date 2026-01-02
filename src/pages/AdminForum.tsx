import { Search, Pin, Lock, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";

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
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Modération Forum</h1>
          <p className="text-muted-foreground mt-2">
            Gérez les discussions, modérez le contenu et administrez les catégories du forum.
          </p>
        </div>

        <ForumStatsCards stats={forumStats} />

        <Tabs defaultValue="posts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="posts">Tous les Posts</TabsTrigger>
            <TabsTrigger value="reported">Posts Signalés</TabsTrigger>
            <TabsTrigger value="categories">Catégories</TabsTrigger>
          </TabsList>

          {/* Posts Management */}
          <TabsContent value="posts" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Rechercher dans les posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
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
              <Card className="border-dashed border-primary">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{selectedPosts.length} post(s) sélectionné(s)</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction("Épingler")}><Pin className="h-4 w-4 mr-1" />Épingler</Button>
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction("Verrouiller")}><Lock className="h-4 w-4 mr-1" />Verrouiller</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleBulkAction("Supprimer")}><Trash2 className="h-4 w-4 mr-1" />Supprimer</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8"><div className="text-muted-foreground">Chargement des posts...</div></div>
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
                <Card><CardContent className="pt-6"><div className="text-center text-muted-foreground">Aucun post trouvé.</div></CardContent></Card>
              )}
            </div>
          </TabsContent>

          {/* Reported Posts */}
          <TabsContent value="reported" className="space-y-4">
            {reportedPosts.length > 0 ? (
              reportedPosts.map((report) => (
                <Card key={report.id} className="border-destructive/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                          <h3 className="text-lg font-semibold">{report.title}</h3>
                          <Badge variant="destructive">{report.reportCount} signalement(s)</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Auteur: {report.author} • Catégorie: {report.category}</p>
                        <p className="text-sm text-muted-foreground">Raison: {report.reportReason} • {report.reportedAt}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Approuver</Button>
                        <Button variant="destructive" size="sm">Supprimer</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card><CardContent className="pt-6"><div className="text-center text-muted-foreground">Aucun post signalé.</div></CardContent></Card>
            )}
          </TabsContent>

          {/* Categories Management */}
          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Gestion des Catégories</h3>
              <Dialog open={isNewCategoryOpen} onOpenChange={setIsNewCategoryOpen}>
                <DialogTrigger asChild><Button>Nouvelle Catégorie</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Créer une Nouvelle Catégorie</DialogTitle>
                    <DialogDescription>Ajoutez une nouvelle catégorie pour organiser les discussions.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category-name">Nom de la catégorie</Label>
                      <Input id="category-name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Ex: Innovation Technologique" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category-description">Description</Label>
                      <Textarea id="category-description" value={newCategoryDescription} onChange={(e) => setNewCategoryDescription(e.target.value)} placeholder="Description de la catégorie..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category-color">Couleur</Label>
                      <div className="flex gap-2">
                        <Input id="category-color" type="color" value={newCategoryColor} onChange={(e) => setNewCategoryColor(e.target.value)} className="w-16 h-10 p-1" />
                        <Input value={newCategoryColor} onChange={(e) => setNewCategoryColor(e.target.value)} placeholder="#3B82F6" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsNewCategoryOpen(false)}>Annuler</Button>
                      <Button onClick={handleCreateCategory}>Créer</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color || '#3B82F6' }} />
                      <h4 className="font-medium">{category.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{category.description || 'Pas de description'}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminForum;
