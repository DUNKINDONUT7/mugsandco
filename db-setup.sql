-- Create database
CREATE DATABASE IF NOT EXISTS mugs_db;
USE mugs_db;

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample products
INSERT INTO products (name, price, image) VALUES
('Classic Coffee Mug', 12.99, 'classic-mug.jpg'),
('Ceramic Travel Mug', 18.99, 'travel-mug.jpg'),
('Vintage Porcelain Mug', 24.99, 'vintage-mug.jpg'),
('Personalized Custom Mug', 16.99, 'custom-mug.jpg'),
('Insulated Keep Warm Mug', 22.99, 'insulated-mug.jpg'),
('Minimalist White Mug', 9.99, 'white-mug.jpg');
