import json
import os
import datetime
from datetime import date

ORDERS_FILE = 'orders.json'

SAMPLE_DATA = [
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
    },
    {
        "id": 3,
        "productId": "BIZ-1003",
        "deliveryDate": date.today().isoformat(),
        "deliveryLocation": "13.0067,80.2206", # Guindy
        "created_at": str(datetime.datetime.now())
    },
    {
        "id": 4,
        "productId": "BIZ-1004",
        "deliveryDate": (date.today() + datetime.timedelta(days=1)).isoformat(),
        "deliveryLocation": "12.9716,77.5946", # Bangalore
        "created_at": str(datetime.datetime.now())
    }
]

def seed_json():
    print(f"Seeding {ORDERS_FILE}...")
    with open(ORDERS_FILE, 'w') as f:
        json.dump(SAMPLE_DATA, f, indent=4)
    print("Successfully seeded orders.json with 4 sample orders.")

if __name__ == "__main__":
    seed_json()
