from flask import Flask, render_template, request, jsonify
import requests
import math
from dotenv import load_dotenv
import os
import datetime
from datetime import date
import json

app = Flask(__name__)
load_dotenv()

# --- MOCK DATA STORAGE ---
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

# Initialize storage with realistic sample data for the demo
if not os.path.exists(ORDERS_FILE) or os.path.getsize(ORDERS_FILE) < 100:
    save_orders([
        {
            "id": 1,
            "productId": "BIZ-DEL-1042",
            "customerName": "John Doe",
            "deliveryDate": date.today().isoformat(),
            "deliveryLocation": "13.0827,80.2707", # Chennai Central
            "address": "Park Town, Chennai, Tamil Nadu 600003",
            "status": "In Transit",
            "created_at": "2024-03-20 09:15:00"
        },
        {
            "id": 2,
            "productId": "BIZ-DEL-2051",
            "customerName": "Alice Smith",
            "deliveryDate": date.today().isoformat(),
            "deliveryLocation": "13.0475,80.2089", # T.Nagar
            "address": "T. Nagar, Chennai, Tamil Nadu 600017",
            "status": "Pending",
            "created_at": "2024-03-20 10:30:00"
        },
        {
            "id": 3,
            "productId": "BIZ-DEL-3019",
            "customerName": "Global Logistics",
            "deliveryDate": date.today().isoformat(),
            "deliveryLocation": "13.0067,80.2206", # Guindy
            "address": "Guindy, Chennai, Tamil Nadu 600032",
            "status": "Pending",
            "created_at": "2024-03-20 11:45:00"
        },
        {
            "id": 4,
            "productId": "BIZ-DEL-4022",
            "customerName": "Priya Raj",
            "deliveryDate": date.today().isoformat(),
            "deliveryLocation": "12.9171,80.1923", # Tambaram
            "address": "Tambaram, Chennai, Tamil Nadu 600045",
            "status": "Optimization",
            "created_at": "2024-03-20 12:00:00"
        },
        {
            "id": 5,
            "productId": "BIZ-DEL-5088",
            "customerName": "Tech Hub",
            "deliveryDate": date.today().isoformat(),
            "deliveryLocation": "12.9806,80.2184", # Velachery
            "address": "Velachery, Chennai, Tamil Nadu 600042",
            "status": "Processing",
            "created_at": "2024-03-20 14:20:00"
        }
    ])
# -------------------------

EMISSION_FACTOR = 0.12  

def calculate_emissions(distance_km):
    return round(distance_km * EMISSION_FACTOR, 2)

@app.route('/')
def dashboard():
    return render_template('dashboard.html', title="Dashboard")

@app.route('/routes')
def routes():
    return render_template('index1.html', title="Route Planner")

@app.route('/get-routes', methods=['POST'])
def get_routes():
    data = request.json
    
    # Handle both single route and multiple routes
    if 'routes' in data:
        results = []
        for r in data['routes']:
            start_coords = r.get('start')
            end_coords = r.get('end')
            results.extend(process_single_route(start_coords, end_coords))
        return jsonify({'routes': results})
    
    start_coords = data.get('start_coords') or data.get('start')
    end_coords = data.get('end_coords') or data.get('end')
    
    route_details = process_single_route(start_coords, end_coords)
    return jsonify({'routes': route_details})

def process_single_route(start_coords, end_coords, mode='DRIVING', fuel_type='PETROL', enable_traffic=False):
    # Deterministic but realistic-looking simulation
    import hashlib
    seed_str = f"{start_coords}{end_coords}{mode}{fuel_type}"
    seed = int(hashlib.md5(seed_str.encode()).hexdigest(), 16)
    
    dist_base = (seed % 150) / 10.0 + 3.2 # 3.2km to 18.2km
    # Traffic factor
    traffic_delay = (seed % 12) if enable_traffic else 0
    dur_base = int(dist_base * 2.1 + traffic_delay + (seed % 5)) 
    
    emissions = calculate_emissions(dist_base)
    fuel_cost = round(dist_base * 0.15, 2) # Simulate 0.15 cost per km
    
    return [{
        'summary': 'BIZ-AI Optimized Path',
        'distance': f"{dist_base:.2f} km",
        'duration': f"{dur_base} mins",
        'emissions': f"{emissions} kg CO₂",
        'fuel_cost': f"${fuel_cost}",
        'optimization_status': 'Optimized',
        'polyline': "", 
    }]

@app.route('/smart_scheduling')
def smart_schedule_page():
    return render_template('smart_schedule.html', title="Smart Scheduling")

