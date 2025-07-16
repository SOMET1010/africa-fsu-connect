import { useState, useCallback } from "react";
import { Upload, File, X, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface FileUploadComponentProps {
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  onFileUploaded?: (url: string, fileName: string) => void;
  className?: string;
  bucket: string;
  folder?: string;
}

interface UploadingFile {
  file: File;
  id: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  url?: string;
}

const FileUploadComponent = ({ 
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png",
  maxSize = 50,
  multiple = true,
  onFileUploaded,
  className = "",
  bucket,
  folder = ""
}: FileUploadComponentProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `Le fichier ${file.name} dépasse la taille maximale de ${maxSize}MB`;
    }

    // Check file type
    const allowedTypes = accept.split(',').map(type => type.trim().toLowerCase());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      return `Type de fichier non autorisé: ${fileExtension}`;
    }

    return null;
  };

  const uploadFileToStorage = async (file: File): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${folder ? folder + '/' : ''}${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || !user) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      errors.forEach(error => {
        toast({
          title: "Erreur de validation",
          description: error,
          variant: "destructive"
        });
      });
    }

    if (validFiles.length > 0) {
      // Create upload tracking objects
      const newFiles = validFiles.map(file => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        progress: 0,
        status: 'uploading' as const
      }));

      setUploadingFiles(prev => [...prev, ...newFiles]);

      // Upload files
      for (const uploadFile of newFiles) {
        try {
          // Simulate progress
          const progressInterval = setInterval(() => {
            setUploadingFiles(prev => 
              prev.map(f => 
                f.id === uploadFile.id 
                  ? { ...f, progress: Math.min(f.progress + 20, 90) }
                  : f
              )
            );
          }, 200);

          // Actual upload
          const url = await uploadFileToStorage(uploadFile.file);

          clearInterval(progressInterval);

          // Complete upload
          setUploadingFiles(prev => 
            prev.map(f => 
              f.id === uploadFile.id 
                ? { ...f, progress: 100, status: 'completed', url }
                : f
            )
          );

          onFileUploaded?.(url, uploadFile.file.name);

          toast({
            title: "Succès",
            description: `${uploadFile.file.name} uploadé avec succès`
          });

        } catch (error) {
          console.error('Upload error:', error);
          setUploadingFiles(prev => 
            prev.map(f => 
              f.id === uploadFile.id 
                ? { ...f, status: 'error' }
                : f
            )
          );

          toast({
            title: "Erreur d'upload",
            description: `Impossible d'uploader ${uploadFile.file.name}`,
            variant: "destructive"
          });
        }
      }
    }
  }, [accept, maxSize, user, bucket, folder, onFileUploaded, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  const removeFile = (id: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Upload className={`h-12 w-12 mb-4 ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
          <h3 className="text-lg font-medium mb-2">
            Glissez-déposez vos fichiers ici
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            ou cliquez pour sélectionner des fichiers
          </p>
          <Button variant="outline" asChild>
            <label className="cursor-pointer">
              Sélectionner des fichiers
              <input
                type="file"
                className="hidden"
                accept={accept}
                multiple={multiple}
                onChange={handleFileInput}
              />
            </label>
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Formats acceptés: {accept.replace(/\./g, '').toUpperCase()} • Taille max: {maxSize}MB
          </p>
        </CardContent>
      </Card>

      {/* Uploading Files List */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Fichiers:</h4>
          {uploadingFiles.map((uploadFile) => (
            <Card key={uploadFile.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <File className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {uploadFile.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(uploadFile.file.size)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {uploadFile.status === 'uploading' && (
                    <div className="w-24">
                      <Progress value={uploadFile.progress} className="h-2" />
                    </div>
                  )}
                  {uploadFile.status === 'completed' && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  {uploadFile.status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(uploadFile.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;