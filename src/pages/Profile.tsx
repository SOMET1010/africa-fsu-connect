
import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Building, Camera, Save, Edit3, Shield, Bell, Globe, Settings, ChevronDown, CheckCircle, AlertCircle } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { ModernButton } from "@/components/ui/modern-button";
import { GlassCard } from "@/components/ui/glass-card";
import { ModernInput, ModernTextarea, ModernSelect, ModernSwitch } from "@/components/forms";
import { ModernModal, ModernModalFooter } from "@/components/ui/modern-modal";
import { ModernLoadingSpinner } from "@/components/ui/modern-loading-states";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useAutoSave } from "@/hooks/useAutoSave";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, profile, loading } = useAuth();
  const { updateProfile } = useProfile();
  const { toast } = useToast();
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    email: user?.email || "",
    organization: profile?.organization || "",
    country: profile?.country || "",
    bio: profile?.bio || ""
  });

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: user?.email || "",
        organization: profile.organization || "",
        country: profile.country || "",
        bio: profile.bio || ""
      });
    }
  }, [profile, user]);

  const handleProfileUpdate = async (data: any) => {
    if (!profile || !updateProfile) return;
    try {
      await updateProfile(data);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées automatiquement"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive"
      });
      throw error;
    }
  };

  const { autoSaveStatus } = useAutoSave(formData, {
    onSave: handleProfileUpdate,
    delay: 2000
  });

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('user-avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(fileName);

      await handleProfileUpdate({ avatar_url: data.publicUrl });
      setShowAvatarModal(false);
      
      toast({
        title: "Avatar mis à jour",
        description: "Votre photo de profil a été mise à jour avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'avatar",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
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
      case 'country_admin':
        return 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-700 border-blue-200/50';
      case 'editor':
        return 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-700 border-green-200/50';
      case 'contributor':
        return 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-700 border-orange-200/50';
      default:
        return 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-700 border-gray-200/50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative z-10">
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
    <div className="min-h-screen relative z-10">
      <PageHeader
        title="Mon Profil"
        description="Gérez vos informations personnelles et préférences"
        badge="Personnel"
        gradient
        actions={
          <div className="flex items-center gap-2">
            {autoSaveStatus.status === 'saving' && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Sauvegarde...
              </div>
            )}
            {autoSaveStatus.status === 'saved' && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                Sauvegardé
              </div>
            )}
            {autoSaveStatus.status === 'error' && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                Erreur
              </div>
            )}
            <ModernButton 
              variant="outline" 
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Settings className="mr-2 h-4 w-4" />
              {showAdvanced ? "Masquer" : "Plus d'options"}
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
            </ModernButton>
          </div>
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
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profil</TabsTrigger>
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
                      required
                    />
                    
                    <ModernInput
                      label="Nom"
                      value={formData.last_name}
                      onChange={(value) => setFormData({...formData, last_name: value})}
                      required
                    />
                    
                    <ModernInput
                      label="Email"
                      type="email"
                      value={formData.email}
                      disabled={true}
                      description="L'email ne peut pas être modifié"
                    />
                    
                    <ModernSelect
                      label="Pays"
                      value={formData.country}
                      onChange={(value) => setFormData({...formData, country: value})}
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

                  {showAdvanced && (
                    <>
                      <div className="grid grid-cols-1 gap-6 pt-6 border-t border-border/50">
                        <ModernInput
                          label="Organisation"
                          value={formData.organization}
                          onChange={(value) => setFormData({...formData, organization: value})}
                        />
                        
                        <ModernTextarea
                          label="Biographie"
                          value={formData.bio}
                          onChange={(value) => setFormData({...formData, bio: value})}
                          rows={4}
                          description="Présentez-vous brièvement"
                        />
                      </div>
                    </>
                  )}
                </GlassCard>

              </TabsContent>


              <TabsContent value="security" className="space-y-6">
                <GlassCard variant="default" className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Sécurité du compte</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-[hsl(var(--nx-gold))]" />
                        <div>
                          <p className="font-medium text-white">Mot de passe</p>
                          <p className="text-sm text-white/60">
                            Dernière modification il y a 30 jours
                          </p>
                        </div>
                      </div>
                      <ModernButton variant="outline" size="sm">
                        Changer
                      </ModernButton>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-[hsl(var(--nx-coop-500))]" />
                        <div>
                          <p className="font-medium text-white">Authentification 2FA</p>
                          <p className="text-sm text-white/60">
                            Activée
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-[hsl(var(--nx-coop-600)/0.2)] text-[hsl(var(--nx-coop-500))] border border-[hsl(var(--nx-coop-500)/0.3)]">
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
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAvatarUpload(file);
              }}
              className="hidden"
              id="avatar-upload"
            />
            <label htmlFor="avatar-upload">
              <ModernButton variant="outline" className="w-full cursor-pointer" asChild>
                <span>
                  <Camera className="mr-2 h-4 w-4" />
                  {uploading ? "Upload en cours..." : "Sélectionner une image"}
                </span>
              </ModernButton>
            </label>
          </div>
        </div>
        
        <ModernModalFooter>
          <ModernButton variant="outline" onClick={() => setShowAvatarModal(false)}>
            Fermer
          </ModernButton>
        </ModernModalFooter>
      </ModernModal>
    </div>
  );
};

export default Profile;
