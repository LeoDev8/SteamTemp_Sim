import collections
from .base_model import BasePhysicalModel

class BoilerModel(BasePhysicalModel):
    """
    Thermodynamic Process Simulation: Superheater Outlet Steam Temperature.
    
    This class models the physical relationship between desuperheating spray water 
    (Control Input) and the resulting steam temperature (Process Value). 
    It characterizes the system using a 'First-Order Plus Dead-Time' (FOPDT) model, 
    accounting for both transport delay in pipes and the massive thermal inertia 
    of the heat exchanger metal.

    Attributes:
        inertia_constant (float): The damping factor (0-1). Represents thermal mass.
        dead_time_steps (int): The number of delay cycles for desuperheating water.
        cooling_efficiency (float): The 'gain' of the desuperheater (temp drop per 1% valve).
        furnace_heat_baseline (float): The steady-state temperature without cooling.
    """

    def __init__(self, 
                 inertia_constant: float = 0.98, 
                 dead_time_steps: int = 20, 
                 cooling_efficiency: float = 0.5, 
                 initial_steam_temp: float = 540.0,
                 furnace_heat_baseline: float = 565.0):
        
        # --- System Constants (Physical Specs) ---
        self.inertia = inertia_constant
        self.dead_time = dead_time_steps
        self.gain = cooling_efficiency
        self.base_heat = furnace_heat_baseline
        self.initial_val = initial_steam_temp
        
        # --- Internal Dynamic States ---
        self._current_pv = initial_steam_temp  # The actual steam temperature state
        self._delay_buffer = collections.deque([0.0] * dead_time_steps)

    def update(self, control_input: float, disturbance: float = 0.0) -> float:
        """
        Steps the simulation forward by 1 second.
        
        Logic:
        1. Clamp input to physical valve limits (0-100%).
        2. Push command into the transport delay pipeline (Dead-time).
        3. Calculate the instantaneous heat balance (Equilibrium).
        4. Apply first-order lag to simulate the metal's heat capacity.
        """
        # 1. Input Saturation (Actuator Limits)
        safe_valve = max(0.0, min(100.0, control_input))
        
        # 2. Simulate Transport Delay (Pure Dead-time)
        self._delay_buffer.append(safe_valve)
        effective_cooling_valve = self._delay_buffer.popleft()
        
        # 3. Calculate Target Equilibrium Point
        # The temperature the steam "aims" to reach based on current cooling and furnace heat
        cooling_impact = effective_cooling_valve * self.gain
        equilibrium_point = self.base_heat - cooling_impact + disturbance
        
        # 4. First-Order Lag Equation (Thermal Inertia)
        # y(k) = a * y(k-1) + (1-a) * u(k)
        self._current_pv = (self.inertia * self._current_pv) + \
                           (1 - self.inertia) * equilibrium_point
        
        return self._current_pv

    def reset(self) -> None:
        """Restores the system to its initial thermodynamic equilibrium."""
        self._current_pv = self.initial_val
        self._delay_buffer = collections.deque([0.0] * self.dead_time)

    @property
    def current_state(self) -> float:
        """Returns the current measured steam temperature (Process Value)."""
        return self._current_pv

    def get_info(self) -> dict:
        """Returns metadata for UI rendering and system identification."""
        return {
            "model_id": "boiler_superheater_01",
            "display_name": "Steam Temperature Process",
            "unit": "°C",
            "input_name": "Attemperator Spray Valve",
            "input_unit": "%",
            "description": "FOPDT model of a thermal power plant superheater section."
        }