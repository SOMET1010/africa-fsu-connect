import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForum } from "@/hooks/useForum";

export const useAdminForumPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#3B82F6");
  
  const { categories, posts, loading } = useForum();
  const { toast } = useToast();

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

  return {
    // State
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
    
    // Data
    categories,
    posts,
    loading,
    forumStats,
    reportedPosts,
    filteredPosts,
    
    // Actions
    handlePostAction,
    handleBulkAction,
    handleCreateCategory,
    togglePostSelection,
  };
};
