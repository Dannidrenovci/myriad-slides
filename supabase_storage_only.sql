-- Create storage bucket for presentations
insert into storage.buckets (id, name, public)
values ('presentations', 'presentations', false)
on conflict (id) do nothing;

-- Drop existing storage policies if they exist
drop policy if exists "Authenticated users can upload presentations" on storage.objects;
drop policy if exists "Users can view their own presentations" on storage.objects;
drop policy if exists "Users can delete their own presentations" on storage.objects;

-- Storage Policies
create policy "Authenticated users can upload presentations"
  on storage.objects for insert
  with check (
    bucket_id = 'presentations' 
    and auth.role() = 'authenticated'
  );

create policy "Users can view their own presentations"
  on storage.objects for select
  using (
    bucket_id = 'presentations' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own presentations"
  on storage.objects for delete
  using (
    bucket_id = 'presentations' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );
