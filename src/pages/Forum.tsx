import { useState } from "react";
import { MessageCircle, Reply, ThumbsUp, Pin, Search, Plus, Heart, Lightbulb, ThumbsDown, Edit, Trash2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import OptimizedSearchBar from "@/components/shared/OptimizedSearchBar";
import { useToast } from "@/hooks/use-toast";

const Forum = () => {
  const { t } = useTranslation();
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("");
  const { toast } = useToast();

  const categories = [
    { id: "cmdt25", name: "CMDT-25", description: "Préparation à la Conférence Mondiale" },
    { id: "financement", name: "Financement", description: "Appels à projets et opportunités" },
    { id: "regulation", name: "Régulation", description: "Cadres réglementaires et réformes" },
    { id: "innovation", name: "Innovation", description: "Technologies émergentes et solutions" },
    { id: "cooperation", name: "Coopération", description: "Partenariats et collaborations" }
  ];

  const posts = [
    {
      id: 1,
      title: "Préparation Position Commune Africaine - CMDT-25",
      content: "Discussion sur l'élaboration de la position commune africaine pour la Conférence Mondiale de Développement des Télécommunications 2025...",
      author: {
        name: "Dr. Amina Kone",
        role: "Directrice ANSUT",
        avatar: "/api/placeholder/40/40",
        country: "Côte d'Ivoire"
      },
      category: "cmdt25",
      replies: 23,
      views: 156,
      likes: 12,
      isPinned: true,
      lastActivity: "Il y a 2 heures",
      tags: ["Position", "CMDT-25", "UAT"],
      reactions: { thumbsUp: 12, thumbsDown: 1, heart: 8, lightbulb: 5 }
    },
    {
      id: 2,
      title: "Financement Projets Villages Connectés - Retour d'expérience",
      content: "Partage d'expérience sur les mécanismes de financement des projets de connectivité rurale...",
      author: {
        name: "Jean-Baptiste Ouedraogo",
        role: "Chef de Projet FSU",
        avatar: "/api/placeholder/40/40",
        country: "Burkina Faso"
      },
      category: "financement",
      replies: 15,
      views: 89,
      likes: 8,
      isPinned: false,
      lastActivity: "Il y a 4 heures",
      tags: ["Villages Connectés", "Financement", "Rural"],
      reactions: { thumbsUp: 8, thumbsDown: 0, heart: 3, lightbulb: 2 }
    },
    {
      id: 3,
      title: "Réforme Cadre Réglementaire FSU - Consultation Régionale",
      content: "Consultation sur les propositions de réforme du cadre réglementaire des FSU en Afrique de l'Ouest...",
      author: {
        name: "Prof. Sarah Mbeki",
        role: "Experte Régulation",
        avatar: "/api/placeholder/40/40",
        country: "Ghana"
      },
      category: "regulation",
      replies: 31,
      views: 245,
      likes: 18,
      isPinned: false,
      lastActivity: "Il y a 1 jour",
      tags: ["Réglementation", "CEDEAO", "Consultation"],
      reactions: { thumbsUp: 18, thumbsDown: 2, heart: 6, lightbulb: 12 }
    }
  ];

  const searchFilters = [
    {
      id: "category",
      label: "Catégorie",
      options: categories.map(cat => ({ value: cat.id, label: cat.name }))
    }
  ];

  const handleSearch = (query: string, filters: Record<string, string>) => {
    // Search logic implemented by SearchBar
  };

  const handleNewPost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim() || !newPostCategory) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Discussion créée",
      description: "Votre nouvelle discussion a été publiée avec succès.",
    });
    
    setIsNewPostOpen(false);
    setNewPostTitle("");
    setNewPostContent("");
    setNewPostCategory("");
  };

  const handleReaction = (postId: number, reactionType: string) => {
    toast({
      title: "Réaction ajoutée",
      description: `Votre réaction a été enregistrée.`,
    });
  };

  const filteredPosts = selectedCategory === "all" 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            {t('forum.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {t('forum.subtitle')}
          </p>
        </div>

        {/* Enhanced Search and Actions */}
        <div className="mb-8">
          <OptimizedSearchBar
            placeholder="Rechercher dans les discussions..."
            onSearch={handleSearch}
            filters={searchFilters}
            showFilters={true}
            className="mb-4"
          />
          <div className="flex justify-end">
            <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Discussion
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Créer une Nouvelle Discussion</DialogTitle>
                  <DialogDescription>
                    Partagez vos idées et questions avec la communauté FSU
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre de la Discussion</Label>
                    <Input
                      id="title"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      placeholder="Ex: Nouvelles approches pour la connectivité rurale"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <select
                      id="category"
                      value={newPostCategory}
                      onChange={(e) => setNewPostCategory(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
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
                    <Button variant="outline" onClick={() => setIsNewPostOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleNewPost}>
                      Publier la Discussion
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4 flex-1">
                      <Avatar>
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {post.isPinned && <Pin className="h-4 w-4 text-primary" />}
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                        </div>
                        <CardDescription className="text-base mb-3">
                          {post.content}
                        </CardDescription>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="font-medium">{post.author.name}</span>
                          <span>•</span>
                          <span>{post.author.role}</span>
                          <span>•</span>
                          <span>{post.author.country}</span>
                          <span>•</span>
                          <span>{post.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {post.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Reply className="h-4 w-4" />
                        <span>{post.replies} réponses</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.views} vues</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{post.reactions.thumbsUp}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{post.reactions.heart}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Lightbulb className="h-4 w-4" />
                          <span>{post.reactions.lightbulb}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Reply className="h-4 w-4 mr-2" />
                        Répondre
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleReaction(post.id, 'thumbsUp')}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleReaction(post.id, 'heart')}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleReaction(post.id, 'lightbulb')}
                      >
                        <Lightbulb className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {categories.map(category => (
            <TabsContent key={category.id} value={category.id} className="space-y-4">
              <Card className="border-dashed">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">{category.name}</h3>
                    <p className="text-muted-foreground mb-4">{category.description}</p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Commencer une discussion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Forum;