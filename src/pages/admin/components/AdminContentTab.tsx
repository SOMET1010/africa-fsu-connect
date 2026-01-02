import { Badge } from "@/components/ui/badge";
import { ModernButton } from "@/components/ui/modern-button";
import { ModernDataTable, DataRow } from "@/components/system/ModernDataTable";
import { AdminSelectedContent, getStatusBadgeConfig } from "../hooks/useAdminPage";

// Convert to DataRow compatible format
const toDataRows = (content: AdminSelectedContent[]): DataRow[] => 
  content.map(c => ({ ...c } as unknown as DataRow));

interface AdminContentTabProps {
  content: AdminSelectedContent[];
  onContentAction: (action: string, content: AdminSelectedContent) => void;
  onRefresh: () => void;
}

const contentColumns = [
  { key: "title", label: "Titre", sortable: true },
  { key: "type", label: "Type", sortable: true },
  { key: "author", label: "Auteur", sortable: true },
  { key: "country", label: "Pays", sortable: true },
  { key: "status", label: "Statut", sortable: true },
  { key: "actions", label: "Actions" }
];

export const AdminContentTab = ({ content, onContentAction, onRefresh }: AdminContentTabProps) => {
  return (
    <ModernDataTable
      data={toDataRows(content)}
      columns={contentColumns.map(col => ({
        ...col,
        render: col.key === "title" ? (value: unknown, row: Record<string, unknown>) => {
          const item = row as unknown as AdminSelectedContent;
          return (
            <div>
              <p className="font-medium">{String(value)}</p>
              <p className="text-sm text-muted-foreground">Par {item.author}</p>
            </div>
          );
        } : col.key === "type" ? (value: unknown) => (
          <Badge variant="outline">
            {String(value)}
          </Badge>
        ) : col.key === "status" ? (value: unknown) => {
          const config = getStatusBadgeConfig(String(value));
          return <Badge className={config.className}>{config.label}</Badge>;
        } : col.key === "actions" ? (_value: unknown, row: Record<string, unknown>) => {
          const item = row as unknown as AdminSelectedContent;
          return (
            <div className="flex items-center space-x-2">
              <ModernButton 
                size="sm" 
                variant="outline"
                onClick={() => onContentAction("edit", item)}
              >
                Réviser
              </ModernButton>
              <ModernButton 
                size="sm"
                onClick={() => onContentAction("approve", item)}
              >
                Approuver
              </ModernButton>
            </div>
          );
        } : undefined
      }))}
      title="Modération du contenu"
      subtitle="Révisez et approuvez le contenu soumis par les utilisateurs"
      onRefresh={onRefresh}
    />
  );
};
