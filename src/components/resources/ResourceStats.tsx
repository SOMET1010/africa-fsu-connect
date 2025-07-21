
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Users, Globe } from "lucide-react";

interface ResourceStatsProps {
  documents: any[];
  loading: boolean;
}

const ResourceStats = ({ documents, loading }: ResourceStatsProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-1"></div>
              <div className="h-3 bg-muted rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalDocuments = documents.length;
  const totalDownloads = documents.reduce((sum, doc) => sum + (doc.download_count || 0), 0);
  const uniqueCountries = new Set(documents.filter(doc => doc.country).map(doc => doc.country)).size;
  const documentTypes = new Set(documents.map(doc => doc.document_type)).size;

  const stats = [
    {
      title: "Total Documents",
      value: totalDocuments,
      description: "Documents disponibles",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Téléchargements",
      value: totalDownloads,
      description: "Total des téléchargements",
      icon: Download,
      color: "text-green-600"
    },
    {
      title: "Pays",
      value: uniqueCountries,
      description: "Pays représentés",
      icon: Globe,
      color: "text-purple-600"
    },
    {
      title: "Types",
      value: documentTypes,
      description: "Types de documents",
      icon: Users,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ResourceStats;
