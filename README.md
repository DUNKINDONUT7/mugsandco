# Mugs & Co. - E-commerce Store

A simple, beginner-friendly PHP and MySQL e-commerce website for selling premium ceramic mugs.

## React + Supabase setup

The active storefront is the Next.js React app. Supabase migrations create the `products` and `profiles` tables, the `product-images` storage bucket, authentication roles, and product approval policies.

1. Copy `.env.example` to `.env.local` and add the Supabase URL and publishable key.
2. Run `npx supabase@latest link --project-ref YOUR_PROJECT_REF`.
3. Run `npx supabase@latest db push --linked`.
4. Open `/auth` to create an account, then use the dashboard at `/dashboard`.

New accounts are `user` accounts. After creating your own account, promote it to admin in Supabase SQL Editor:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'YOUR_EMAIL');
```

Users can upload product images and submit products for review. Admins can approve, reject, publish, and delete listings.

## Features

- **Frontend Store** (`index.php`) - Display products with hero section and navigation
- **Admin Panel** (`admin.php`) - Manage products (add, edit, delete)
- **Responsive Design** - Works on desktop and mobile devices
- **Clean & Modern UI** - Deep purple and white color theme
- **Product Management** - Store products in MySQL database
- **Image Upload Support** - Organize product images in `/public/products/` folder

## Project Structure

```
mugs-co/
├── index.php           # Main storefront
├── admin.php           # Admin panel for product management
├── db.php              # Database configuration and helper functions
├── style.css           # All styling
├── script.js           # Interactive elements
├── db-setup.sql        # Database initialization script
├── public/
│   ├── logo.png        # Store logo
│   ├── hero-bg.jpg     # Hero section background
│   └── products/       # Product images folder (create this)
└── uploads/            # Alternative upload folder (create as needed)
```

## Setup Instructions

### 1. Install XAMPP or WAMP
Download and install [XAMPP](https://www.apachefriends.org/) (recommended) or WAMP.

### 2. Copy Project Files
Move the entire project folder to:
- **XAMPP**: `C:\xampp\htdocs\mugs-co\`
- **WAMP**: `C:\wamp64\www\mugs-co\`

### 3. Start Services
- Open XAMPP Control Panel
- Start **Apache** and **MySQL**

### 4. Create Database
1. Open `http://localhost/phpmyadmin`
2. Go to the **SQL** tab
3. Copy and paste the entire content of `db-setup.sql`
4. Click **Execute**

The database and sample products will be created automatically.

### 5. Prepare Image Folders
Create these folders in your project:
- `/public/products/` - For product images
- `/uploads/` - For image uploads (optional)

### 6. Access Your Store
- **Store**: `http://localhost/mugs-co/`
- **Admin Panel**: `http://localhost/mugs-co/admin.php`

## Using the Admin Panel

### Add a Product
1. Click "Admin" in the store header or go to `/admin.php`
2. Click "+ Add New Product"
3. Fill in:
   - **Product Name** - e.g., "Classic Coffee Mug"
   - **Price** - e.g., 12.99
   - **Image Filename** - e.g., "classic-mug.jpg"
4. Upload your image to `/public/products/` folder
5. Click "Add Product"

### Edit a Product
1. Click "Edit" next to the product in the admin table
2. Update the details
3. Click "Update Product"

### Delete a Product
1. Click "Delete" next to the product
2. Confirm the deletion

## Customization

### Update Facebook Link
Edit `index.php` and find this line:
```php
$facebookLink = 'https://www.facebook.com/profile.php?id=61588035627320';
```
Replace with your actual Facebook page URL.

### Change Colors
Edit `style.css` and modify these variables at the top:
```css
:root {
    --primary: #4b2ca3;      /* Change deep purple */
    --primary-dark: #3a1f7d;
    --white: #ffffff;
    --text: #333333;
    ...
}
```

### Replace Logo and Hero Image
1. Place your images in the `/public/` folder
2. Update the file paths in `index.php`

## Database Details

### Table: `products`
```
- id (INT, Primary Key, Auto Increment)
- name (VARCHAR 255) - Product name
- price (DECIMAL 10,2) - Product price
- image (VARCHAR 255) - Image filename
- created_at (TIMESTAMP) - Creation date
- updated_at (TIMESTAMP) - Last update date
```

## File Descriptions

### index.php
Main storefront page that displays:
- Header with navigation
- Hero section with background image
- Product grid with cards
- About section
- Contact section linking to Facebook
- Footer

### admin.php
Admin panel for managing products:
- View all products in a table
- Add new products
- Edit existing products
- Delete products
- Uses the same styling as the store

### db.php
Database connection and helper functions:
- Database configuration (localhost, root, empty password)
- `getAllProducts()` - Retrieve all products
- `getProductById()` - Get single product
- `addProduct()` - Insert new product
- `updateProduct()` - Update product
- `deleteProduct()` - Delete product

### style.css
Complete styling including:
- Header and navigation
- Hero section
- Product cards and grid
- Responsive design (mobile-first)
- Button styles
- Admin panel styles

### script.js
Client-side JavaScript for:
- Smooth scrolling
- Product card animations
- Intersection Observer for fade-in effects

## Database Configuration

The default configuration in `db.php`:
- **Host**: localhost
- **User**: root
- **Password**: (empty)
- **Database**: mugs_db

If your MySQL credentials are different, edit `db.php`:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');        // Change this
define('DB_PASS', '');            // Change this
define('DB_NAME', 'mugs_db');
```

## Mobile Responsive

The site is fully responsive and includes breakpoints for:
- Mobile devices (< 768px)
- Tablets (768px - 1024px)
- Desktop (> 1024px)

## Troubleshooting

### "Connection failed" Error
- Make sure MySQL is running in XAMPP
- Check database credentials in `db.php`
- Verify the database was created with `db-setup.sql`

### Products Not Displaying
- Check that `/public/products/` folder exists
- Verify image filenames in the admin panel match actual files
- Check browser console for errors (F12 → Console tab)

### Admin Panel Not Working
- Ensure all PHP files are in the correct location
- Check that Apache is running
- Clear browser cache and refresh

### Images Not Loading
- Create `/public/products/` folder if it doesn't exist
- Upload images to this folder
- Make sure filenames match exactly (case-sensitive on some systems)

## Deployment

To deploy to shared hosting:
1. Upload all files via FTP/SFTP
2. Run the `db-setup.sql` in your hosting's phpMyAdmin
3. Update database credentials in `db.php` if needed
4. Create `/public/products/` and `/uploads/` folders via FTP
5. Visit your domain to access the store

## License

Free to use and modify for your business.

## Support

For issues or questions, review the code comments or check the troubleshooting section above.

---

Happy selling! 🎉
