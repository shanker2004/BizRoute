from flask import Flask, render_template, request, jsonify
import requests
import math
from dotenv import load_dotenv
import os
import datetime
from datetime import date
import json

# Try to import MySQL, but make it optional
try:
    import mysql.connector
    MYSQL_AVAILABLE = True
except ImportError:
    MYSQL_AVAILABLE = False
    print("MySQL connector not available - database features will be disabled")

try:
    import googlemaps
    GOOGLEMAPS_AVAILABLE = True
except ImportError:
    GOOGLEMAPS_AVAILABLE = False
    print("googlemaps library not available - some features may be limited")

app = Flask(__name__)
load_dotenv()

# Try to connect to database, but don't fail if it's not available
db_config = {
    'host': 'localhost',
    'user': 'fedex',
    'password': 'BizRoute',
    'database': 'BizRoute'
}

conn = None
cursor = None
gmaps = None

if MYSQL_AVAILABLE:
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        print("✓ Database connected successfully")
    except mysql.connector.Error as err:
        print(f"⚠ Database connection failed: {err}")
        print("  App will run without database features")
        conn = None
        cursor = None

GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')
TOMTOM_API_KEY = os.getenv('TOMTOM_API_KEY')
AQICN_API_KEY = os.getenv('AQICN_API_KEY')

if GOOGLEMAPS_AVAILABLE and GOOGLE_MAPS_API_KEY:
    try:
        gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)
    except Exception as e:
        print(f"⚠ Google Maps client initialization failed: {e}")

# --- MOCK DATA STORAGE (Option 2) ---
ORDERS_FILE = 'orders.json'

def load_orders():
    if not os.path.exists(ORDERS_FILE):
        return []
    try:
        with open(ORDERS_FILE, 'r') as f:
            return json.load(f)
    except Exception:
        return []

def save_orders(orders):
    with open(ORDERS_FILE, 'w') as f:
        json.dump(orders, f, indent=4)

# Initialize storage if needed
if not os.path.exists(ORDERS_FILE):
    save_orders([
        {
            "id": 1,
            "productId": "BIZ-1001",
            "deliveryDate": date.today().isoformat(),
            "deliveryLocation": "13.0827,80.2707", # Chennai
            "created_at": str(datetime.datetime.now())
        },
        {
            "id": 2,
            "productId": "BIZ-1002",
            "deliveryDate": date.today().isoformat(),
            "deliveryLocation": "13.0475,80.2089", # T.Nagar
            "created_at": str(datetime.datetime.now())
        }
    ])
# -----------------------------------

EMISSION_FACTOR = 0.12  

def calculate_emissions(distance_km, mode='DRIVING', fuel_type='PETROL'):
    """Calculate emissions based on distance, mode, and fuel type."""
    emission_factors = {
        'DRIVING': {
            'PETROL': 180,  # g/km
            'DIESEL': 190,
            'ELECTRIC': 0,
            'CNG': 120,
        },
        'BICYCLING': 0,
        'WALKING': 0,
        'TRANSIT': {
            'PETROL': 100,
            'ELECTRIC': 0,
        },
        'TRUCK': 300,
    }

    if mode in ['BICYCLING', 'WALKING']:
        return 0

    if mode in ['DRIVING', 'TRANSIT']:
        factor = emission_factors[mode].get(fuel_type, 180 if mode == 'DRIVING' else 100)
    else:
        factor = emission_factors.get(mode, 180)

    # Convert g/km to kg/km and multiply by distance
    emissions = (factor / 1000) * distance_km
    return round(emissions, 2)

@app.route('/')
def dashboard():
    return render_template('dashboard.html', title="Dashboard")

@app.route('/routes')
def routes():
    return render_template('index1.html', title="Route Planner", google_maps_api_key=GOOGLE_MAPS_API_KEY)
