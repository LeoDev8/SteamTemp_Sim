import collections
import time

class SteamSystem:
    """
    Physical simulation of a power plant steam temperature system.
    Models the 'High Inertia' and 'Long Dead-Time' characteristics.
    """
    def __init__(self, 
                 base_furnace_temp=565.0,   # Unit: Celsius
                 thermal_inertia=0.98,      # Factor between 0 and 1
                 delay_seconds=20,          # Pure dead-time in seconds
                 cooling_coeff=0.4,         # Efficiency of the spray water
                 init_temp=540.0,           
                 init_sp=540.0,             
                 init_valve=0.0             # Initial valve position (0-100%)
                 ):
        # 1. Physics & Environment Parameters
        self.base_furnace_temp = base_furnace_temp
        self.inertia = thermal_inertia
        self.cooling_coeff = cooling_coeff
        
        # 2. Operational State (Setpoint and Process Value)
        self.setpoint = init_sp             
        self.current_temp = init_temp       
        
        # 3. Dead-Time Buffer (Simulates water travel time in pipes)
        self.delay_buffer = collections.deque([init_valve] * delay_seconds)

    def set_new_target(self, new_sp):
        """Updates the Target Setpoint (SP) dynamically."""
        self.setpoint = new_sp
        print(f"\n>>> [System Command] Target Setpoint (SP) updated to: {self.setpoint} C")

    def update(self, valve_opening, disturbance=0.0):
        """
        Calculates the physics of the system for one time step.
        :param valve_opening: The raw command from operator or PID (0-100)
        :param disturbance: External thermal fluctuations
        """
        # --- Actuator Saturation Logic ---
        # Ensures valve opening is physically constrained between 0% and 100%
        actual_valve = max(0.0, min(100.0, valve_opening))
        
        # A. Simulate Pure Dead-Time (Transport Delay)
        self.delay_buffer.append(actual_valve)
        effective_valve = self.delay_buffer.popleft()
        
        # B. Calculate Cooling Effect
        cooling_effect = effective_valve * self.cooling_coeff
        
        # C. Calculate Instantaneous Equilibrium Point
        # The balance point the temperature is "trying" to reach
        equilibrium_point = self.base_furnace_temp - cooling_effect + disturbance
        
        # D. First-Order Lag (Inertia Simulation)
        # Discrete-time implementation: y(k) = a*y(k-1) + (1-a)*u(k)
        self.current_temp = (self.inertia * self.current_temp + 
                             (1 - self.inertia) * equilibrium_point)
        
        return self.current_temp, actual_valve

# --- Standard Test Block (Operator Simulation) ---
if __name__ == "__main__":
    boiler = SteamSystem(base_furnace_temp=565.0, delay_seconds=20, cooling_coeff=0.4)
    print("--- Starting Physics Model Test (Manual Operation) ---")
    
    current_valve = 0.0 
    for t in range(150):
        if t == 10: current_valve = 60.0  # Open spray valve
        if t == 80: boiler.set_new_target(535.0) # Lower SP
        if t == 100: current_valve = 80.0 # Increase spray further
        
        temp, valve = boiler.update(current_valve)
        bar = ">".rjust(int(temp - 520) * 2, "-")
        print(f"Time:{t:3d}s | Valve:{valve:3.0f}% | Temp:{temp:.2f}C | {bar}")
        time.sleep(0.5)