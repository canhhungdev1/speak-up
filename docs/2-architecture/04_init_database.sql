-- Kích hoạt extension tạo UUID mặc định của Postgres
create extension if not exists "uuid-ossp";

-- Tạo kiểu dữ liệu Enum (các giá trị cố định)
create type user_role as enum ('USER', 'ADMIN');
create type lesson_type as enum ('MAIN', 'VOCAB', 'MINI_STORY', 'POV');

-- 1. Bảng profiles (Liên kết 1-1 với auth.users của Supabase)
create table public.profiles (
    id uuid references auth.users(id) on delete cascade primary key,
    full_name varchar(255),
    avatar_url varchar(255),
    role user_role default 'USER'::user_role,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Bảng courses (Khóa học)
create table public.courses (
    id uuid default uuid_generate_v4() primary key,
    title varchar(255) not null,
    description text,
    cover_image_url varchar(255),
    is_published boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Bảng lesson_sets (Bộ bài học / Module)
create table public.lesson_sets (
    id uuid default uuid_generate_v4() primary key,
    course_id uuid references public.courses(id) on delete cascade,
    title varchar(255) not null,
    description text,
    order_index integer default 0,
    required_days integer default 7,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Bảng lessons (Các bài học thành phần: Main, Vocab...)
create table public.lessons (
    id uuid default uuid_generate_v4() primary key,
    lesson_set_id uuid references public.lesson_sets(id) on delete cascade,
    title varchar(255) not null,
    type lesson_type not null,
    audio_url varchar(1024) not null,
    duration_seconds integer default 0,
    order_index integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. Bảng transcripts (Lời thoại đồng bộ thời gian)
create table public.transcripts (
    id uuid default uuid_generate_v4() primary key,
    lesson_id uuid references public.lessons(id) on delete cascade,
    start_time float not null,
    end_time float not null,
    text_content text not null,
    order_index integer default 0
);

-- 6. Bảng user_progress (Tiến độ nghe của học viên)
create table public.user_progress (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade,
    lesson_id uuid references public.lessons(id) on delete cascade,
    last_position float default 0.0,
    is_completed boolean default false,
    listen_count integer default 0,
    total_listen_time integer default 0,
    last_listened_at timestamp with time zone default timezone('utc'::text, now()),
    unique(user_id, lesson_id)
);

-- 7. Bảng daily_checkins (Đếm số ngày học)
create table public.daily_checkins (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade,
    lesson_set_id uuid references public.lesson_sets(id) on delete cascade,
    checkin_date date not null default current_date,
    unique(user_id, lesson_set_id, checkin_date)
);

-- 8. TẠO TRIGGER TỰ ĐỘNG: Khi có người đăng ký tài khoản, tự động tạo Profile
create function public.handle_new_user() 
returns trigger 
language plpgsql 
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