@app.route('/get-routes', methods=['POST'])
def get_routes():
    data = request.json
    
    # Handle both single route and multiple routes from smart_schedule.html
    if 'routes' in data:
        results = []
        for r in data['routes']:
            start_coords = r.get('start')
            end_coords = r.get('end')
            results.extend(process_single_route(start_coords, end_coords))
        return jsonify({'routes': results})
    
    start_coords = data.get('start_coords')
    end_coords = data.get('end_coords')
    mode = data.get('mode', 'DRIVING')
    fuel_type = data.get('fuel_type', 'PETROL')
    enable_traffic = data.get('enableTraffic', False)
    
    route_details = process_single_route(start_coords, end_coords, mode, fuel_type, enable_traffic)
    return jsonify({'routes': route_details})

def process_single_route(start_coords, end_coords, mode='DRIVING', fuel_type='PETROL', enable_traffic=False):
    if not start_coords or not end_coords:
        return []

    directions_url = "https://maps.googleapis.com/maps/api/directions/json"
    
    params = {
        'origin': start_coords,
        'destination': end_coords,
        'alternatives': 'true',
        'key': GOOGLE_MAPS_API_KEY,
        'mode': mode,
    }
    
    if enable_traffic and mode == 'DRIVING':
        params['departure_time'] = 'now'
        params['traffic_model'] = 'best_guess'

    response = requests.get(directions_url, params=params)
    routes = response.json().get('routes', [])

    # Sort routes by a simple heuristic
    routes = sorted(routes, key=lambda x: (
        x['legs'][0]['distance']['value'],
        x['legs'][0]['duration']['value']
    ))

    route_details = []
    for route in routes[:3]:
        distance_km = route['legs'][0]['distance']['value'] / 1000
        duration = route['legs'][0]['duration']['text']
        emissions = calculate_emissions(distance_km, mode, fuel_type)
        route_details.append({
            'summary': route.get('summary', 'Route'),
            'distance': f"{distance_km:.2f} km",
            'duration': duration,
            'emissions': f"{emissions} kg CO₂",
            'polyline': route['overview_polyline']['points'],
        })
    return route_details
# Removed redundant calculateemissions function as it's consolidated above


@app.route('/smart_scheduling')
def smart_schedule_page():
    return render_template('smart_schedule.html', title="Smart Scheduling", google_maps_api_key=GOOGLE_MAPS_API_KEY)

@app.route('/smart_scheduling', methods=['POST'])
    
