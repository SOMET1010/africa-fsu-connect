-- Fix storage buckets: Set public buckets to private for proper RLS enforcement
-- This ensures RLS policies are enforced for all access methods, not just API calls

UPDATE storage.buckets SET public = false 
WHERE id IN ('documents', 'user-avatars', 'user-documents', 'avatars', 'maintenance-photos', 'payment-documents', 'property-images');

-- Note: submission-attachments and submissions-attachments are already private