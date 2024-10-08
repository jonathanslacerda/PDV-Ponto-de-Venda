create database pdv;

create table usuarios (
    id serial primary key,
    nome text not null,
    email text not null unique,
    senha text not null
);

create table categorias (
    id serial primary key,
    descricao text not null
);

create table produtos (
    id serial primary key,
    descricao text not null,
    quantidade_estoque integer not null,
    valor integer not null,
    categoria_id integer not null references categorias(id),
    imagem_url text unique
);

create table clientes (
    id serial primary key,
    nome text not null,
    email text not null unique,
    cpf varchar(11) not null unique,
    cep varchar(8),
    rua varchar(100),
    numero varchar(10),
    bairro varchar(50),
    cidade varchar(50),
    estado varchar(50)
);
create table pedidos (
    id serial primary key,
    cliente_id integer not null references clientes(id),
    observacao text,
    valor_total integer not null
);

create table pedido_produtos (
    id serial primary key,
    pedido_id integer not null references pedidos(id),
    produto_id integer not null references produtos(id),
    quantidade_produto integer not null,
    valor_produto integer not null
);
