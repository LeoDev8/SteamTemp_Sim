from models.boiler_model import BoilerModel
from algorithms.pid_controller import PIDController

class SimulationManager:
    """
    Manages the lifecycle of simulations. 
    It 'wires' the Controller to the Physical Model.
    """
    def __init__(self):
        # Model Registry: Add new models here
        self._models = {
            "boiler": BoilerModel(),
            # "drone": BoilerModel(),
        }
        self.active_model_id = "boiler"
        
        # Initialize the PID Controller
        self.controllers = {
            "pid": PIDController(kp=6.0, ki=0.05, kd=10.0, setpoint=540.0),
        }
        self.active_controller_id = "pid"

    @property
    def active_model(self):
        return self._models[self.active_model_id]
    
    @property
    def active_controller(self):
        return self.controllers[self.active_controller_id]

    def switch_model(self, model_id: str):
        if model_id in self._models:
            self.active_model_id = model_id
            self.active_model.reset()
            return True
        return False
    
    def switch_controller(self, controller_id: str):
        if controller_id in self.controllers:
            self.active_controller_id = controller_id
            self.active_controller.reset()
            return True
        return False

    def run_pid_step(self):
        """The core control loop execution."""
        pv = self.active_model.current_state
        mv = self.active_controller.compute(pv)
        new_pv = self.active_model.update(control_input=mv)
        return {
            "pv": round(new_pv, 2),
            "mv": round(mv, 2),
            "sp": self.active_controller.setpoint
        }
    
    def get_full_schema(self):
        """Combines model and controller parameters for the UI."""
        return {
            "model_params": self.active_model.get_params(),
            "controller_params": self.active_controller.get_params(),
            "active_model": self.active_model_id,
            "active_controller": self.active_controller_id
        }

# Singleton instance to be shared across routes
sim_service = SimulationManager()