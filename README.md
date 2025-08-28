# SIMGEAR - Gym Equipment E-Commerce Platform

SIMGEAR is a comprehensive e-commerce platform specializing in high-quality fitness equipment, gym accessories, machines, and athletic apparel.

## 🏋️‍♂️ Project Overview

SIMGEAR is designed to provide a seamless shopping experience for fitness enthusiasts, offering a wide range of products from workout equipment to athletic wear. The platform features a responsive design, intuitive navigation, and secure checkout process.

## 🚀 Features

- **User Management**
  - Secure user authentication
  - Profile management
  - Order history tracking
  - Wishlist functionality

- **Product Management**
  - Comprehensive product catalog
  - Category-based navigation
  - Advanced search functionality
  - Real-time stock management

- **Shopping Experience**
  - Interactive shopping cart
  - Secure checkout process
  - Multiple payment methods
  - Order tracking

- **Admin Features**
  - Product inventory management
  - Order management
  - User account management
  - Stock status updates

## 🛠 Technical Stack

- **Frontend**
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - Responsive Design

- **Database Design**
  - Oracle SQL
  - Optimized queries with indexes
  - Relational database structure

## ⚙️ Requirements

- **Development Environment**
  - Visual Studio Code or any modern web browser
  - Oracle Database 19c or higher
  - Web server (e.g., Apache, Live Server VS Code extension)

- **Browser Requirements**
  - Modern web browser with JavaScript enabled
  - Minimum screen resolution: 320px (mobile) to 1920px (desktop)

## 🚦 Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/bodzzzzz/SIMGEAR.git
   cd SIMGEAR
   ```

2. **Database Setup**
   - Install Oracle Database 19c or higher
   - Run the SQL scripts in the following order:
     1. Create tables (tables.sql)
     2. Create indexes (indexes.sql)
     3. Insert initial data (data.sql)

3. **Web Server Setup**
   - Using VS Code:
     1. Install "Live Server" extension
     2. Right-click on index.html
     3. Select "Open with Live Server"
   - Using Apache:
     1. Copy project files to web root directory
     2. Configure virtual host if needed
     3. Access via localhost

4. **Configuration**
   - Update database connection settings if needed
   - Verify file paths in HTML/JavaScript files
   - Check image references in CSS files

## 📂 Project Structure

```
├── assets/              # Images and media files
├── pages/              # HTML pages
│   ├── index.html      # Home page
│   ├── login.html      # Authentication
│   ├── allProducts.html # All products page
│   ├── accessories.html # Gym accessories
│   ├── machines.html   # Gym machines
│   ├── apparel.html    # Athletic apparel
│   ├── Checkout.html   # Checkout process
│   ├── profile.html    # User profile
│   └── admin/          # Admin pages
│       ├── AdminHomepage.html
│       ├── Add-Update_Products.html
│       └── OrderManagement.html
├── scripts/            # JavaScript files
├── styles/            # CSS stylesheets
└── Documentation/     # Project documentation
    ├── E-Commerce Requirements for Exporting Gym Equipment.pdf
    ├── Gym E-commerce Use Cases.pdf
    └── Gym Equipment E-Commerce User Flow.png
```

## 💡 Key Features

1. **Responsive Design**
   - Mobile-first approach
   - Cross-browser compatibility
   - Adaptive layouts

2. **User Experience**
   - Intuitive navigation
   - Quick product search
   - Streamlined checkout

3. **Security**
   - Secure authentication
   - Protected user data
   - Safe payment processing

## 🚀 Performance

- Fast loading times (<3 seconds)
- Optimized images and assets
- Efficient database queries
- Scalable architecture

## 👥 Team Members

- Abdelrahman Moamen Mohamed 
- Ahmed Hamza Helmy 
- Youssef Al-Moataz Bellah Mohamed 
- Yassin Ramy Mohamed 
- Yassin Hassan Yassin 

## 📝 Documentation

Detailed documentation is available in the Documentation folder:
- E-Commerce Requirements
- Use Cases
- User Flow Diagrams
- Database Schema

## 🔒 Security Features

- Password encryption
- Secure session management
- Protected admin routes
- Data validation

## 📱 Responsive Design

The website is fully responsive and tested across:
- Desktop browsers
- Tablets
- Mobile devices

## 🌐 Browser Support

- Google Chrome
- Mozilla Firefox
- Safari
- Microsoft Edge

## 📖 License

© 2025 SIMGEAR. All rights reserved.
