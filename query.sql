-- database: ./geargod.db

create table users (
    user_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    username varchar(30) not null unique,
    email varchar(30) not null unique,
    password_hash text not null,
    first_name varchar(30),
    last_name varchar(30),
    phone varchar(20) not null,
    address text,
    create_at timestamp not null default current_timestamp
); -- already

create table products (
    product_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    product_name varchar(100) not null,
    description text,
    price decimal(10, 2) not null,
    stock_quantity int default 0,
    is_customizable boolean default true
); -- already

create table colors (
    color_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    color_name varchar(50) not null,
    color_code varchar(10) not null,
    add_price decimal(10, 2) default 0
); -- already

create table materials (
    material_id integer not null PRIMARY KEY AUTOINCREMENT,
    material_name varchar(50) not null,
    description text,
    add_price decimal(10, 2) default 0
); -- already

create table products_image (
    image_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    product_id int references products(product_id),
    image_url varchar(100) not null -- image path(?)
);

create table components (
    component_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    component_name varchar(50) not null,
    description text
);

create table custom_designs (
    design_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    user_id int references users(user_id),
    product_id int references products(product_id),
    color_id int references colors(color_id),
    material_id int references materials(material_id),
    created_at timestamp not null default CURRENT_TIMESTAMP
);

create table product_materials (
    product_materials_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    product_id int references products(product_id),
    material_id int references materials(material_id),
    is_default boolean default false,
    unique(product_id, material_id)
);

create table product_colors (
    product_color_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    product_id int references products(product_id),
    color_id int references colors(color_id),
    is_default boolean false,
    unique(product_id, color_id)
);

create table product_components (
    product_component_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    product_id int references products(product_id),
    component_id int references components(component_id),
    add_price decimal(10, 2) default 0,
    is_default boolean default false,
    unique(product_id, component_id)
);

create table orders (
    order_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    user_id int references users(user_id),
    order_date timestamp not null default current_timestamp,
    total_amount decimal(10, 2) not null,
    shipping_address text not null,
    shipping_cost decimal(10, 2),
    payment_method varchar(30) not null,
    order_status varchar(20) default 'pending',
    notes text
);

create table order_items (
    order_item_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    order_id int references orders(order_id),
    product_id int references products(product_id),
    design_id int references custom_designs(design_id),
    quantity int default 1,
    unit_price decimal(10, 2) not null,
    subtotal decimal(10, 2) not null
);

create table receipts (
    receipt_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    order_id int references orders(order_id),
    receipt_number varchar(50) not null unique,
    total_amount decimal(10, 2) not null,
    payment_status varchar(10) default 'unpaid'
);

create table reviews (
    review_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    user_id int references users(user_id),
    product_id int references products(product_id),
    design_id int references custom_designs(design_id),
    order_id int references orders(order_id),
    rating int not null check (rating between 1 and 5),
    created_at timestamp not null default CURRENT_TIMESTAMP,
    helpful_votes int default 0
);

create table coupons (
    coupon_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    coupon_code varchar(20) not null unique,
    discount_type varchar(10) not null, -- % or fixed
    discount_value decimal(10, 2) not null,
    valid_from timestamp not null,
    valid_to timestamp not null,
    is_active boolean default true
);

create table coupon_usage (
    usage_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    coupon_id int REFERENCES coupons(coupon_id),
    user_id int references users(user_id),
    order_id int references orders(order_id),
    used_at timestamp not null default current_timestamp,
    discount_amount decimal(10, 2) not null
);