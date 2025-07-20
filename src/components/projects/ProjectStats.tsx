
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  DollarSign, 
  Users, 
  MapPin,
  TrendingUp,
  Activity
} from "lucide-react";
import type { Database } from '@/integrations/supabase/types';

type Project = Database['public']['Tables']['agency_projects']['Row'] & {
  agencies?: Database['public']['Tables']['agencies']['Row'];
};

interface ProjectStatsProps {
  projects: Project[];
}

export const ProjectStats = ({ projects }: ProjectStatsProps) => {
  // Calculate statistics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'ongoing' || p.status === 'en cours').length;
  const completedProjects = projects.filter(p => p.status === 'completed' || p.status === 'complété').length;
  
  const totalBudget = projects.reduce((sum, project) => {
    return sum + (Number(project.budget) || 0);
  }, 0);
  
  const totalBeneficiaries = projects.reduce((sum, project) => {
    return sum + (project.beneficiaries || 0);
  }, 0);
  
  const regionStats = projects.reduce((acc, project) => {
    if (project.agencies?.region) {
      acc[project.agencies.region] = (acc[project.agencies.region] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topRegion = Object.entries(regionStats).reduce((max, [region, count]) => 
    count > max.count ? { region, count } : max, 
    { region: '', count: 0 }
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
      notation: amount >= 1000000 ? 'compact' : 'standard'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR', {
      notation: num >= 1000000 ? 'compact' : 'standard'
    }).format(num);
  };

  const stats = [
    {
      title: "Total des projets",
      value: totalProjects.toString(),
      description: `${activeProjects} actifs, ${completedProjects} terminés`,
      icon: BarChart3,
      color: "text-[hsl(var(--primary))]"
    },
    {
      title: "Budget total",
      value: formatCurrency(totalBudget),
      description: "Investissement cumulé",
      icon: DollarSign,
      color: "text-[hsl(var(--fsu-gold))]"
    },
    {
      title: "Bénéficiaires",
      value: formatNumber(totalBeneficiaries),
      description: "Population impactée",
      icon: Users,
      color: "text-[hsl(var(--fsu-blue))]"
    },
    {
      title: "Région leader",
      value: topRegion.region || "N/A",
      description: `${topRegion.count} projets`,
      icon: MapPin,
      color: "text-[hsl(var(--primary))]"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
