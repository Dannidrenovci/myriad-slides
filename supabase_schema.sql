-- Create presentations table
create table presentations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  status text not null default 'processing', -- processing, ready, error
  file_path text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create slides table
create table slides (
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

-- Storage Bucket Policy (You need to create the 'presentations' bucket in the dashboard first)
-- This is just for reference, usually set in the Storage UI or via API if using Supabase CLI
-- insert into storage.buckets (id, name) values ('presentations', 'presentations');

-- Storage Policies
-- create policy "Authenticated users can upload presentations"
-- on storage.objects for insert
-- with check ( bucket_id = 'presentations' and auth.role() = 'authenticated' );

-- create policy "Users can view their own presentations"
-- on storage.objects for select
-- using ( bucket_id = 'presentations' and auth.uid() = owner );