def smart_schedule():
    """Handle smart scheduling requests."""
    try:
        data = request.get_json()
        num_orders = data.get('num_orders', 0)
        priority = data.get('priority', 'medium')
        order_coords = data.get('order_coords', [])

        if not num_orders or not order_coords:
            return jsonify({'error': 'Invalid inputs'}), 400

        all_routes = []
        for order in order_coords:
            start_coords = order['start']
            end_coords = order['end']
            google_routes = get_google_routes(start_coords, end_coords)
            tomtom_routes = get_tomtom_routes(start_coords, end_coords)

            all_routes.append({
                'start_coords': start_coords,
                'end_coords': end_coords,
                'google_routes': google_routes,
                'tomtom_routes': tomtom_routes
            })

        best_routes = optimize_routes(all_routes, num_orders, priority)
        return jsonify({'best_routes': best_routes}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_google_routes(start_coords, end_coords):
    """Fetch routes from Google Maps API."""
    try:
        directions_url = f"https://maps.googleapis.com/maps/api/directions/json"
        params = {
            'origin': start_coords,
            'destination': end_coords,
            'alternatives': 'true',
            'key': GOOGLE_MAPS_API_KEY
        }
        response = requests.get(directions_url, params=params)
        if response.status_code == 200:
            return response.json().get('routes', [])
        return []
    except Exception as e:
        print(f"Google Maps API Error: {e}")
        return []

def get_tomtom_routes(start_coords, end_coords):
    """Fetch routes from TomTom API."""
    try:
        tomtom_url = f"https://api.tomtom.com/routing/1/calculateRoute/{start_coords}:{end_coords}/json"
        params = {
            'key': TOMTOM_API_KEY,
            'routeType': 'fastest',
            'traffic': 'true'
        }
        response = requests.get(tomtom_url, params=params)
        if response.status_code == 200:
            return response.json().get('routes', [])
        return []
    except Exception as e:
        print(f"TomTom API Error: {e}")
        return []

def optimize_routes(all_routes, num_orders, priority):
    """Optimize routes based on criteria."""
    best_routes = []
    for route in all_routes:
        route_data = []
        for g_route in route['google_routes'] + route['tomtom_routes']:
            distance = g_route.get('legs', [{}])[0].get('distance', {}).get('value', 0) / 1000
            duration = g_route.get('legs', [{}])[0].get('duration', {}).get('text', 'Unknown')
            emissions = calculate_emissions(distance)
            route_data.append({
                'source': 'Google' if g_route in route['google_routes'] else 'TomTom',
                'summary': g_route.get('summary', 'N/A'),
                'distance': f"{distance:.2f} km",
                'duration': duration,
                'emissions': f"{emissions} kg CO₂",
                'polyline': g_route.get('overview_polyline', {}).get('points', '')
            })

        route_details = sorted(route_data, key=lambda x: (x['distance'], x['emissions']))
        best_routes.append(route_details[:1])  
    return best_routes

@app.route('/calculate-multi-routes')
def multirouteplanner():
    return render_template('multirouteplanner.html', title="Multi-Route Planner", google_maps_api_key=GOOGLE_MAPS_API_KEY)


@app.route('/calculate-multi-routes', methods=['POST'])
def calculate_multi_routes():
    """
    Calculate and optimize routes with traffic data for multiple destinations.
    """
    try:
        data = request.get_json()
        start_location = data['start_location']
        destinations = data['destinations']

        routes = []
        for index, destination in enumerate(destinations):
            response = get_route_from_google_maps(start_location, destination)
            for route in response.get('routes', []):
                distance_km = route['legs'][0]['distance']['value'] / 1000  
                duration_traffic = route['legs'][0].get('duration_in_traffic', {}).get('text', route['legs'][0]['duration']['text'])
                emissions = calculate_emissions(distance_km)
                arrival_time = estimate_arrival_time(route['legs'][0]['duration_in_traffic']['value'] if 'duration_in_traffic' in route['legs'][0] else route['legs'][0]['duration']['value'])

                routes.append({
                    'destination': destination,
                    'distance': f"{distance_km:.2f} km",
                    'duration': duration_traffic,
                    'arrival_time': arrival_time,
                    'emissions': f"{emissions:.2f} kg CO₂",
                    'polyline': route['overview_polyline']['points']
                })

        routes = sorted(routes, key=lambda x: (float(x['distance'].split()[0]), float(x['emissions'].split()[0])))

        return jsonify({'routes': routes}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def get_route_from_google_maps(start_coords, end_coords):
    """
    Fetch route information from Google Maps API with real-time traffic data.
    """
    try:
        directions_url = "https://maps.googleapis.com/maps/api/directions/json"
        params = {
            'origin': start_coords,
            'destination': end_coords,
            'key': GOOGLE_MAPS_API_KEY,
            'departure_time': 'now', 
            'alternatives': 'true',
        }
        response = requests.get(directions_url, params=params)
        if response.status_code == 200:
            return response.json()
        else:
            raise ValueError(f"Error in Google Maps API Response: {response.status_code}")
    except Exception as e:
        print(f"Error fetching routes from Google Maps: {e}")
        return {}

# Removed redundant calculate_emissions function


def estimate_arrival_time(duration_seconds):
    """
    Estimate arrival time based on the current time and duration.
    """
    from datetime import datetime, timedelta
    current_time = datetime.now()
    arrival_time = current_time + timedelta(seconds=duration_seconds)
    return arrival_time.strftime('%I:%M %p')


@app.route('/deliveryPartner')
def dp():
    return render_template('DeliveryPartner.html', title="Real-Time Delivery Rescheduling System", google_maps_api_key=GOOGLE_MAPS_API_KEY)
    
@app.route('/client')
def client():
    return render_template('client.html', title="Real-Time Delivery Rescheduling System", google_maps_api_key=GOOGLE_MAPS_API_KEY)


@app.route('/place_order', methods=['POST'])
def place_order():
    try:
        data = request.json
        orders = load_orders()
        
        new_order = {
            "id": len(orders) + 1,
            "productId": data['productId'],
            "deliveryDate": data['deliveryDate'],
            "deliveryLocation": data['deliveryLocation'],
            "created_at": str(datetime.datetime.now())
        }
        
        orders.append(new_order)
        save_orders(orders)
        
        return jsonify({"message": "Order placed successfully (Mock Storage)!"})
    except Exception as e:
        return jsonify({"error": f"Failed to place order: {str(e)}"}), 500

# Endpoint to reschedule an order
@app.route('/reschedule_order', methods=['POST'])
def reschedule_order():
    data = request.get_json()
    order_id = data.get('orderId')
    new_date = data.get('newDate')

    if not order_id or not new_date:
        return jsonify({'message': 'Order ID and New Date are required'}), 400

    try:
        orders = load_orders()
        found = False
        for order in orders:
            if str(order['productId']) == str(order_id):
                order['deliveryDate'] = new_date
                found = True
                break
        
        if not found:
            return jsonify({'message': f'Product ID {order_id} does not exist'}), 404

        save_orders(orders)
        return jsonify({'message': f'Delivery date updated successfully for Product ID {order_id} (Mock Storage)'}), 200

    except Exception as e:
        return jsonify({'message': f'An unexpected error occurred: {str(e)}'}), 500

# Endpoint to get delivery partner routes
@app.route('/delivery-partner', methods=['GET'])
def delivery_partner():
    if not gmaps:
        return jsonify({'error': 'Google Maps client not available. Please check API key configuration.'}), 503
    
    try:
        today = date.today().isoformat()
        orders = load_orders()
        
        # Filter orders for today
        todays_orders = [o for o in orders if o['deliveryDate'] == today]
        
        if not todays_orders:
            return jsonify({'message': 'No orders found for today (Mock Storage)'}), 404
        
        delivery_locations = [order['deliveryLocation'] for order in todays_orders]
        
        # Fetch start point (current location) from the frontend
        current_location = request.args.get('currentLocation', '13.0827,80.2707')  # Default to Chennai if not provided
        
        # Calculate the best route using Google Maps API
        waypoints = delivery_locations
        directions_result = gmaps.directions(
            origin=current_location,
            destination=waypoints[-1],
            waypoints=waypoints[:-1],
            optimize_waypoints=True
        )
        
        if not directions_result:
            return jsonify({'error': 'No route found'}), 404
            
        # Parse the directions result
        route = directions_result[0]
        overview_polyline = route['overview_polyline']['points']
        legs = route['legs']
        
        route_details = {
            'overall_distance': sum(leg['distance']['value'] for leg in legs) / 1000,  # in kilometers
            'overall_time': sum(leg['duration']['value'] for leg in legs) / 60,  # in minutes
            'overall_carbon_emission': round(0.120 * (sum(leg['distance']['value'] for leg in legs) / 1000), 2),  # Approximation
            'polyline': overview_polyline,
            'markers': [{'lat': leg['start_location']['lat'], 'lng': leg['start_location']['lng']} for leg in legs]
        }
        
        detailed_points = []
        for i, order in enumerate(todays_orders):
            if i < len(legs):
                leg = legs[i]
                detailed_points.append({
                    'productId': order['productId'],
                    'estimated_time_reach': leg['duration']['text'],
                    'distance_from_origin': leg['distance']['text'],
                    'location': order['deliveryLocation']
                })
        
        return jsonify({'route_details': route_details, 'detailed_points': detailed_points})
    except Exception as e:
        return jsonify({'error': f'Failed to get delivery routes: {str(e)}'}), 500


if __name__ == '__main__':
    app.run(debug=True)
