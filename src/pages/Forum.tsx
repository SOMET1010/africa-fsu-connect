
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Plus, TrendingUp, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { useDirection } from "@/hooks/useDirection";
import { logger } from '@/utils/logger';

const Forum = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
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
    logger.debug("Forum search executed", { component: 'Forum', query, filters });
  };

  const handleNewPost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim() || !newPostCategory) {
      toast({
        title: t('form.error'),
        description: t('forum.error.fill'),
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
      logger.error("Error creating post:", error as any);
    }
  };

  const handleReaction = (postId: number, reactionType: string) => {
    toast({
      title: t('forum.reaction.added'),
      description: t('forum.reaction.desc'),
    });
  };

  const handleReply = (postId: number) => {
    toast({
      title: t('forum.reply.title'),
      description: t('forum.reply.description'),
    });
  };

  const filteredPosts = selectedCategory === "all" 
    ? enhancedPosts 
    : enhancedPosts.filter(post => post.category_id === selectedCategory);

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

  return (
    <AnimatedPage className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <ModernForumHeader
          onNewPost={() => setIsNewPostOpen(true)}
          onSearch={handleSearch}
          isAdmin={false}
        />

        {/* Categories */}
        <ModernForumCategories
          categories={enhancedCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onCreateCategory={() => toast({ title: t('forum.category.create'), description: t('forum.category.create.description') })}
          onManageCategories={() => toast({ title: t('forum.category.manage'), description: t('forum.category.manage.description') })}
          isAdmin={false}
        />

        {/* Posts Section */}
        <div className="space-y-6">
          {/* Sort and Filter Bar */}
          <GlassCard variant="subtle" className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h3 className="font-semibold text-lg">
                  {selectedCategory === "all" ? t('forum.all.discussions') : 
                   enhancedCategories.find(cat => cat.id === selectedCategory)?.name || t('forum.all.discussions')}
                </h3>
                <span className="text-sm text-muted-foreground">
                  {sortedPosts.length} {sortedPosts.length > 1 ? t('forum.discussions.count') : t('forum.discussion.count')}
                </span>
              </div>
              
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={t('forum.sort.by')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Clock className="h-4 w-4" />
                        {t('forum.sort.recent')}
                      </div>
                    </SelectItem>
                    <SelectItem value="popular">
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <TrendingUp className="h-4 w-4" />
                        {t('forum.sort.popular')}
                      </div>
                    </SelectItem>
                    <SelectItem value="replies">
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <MessageCircle className="h-4 w-4" />
                        {t('forum.sort.replies')}
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
                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
                <h3 className="text-lg font-medium mb-2">{t('forum.empty.title')}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('forum.empty.desc')}
                </p>
                <ModernButton onClick={() => setIsNewPostOpen(true)} className={isRTL ? 'flex-row-reverse' : ''}>
                  <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('forum.empty.cta')}
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
                      : t('common.user'),
                    role: post.author?.role || "Membre",
                    avatar: post.author?.avatar_url || "/api/placeholder/40/40",
                    country: post.author?.country || "Non spécifié"
                  }}
                  category={post.category_id}
                  replies={post.reply_count}
                  views={post.view_count}
                  likes={post.reactions.thumbsUp}
                  isPinned={post.is_pinned}
                  lastActivity={new Date(post.created_at).toLocaleDateString(isRTL ? 'ar-EG' : 'fr-FR')}
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
                {t('forum.new.title')}
              </DialogTitle>
              <DialogDescription>
                {t('forum.new.desc')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">{t('forum.new.titleLabel')}</Label>
                <Input
                  id="title"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder={t('forum.new.titlePlaceholder')}
                  className="text-lg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">{t('forum.new.category')}</Label>
                <Select value={newPostCategory} onValueChange={setNewPostCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('forum.new.categoryPlaceholder')} />
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
                <Label htmlFor="content">{t('forum.new.content')}</Label>
                <Textarea
                  id="content"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder={t('forum.new.contentPlaceholder')}
                  className="min-h-32"
                />
              </div>
              
              <div className={`flex gap-2 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <ModernButton variant="outline" onClick={() => setIsNewPostOpen(false)}>
                  {t('forum.new.cancel')}
                </ModernButton>
                <ModernButton onClick={handleNewPost}>
                  {t('forum.new.publish')}
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
