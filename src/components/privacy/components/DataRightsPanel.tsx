import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Trash2, AlertTriangle } from 'lucide-react';

interface DataRightsPanelProps {
  onExportData: () => void;
  onDeleteData: () => void;
}

export function DataRightsPanel({ onExportData, onDeleteData }: DataRightsPanelProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Your Data Rights</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button variant="outline" onClick={onExportData} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export My Data
        </Button>
        
        <Button variant="outline" onClick={onDeleteData} className="flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          Delete My Data
        </Button>
      </div>
      
      <Alert className="mt-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You have the right to access, rectify, erase, restrict processing, and data portability. 
          Contact us at privacy@sutel.com for any requests.
        </AlertDescription>
      </Alert>
    </Card>
  );
}