"""
Emission calculation utilities for BizRoute.
Calculates CO2 emissions based on vehicle type, fuel type, and distance.
"""

class EmissionCalculator:
    """Calculate CO2 emissions for different vehicle and fuel types."""
    
    # Emission factors in grams CO2 per kilometer
    EMISSION_FACTORS = {
        'DRIVING': {
            'PETROL': 180,
            'DIESEL': 190,
            'ELECTRIC': 0,
            'CNG': 120,
        },
        'BICYCLING': 0,
        'TRANSIT': {
            'PETROL': 100,
            'ELECTRIC': 0,
        },
        'TRUCK': 300,
    }
    
    @staticmethod
    def calculate(distance_km, mode='DRIVING', fuel_type='PETROL'):
        """
        Calculate CO2 emissions for a given distance and vehicle configuration.
        
        Args:
            distance_km (float): Distance in kilometers
            mode (str): Travel mode (DRIVING, BICYCLING, TRANSIT, TRUCK)
            fuel_type (str): Fuel type (PETROL, DIESEL, ELECTRIC, CNG)
            
        Returns:
            float: CO2 emissions in kilograms
        """
        if mode == 'BICYCLING':
            return 0.0
        
        if mode in ['DRIVING', 'TRANSIT']:
            emission_factor = EmissionCalculator.EMISSION_FACTORS[mode].get(fuel_type, 0)
        else:
            emission_factor = EmissionCalculator.EMISSION_FACTORS.get(mode, 0)
        
        # Convert from grams to kilograms
        emissions_kg = (emission_factor * distance_km) / 1000
        return round(emissions_kg, 2)
    
    @staticmethod
    def calculate_simple(distance_km, emission_rate=0.12):
        """
        Simple emission calculation using a flat rate.
        
        Args:
            distance_km (float): Distance in kilometers
            emission_rate (float): Emission rate in kg CO2 per km (default: 0.12)
            
        Returns:
            float: CO2 emissions in kilograms
        """
        return round(distance_km * emission_rate, 2)
