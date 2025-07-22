
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Shield, Download, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { withLazyLoading } from "@/utils/lazyLoading";
import SecurityDashboard from "@/features/security/components/dashboard/SecurityDashboard";

const SecurityPage = () => {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Sécurité et Authentification"
        description="Gérez vos paramètres de sécurité et surveillez l'activité de votre compte"
        badge="Professionnel"
        gradient
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exporter rapport
            </Button>
            <Button size="sm">
              <Bell className="mr-2 h-4 w-4" />
              Configurer alertes
            </Button>
          </>
        }
      />
      
      <PageContainer>
        <SecurityDashboard />
      </PageContainer>
    </div>
  );
};

export default SecurityPage;
