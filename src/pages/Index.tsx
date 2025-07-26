
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import HeroSection from "@/components/landing/HeroSection";
import { RegionalMapSection } from "@/components/landing/RegionalMapSection";
import { 
  Target, 
  Users, 
  BookOpen,
  MessageSquare,
  Calendar,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Globe,
  Building2
} from "lucide-react";
import { useTranslationDb } from "@/hooks/useTranslationDb";
import { useEffect } from "react";
import { forceCompleteTranslationRefresh } from "@/utils/forceTranslationRefresh";

const Index = () => {
  const { t, refreshTranslations } = useTranslationDb();
  
  // Force complete refresh of translations on component mount
  useEffect(() => {
    const refreshAll = async () => {
      await forceCompleteTranslationRefresh();
      refreshTranslations();
    };
    refreshAll();
  }, []);

  const features = [
    {
      icon: Target,
      title: t('features.fsu.projects'),
      description: t('features.fsu.projects.desc'),
      link: "/projects",
      highlights: [
        t('features.fsu.projects.highlight1'), 
        t('features.fsu.projects.highlight2'), 
        t('features.fsu.projects.highlight3')
      ]
    },
    {
      icon: BookOpen,
      title: t('features.shared.resources'),
      description: t('features.shared.resources.desc'),
      link: "/docs",
      highlights: [
        t('features.shared.resources.highlight1'), 
        t('features.shared.resources.highlight2'), 
        t('features.shared.resources.highlight3')
      ]
    },
    {
      icon: Building2,
      title: t('features.organizations.directory'),
      description: t('features.organizations.directory.desc'),
      link: "/organizations",
      highlights: [
        t('features.organizations.directory.highlight1'), 
        t('features.organizations.directory.highlight2'), 
        t('features.organizations.directory.highlight3')
      ]
    },
    {
      icon: MessageSquare,
      title: t('features.collaborative.forum'),
      description: t('features.collaborative.forum.desc'),
      link: "/forum",
      highlights: [
        t('features.collaborative.forum.highlight1'), 
        t('features.collaborative.forum.highlight2'), 
        t('features.collaborative.forum.highlight3')
      ]
    },
    {
      icon: Calendar,
      title: t('features.events.training'),
      description: t('features.events.training.desc'),
      link: "/events",
      highlights: [
        t('features.events.training.highlight1'), 
        t('features.events.training.highlight2'), 
        t('features.events.training.highlight3')
      ]
    },
    {
      icon: BarChart3,
      title: t('features.analytics.reporting'),
      description: t('features.analytics.reporting.desc'),
      link: "/dashboard",
      highlights: [
        t('features.analytics.reporting.highlight1'), 
        t('features.analytics.reporting.highlight2'), 
        t('features.analytics.reporting.highlight3')
      ]
    }
  ];

  const regions = [
    { name: "CEDEAO", countries: 15, projects: 342, color: "bg-blue-500" },
    { name: "SADC", countries: 16, projects: 289, color: "bg-green-500" },
    { name: "EACO", countries: 8, projects: 198, color: "bg-purple-500" },
    { name: "ECCAS", countries: 11, projects: 156, color: "bg-orange-500" },
    { name: "UMA", countries: 5, projects: 143, color: "bg-red-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Regional Map Section */}
      <RegionalMapSection />

      {/* Features Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2">
              <Globe className="w-4 h-4 mr-2" />
              {t('features.badge')}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('features.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group border-border/50 hover:shadow-xl transition-all duration-500 hover:scale-[1.03] bg-card/80 backdrop-blur-sm hover:bg-card/90 animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary via-primary/90 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:shadow-primary/25">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 mb-4">
                    {feature.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {highlight}
                      </div>
                    ))}
                  </div>
                  <Link to={feature.link}>
                    <Button variant="outline" className="w-full group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-blue-600 group-hover:text-white group-hover:border-transparent transition-all duration-300 hover:shadow-lg hover:shadow-primary/25">
                      {t('common.discover')}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Regional Overview Section */}
      <section className="py-20 bg-gradient-to-r from-muted/20 via-muted/10 to-muted/20 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-4 py-2 bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
              <Users className="w-4 h-4 mr-2" />
              {t('regions.badge')}
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t('regions.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              {t('regions.subtitle')}
            </p>
            <Button asChild variant="outline" className="hover:bg-gradient-to-r hover:from-primary hover:to-blue-600 hover:text-white transition-all duration-300">
              <Link to="/organizations" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>{t('common.explore.map')}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {regions.map((region, index) => (
              <Card key={index} className="text-center border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-xl hover:scale-105 transition-all duration-300 hover:bg-card/90 animate-fade-in group" style={{animationDelay: `${(index + 6) * 100}ms`}}>
                <CardContent className="pt-6 pb-4">
                  <div className={`w-12 h-12 ${region.color} rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white font-bold text-lg">{region.name[0]}</span>
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">{region.name}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center justify-center">
                      <Globe className="h-4 w-4 mr-2" />
                      {region.countries} {t('common.countries')}
                    </div>
                    <div className="flex items-center justify-center">
                      <Target className="h-4 w-4 mr-2" />
                      {region.projects} {t('common.projects')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-blue-600 to-blue-800 text-white relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-white/5 to-transparent rounded-full blur-3xl" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{animationDelay: '200ms'}}>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 hover:scale-105 px-8 py-3 transition-all duration-300 shadow-lg hover:shadow-xl">
              <Link to="/auth" className="flex items-center">
                <span>{t('common.create.account')}</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:scale-105 px-8 py-3 transition-all duration-300 backdrop-blur-sm">
              <Link to="/organizations">{t('common.learn.more')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
