<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'mugs_db');

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8");

// Helper function to get all products
function getAllProducts($conn) {
    $sql = "SELECT * FROM products ORDER BY created_at DESC";
    $result = $conn->query($sql);
    $products = [];
    
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
    }
    
    return $products;
}

// Helper function to get product by ID
function getProductById($conn, $id) {
    $sql = "SELECT * FROM products WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    return $result->fetch_assoc();
}

// Helper function to add product
function addProduct($conn, $name, $price, $image) {
    $sql = "INSERT INTO products (name, price, image) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sds", $name, $price, $image);
    
    return $stmt->execute();
}

// Helper function to update product
function updateProduct($conn, $id, $name, $price, $image) {
    $sql = "UPDATE products SET name = ?, price = ?, image = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sdsi", $name, $price, $image, $id);
    
    return $stmt->execute();
}

// Helper function to delete product
function deleteProduct($conn, $id) {
    $sql = "DELETE FROM products WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    
    return $stmt->execute();
}
?>
