import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Video, Square, Pause, Play, Download } from 'lucide-react';
import { useScreenRecording } from '@/hooks/useScreenRecording';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface VideoRecorderProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoRecorder = ({ isOpen, onClose }: VideoRecorderProps) => {
  const [includeAudio, setIncludeAudio] = useState(false);
  const [quality, setQuality] = useState<'720p' | '1080p' | '4k'>('1080p');
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  const {
    isRecording,
    isPaused,
    formattedDuration,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
  } = useScreenRecording();

  const handleStartRecording = async () => {
    try {
      await startRecording({ includeAudio, quality });
      toast.success('Enregistrement démarré');
    } catch (error) {
      toast.error('Erreur lors du démarrage de l\'enregistrement');
    }
  };

  const handleStopRecording = async () => {
    try {
      const blob = await stopRecording();
      setRecordedBlob(blob);
      toast.success('Enregistrement terminé');
    } catch (error) {
      toast.error('Erreur lors de l\'arrêt de l\'enregistrement');
    }
  };

  const handleDownload = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sutel-presentation-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Téléchargement démarré');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enregistrement Vidéo</DialogTitle>
          <DialogDescription>
            Enregistrez votre présentation avec audio optionnel
          </DialogDescription>
        </DialogHeader>

        {!isRecording && !recordedBlob && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Qualité Vidéo</Label>
              <Select value={quality} onValueChange={(v: any) => setQuality(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="720p">720p (HD)</SelectItem>
                  <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                  <SelectItem value="4k">4K (Ultra HD)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="audio">Inclure Audio (Micro)</Label>
              <Switch
                id="audio"
                checked={includeAudio}
                onCheckedChange={setIncludeAudio}
              />
            </div>

            <Button onClick={handleStartRecording} className="w-full gap-2">
              <Video className="h-4 w-4" />
              Démarrer l'Enregistrement
            </Button>
          </div>
        )}

        {isRecording && (
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                <span className="font-mono text-lg">{formattedDuration}</span>
              </div>
              <div className="flex gap-2">
                {isPaused ? (
                  <Button size="sm" variant="outline" onClick={resumeRecording}>
                    <Play className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={pauseRecording}>
                    <Pause className="h-4 w-4" />
                  </Button>
                )}
                <Button size="sm" variant="destructive" onClick={handleStopRecording}>
                  <Square className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Enregistrement en cours... Arrêtez pour sauvegarder.
            </p>
          </Card>
        )}

        {recordedBlob && (
          <div className="space-y-4">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-4">
                Enregistrement terminé ! Téléchargez votre vidéo.
              </p>
              <Button onClick={handleDownload} className="w-full gap-2">
                <Download className="h-4 w-4" />
                Télécharger la Vidéo
              </Button>
            </Card>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setRecordedBlob(null);
              }}
            >
              Nouvel Enregistrement
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
