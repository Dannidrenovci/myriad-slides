-- Create presentations table
create table if not exists presentations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  status text not null default 'processing',
  file_path text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create slides table
create table if not exists slides (
  id uuid default gen_random_uuid() primary key,
  presentation_id uuid references presentations on delete cascade not null,
  order_index integer not null,
  layout_id text not null,
  content jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table presentations enable row level security;
alter table slides enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view their own presentations" on presentations;
drop policy if exists "Users can insert their own presentations" on presentations;
drop policy if exists "Users can update their own presentations" on presentations;
drop policy if exists "Users can delete their own presentations" on presentations;
drop policy if exists "Users can view slides of their presentations" on slides;
drop policy if exists "Users can insert slides into their presentations" on slides;

-- Policies for presentations
create policy "Users can view their own presentations"
  on presentations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own presentations"
  on presentations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own presentations"
  on presentations for update
  using (auth.uid() = user_id);

create policy "Users can delete their own presentations"
  on presentations for delete
  using (auth.uid() = user_id);

-- Policies for slides
create policy "Users can view slides of their presentations"
  on slides for select
  using (
    exists (
      select 1 from presentations
      where presentations.id = slides.presentation_id
      and presentations.user_id = auth.uid()
    )
  );

create policy "Users can insert slides into their presentations"
  on slides for insert
  with check (
    exists (
      select 1 from presentations
      where presentations.id = slides.presentation_id
      and presentations.user_id = auth.uid()
    )
  );

-- Create storage bucket for presentations
insert into storage.buckets (id, name, public)
values ('presentations', 'presentations', false)
on conflict (id) do nothing;

-- Storage Policies
drop policy if exists "Authenticated users can upload presentations" on storage.objects;
drop policy if exists "Users can view their own presentations" on storage.objects;
drop policy if exists "Users can delete their own presentations" on storage.objects;

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
