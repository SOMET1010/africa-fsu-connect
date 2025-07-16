import { useState } from "react";
import { Search, Filter, MoreHorizontal, Pin, Lock, Trash2, Edit, AlertTriangle, MessageSquare, Users, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useForum } from "@/hooks/useForum";
import { AdminLayout } from "@/components/admin/AdminLayout";

const AdminForum = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#3B82F6");
  
  const { categories, posts, loading, fetchCategories, fetchPosts } = useForum();
  const { toast } = useToast();

  // Mock data for demonstration
  const forumStats = {
    totalPosts: 245,
    totalReplies: 1283,
    activeUsers: 89,
    reportedPosts: 5,
    postsToday: 12,
    repliesThisWeek: 67
  };

  const reportedPosts = [
    {
      id: "1",
      title: "Post avec contenu inapproprié",
      author: "User123",
      category: "Général",
      reportCount: 3,
      reportReason: "Langage inapproprié",
      reportedAt: "Il y a 2 heures"
    }
  ];

  const handlePostAction = (action: string, postId: string) => {
    toast({
      title: "Action effectuée",
      description: `L'action "${action}" a été appliquée au post.`,
    });
  };

  const handleBulkAction = (action: string) => {
    if (selectedPosts.length === 0) {
      toast({
        title: "Aucune sélection",
        description: "Veuillez sélectionner des posts pour effectuer cette action.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Action en masse",
      description: `L'action "${action}" a été appliquée à ${selectedPosts.length} post(s).`,
    });
    setSelectedPosts([]);
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la catégorie est requis.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Catégorie créée",
      description: `La catégorie "${newCategoryName}" a été créée avec succès.`,
    });
    
    setIsNewCategoryOpen(false);
    setNewCategoryName("");
    setNewCategoryDescription("");
    setNewCategoryColor("#3B82F6");
  };

  const togglePostSelection = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{forumStats.totalPosts}</div>
              <p className="text-xs text-muted-foreground">
                +{forumStats.postsToday} aujourd'hui
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Réponses</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{forumStats.totalReplies}</div>
              <p className="text-xs text-muted-foreground">
                +{forumStats.repliesThisWeek} cette semaine
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{forumStats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                24h dernières
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posts Signalés</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{forumStats.reportedPosts}</div>
              <p className="text-xs text-muted-foreground">
                Nécessitent attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="posts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="posts">Tous les Posts</TabsTrigger>
            <TabsTrigger value="reported">Posts Signalés</TabsTrigger>
            <TabsTrigger value="categories">Catégories</TabsTrigger>
          </TabsList>

          {/* Posts Management */}
          <TabsContent value="posts" className="space-y-4">
            {/* Search and Filters */}
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
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bulk Actions */}
            {selectedPosts.length > 0 && (
              <Card className="border-dashed border-primary">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {selectedPosts.length} post(s) sélectionné(s)
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction("Épingler")}>
                        <Pin className="h-4 w-4 mr-1" />
                        Épingler
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction("Verrouiller")}>
                        <Lock className="h-4 w-4 mr-1" />
                        Verrouiller
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleBulkAction("Supprimer")}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts List */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">Chargement des posts...</div>
                </div>
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <Checkbox
                            checked={selectedPosts.includes(post.id)}
                            onCheckedChange={() => togglePostSelection(post.id)}
                          />
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={post.author?.avatar_url} />
                            <AvatarFallback>
                              {post.author?.first_name?.[0]}{post.author?.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {post.is_pinned && <Pin className="h-4 w-4 text-primary" />}
                              {post.is_locked && <Lock className="h-4 w-4 text-muted-foreground" />}
                              <CardTitle className="text-lg truncate">{post.title}</CardTitle>
                            </div>
                            <CardDescription className="line-clamp-2 mb-2">
                              {post.content}
                            </CardDescription>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{post.author?.first_name} {post.author?.last_name}</span>
                              <span>•</span>
                              <span>{post.category?.name}</span>
                              <span>•</span>
                              <Clock className="h-3 w-3" />
                              <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{post.reply_count} réponses</Badge>
                          <Badge variant="outline">{post.view_count} vues</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handlePostAction("Épingler", post.id)}>
                                <Pin className="h-4 w-4 mr-2" />
                                {post.is_pinned ? "Désépingler" : "Épingler"}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePostAction("Verrouiller", post.id)}>
                                <Lock className="h-4 w-4 mr-2" />
                                {post.is_locked ? "Déverrouiller" : "Verrouiller"}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePostAction("Éditer", post.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Éditer
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handlePostAction("Supprimer", post.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                      Aucun post trouvé avec les critères actuels.
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Reported Posts */}
          <TabsContent value="reported" className="space-y-4">
            <div className="space-y-4">
              {reportedPosts.length > 0 ? (
                reportedPosts.map((report) => (
                  <Card key={report.id} className="border-destructive/20">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            <CardTitle className="text-lg">{report.title}</CardTitle>
                            <Badge variant="destructive">{report.reportCount} signalement(s)</Badge>
                          </div>
                          <CardDescription className="mb-2">
                            Auteur: {report.author} • Catégorie: {report.category}
                          </CardDescription>
                          <div className="text-sm text-muted-foreground">
                            Raison: {report.reportReason} • {report.reportedAt}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Approuver</Button>
                          <Button variant="destructive" size="sm">Supprimer</Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                      Aucun post signalé pour le moment.
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Categories Management */}
          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Gestion des Catégories</h3>
              <Dialog open={isNewCategoryOpen} onOpenChange={setIsNewCategoryOpen}>
                <DialogTrigger asChild>
                  <Button>Nouvelle Catégorie</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Créer une Nouvelle Catégorie</DialogTitle>
                    <DialogDescription>
                      Ajoutez une nouvelle catégorie pour organiser les discussions.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category-name">Nom de la catégorie</Label>
                      <Input
                        id="category-name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Ex: Innovation Technologique"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category-description">Description</Label>
                      <Textarea
                        id="category-description"
                        value={newCategoryDescription}
                        onChange={(e) => setNewCategoryDescription(e.target.value)}
                        placeholder="Description de la catégorie..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category-color">Couleur</Label>
                      <Input
                        id="category-color"
                        type="color"
                        value={newCategoryColor}
                        onChange={(e) => setNewCategoryColor(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsNewCategoryOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handleCreateCategory}>
                        Créer la Catégorie
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: category.color }}
                        />
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {category.description && (
                      <CardDescription>{category.description}</CardDescription>
                    )}
                  </CardHeader>
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