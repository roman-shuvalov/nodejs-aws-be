create extension if not exists "uuid-ossp";

create table if not exists products (
    id uuid primary key,
    title text not null,
    description text,
    price integer
);

create table if not exists stocks (
    product_id uuid,
    count integer,
    FOREIGN KEY(product_id) references products(id)
);

insert into products (id, title, description, price)
values
       ('7567ec4b-b10c-48c5-9345-fc73c48a80aa', 'ProductOne', 'Short Product Description1', 2),
       ('7567ec4b-b10c-48c5-9345-fc73c48a80a0', 'ProductNew', 'Short Product Description3', 10),
       ('7567ec4b-b10c-48c5-9345-fc73c48a80a2', 'ProductTop', 'Short Product Description2', 23),
       ('7567ec4b-b10c-48c5-9345-fc73c48a80a1', 'ProductTitle', 'Short Product Description7', 15),
       ('7567ec4b-b10c-48c5-9345-fc73c48a80a3', 'Product', 'Short Product Description2', 23),
       ('7567ec4b-b10c-48c5-9345-fc73348a80a1', 'ProductTest', 'Short Product Description4', 15),
       ('7567ec4b-b10c-48c5-9445-fc73c48a80a2', 'Product2', 'Short Product Descriptio1', 23),
       ('7567ec4b-b10c-45c5-9345-fc73c48a80a1', 'ProductName', 'Short Product Description7', 15);

insert into stocks (product_id, count)
values
       ('7567ec4b-b10c-48c5-9345-fc73c48a80aa', 4),
       ('7567ec4b-b10c-48c5-9345-fc73c48a80a0', 6),
       ('7567ec4b-b10c-48c5-9345-fc73c48a80a2', 6),
       ('7567ec4b-b10c-48c5-9345-fc73c48a80a1', 12),
       ('7567ec4b-b10c-48c5-9345-fc73c48a80a3', 7),
       ('7567ec4b-b10c-48c5-9345-fc73348a80a1', 8),
       ('7567ec4b-b10c-48c5-9445-fc73c48a80a2', 2),
       ('7567ec4b-b10c-45c5-9345-fc73c48a80a1', 3);