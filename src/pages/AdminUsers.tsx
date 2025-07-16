import { useState } from "react";
import { Search, Filter, Download, UserPlus, Mail, Shield, Eye, EyeOff, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
        return "bg-red-100 text-red-800 border-red-200";
      case "admin_pays":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "editeur":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "contributeur":
        return "bg-green-100 text-green-800 border-green-200";
      case "lecteur":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (blocked: boolean) => {
    return blocked 
      ? "bg-red-100 text-red-800 border-red-200"
      : "bg-green-100 text-green-800 border-green-200";
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2">
                Gestion des Utilisateurs
              </h1>
              <p className="text-lg text-muted-foreground">
                Administration complète des comptes utilisateurs de la plateforme
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => openNotificationDialog(undefined, "broadcast")}
              >
                <Mail className="h-4 w-4 mr-2" />
                Notification Globale
              </Button>
              <Button onClick={exportUsers}>
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{stats.totalUsers}</p>
                <p className="text-sm text-muted-foreground">Total Utilisateurs</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
                <p className="text-sm text-muted-foreground">Actifs</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.newUsersThisMonth}</p>
                <p className="text-sm text-muted-foreground">Nouveaux ce mois</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{stats.adminUsers}</p>
                <p className="text-sm text-muted-foreground">Administrateurs</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48">
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
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="blocked">Bloqués</SelectItem>
                </SelectContent>
              </Select>

              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-48">
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
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Utilisateurs ({filteredUsers.length})</CardTitle>
            <CardDescription>
              Gestion complète des comptes utilisateurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Pays</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Inscription</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback>
                            {user.first_name?.[0]}{user.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                          {user.organization && (
                            <p className="text-xs text-muted-foreground">
                              {user.organization}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.country || "Non spécifié"}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                      >
                        <SelectTrigger className="w-36">
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
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
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
                            className={user.blocked ? "text-green-600" : "text-red-600"}
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
          </CardContent>
        </Card>

        {/* Notification Dialog */}
        <Dialog open={notificationDialog} onOpenChange={setNotificationDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {notificationData.type === "individual" 
                  ? `Envoyer une notification à ${selectedUser?.first_name} ${selectedUser?.last_name}`
                  : "Envoyer une notification globale"
                }
              </DialogTitle>
              <DialogDescription>
                {notificationData.type === "individual"
                  ? "Cette notification sera envoyée uniquement à cet utilisateur."
                  : "Cette notification sera envoyée à tous les utilisateurs de la plateforme."
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={notificationData.title}
                  onChange={(e) => setNotificationData({...notificationData, title: e.target.value})}
                  placeholder="Titre de la notification"
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={notificationData.message}
                  onChange={(e) => setNotificationData({...notificationData, message: e.target.value})}
                  placeholder="Contenu de la notification"
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setNotificationDialog(false)}
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleSendNotification}
                  disabled={!notificationData.title || !notificationData.message}
                >
                  Envoyer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminUsers;