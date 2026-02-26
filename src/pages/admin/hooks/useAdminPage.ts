import { useState } from "react";

// Type-safe interfaces for admin data
export interface AdminSelectedUser {
  id: number;
  name: string;
  email: string;
  country: string;
  role: string;
  status: string;
  joinDate: string;
  avatar: string;
}

export interface AdminSelectedContent {
  id: number;
  type: string;
  title: string;
  author: string;
  country: string;
  submittedDate: string;
  status: string;
}

export interface AdminStat {
  title: string;
  value: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  trend: string;
}

export const useAdminPage = () => {
  const [loading, setLoading] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminSelectedUser | null>(null);
  const [selectedContent, setSelectedContent] = useState<AdminSelectedContent | null>(null);

  const handleUserAction = (action: string, user: AdminSelectedUser) => {
    setSelectedUser(user);
    if (action === "edit") {
      setShowUserModal(true);
    }
  };

  const handleContentAction = (action: string, content: AdminSelectedContent) => {
    setSelectedContent(content);
    if (action === "edit") {
      setShowContentModal(true);
    }
  };

  return {
    loading,
    setLoading,
    showUserModal,
    setShowUserModal,
    showContentModal,
    setShowContentModal,
    selectedUser,
    selectedContent,
    handleUserAction,
    handleContentAction,
  };
};

export const getStatusBadgeConfig = (status: string) => {
  const variants = {
    active: "bg-green-100 text-green-800 border-green-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    review: "bg-blue-100 text-blue-800 border-blue-200",
    inactive: "bg-gray-100 text-gray-800 border-gray-200"
  };
  
  const labels = {
    active: "Actif",
    pending: "En attente",
    review: "En révision",
    inactive: "Inactif"
  };
  
  return {
    className: variants[status as keyof typeof variants] || variants.inactive,
    label: labels[status as keyof typeof labels] || status,
  };
};

export const getRoleLabel = (role: string) => {
  const roles = {
    super_admin: "Super Admin",
    country_admin: "Admin Pays",
    editor: "Éditeur",
    contributor: "Contributeur",
    reader: "Lecteur"
  };
  return roles[role as keyof typeof roles] || role;
};
