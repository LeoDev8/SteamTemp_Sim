from abc import ABC, abstractmethod

class BasePhysicalModel(ABC):
    """
    Abstract Base Class for OmniControl-Studio.
    Defines the 'contract' for all physical simulations.
    """
    @abstractmethod
    def update(self, control_input: float, disturbance: float = 0.0) -> float:
        """Execute one simulation step and return the new Process Value (PV)."""
        pass

    @abstractmethod
    def reset(self):
        """Reset the model to its initial state."""
        pass
    
    @abstractmethod
    def get_params(self) -> List[Dict[str, Any]]:
        """
        Returns a list of parameter definitions for UI rendering.
        Each dict should contain: id, label, type, value, min, max, step, unit.
        """
        pass