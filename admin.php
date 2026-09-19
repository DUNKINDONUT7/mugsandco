<?php
include 'db.php';

$action = isset($_GET['action']) ? $_GET['action'] : 'list';
$message = '';

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $action = isset($_POST['action']) ? $_POST['action'] : 'list';
    
    if ($action == 'add') {
        $name = $_POST['name'];
        $price = $_POST['price'];
        $image = $_POST['image'];
        
        if (addProduct($conn, $name, $price, $image)) {
            $message = "Product added successfully!";
            $action = 'list';
        } else {
            $message = "Error adding product: " . $conn->error;
        }
    } 
    elseif ($action == 'edit') {
        $id = $_POST['id'];
        $name = $_POST['name'];
        $price = $_POST['price'];
        $image = $_POST['image'];
        
        if (updateProduct($conn, $id, $name, $price, $image)) {
            $message = "Product updated successfully!";
            $action = 'list';
        } else {
            $message = "Error updating product: " . $conn->error;
        }
    }
    elseif ($action == 'delete') {
        $id = $_POST['id'];
        
        if (deleteProduct($conn, $id)) {
            $message = "Product deleted successfully!";
            $action = 'list';
        } else {
            $message = "Error deleting product: " . $conn->error;
        }
    }
}

$products = getAllProducts($conn);
$editProduct = null;

if ($action == 'edit' && isset($_GET['id'])) {
    $editProduct = getProductById($conn, $_GET['id']);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - Mugs & Co.</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .admin-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .admin-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #4b2ca3;
        }

        .admin-header h1 {
            margin: 0;
            color: #4b2ca3;
        }

        .admin-nav {
            display: flex;
            gap: 10px;
        }

        .admin-nav a {
            padding: 10px 20px;
            background-color: #4b2ca3;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s;
        }

        .admin-nav a:hover {
            background-color: #3a1f7d;
        }

        .message {
            padding: 15px;
            margin-bottom: 20px;
            background-color: #d4edda;
            color: #155724;
            border-radius: 5px;
            border: 1px solid #c3e6cb;
        }

        .form-section {
            background-color: #f8f9fa;
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 30px;
            border: 1px solid #dee2e6;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #4b2ca3;
            font-weight: bold;
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #4b2ca3;
            box-shadow: 0 0 5px rgba(75, 44, 163, 0.3);
        }

        .form-buttons {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }

        .form-buttons button,
        .form-buttons a {
            padding: 12px 25px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s;
        }

        .btn-submit {
            background-color: #4b2ca3;
            color: white;
        }

        .btn-submit:hover {
            background-color: #3a1f7d;
        }

        .btn-cancel {
            background-color: #6c757d;
            color: white;
            text-decoration: none;
            display: inline-block;
        }

        .btn-cancel:hover {
            background-color: #5a6268;
        }

        .products-table {
            width: 100%;
            border-collapse: collapse;
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .products-table thead {
            background-color: #4b2ca3;
            color: white;
        }

        .products-table th,
        .products-table td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #dee2e6;
        }

        .products-table tbody tr:hover {
            background-color: #f5f5f5;
        }

        .products-table tbody tr:last-child td {
            border-bottom: none;
        }

        .action-buttons {
            display: flex;
            gap: 5px;
        }

        .action-buttons a,
        .action-buttons button {
            padding: 8px 12px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            text-decoration: none;
            font-size: 12px;
            transition: background-color 0.3s;
        }

        .btn-edit {
            background-color: #4b2ca3;
            color: white;
        }

        .btn-edit:hover {
            background-color: #3a1f7d;
        }

        .btn-delete {
            background-color: #dc3545;
            color: white;
        }

        .btn-delete:hover {
            background-color: #c82333;
        }

        .btn-add {
            background-color: #4b2ca3;
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin-bottom: 20px;
        }

        .btn-add:hover {
            background-color: #3a1f7d;
        }

        .back-link {
            display: inline-block;
            margin-bottom: 20px;
            color: #4b2ca3;
            text-decoration: none;
        }

        .back-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="admin-container">
        <div class="admin-header">
            <h1>Admin Panel - Mugs & Co.</h1>
            <div class="admin-nav">
                <a href="index.php">← Back to Store</a>
            </div>
        </div>

        <?php if ($message): ?>
        <div class="message"><?php echo htmlspecialchars($message); ?></div>
        <?php endif; ?>

        <?php if ($action == 'list'): ?>
            <!-- List Products -->
            <div>
                <a href="?action=add" class="btn-add">+ Add New Product</a>
            </div>

            <table class="products-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach($products as $product): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($product['id']); ?></td>
                        <td><?php echo htmlspecialchars($product['name']); ?></td>
                        <td>$<?php echo number_format($product['price'], 2); ?></td>
                        <td><?php echo htmlspecialchars($product['image']); ?></td>
                        <td>
                            <div class="action-buttons">
                                <a href="?action=edit&id=<?php echo $product['id']; ?>" class="btn-edit">Edit</a>
                                <form method="POST" style="display: inline;" onsubmit="return confirm('Are you sure?');">
                                    <input type="hidden" name="action" value="delete">
                                    <input type="hidden" name="id" value="<?php echo $product['id']; ?>">
                                    <button type="submit" class="btn-delete">Delete</button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>

        <?php elseif ($action == 'add' || $action == 'edit'): ?>
            <!-- Add/Edit Product Form -->
            <a href="?action=list" class="back-link">← Back to Products</a>

            <div class="form-section">
                <h2><?php echo ($action == 'add') ? 'Add New Product' : 'Edit Product'; ?></h2>

                <form method="POST">
                    <input type="hidden" name="action" value="<?php echo htmlspecialchars($action); ?>">
                    <?php if ($action == 'edit'): ?>
                    <input type="hidden" name="id" value="<?php echo htmlspecialchars($editProduct['id']); ?>">
                    <?php endif; ?>

                    <div class="form-group">
                        <label for="name">Product Name:</label>
                        <input type="text" id="name" name="name" required 
                               value="<?php echo $editProduct ? htmlspecialchars($editProduct['name']) : ''; ?>">
                    </div>

                    <div class="form-group">
                        <label for="price">Price:</label>
                        <input type="number" id="price" name="price" step="0.01" required 
                               value="<?php echo $editProduct ? htmlspecialchars($editProduct['price']) : ''; ?>">
                    </div>

                    <div class="form-group">
                        <label for="image">Image Filename:</label>
                        <input type="text" id="image" name="image" required 
                               placeholder="e.g., mug-1.jpg"
                               value="<?php echo $editProduct ? htmlspecialchars($editProduct['image']) : ''; ?>">
                        <small style="color: #666;">Upload image files to /public/products/ folder</small>
                    </div>

                    <div class="form-buttons">
                        <button type="submit" class="btn-submit">
                            <?php echo ($action == 'add') ? 'Add Product' : 'Update Product'; ?>
                        </button>
                        <a href="?action=list" class="btn-cancel">Cancel</a>
                    </div>
                </form>
            </div>

        <?php endif; ?>
    </div>
</body>
</html>
