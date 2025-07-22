
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { GlobalIndicatorsWidget } from "@/components/dashboard/widgets/GlobalIndicatorsWidget";
import { IndicatorsEnrichmentPanel } from "@/components/indicators/IndicatorsEnrichmentPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Download, Filter, Calendar, Globe, Database } from "lucide-react";

const Indicators = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Hero Section */}
        <ScrollReveal direction="fade">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-8 border border-primary/20">
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold font-poppins mb-3 flex items-center gap-3">
                    <TrendingUp className="h-12 w-12 text-primary" />
                    Indicateurs FSU
                  </h1>
                  <p className="text-xl text-muted-foreground font-inter">
                    Données du Service Universel en temps réel
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Badge variant="secondary">
                      <Globe className="h-3 w-3 mr-1" />
                      5 Pays
                    </Badge>
                    <Badge variant="secondary">
                      <Calendar className="h-3 w-3 mr-1" />
                      2024
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" size="lg">
                    <Filter className="mr-2 h-5 w-5" />
                    Filtrer
                  </Button>
                  <Button variant="default" size="lg">
                    <Download className="mr-2 h-5 w-5" />
                    Exporter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Description Section */}
        <ScrollReveal delay={200}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                À propos des Indicateurs FSU
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Les indicateurs du Service Universel des télécommunications (FSU) fournissent une vue d'ensemble 
                des progrès réalisés en matière de connectivité et d'accès aux services de télécommunications 
                dans les pays membres. Ces données sont collectées auprès d'organisations internationales 
                reconnues comme l'UIT, la GSMA, et la Banque Mondiale.
              </p>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Main Content with Tabs */}
        <ScrollReveal delay={400}>
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="enrichment" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Enrichissement
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="mt-6">
              <GlobalIndicatorsWidget />
            </TabsContent>
            
            <TabsContent value="enrichment" className="mt-6">
              <IndicatorsEnrichmentPanel />
            </TabsContent>
          </Tabs>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Indicators;
