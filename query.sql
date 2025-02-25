CREATE TABLE users (
    user_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(30) NOT NULL UNIQUE,
    password_hash varchar(255) NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    category_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    category_name VARCHAR(50) NOT NULL,
    description TEXT,
    parent_category INT REFERENCES categories(category_id)
);

CREATE TABLE products (
    product_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    category_id INT REFERENCES categories(category_id),
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    is_customizable BOOLEAN DEFAULT TRUE
);

CREATE TABLE colors (
    color_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    color_name VARCHAR(50) NOT NULL,
    color_code VARCHAR(10) NOT NULL,
    add_price DECIMAL(10, 2) DEFAULT 0
);

CREATE TABLE materials (
    material_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    material_name VARCHAR(50) NOT NULL,
    description TEXT,
    add_price DECIMAL(10, 2) DEFAULT 0
);

CREATE TABLE products_image (
    image_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    image_url VARCHAR(100) NOT NULL
);

CREATE TABLE components (
    component_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    component_name VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE custom_designs (
    design_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    user_id INT REFERENCES users(user_id),
    product_id INT REFERENCES products(product_id),
    color_id INT REFERENCES colors(color_id),
    material_id INT REFERENCES materials(material_id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_materials (
    product_materials_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    product_id INT REFERENCES products(product_id),
    material_id INT REFERENCES materials(material_id),
    is_default BOOLEAN DEFAULT FALSE,
    UNIQUE(product_id, material_id)
);

CREATE TABLE product_colors (
    product_color_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    product_id INT REFERENCES products(product_id),
    color_id INT REFERENCES colors(color_id),
    is_default BOOLEAN DEFAULT FALSE,
    UNIQUE(product_id, color_id)
);

CREATE TABLE product_components (
    product_component_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    product_id INT REFERENCES products(product_id),
    component_id INT REFERENCES components(component_id),
    add_price DECIMAL(10, 2) DEFAULT 0,
    is_default BOOLEAN DEFAULT FALSE,
    UNIQUE(product_id, component_id)
);

CREATE TABLE orders (
    order_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    user_id INT REFERENCES users(user_id),
    order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_cost DECIMAL(10, 2),
    payment_method VARCHAR(30) NOT NULL,
    order_status VARCHAR(20) DEFAULT 'pending',
    notes TEXT
);

CREATE TABLE order_items (
    order_item_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    order_id INT REFERENCES orders(order_id),
    product_id INT REFERENCES products(product_id),
    design_id INT REFERENCES custom_designs(design_id),
    quantity INT DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL
);

CREATE TABLE receipts (
    receipt_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    order_id INT REFERENCES orders(order_id),
    receipt_number VARCHAR(50) NOT NULL UNIQUE,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(10) DEFAULT 'unpaid'
);

CREATE TABLE reviews (
    review_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    user_id INT REFERENCES users(user_id),
    product_id INT REFERENCES products(product_id),
    design_id INT REFERENCES custom_designs(design_id),
    order_id INT REFERENCES orders(order_id),
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    helpful_votes INT DEFAULT 0
);

CREATE TABLE coupons (
    coupon_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    coupon_code VARCHAR(20) NOT NULL UNIQUE,
    discount_type VARCHAR(10) NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    valid_from TIMESTAMP NOT NULL,
    valid_to TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE coupon_usage (
    usage_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    coupon_id INT REFERENCES coupons(coupon_id),
    user_id INT REFERENCES users(user_id),
    order_id INT REFERENCES orders(order_id),
    used_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    discount_amount DECIMAL(10, 2) NOT NULL
);
