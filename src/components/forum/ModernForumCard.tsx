
import { useState } from "react";
import { MessageCircle, Reply, Pin, Heart, ThumbsUp, ThumbsDown, Lightbulb, Edit, Trash2, MoreVertical } from "lucide-react";
import { ModernCard } from "@/components/ui/modern-card";
import { ModernButton } from "@/components/ui/modern-button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { GlassCard } from "@/components/ui/glass-card";
import { ModernTooltip, TooltipTrigger, TooltipContent } from "@/components/ui/modern-tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ModernForumCardProps {
  id: string | number;
  title: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    country: string;
  };
  category: string;
  replies: number;
  views: number;
  likes: number;
  isPinned: boolean;
  lastActivity: string;
  tags: string[];
  reactions: {
    thumbsUp: number;
    thumbsDown: number;
    heart: number;
    lightbulb: number;
  };
  onReaction: (reactionType: string) => void;
  onReply: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

export function ModernForumCard({
  id,
  title,
  content,
  author,
  category,
  replies,
  views,
  likes,
  isPinned,
  lastActivity,
  tags,
  reactions,
  onReaction,
  onReply,
  onEdit,
  onDelete,
  isAdmin = false
}: ModernForumCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredReaction, setHoveredReaction] = useState<string | null>(null);

  const reactionButtons = [
    { type: 'thumbsUp', icon: ThumbsUp, count: reactions.thumbsUp, color: 'text-blue-500' },
    { type: 'heart', icon: Heart, count: reactions.heart, color: 'text-red-500' },
    { type: 'lightbulb', icon: Lightbulb, count: reactions.lightbulb, color: 'text-yellow-500' },
    { type: 'thumbsDown', icon: ThumbsDown, count: reactions.thumbsDown, color: 'text-gray-500' },
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      'cmdt25': 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-700 border-blue-200/50',
      'financement': 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-700 border-green-200/50',
      'regulation': 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-700 border-purple-200/50',
      'innovation': 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-700 border-orange-200/50',
      'cooperation': 'bg-gradient-to-r from-pink-500/20 to-pink-600/20 text-pink-700 border-pink-200/50'
    };
    return colors[category as keyof typeof colors] || 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-700 border-gray-200/50';
  };

  return (
    <ModernCard 
      variant="glass" 
      hover="lift"
      className="group overflow-hidden"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs font-medium">
                {author.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {isPinned && (
                  <Pin className="h-4 w-4 text-primary animate-pulse" />
                )}
                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                  {title}
                </h3>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">{author.name}</span>
                <span>•</span>
                <Badge variant="secondary" className="text-xs">
                  {author.role}
                </Badge>
                <span>•</span>
                <span>{author.country}</span>
                <span>•</span>
                <span className="group-hover:text-foreground transition-colors">
                  {lastActivity}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={cn("text-xs font-medium", getCategoryColor(category))}>
              {category.toUpperCase()}
            </Badge>
            
            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ModernButton variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </ModernButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={onEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem onClick={onDelete} className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Content */}
        <div className={cn(
          "text-muted-foreground leading-relaxed transition-all duration-300",
          isExpanded ? "line-clamp-none" : "line-clamp-3"
        )}>
          {content}
        </div>

        {content.length > 150 && (
          <ModernButton 
            variant="ghost" 
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-primary hover:text-primary/80"
          >
            {isExpanded ? "Réduire" : "Voir plus"}
          </ModernButton>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="text-xs bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Stats and Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
          <div className="flex items-center gap-6">
            <GlassCard variant="subtle" className="px-3 py-1 flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <AnimatedCounter value={replies} className="text-sm font-medium" />
              <span className="text-xs text-muted-foreground">réponses</span>
            </GlassCard>
            
            <GlassCard variant="subtle" className="px-3 py-1 flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <AnimatedCounter value={views} className="text-sm font-medium" />
              <span className="text-xs text-muted-foreground">vues</span>
            </GlassCard>
          </div>

          <div className="flex items-center gap-2">
            {/* Reaction buttons */}
            <div className="flex items-center gap-1">
              {reactionButtons.map(({ type, icon: Icon, count, color }) => (
                <ModernTooltip key={type}>
                  <TooltipTrigger asChild>
                    <ModernButton
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 w-8 p-0 transition-all duration-200",
                        hoveredReaction === type && "scale-110",
                        count > 0 && "bg-muted/50"
                      )}
                      onMouseEnter={() => setHoveredReaction(type)}
                      onMouseLeave={() => setHoveredReaction(null)}
                      onClick={() => onReaction(type)}
                    >
                      <Icon className={cn("h-4 w-4", color)} />
                      {count > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {count}
                        </span>
                      )}
                    </ModernButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    {type === 'thumbsUp' && 'J\'aime'}
                    {type === 'heart' && 'Cœur'}
                    {type === 'lightbulb' && 'Bonne idée'}
                    {type === 'thumbsDown' && 'Je n\'aime pas'}
                  </TooltipContent>
                </ModernTooltip>
              ))}
            </div>

            <ModernButton onClick={onReply} size="sm" variant="outline">
              <Reply className="h-4 w-4 mr-2" />
              Répondre
            </ModernButton>
          </div>
        </div>
      </div>
    </ModernCard>
  );
}
