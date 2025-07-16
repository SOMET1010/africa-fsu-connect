import { useState } from "react";
import { MessageCircle, Reply, ThumbsUp, Pin, Search, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Forum = () => {
  const [searchTerm, setSearchTerm] = useState("");

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
      tags: ["Position", "CMDT-25", "UAT"]
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
      tags: ["Villages Connectés", "Financement", "Rural"]
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
      tags: ["Réglementation", "CEDEAO", "Consultation"]
    }
  ];

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Forum de Discussion FSU
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Espace d'échange et de collaboration entre les agences FSU africaines. 
            Partagez vos expériences, posez vos questions et contribuez aux discussions thématiques.
          </p>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les discussions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Discussion
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
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
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{post.likes} j'aime</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Reply className="h-4 w-4 mr-2" />
                        Répondre
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-4 w-4" />
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