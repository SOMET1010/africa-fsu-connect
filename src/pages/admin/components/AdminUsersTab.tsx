import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ModernButton } from "@/components/ui/modern-button";
import { ModernDataTable, DataRow } from "@/components/system/ModernDataTable";
import { AdminSelectedUser, getStatusBadgeConfig, getRoleLabel } from "../hooks/useAdminPage";

// Convert to DataRow compatible format
const toDataRows = (users: AdminSelectedUser[]): DataRow[] => 
  users.map(u => ({ ...u } as unknown as DataRow));

interface AdminUsersTabProps {
  users: AdminSelectedUser[];
  onUserAction: (action: string, user: AdminSelectedUser) => void;
  onRefresh: () => void;
}

const userColumns = [
  { key: "name", label: "Utilisateur", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "country", label: "Pays", sortable: true },
  { key: "role", label: "Rôle", sortable: true },
  { key: "status", label: "Statut", sortable: true },
  { key: "actions", label: "Actions" }
];

export const AdminUsersTab = ({ users, onUserAction, onRefresh }: AdminUsersTabProps) => {
  return (
    <ModernDataTable
      data={toDataRows(users)}
      columns={userColumns.map(col => ({
        ...col,
        render: col.key === "name" ? (value: unknown, row: Record<string, unknown>) => {
          const user = row as unknown as AdminSelectedUser;
          return (
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>
                  {user.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{String(value)}</p>
                <p className="text-sm text-muted-foreground">{user.country}</p>
              </div>
            </div>
          );
        } : col.key === "role" ? (value: unknown) => (
          <Badge variant="outline">
            {getRoleLabel(String(value))}
          </Badge>
        ) : col.key === "status" ? (value: unknown) => {
          const config = getStatusBadgeConfig(String(value));
          return <Badge className={config.className}>{config.label}</Badge>;
        } : col.key === "actions" ? (_value: unknown, row: Record<string, unknown>) => {
          const user = row as unknown as AdminSelectedUser;
          return (
            <div className="flex items-center space-x-2">
              <ModernButton 
                size="sm" 
                variant="outline"
                onClick={() => onUserAction("edit", user)}
              >
                Modifier
              </ModernButton>
              {user.status === "pending" && (
                <ModernButton 
                  size="sm"
                  onClick={() => onUserAction("approve", user)}
                >
                  Approuver
                </ModernButton>
              )}
            </div>
          );
        } : undefined
      }))}
      title="Gestion des utilisateurs"
      subtitle="Gérez les comptes utilisateurs et leurs permissions"
      onRefresh={onRefresh}
    />
  );
};
