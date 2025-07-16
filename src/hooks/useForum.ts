import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  created_by: string;
  created_at: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category_id: string;
  is_pinned: boolean;
  is_locked: boolean;
  view_count: number;
  reply_count: number;
  last_reply_at?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  author?: {
    first_name: string;
    last_name: string;
    role: string;
    country?: string;
    avatar_url?: string;
  };
  category?: ForumCategory;
}

export interface ForumReply {
  id: string;
  content: string;
  author_id: string;
  post_id: string;
  parent_reply_id?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  author?: {
    first_name: string;
    last_name: string;
    role: string;
    country?: string;
    avatar_url?: string;
  };
}

export const useForum = () => {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories.",
        variant: "destructive",
      });
    }
  };

  // Fetch posts with author and category data
  const fetchPosts = async (categoryId?: string) => {
    try {
      let query = supabase
        .from('forum_posts')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedPosts = data || [];

      setPosts(formattedPosts);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les discussions.",
        variant: "destructive",
      });
    }
  };

  // Fetch replies for a specific post
  const fetchReplies = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('forum_replies')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedReplies = data || [];

      setReplies(formattedReplies);
      return formattedReplies;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les réponses.",
        variant: "destructive",
      });
      return [];
    }
  };

  // Create a new post
  const createPost = async (title: string, content: string, categoryId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const { data, error } = await supabase
        .from('forum_posts')
        .insert([{
          title,
          content,
          category_id: categoryId,
          author_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Discussion créée",
        description: "Votre nouvelle discussion a été publiée avec succès.",
      });

      // Refresh posts
      await fetchPosts();
      return data;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Create a reply
  const createReply = async (postId: string, content: string, parentReplyId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const { data, error } = await supabase
        .from('forum_replies')
        .insert([{
          post_id: postId,
          content,
          author_id: user.id,
          parent_reply_id: parentReplyId
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Réponse ajoutée",
        description: "Votre réponse a été publiée avec succès.",
      });

      // Refresh replies for this post
      await fetchReplies(postId);
      // Refresh posts to update reply count
      await fetchPosts();
      return data;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Update post view count
  const incrementViewCount = async (postId: string) => {
    try {
      const currentPost = posts.find(p => p.id === postId);
      if (!currentPost) return;

      const { error } = await supabase
        .from('forum_posts')
        .update({ view_count: currentPost.view_count + 1 })
        .eq('id', postId);

      if (error) throw error;
    } catch (err: any) {
      // Silent fail for view count update
      console.error('Failed to update view count:', err);
    }
  };

  // Admin functions
  const updatePostStatus = async (postId: string, updates: { is_pinned?: boolean; is_locked?: boolean }) => {
    try {
      const { error } = await supabase
        .from('forum_posts')
        .update(updates)
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Post mis à jour",
        description: "Le statut du post a été modifié avec succès.",
      });

      await fetchPosts();
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deletePost = async (postId: string) => {
    try {
      // First delete all replies
      const { error: repliesError } = await supabase
        .from('forum_replies')
        .delete()
        .eq('post_id', postId);

      if (repliesError) throw repliesError;

      // Then delete the post
      const { error } = await supabase
        .from('forum_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Post supprimé",
        description: "Le post et ses réponses ont été supprimés avec succès.",
      });

      await fetchPosts();
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updatePost = async (postId: string, updates: { title?: string; content?: string; category_id?: string }) => {
    try {
      const { error } = await supabase
        .from('forum_posts')
        .update(updates)
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Post modifié",
        description: "Le post a été modifié avec succès.",
      });

      await fetchPosts();
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const createCategory = async (name: string, description?: string, color?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const { data, error } = await supabase
        .from('forum_categories')
        .insert([{
          name,
          description,
          color: color || '#3B82F6',
          created_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Catégorie créée",
        description: "La nouvelle catégorie a été créée avec succès.",
      });

      await fetchCategories();
      return data;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateCategory = async (categoryId: string, updates: { name?: string; description?: string; color?: string }) => {
    try {
      const { error } = await supabase
        .from('forum_categories')
        .update(updates)
        .eq('id', categoryId);

      if (error) throw error;

      toast({
        title: "Catégorie modifiée",
        description: "La catégorie a été modifiée avec succès.",
      });

      await fetchCategories();
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      // Check if there are posts in this category
      const { data: postsInCategory } = await supabase
        .from('forum_posts')
        .select('id')
        .eq('category_id', categoryId);

      if (postsInCategory && postsInCategory.length > 0) {
        throw new Error("Impossible de supprimer une catégorie contenant des posts. Veuillez d'abord déplacer ou supprimer les posts.");
      }

      const { error } = await supabase
        .from('forum_categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      toast({
        title: "Catégorie supprimée",
        description: "La catégorie a été supprimée avec succès.",
      });

      await fetchCategories();
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Real-time subscriptions
  useEffect(() => {
    const setupSubscriptions = () => {
      // Subscribe to posts changes
      const postsSubscription = supabase
        .channel('forum_posts_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'forum_posts' },
          () => {
            fetchPosts();
          }
        )
        .subscribe();

      // Subscribe to replies changes
      const repliesSubscription = supabase
        .channel('forum_replies_changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'forum_replies' },
          () => {
            // Refresh posts to update reply counts
            fetchPosts();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(postsSubscription);
        supabase.removeChannel(repliesSubscription);
      };
    };

    const cleanup = setupSubscriptions();
    return cleanup;
  }, []);

  // Initial fetch
  useEffect(() => {
    const initializeForum = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchCategories(),
          fetchPosts()
        ]);
      } finally {
        setLoading(false);
      }
    };

    initializeForum();
  }, []);

  return {
    categories,
    posts,
    replies,
    loading,
    error,
    fetchCategories,
    fetchPosts,
    fetchReplies,
    createPost,
    createReply,
    incrementViewCount,
    // Admin functions
    updatePostStatus,
    deletePost,
    updatePost,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: () => {
      fetchCategories();
      fetchPosts();
    }
  };
};