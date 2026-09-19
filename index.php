<?php
include 'db.php';
$products = getAllProducts($conn);
$facebookLink = 'https://www.facebook.com/mugsco'; // Update with your Facebook page
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mugs & Co. - Premium Ceramic Mugs</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <img src="public/logo.png" alt="Mugs & Co. Logo">
                    <span>Mugs & Co.</span>
                </div>
                <nav class="nav">
                    <a href="#products">Products</a>
                    <a href="#about">About</a>
                    <a href="#contact">Contact</a>
                    <a href="admin.php" class="admin-link">Admin</a>
                </nav>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero" style="background-image: url('public/hero-bg.jpg');">
        <div class="hero-overlay"></div>
        <div class="hero-content">
            <h1>Premium Ceramic Mugs</h1>
            <p>Handcrafted mugs for your perfect coffee moment</p>
            <a href="#products" class="btn btn-primary">Shop Now</a>
        </div>
    </section>

    <!-- Products Section -->
    <section id="products" class="products">
        <div class="container">
            <h2>Our Collection</h2>
            <div class="products-grid">
                <?php foreach($products as $product): ?>
                <div class="product-card">
                    <div class="product-image">
                        <img src="public/products/<?php echo htmlspecialchars($product['image']); ?>" 
                             alt="<?php echo htmlspecialchars($product['name']); ?>"
                             onerror="this.src='public/placeholder.png'">
                    </div>
                    <div class="product-info">
                        <h3><?php echo htmlspecialchars($product['name']); ?></h3>
                        <p class="price">$<?php echo number_format($product['price'], 2); ?></p>
                        <a href="<?php echo $facebookLink; ?>" class="btn btn-secondary" target="_blank">
                            Order on Facebook
                        </a>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about">
        <div class="container">
            <h2>About Mugs & Co.</h2>
            <p>We craft premium ceramic mugs designed to make your daily coffee ritual special. 
               Each mug is carefully made with attention to detail and quality, ensuring they last for years.</p>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
        <div class="container">
            <h2>Get In Touch</h2>
            <p>Follow us on Facebook to stay updated with new designs and special offers</p>
            <a href="<?php echo $facebookLink; ?>" class="btn btn-primary" target="_blank">Visit Our Facebook Page</a>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 Mugs & Co. All rights reserved.</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>
