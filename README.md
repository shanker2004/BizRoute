# BizRoute: AI-Driven Real-Time RoadRoute Optimization and Emission Reduction System

## Overview

**BizRoute** is an advanced AI-driven platform designed to optimize vehicle routes for real-time business logistics and transportation. By leveraging cutting-edge APIs including TomTom, Google Maps, and AQICN, BizRoute calculates efficient routes, estimates CO₂ emissions, and promotes environmental sustainability while ensuring timely deliveries.

The platform adapts dynamically to changing traffic conditions, weather patterns, and vehicle-specific data, providing businesses with intelligent route recommendations that balance speed, efficiency, and environmental impact.

---

## 🚀 Key Features

### Smart Route Optimization
- **Multiple Route Options**: Compare routes based on distance, duration, and emissions
- **Real-Time Traffic Integration**: Dynamic routing based on current traffic conditions
- **Multi-Destination Planning**: Optimize routes for multiple stops efficiently
- **AI-Powered Recommendations**: Intelligent route selection using advanced algorithms

### Environmental Impact
- **CO₂ Emission Tracking**: Calculate emissions for different vehicle types and fuel types
- **Eco-Friendly Alternatives**: Suggest greener route options
- **Sustainability Metrics**: Track and reduce your carbon footprint

### Business Features
- **Smart Scheduling**: Optimize delivery schedules based on priority and efficiency
- **Client Management**: Track and manage client orders and deliveries
- **Delivery Partner Coordination**: Streamline communication with delivery partners
- **Real-Time Updates**: Live tracking and notifications for route changes

### User Experience
- **Interactive Map Interface**: Visualize routes with detailed overlays
- **Modern Responsive Design**: Works seamlessly on desktop and mobile devices
- **Detailed Analytics**: Comprehensive insights into route performance
- **Easy Configuration**: Simple setup with environment variables

---

## 🛠️ Technology Stack

### Backend
- **Python 3.x** - Core programming language
- **Flask 3.0** - Web framework for API and routing
- **MySQL** - Relational database for data persistence
- **RESTful APIs** - Clean API architecture

### Frontend
- **HTML5 & CSS3** - Modern web standards
- **Bootstrap 5.3** - Responsive UI framework
- **JavaScript (ES6+)** - Interactive client-side functionality
- **Leaflet.js** - Interactive mapping library

### APIs & Services
- **Google Maps API** - Route calculation and geocoding
- **TomTom API** - Traffic data and alternative routing
- **AQICN API** - Air quality and environmental data
- **OpenRouteService** - Additional routing options

---

## 📋 Prerequisites

Before you begin, ensure you have the following:

1. **Python 3.8 or higher**
2. **MySQL Server** (or PostgreSQL)
3. **API Keys** for:
   - Google Maps API
   - TomTom API
   - AQICN API

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/BizRoute.git
cd BizRoute
```

### 2. Create Virtual Environment

```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

The `.env` file is already included with the necessary API keys. If you need to update them:

```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
TOMTOM_API_KEY=your_tomtom_api_key
AQICN_API_KEY=your_aqicn_api_key
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=bizroute
FLASK_ENV=development
SECRET_KEY=your_secret_key
```

### 5. Set Up Database

```sql
CREATE DATABASE bizroute;
USE bizroute;

CREATE TABLE clientOrders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    productId VARCHAR(100) NOT NULL,
    deliveryDate DATE NOT NULL,
    deliveryLocation VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Run the Application

```bash
python app.py
```

The application will be available at `http://localhost:5000`

---

## 📖 Usage

### Route Planning

1. Navigate to the **Route Planner** from the dashboard
2. Enter your start and end locations
3. Select vehicle type and fuel type
4. Choose whether to include real-time traffic data
5. View multiple route options with distance, duration, and emission data
6. Select the best route for your needs

### Multi-Destination Planning

1. Go to **Multi-Route Planner**
2. Enter your starting location
3. Add multiple destination addresses
4. The system will optimize the route order
5. View comprehensive route details for all stops

### Smart Scheduling

1. Access **Smart Scheduling** feature
2. Input number of orders and priority level
3. Enter coordinates for each delivery
4. Get optimized schedule recommendations
5. View best routes considering traffic and priority

### Client & Delivery Management

1. **Client Portal**: Place orders with delivery dates and locations
2. **Delivery Partner Portal**: View optimized routes for today's deliveries
3. **Rescheduling**: Update delivery dates as needed
4. **Real-Time Tracking**: Monitor delivery progress

---

## 🌍 API Endpoints

### Route Calculation
- `POST /get-routes` - Calculate routes between two points
- `POST /calculate-multi-routes` - Calculate multi-destination routes

### Scheduling
- `POST /smart_scheduling` - Get smart scheduling recommendations

### Delivery Management
- `POST /place_order` - Place a new delivery order
- `POST /reschedule_order` - Reschedule an existing order
- `GET /delivery-partner` - Get delivery partner routes

---

## 🎨 Features in Detail

### Emission Calculation

BizRoute calculates CO₂ emissions based on:
- **Vehicle Type**: Car, Truck, Motorcycle, Bicycle
- **Fuel Type**: Petrol, Diesel, Electric, CNG
- **Distance**: Actual route distance in kilometers

Emission factors (g CO₂/km):
- **Car**: Petrol (180), Diesel (190), Electric (0), CNG (120)
- **Truck**: 300
- **Motorcycle**: Petrol (55), Diesel (70), Electric (20)
- **Bicycle**: 0

### Route Optimization Algorithm

The system compares routes based on:
1. Total distance
2. Estimated travel time (with traffic)
3. CO₂ emissions
4. User preferences (fastest, shortest, eco-friendly)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Authors

- **Development Team** - Initial work and ongoing maintenance

---

## 🙏 Acknowledgments

- Google Maps Platform for routing services
- TomTom for real-time traffic data
- AQICN for air quality information
- Bootstrap team for the UI framework
- Flask community for the excellent web framework

---

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

## 🗺️ Roadmap

- [ ] Machine learning-based route prediction
- [ ] Mobile application (iOS/Android)
- [ ] Advanced analytics dashboard
- [ ] Integration with fleet management systems
- [ ] Real-time driver communication
- [ ] Weather-based route adjustments
- [ ] Historical route analysis
- [ ] API rate limiting and caching

---

**Built with ❤️ for sustainable and efficient logistics**
