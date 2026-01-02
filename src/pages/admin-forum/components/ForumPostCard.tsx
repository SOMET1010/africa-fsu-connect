import { Pin, Lock, Trash2, Edit, MoreHorizontal, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  is_locked: boolean;
  reply_count: number;
  view_count: number;
  created_at: string;
  author?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
  category?: {
    name?: string;
  };
}

interface ForumPostCardProps {
  post: ForumPost;
  isSelected: boolean;
  onToggleSelection: (postId: string) => void;
  onAction: (action: string, postId: string) => void;
}

export const ForumPostCard = ({ post, isSelected, onToggleSelection, onAction }: ForumPostCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleSelection(post.id)}
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
                <DropdownMenuItem onClick={() => onAction("Épingler", post.id)}>
                  <Pin className="h-4 w-4 mr-2" />
                  {post.is_pinned ? "Désépingler" : "Épingler"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAction("Verrouiller", post.id)}>
                  <Lock className="h-4 w-4 mr-2" />
                  {post.is_locked ? "Déverrouiller" : "Verrouiller"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAction("Éditer", post.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Éditer
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onAction("Supprimer", post.id)}
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
  );
};
