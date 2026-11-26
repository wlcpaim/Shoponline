-- Schema SQL para Shoponline

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  price decimal(10,2) not null,
  category text not null,
  image text not null,
  stock integer not null default 0,
  description text,
  rating decimal(3,2) default 5.0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  address text not null,
  city text not null,
  zip_code text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists orders (
  id text primary key,
  customer jsonb not null,
  items jsonb not null,
  total decimal(10,2) not null,
  status text not null default 'Pendente',
  payment_method text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists coupons (
  code text primary key,
  discount_percent integer not null,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table products enable row level security;
alter table categories enable row level security;
alter table orders enable row level security;
alter table coupons enable row level security;

create policy "Public products read" on products for select using (true);
create policy "Public categories read" on categories for select using (true);
create policy "Public orders insert" on orders for insert with check (true);
create policy "Public orders read" on orders for select using (true);
create policy "Public coupons read" on coupons for select using (true);

-- Seed initial data
insert into products (id, title, price, category, image, stock, description, rating)
values 
('1', 'Relógio Suíço Chronos Gold', 1890.00, 'Acessórios', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80', 12, 'Relógio de alta precisão com acabamento em ouro 18k e vidro de safira.', 4.9),
('2', 'Jaqueta de Couro Italiano Noir', 850.00, 'Vestuário', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80', 8, 'Couro legítimo com modelagem slim e forro térmico acolchoado.', 4.8),
('3', 'Fones de Ouvido Studio Wireless Pro', 1290.00, 'Tecnologia', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80', 15, 'Cancelamento ativo de ruído, som espacial e autonomia de 40 horas.', 4.7),
('4', 'Tênis Urban Minimalist White', 490.00, 'Calçados', 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80', 20, 'Confeccionado em couro premium com solado emborrachado antiderrapante.', 4.6),
('5', 'Óculos de Sol Aviator Classic Titanium', 620.00, 'Acessórios', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80', 10, 'Armação ultra leve em titânio com lentes polarizadas e proteção UV400.', 4.9),
('6', 'Mochila Executiva Impermeável', 380.00, 'Acessórios', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80', 25, 'Compartimento dedicado para notebook de até 17 polegadas e porta USB integrada.', 4.8)
on conflict (id) do nothing;

insert into coupons (code, discount_percent, active)
values 
('SHOP10', 10, true),
('EXCLUSIVO20', 20, true)
on conflict (code) do nothing;
