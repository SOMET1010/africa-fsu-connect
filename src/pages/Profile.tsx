
import { useState } from "react";
import { User, Mail, Phone, MapPin, Building, Camera, Save, Edit3, Shield, Bell, Globe } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { ModernButton } from "@/components/ui/modern-button";
import { GlassCard } from "@/components/ui/glass-card";
import { ModernInput, ModernTextarea, ModernSelect, ModernSwitch } from "@/components/forms/ModernFormFields";
import { ModernModal, ModernModalFooter } from "@/components/ui/modern-modal";
import { ModernLoadingSpinner } from "@/components/ui/modern-loading-states";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const { user, profile } = useAuth();
  const { loading, updating, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    email: user?.email || "",
    organization: profile?.organization || "",
    country: profile?.country || "",
    bio: profile?.bio || ""
  });

  const [preferences, setPreferences] = useState({
    email_notifications: true,
    push_notifications: true,
    marketing_emails: false,
    newsletter: true,
    language: "fr",
    timezone: "Africa/Dakar",
    theme: "system"
  });

  const handleSave = async () => {
    if (!profile) return;
    
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const getUserInitials = () => {
    if (formData.first_name && formData.last_name) {
      return `${formData.first_name[0]}${formData.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-700 border-red-200/50';
      case 'admin_pays':
        return 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-700 border-blue-200/50';
      case 'editeur':
        return 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-700 border-green-200/50';
      case 'contributeur':
        return 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-700 border-orange-200/50';
      default:
        return 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-700 border-gray-200/50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <PageHeader
          title="Mon Profil"
          description="Gérez vos informations personnelles et préférences"
          badge="Personnel"
          gradient
        />
        <PageContainer>
          <div className="flex items-center justify-center h-64">
            <ModernLoadingSpinner size="lg" />
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Mon Profil"
        description="Gérez vos informations personnelles et préférences"
        badge="Personnel"
        gradient
        actions={
          <>
            {isEditing ? (
              <>
                <ModernButton 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Annuler
                </ModernButton>
                <ModernButton 
                  size="sm"
                  onClick={handleSave}
                  loading={updating}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </ModernButton>
              </>
            ) : (
              <ModernButton 
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Modifier
              </ModernButton>
            )}
          </>
        }
      />
      
      <PageContainer>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Informations utilisateur */}
          <div className="lg:col-span-1">
            <GlassCard variant="default" className="p-6 sticky top-6">
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <Avatar className="h-24 w-24 border-4 border-primary/20">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback className="text-xl bg-gradient-to-br from-primary to-accent text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <ModernButton
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 p-0 rounded-full"
                    onClick={() => setShowAvatarModal(true)}
                  >
                    <Camera className="h-3 w-3" />
                  </ModernButton>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">
                    {formData.first_name} {formData.last_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{formData.email}</p>
                  {profile?.role && (
                    <Badge className={`mt-2 ${getRoleColor(profile.role)}`}>
                      {profile.role.replace('_', ' ').toUpperCase()}
                    </Badge>
                  )}
                </div>
                
                <div className="text-left space-y-2 pt-4 border-t border-border/50">
                  {formData.organization && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{formData.organization}</span>
                    </div>
                  )}
                  {formData.country && (
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{formData.country}</span>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profil</TabsTrigger>
                <TabsTrigger value="preferences">Préférences</TabsTrigger>
                <TabsTrigger value="security">Sécurité</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <GlassCard variant="default" className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Informations personnelles</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ModernInput
                      label="Prénom"
                      value={formData.first_name}
                      onChange={(value) => setFormData({...formData, first_name: value})}
                      disabled={!isEditing}
                      required
                    />
                    
                    <ModernInput
                      label="Nom"
                      value={formData.last_name}
                      onChange={(value) => setFormData({...formData, last_name: value})}
                      disabled={!isEditing}
                      required
                    />
                    
                    <ModernInput
                      label="Email"
                      type="email"
                      value={formData.email}
                      disabled={true}
                      description="L'email ne peut pas être modifié"
                    />
                    
                    
                    <ModernInput
                      label="Organisation"
                      value={formData.organization}
                      onChange={(value) => setFormData({...formData, organization: value})}
                      disabled={!isEditing}
                    />
                    
                    <ModernSelect
                      label="Pays"
                      value={formData.country}
                      onChange={(value) => setFormData({...formData, country: value})}
                      disabled={!isEditing}
                      options={[
                        { value: "sn", label: "Sénégal" },
                        { value: "cm", label: "Cameroun" },
                        { value: "ci", label: "Côte d'Ivoire" },
                        { value: "ma", label: "Maroc" },
                        { value: "eg", label: "Égypte" },
                        { value: "other", label: "Autre" }
                      ]}
                    />
                  </div>
                  
                  
                  <div className="mt-6">
                    <ModernTextarea
                      label="Biographie"
                      value={formData.bio}
                      onChange={(value) => setFormData({...formData, bio: value})}
                      disabled={!isEditing}
                      rows={4}
                      description="Présentez-vous brièvement"
                    />
                  </div>
                </GlassCard>

              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <GlassCard variant="default" className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Notifications</h3>
                  
                  <div className="space-y-6">
                    <ModernSwitch
                      label="Notifications par email"
                      description="Recevez des notifications importantes par email"
                      checked={preferences.email_notifications}
                      onChange={(checked) => setPreferences({...preferences, email_notifications: checked})}
                    />
                    
                    <ModernSwitch
                      label="Notifications push"
                      description="Recevez des notifications dans votre navigateur"
                      checked={preferences.push_notifications}
                      onChange={(checked) => setPreferences({...preferences, push_notifications: checked})}
                    />
                    
                    <ModernSwitch
                      label="Newsletter"
                      description="Recevez notre newsletter mensuelle"
                      checked={preferences.newsletter}
                      onChange={(checked) => setPreferences({...preferences, newsletter: checked})}
                    />
                  </div>
                </GlassCard>

                <GlassCard variant="default" className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Préférences régionales</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ModernSelect
                      label="Langue"
                      value={preferences.language}
                      onChange={(value) => setPreferences({...preferences, language: value})}
                      options={[
                        { value: "fr", label: "Français" },
                        { value: "en", label: "English" },
                        { value: "ar", label: "العربية" }
                      ]}
                    />
                    
                    <ModernSelect
                      label="Fuseau horaire"
                      value={preferences.timezone}
                      onChange={(value) => setPreferences({...preferences, timezone: value})}
                      options={[
                        { value: "Africa/Dakar", label: "Dakar (GMT+0)" },
                        { value: "Africa/Casablanca", label: "Casablanca (GMT+1)" },
                        { value: "Africa/Cairo", label: "Le Caire (GMT+2)" },
                        { value: "Africa/Abidjan", label: "Abidjan (GMT+0)" }
                      ]}
                    />
                  </div>
                </GlassCard>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <GlassCard variant="default" className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Sécurité du compte</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Mot de passe</p>
                          <p className="text-sm text-muted-foreground">
                            Dernière modification il y a 30 jours
                          </p>
                        </div>
                      </div>
                      <ModernButton variant="outline" size="sm">
                        Changer
                      </ModernButton>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Authentification 2FA</p>
                          <p className="text-sm text-muted-foreground">
                            Activée
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Activée
                      </Badge>
                    </div>
                  </div>
                </GlassCard>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </PageContainer>

      {/* Modal Avatar */}
      <ModernModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        title="Changer l'avatar"
        description="Sélectionnez une nouvelle photo de profil"
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <Avatar className="h-32 w-32 border-4 border-primary/20">
              <AvatarImage src={profile?.avatar_url || ""} />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-accent text-white">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="text-center">
            <ModernButton variant="outline" className="w-full">
              <Camera className="mr-2 h-4 w-4" />
              Sélectionner une image
            </ModernButton>
          </div>
        </div>
        
        <ModernModalFooter>
          <ModernButton variant="outline" onClick={() => setShowAvatarModal(false)}>
            Annuler
          </ModernButton>
          <ModernButton onClick={() => setShowAvatarModal(false)}>
            Enregistrer
          </ModernButton>
        </ModernModalFooter>
      </ModernModal>
    </div>
  );
};

export default Profile;
