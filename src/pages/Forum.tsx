import { useMemo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useForum } from '@/hooks/useForum';
import { useAuth } from '@/contexts/AuthContext';
import { ModernForumHeader } from '@/components/forum/ModernForumHeader';
import { ModernForumCategories } from '@/components/forum/ModernForumCategories';
import { ModernForumCard } from '@/components/forum/ModernForumCard';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernCard } from '@/components/ui/modern-card';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedPage } from '@/components/ui/animated-page';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, Plus, TrendingUp, Clock } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useDirection } from '@/hooks/useDirection';
import { logger } from '@/utils/logger';

const formatRelativeTime = (value?: string) => {
  if (!value) return 'Aucune activité';
  try {
    return formatDistanceToNow(new Date(value), { addSuffix: true });
  } catch {
    return 'Date inconnue';
  }
};

const composeReactions = (post: ReturnType<typeof useForum>['posts'][number]) => {
  const thumbsUp = post.view_count ?? 0;
  const heart = Math.max(0, post.reply_count ?? 0);
  const lightbulb = heart;
  const thumbsDown = post.reply_count ? Math.floor((post.reply_count ?? 0) / 2) : 0;
  return { thumbsUp, heart, lightbulb, thumbsDown };
};

const Forum = () => {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const { toast } = useToast();
  const { profile } = useAuth();
  const { categories, posts, loading, createPost, refetch } = useForum();
  const isAdmin = ['super_admin', 'country_admin'].includes(profile?.role ?? '');

  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'replies'>('recent');

  const categoryStats = useMemo(() => {
    return categories.map((category) => {
      const relatedPosts = posts.filter(post => post.category_id === category.id);
      const lastActivityDate = relatedPosts.reduce<Date | null>((latest, post) => {
        const candidate = new Date(post.updated_at || post.created_at);
        if (!latest) return candidate;
        return candidate > latest ? candidate : latest;
      }, null);

      return {
        ...category,
        postCount: relatedPosts.length,
        memberCount: new Set(relatedPosts.map(post => post.author_id)).size,
        lastActivity: lastActivityDate ? formatRelativeTime(lastActivityDate.toISOString()) : 'Aucune activité',
        trending: relatedPosts.some(post => (post.reply_count ?? 0) >= 3) || relatedPosts.length >= 4,
      };
    });
  }, [categories, posts]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') return posts;
    return posts.filter(post => post.category_id === selectedCategory);
  }, [posts, selectedCategory]);

  const sortedPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => {
      switch (sortBy) {
        case 'recent': {
          const aDate = new Date(a.updated_at || a.created_at);
          const bDate = new Date(b.updated_at || b.created_at);
          return bDate.getTime() - aDate.getTime();
        }
        case 'popular':
          return (b.view_count ?? 0) - (a.view_count ?? 0);
        case 'replies':
          return (b.reply_count ?? 0) - (a.reply_count ?? 0);
        default:
          return 0;
      }
    });
  }, [filteredPosts, sortBy]);

  const handleReaction = (reactionType: string, title: string) => {
    toast({
      title: t('forum.reaction.added'),
      description: `${reactionType} ajouté à "${title}".`,
    });
  };

  const handleReply = (title: string) => {
    toast({
      title: t('forum.reply.title'),
      description: t('forum.reply.description'),
    });
  };

  const handleSearch = (query: string, filters: Record<string, string>) => {
    logger.debug('Forum search executed', { component: 'Forum', query, filters });
  };

  const handleNewPost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim() || !newPostCategory) {
      toast({
        title: t('form.error'),
        description: t('forum.error.fill'),
        variant: 'destructive',
      });
      return;
    }

    try {
      await createPost(newPostTitle, newPostContent, newPostCategory);
      setIsNewPostOpen(false);
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostCategory('');
      refetch();
    } catch (error) {
      logger.error('Error creating post:', error);
    }
  };

  return (
    <AnimatedPage className="min-h-screen bg-transparent relative z-10">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <ModernForumHeader
          onNewPost={() => setIsNewPostOpen(true)}
          onSearch={handleSearch}
          isAdmin={isAdmin}
        />

        <ModernForumCategories
          categories={categoryStats}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onCreateCategory={() => toast({ title: t('forum.category.create'), description: t('forum.category.create.description') })}
          onManageCategories={() => toast({ title: t('forum.category.manage'), description: t('forum.category.manage.description') })}
          isAdmin={isAdmin}
        />

        <div className="space-y-6">
          <GlassCard variant="subtle" className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h3 className="font-semibold text-lg">
                  {selectedCategory === 'all'
                    ? t('forum.all.discussions')
                    : categoryStats.find(cat => cat.id === selectedCategory)?.name || t('forum.all.discussions')}
                </h3>
                <span className="text-sm text-muted-foreground">
                  {sortedPosts.length} {sortedPosts.length > 1 ? t('forum.discussions.count') : t('forum.discussion.count')}
                </span>
              </div>

              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
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
                <p className="text-muted-foreground mb-4">{t('forum.empty.desc')}</p>
                <ModernButton onClick={() => setIsNewPostOpen(true)} className={isRTL ? 'flex-row-reverse' : ''}>
                  <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('forum.empty.cta')}
                </ModernButton>
              </ModernCard>
            ) : (
              sortedPosts.map((post) => {
                const postReactions = composeReactions(post);
                return (
                  <ModernForumCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    content={post.content}
                    author={{
                      name: post.author?.first_name && post.author?.last_name
                        ? `${post.author.first_name} ${post.author.last_name}`
                        : t('common.user'),
                      role: post.author?.role || 'Membre',
                      avatar: post.author?.avatar_url || '',
                      country: post.author?.country || 'Non spécifié',
                    }}
                    category={post.category?.name || 'discussion'}
                    replies={post.reply_count ?? 0}
                    views={post.view_count ?? 0}
                    likes={postReactions.thumbsUp}
                    isPinned={post.is_pinned}
                    lastActivity={formatRelativeTime(post.updated_at || post.created_at)}
                    tags={[post.category?.name || 'discussion']}
                    reactions={postReactions}
                    onReaction={(reactionType) => handleReaction(reactionType, post.title)}
                    onReply={() => handleReply(post.title)}
                    isAdmin={isAdmin}
                  />
                );
              })
            )}
          </div>
        </div>

        <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t('forum.new.title')}
              </DialogTitle>
              <DialogDescription>{t('forum.new.desc')}</DialogDescription>
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
                    {categories.map(cat => (
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
                <ModernButton onClick={handleNewPost}>{t('forum.new.publish')}</ModernButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AnimatedPage>
  );
};

export default Forum;
