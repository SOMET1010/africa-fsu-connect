import { useState } from "react";
import { Search, Download, Mail, Eye, EyeOff, MoreHorizontal, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHero } from "@/components/shared/PageHero";
import { GlassCard } from "@/components/ui/glass-card";
import { ModernButton } from "@/components/ui/modern-button";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useToast } from "@/hooks/use-toast";

const AdminUsers = () => {
  const { 
    users, 
    stats, 
    loading, 
    updateUserRole, 
    toggleUserStatus, 
    sendNotificationToUser, 
    sendBroadcastNotification,
    exportUsers 
  } = useAdminUsers();
  
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [notificationDialog, setNotificationDialog] = useState(false);
  const [notificationData, setNotificationData] = useState({
    title: "",
    message: "",
    type: "individual" as "individual" | "broadcast"
  });

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && !user.blocked) ||
      (statusFilter === "blocked" && user.blocked);
    const matchesCountry = countryFilter === "all" || user.country === countryFilter;

    return matchesSearch && matchesRole && matchesStatus && matchesCountry;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "admin_pays":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "editeur":
        return "bg-[hsl(var(--nx-cyan)/0.1)] text-[hsl(var(--nx-cyan))] border-[hsl(var(--nx-cyan)/0.2)]";
      case "contributeur":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "lecteur":
        return "bg-white/5 text-white/60 border-white/10";
      default:
        return "bg-white/5 text-white/60 border-white/10";
    }
  };

  const getStatusColor = (blocked: boolean) => {
    return blocked 
      ? "bg-red-500/10 text-red-400 border-red-500/20"
      : "bg-green-500/10 text-green-400 border-green-500/20";
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole as any);
      toast({
        title: "Rôle mis à jour",
        description: "Le rôle de l'utilisateur a été modifié avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le rôle de l'utilisateur.",
        variant: "destructive"
      });
    }
  };

  const handleToggleStatus = async (userId: string, block: boolean) => {
    try {
      await toggleUserStatus(userId, block);
      toast({
        title: block ? "Utilisateur bloqué" : "Utilisateur débloqué",
        description: `L'utilisateur a été ${block ? "bloqué" : "débloqué"} avec succès.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de l'utilisateur.",
        variant: "destructive"
      });
    }
  };

  const handleSendNotification = async () => {
    try {
      if (notificationData.type === "individual" && selectedUser) {
        await sendNotificationToUser(selectedUser.id, notificationData.title, notificationData.message);
      } else if (notificationData.type === "broadcast") {
        await sendBroadcastNotification(notificationData.title, notificationData.message);
      }
      
      toast({
        title: "Notification envoyée",
        description: "La notification a été envoyée avec succès.",
      });
      
      setNotificationDialog(false);
      setNotificationData({ title: "", message: "", type: "individual" });
      setSelectedUser(null);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la notification.",
        variant: "destructive"
      });
    }
  };

  const openNotificationDialog = (user?: any, type: "individual" | "broadcast" = "individual") => {
    setSelectedUser(user || null);
    setNotificationData({ ...notificationData, type });
    setNotificationDialog(true);
  };

  const uniqueCountries = [...new Set(users.map(user => user.country).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--nx-night))] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--nx-gold))] mx-auto mb-4"></div>
          <p className="text-white/60">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--nx-night))]">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <PageHero
          badge="Administration"
          badgeIcon={Users}
          title="Gestion des Utilisateurs"
          subtitle="Administration complète des comptes utilisateurs de la plateforme"
        />

        {/* Actions */}
        <div className="flex gap-3 animate-fade-in">
          <ModernButton 
            variant="outline" 
            onClick={() => openNotificationDialog(undefined, "broadcast")}
          >
            <Mail className="h-4 w-4 mr-2" />
            Notification Globale
          </ModernButton>
          <ModernButton onClick={exportUsers}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </ModernButton>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 animate-fade-in">
          {[
            { label: "Total Utilisateurs", value: stats.totalUsers, color: "text-[hsl(var(--nx-gold))]" },
            { label: "Actifs", value: stats.activeUsers, color: "text-green-400" },
            { label: "Nouveaux ce mois", value: stats.newUsersThisMonth, color: "text-[hsl(var(--nx-cyan))]" },
            { label: "Administrateurs", value: stats.adminUsers, color: "text-orange-400" }
          ].map((stat) => (
            <GlassCard key={stat.label} className="p-6 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-white/60">{stat.label}</p>
            </GlassCard>
          ))}
        </div>

        {/* Filters */}
        <GlassCard className="p-6 animate-fade-in">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  placeholder="Rechercher par nom, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="admin_pays">Admin Pays</SelectItem>
                <SelectItem value="editeur">Éditeur</SelectItem>
                <SelectItem value="contributeur">Contributeur</SelectItem>
                <SelectItem value="lecteur">Lecteur</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actifs</SelectItem>
                <SelectItem value="blocked">Bloqués</SelectItem>
              </SelectContent>
            </Select>

            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Filtrer par pays" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les pays</SelectItem>
                {uniqueCountries.map(country => (
                  <SelectItem key={country} value={country!}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </GlassCard>

        {/* Users Table */}
        <GlassCard className="overflow-hidden animate-fade-in">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Liste des Utilisateurs ({filteredUsers.length})</h3>
            <p className="text-sm text-white/60">Gestion complète des comptes utilisateurs</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-white/70">Utilisateur</TableHead>
                  <TableHead className="text-white/70">Pays</TableHead>
                  <TableHead className="text-white/70">Rôle</TableHead>
                  <TableHead className="text-white/70">Statut</TableHead>
                  <TableHead className="text-white/70">Inscription</TableHead>
                  <TableHead className="text-white/70">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback className="bg-[hsl(var(--nx-gold)/0.2)] text-[hsl(var(--nx-gold))]">
                            {user.first_name?.[0]}{user.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-sm text-white/50">
                            {user.email}
                          </p>
                          {user.organization && (
                            <p className="text-xs text-white/40">
                              {user.organization}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white/70">
                      {user.country || "Non spécifié"}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                      >
                        <SelectTrigger className="w-36 bg-transparent border-0 p-0 h-auto">
                          <Badge className={getRoleColor(user.role)}>
                            {user.role === "super_admin" && "Super Admin"}
                            {user.role === "admin_pays" && "Admin Pays"}
                            {user.role === "editeur" && "Éditeur"}
                            {user.role === "contributeur" && "Contributeur"}
                            {user.role === "lecteur" && "Lecteur"}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                          <SelectItem value="admin_pays">Admin Pays</SelectItem>
                          <SelectItem value="editeur">Éditeur</SelectItem>
                          <SelectItem value="contributeur">Contributeur</SelectItem>
                          <SelectItem value="lecteur">Lecteur</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.blocked || false)}>
                        {user.blocked ? "Bloqué" : "Actif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white/70">
                      {new Date(user.created_at).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <ModernButton variant="ghost" size="sm" aria-label="Actions">
                            <MoreHorizontal className="h-4 w-4" />
                          </ModernButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => openNotificationDialog(user, "individual")}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Envoyer notification
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(user.id, !user.blocked)}
                            className={user.blocked ? "text-green-400" : "text-red-400"}
                          >
                            {user.blocked ? (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                Débloquer
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-4 w-4 mr-2" />
                                Bloquer
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </GlassCard>

        {/* Notification Dialog */}
        <Dialog open={notificationDialog} onOpenChange={setNotificationDialog}>
          <DialogContent className="sm:max-w-md bg-[hsl(var(--nx-night))] border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">
                {notificationData.type === "individual" 
                  ? `Envoyer une notification à ${selectedUser?.first_name} ${selectedUser?.last_name}`
                  : "Envoyer une notification globale"
                }
              </DialogTitle>
              <DialogDescription className="text-white/60">
                {notificationData.type === "individual"
                  ? "Cette notification sera envoyée uniquement à cet utilisateur."
                  : "Cette notification sera envoyée à tous les utilisateurs de la plateforme."
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white/80">Titre</Label>
                <Input
                  id="title"
                  value={notificationData.title}
                  onChange={(e) => setNotificationData({...notificationData, title: e.target.value})}
                  placeholder="Titre de la notification"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-white/80">Message</Label>
                <Textarea
                  id="message"
                  value={notificationData.message}
                  onChange={(e) => setNotificationData({...notificationData, message: e.target.value})}
                  placeholder="Contenu de la notification..."
                  rows={4}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <ModernButton variant="outline" onClick={() => setNotificationDialog(false)}>
                  Annuler
                </ModernButton>
                <ModernButton onClick={handleSendNotification}>
                  Envoyer
                </ModernButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminUsers;