@app.route('/smart_scheduling', methods=['POST'])
def smart_schedule():
    data = request.get_json()
    order_coords = data.get('order_coords', [])
    
    best_routes = []
    for order in order_coords:
        route = process_single_route(order['start'], order['end'])
        best_routes.append(route[:1])
    
    return jsonify({'best_routes': best_routes})

@app.route('/calculate-multi-routes')
def multirouteplanner():
    return render_template('multirouteplanner.html', title="Multi-Route Planner")

@app.route('/deliveryPartner')
def dp():
    return render_template('DeliveryPartner.html', title="Delivery Partner")
    
@app.route('/client')
def client():
    return render_template('client.html', title="Client")

@app.route('/eco-balance')
def eco_balance():
    return render_template('dashboard.html', title="Eco Insights")

@app.route('/package-load')
def package_load_page():
    return render_template('package_load.html', title="Package Loading")

@app.route('/package_load', methods=['POST'])
def package_load_api():
    data = request.json
    try:
        vehicle_capacity = float(data.get('vehicle_capacity', 0))
        package_weight = float(data.get('package_weight', 0))
        num_packages = int(data.get('num_packages', 0))
        
        if package_weight <= 0 or vehicle_capacity <= 0:
            return jsonify({'error': 'Invalid weight or capacity'}), 400
            
        packages_per_vehicle = math.floor(vehicle_capacity / package_weight)
        if packages_per_vehicle == 0:
             return jsonify({'error': 'Package too heavy for vehicle'}), 400
             
        required_vehicles = math.ceil(num_packages / packages_per_vehicle)
        
        return jsonify({
            'required_vehicles': required_vehicles,
            'packages_per_vehicle': packages_per_vehicle
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/place_order', methods=['POST'])
def place_order():
    try:
        data = request.json
        orders = load_orders()
        new_order = {
            "id": len(orders) + 1,
            "productId": data.get('productId', 'BIZ-TEMP'),
            "deliveryDate": data.get('deliveryDate', date.today().isoformat()),
            "deliveryLocation": data.get('deliveryLocation', '13.0827,80.2707'),
            "created_at": str(datetime.datetime.now())
        }
        orders.append(new_order)
        save_orders(orders)
        return jsonify({"message": "Order placed successfully!"})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/reschedule_order', methods=['POST'])
def reschedule_order():
    data = request.get_json()
    order_id = data.get('orderId')
    new_date = data.get('newDate')
    orders = load_orders()
    updated = False
    for order in orders:
        if str(order.get('productId')) == str(order_id):
            order['deliveryDate'] = new_date
            updated = True
            break
    if updated:
        save_orders(orders)
        return jsonify({'message': f'Delivery date updated for {order_id}'}), 200
    return jsonify({'message': 'Order not found'}), 404

@app.route('/delivery_partner')
def delivery_partner_page():
    return render_template('DeliveryPartner.html', title="Delivery Partner")

@app.route('/delivery-partner', methods=['GET'])
def delivery_partner_api():
    today = date.today().isoformat()
    orders = load_orders()
    # Filter for today or just take the first few for the demo
    todays_orders = [o for o in orders if o.get('deliveryDate') == today]
    if not todays_orders:
        todays_orders = orders[:5]
        
    delivery_locations = [order.get('deliveryLocation') for order in todays_orders]
    route_details = {
        'overall_distance': 42.8,
        'overall_time': 85,
        'overall_carbon_emission': 5.14,
        'markers': []
    }
    for loc_str in delivery_locations:
        try:
            lat, lng = map(float, loc_str.split(','))
            route_details['markers'].append({'lat': lat, 'lng': lng})
        except: continue
            
    detailed_points = []
    for i, order in enumerate(todays_orders):
        detailed_points.append({
            'productId': order.get('productId'),
            'customerName': order.get('customerName', 'B2B Client'),
            'estimated_time_reach': f"{(i+1)*15} mins",
            'distance_from_origin': f"{(i+1)*4.5} km",
            'location': order.get('address', order.get('deliveryLocation')),
            'status': order.get('status', 'Pending')
        })
    return jsonify({'route_details': route_details, 'detailed_points': detailed_points})

@app.route('/smart_scheduling', methods=['GET', 'POST'])
def smart_scheduling():
    if request.method == 'GET':
        return render_template('smart_schedule.html', title="Smart Scheduling")
    return jsonify({'best_time': '10:00 AM', 'priority_suggestion': 'High'})

@app.route('/smart_schedule', methods=['POST'])
def smart_schedule_alias():
    return smart_scheduling()

@app.route('/get_orders', methods=['GET'])
def get_orders():
    try:
        return jsonify(load_orders())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/multi-planner')
def multi_planner():
    return render_template('multirouteplanner.html', title="Multi-Route Planner")

if __name__ == '__main__':
    app.run(debug=True, port=5001)
