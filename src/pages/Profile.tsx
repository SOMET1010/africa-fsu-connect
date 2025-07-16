import { useState, useRef } from "react";
import { User, Settings, Bell, Shield, Globe, Save, Camera } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

const Profile = () => {
  const { user } = useAuth();
  const { profile, loading, updating, updateProfile, uploadAvatar } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [forumNotifications, setForumNotifications] = useState(true);
  const [eventNotifications, setEventNotifications] = useState(true);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    bio: '',
    country: '',
    organization: ''
  });

  // Update form data when profile loads
  useState(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        bio: profile.bio || '',
        country: profile.country || '',
        organization: profile.organization || ''
      });
    }
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadAvatar(file);
      } catch (error) {
        // Error is handled in the hook
      }
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(formData);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Profil Utilisateur
          </h1>
          <p className="text-lg text-muted-foreground">
            Gérez vos informations personnelles, préférences et paramètres de sécurité.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="text-lg">
                        {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                      onClick={handleAvatarClick}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </div>
                  <h3 className="text-lg font-semibold">
                    {profile?.first_name} {profile?.last_name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">{profile?.organization}</p>
                  <p className="text-sm text-muted-foreground mb-4">{profile?.country}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base">Activité Récente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium">Documents partagés</p>
                  <p className="text-muted-foreground">12 ce mois-ci</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Discussions forum</p>
                  <p className="text-muted-foreground">8 participations</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Événements</p>
                  <p className="text-muted-foreground">3 inscriptions</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">
                  <User className="h-4 w-4 mr-2" />
                  Personnel
                </TabsTrigger>
                <TabsTrigger value="preferences">
                  <Settings className="h-4 w-4 mr-2" />
                  Préférences
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Shield className="h-4 w-4 mr-2" />
                  Sécurité
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations Personnelles</CardTitle>
                    <CardDescription>
                      Mettez à jour vos informations personnelles et professionnelles
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="prenom">Prénom</Label>
                        <Input 
                          id="prenom" 
                          value={formData.first_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nom">Nom</Label>
                        <Input 
                          id="nom" 
                          value={formData.last_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organisation">Organisation</Label>
                      <Input 
                        id="organisation" 
                        value={formData.organization}
                        onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pays">Pays</Label>
                      <Select 
                        value={formData.country} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un pays" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ci">Côte d'Ivoire</SelectItem>
                          <SelectItem value="sn">Sénégal</SelectItem>
                          <SelectItem value="bf">Burkina Faso</SelectItem>
                          <SelectItem value="ml">Mali</SelectItem>
                          <SelectItem value="ne">Niger</SelectItem>
                          <SelectItem value="gh">Ghana</SelectItem>
                          <SelectItem value="ng">Nigéria</SelectItem>
                          <SelectItem value="za">Afrique du Sud</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Biographie</Label>
                      <Textarea 
                        id="bio" 
                        placeholder="Décrivez brièvement votre parcours et expertise..."
                        className="min-h-24"
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      />
                    </div>

                    <Button 
                      className="w-full md:w-auto" 
                      onClick={handleSaveProfile}
                      disabled={updating}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {updating ? 'Enregistrement...' : 'Enregistrer les Modifications'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Préférences de la Plateforme</CardTitle>
                    <CardDescription>
                      Personnalisez votre expérience sur la plateforme FSU
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="langue">Langue d'Interface</Label>
                      <Select defaultValue="fr">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Fuseau Horaire</Label>
                      <Select defaultValue="gmt">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gmt">GMT (Abidjan)</SelectItem>
                          <SelectItem value="wat">WAT (Lagos)</SelectItem>
                          <SelectItem value="cat">CAT (Johannesburg)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="theme">Thème</Label>
                      <Select defaultValue="light">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Clair</SelectItem>
                          <SelectItem value="dark">Sombre</SelectItem>
                          <SelectItem value="auto">Automatique</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Enregistrer les Préférences
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres de Notification</CardTitle>
                    <CardDescription>
                      Gérez vos préférences de notification par email et sur la plateforme
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notifications Email</Label>
                        <p className="text-sm text-muted-foreground">
                          Recevoir des notifications importantes par email
                        </p>
                      </div>
                      <Switch
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Discussions Forum</Label>
                        <p className="text-sm text-muted-foreground">
                          Notifications pour les réponses à vos messages
                        </p>
                      </div>
                      <Switch
                        checked={forumNotifications}
                        onCheckedChange={setForumNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Événements</Label>
                        <p className="text-sm text-muted-foreground">
                          Rappels pour les événements auxquels vous participez
                        </p>
                      </div>
                      <Switch
                        checked={eventNotifications}
                        onCheckedChange={setEventNotifications}
                      />
                    </div>

                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Enregistrer les Notifications
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sécurité du Compte</CardTitle>
                    <CardDescription>
                      Gérez la sécurité de votre compte et vos autorisations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Rôle Actuel</Label>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="font-medium capitalize">{profile?.role?.replace('_', ' ')}</p>
                        <p className="text-sm text-muted-foreground">
                          {profile?.role === 'super_admin' && 'Accès complet à toutes les fonctionnalités'}
                          {profile?.role === 'admin_pays' && 'Administration au niveau du pays'}
                          {profile?.role === 'editeur' && 'Création et édition de contenu'}
                          {profile?.role === 'contributeur' && 'Contribution et partage de ressources'}
                          {profile?.role === 'lecteur' && 'Consultation des ressources'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Dernière Connexion</Label>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">Aujourd'hui à 14:30 depuis Abidjan, CI</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Button variant="outline" className="w-full">
                        <Shield className="h-4 w-4 mr-2" />
                        Changer le Mot de Passe
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Globe className="h-4 w-4 mr-2" />
                        Sessions Actives
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;