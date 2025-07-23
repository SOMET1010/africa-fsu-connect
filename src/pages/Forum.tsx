
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForum } from "@/hooks/useForum";
import { ModernForumHeader } from "@/components/forum/ModernForumHeader";
import { ModernForumCategories } from "@/components/forum/ModernForumCategories";
import { ModernForumCard } from "@/components/forum/ModernForumCard";
import { ModernButton } from "@/components/ui/modern-button";
import { ModernCard } from "@/components/ui/modern-card";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Plus, TrendingUp, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const Forum = () => {
  const { toast } = useToast();
  const { 
    categories, 
    posts, 
    loading, 
    createPost, 
    createReply,
    refetch 
  } = useForum();
  
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  // Mock data for categories with enhanced info
  const enhancedCategories = [
    {
      id: "cmdt25",
      name: "CMDT-25",
      description: "Préparation à la Conférence Mondiale de Développement des Télécommunications",
      color: "blue",
      postCount: 42,
      memberCount: 156,
      lastActivity: "Il y a 2 heures",
      trending: true
    },
    {
      id: "financement",
      name: "Financement",
      description: "Appels à projets, opportunités de financement et mécanismes innovants",
      color: "green",
      postCount: 38,
      memberCount: 89,
      lastActivity: "Il y a 4 heures"
    },
    {
      id: "regulation",
      name: "Régulation",
      description: "Cadres réglementaires, réformes et harmonisation des politiques",
      color: "purple",
      postCount: 67,
      memberCount: 234,
      lastActivity: "Il y a 1 heure"
    },
    {
      id: "innovation",
      name: "Innovation",
      description: "Technologies émergentes, solutions numériques et transformation digitale",
      color: "orange",
      postCount: 54,
      memberCount: 198,
      lastActivity: "Il y a 3 heures",
      trending: true
    },
    {
      id: "cooperation",
      name: "Coopération",
      description: "Partenariats, collaborations régionales et initiatives communes",
      color: "pink",
      postCount: 29,
      memberCount: 112,
      lastActivity: "Il y a 6 heures"
    }
  ];

  // Enhanced posts with reactions
  const enhancedPosts = posts.map(post => ({
    ...post,
    reactions: {
      thumbsUp: Math.floor(Math.random() * 20) + 1,
      thumbsDown: Math.floor(Math.random() * 3),
      heart: Math.floor(Math.random() * 15) + 1,
      lightbulb: Math.floor(Math.random() * 10) + 1
    }
  }));

  const handleSearch = (query: string, filters: Record<string, string>) => {
    console.log("Search:", query, filters);
    // Implement search logic
  };

  const handleNewPost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim() || !newPostCategory) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createPost(newPostTitle, newPostContent, newPostCategory);
      setIsNewPostOpen(false);
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostCategory("");
      refetch();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleReaction = (postId: number, reactionType: string) => {
    toast({
      title: "Réaction ajoutée",
      description: `Votre réaction a été enregistrée.`,
    });
  };

  const handleReply = (postId: number) => {
    toast({
      title: "Réponse",
      description: "Fonctionnalité de réponse à implémenter",
    });
  };

  const filteredPosts = selectedCategory === "all" 
    ? enhancedPosts 
    : enhancedPosts.filter(post => post.category === selectedCategory);

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "popular":
        return b.reactions.thumbsUp - a.reactions.thumbsUp;
      case "replies":
        return b.reply_count - a.reply_count;
      default:
        return 0;
    }
  });

  const totalStats = {
    posts: enhancedPosts.length,
    members: enhancedCategories.reduce((sum, cat) => sum + cat.memberCount, 0),
    activeUsers: 47
  };

  return (
    <AnimatedPage className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <ModernForumHeader
          onNewPost={() => setIsNewPostOpen(true)}
          onSearch={handleSearch}
          totalPosts={totalStats.posts}
          totalMembers={totalStats.members}
          activeUsers={totalStats.activeUsers}
          isAdmin={false}
        />

        {/* Categories */}
        <ModernForumCategories
          categories={enhancedCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onCreateCategory={() => toast({ title: "Créer une catégorie", description: "Fonctionnalité admin" })}
          onManageCategories={() => toast({ title: "Gérer les catégories", description: "Fonctionnalité admin" })}
          isAdmin={false}
        />

        {/* Posts Section */}
        <div className="space-y-6">
          {/* Sort and Filter Bar */}
          <GlassCard variant="subtle" className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="font-semibold text-lg">
                  {selectedCategory === "all" ? "Toutes les discussions" : 
                   enhancedCategories.find(cat => cat.id === selectedCategory)?.name || "Discussions"}
                </h3>
                <span className="text-sm text-muted-foreground">
                  {sortedPosts.length} discussion{sortedPosts.length > 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Récentes
                      </div>
                    </SelectItem>
                    <SelectItem value="popular">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Populaires
                      </div>
                    </SelectItem>
                    <SelectItem value="replies">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Plus de réponses
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </GlassCard>

          {/* Posts List */}
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <ModernCard key={index} variant="glass" className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-muted rounded-full" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded w-5/6" />
                    </div>
                  </div>
                </ModernCard>
              ))
            ) : sortedPosts.length === 0 ? (
              <ModernCard variant="glass" className="p-12 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucune discussion trouvée</h3>
                <p className="text-muted-foreground mb-4">
                  Soyez le premier à créer une discussion dans cette catégorie
                </p>
                <ModernButton onClick={() => setIsNewPostOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer une discussion
                </ModernButton>
              </ModernCard>
            ) : (
              sortedPosts.map((post) => (
                <ModernForumCard
                  key={post.id}
                  id={parseInt(post.id)}
                  title={post.title}
                  content={post.content}
                  author={{
                    name: post.author?.first_name && post.author?.last_name 
                      ? `${post.author.first_name} ${post.author.last_name}`
                      : "Utilisateur",
                    role: post.author?.role || "Membre",
                    avatar: post.author?.avatar_url || "/api/placeholder/40/40",
                    country: post.author?.country || "Non spécifié"
                  }}
                  category={post.category_id}
                  replies={post.reply_count}
                  views={post.view_count}
                  likes={post.reactions.thumbsUp}
                  isPinned={post.is_pinned}
                  lastActivity={new Date(post.created_at).toLocaleDateString('fr-FR')}
                  tags={[post.category_id]}
                  reactions={post.reactions}
                  onReaction={(reactionType) => handleReaction(parseInt(post.id), reactionType)}
                  onReply={() => handleReply(parseInt(post.id))}
                />
              ))
            )}
          </div>
        </div>

        {/* New Post Dialog */}
        <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Créer une Nouvelle Discussion
              </DialogTitle>
              <DialogDescription>
                Partagez vos idées et questions avec la communauté FSU
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de la Discussion</Label>
                <Input
                  id="title"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Ex: Nouvelles approches pour la connectivité rurale"
                  className="text-lg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select value={newPostCategory} onValueChange={setNewPostCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {enhancedCategories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Contenu de la Discussion</Label>
                <Textarea
                  id="content"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Décrivez votre sujet et questions..."
                  className="min-h-32"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <ModernButton variant="outline" onClick={() => setIsNewPostOpen(false)}>
                  Annuler
                </ModernButton>
                <ModernButton onClick={handleNewPost}>
                  Publier la Discussion
                </ModernButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AnimatedPage>
  );
};

export default Forum;
