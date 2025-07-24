-- PHASE 1C - SÉCURISATION DU STOCKAGE

-- Sécuriser les politiques de stockage pour restreindre l'accès anonyme
-- Supprimer toutes les politiques de stockage qui permettent l'accès anonyme

-- 1. Supprimer les politiques de stockage anonymes existantes
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view public documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own submission attachments" ON storage.objects;

-- 2. Créer des politiques de stockage sécurisées - accès restreint aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can view avatars" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (bucket_id = 'user-avatars');

CREATE POLICY "Authenticated users can view public documents" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (bucket_id = 'documents');

CREATE POLICY "Authenticated users can update their own avatar" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated users can insert their own avatar" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated users can delete their own avatar" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated users can update their own documents" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated users can insert their own documents" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated users can delete their own documents" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated users can view their own submission attachments" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (bucket_id = 'submissions-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated users can insert their own submission attachments" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'submissions-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated users can update their own submission attachments" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'submissions-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated users can delete their own submission attachments" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'submissions-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 3. Politiques d'administration pour le stockage
CREATE POLICY "Authenticated admins can manage all storage objects" 
ON storage.objects FOR ALL 
TO authenticated 
USING (is_admin(auth.uid()));