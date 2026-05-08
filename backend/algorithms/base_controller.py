from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BaseAlgorithm(ABC):
    """
    Abstract Base Class for all control strategies.
    Ensures a standardized interface for system integration.
    """

    @abstractmethod
    def compute(self, process_value: float, dt: float = 1.0) -> float:
        """Calculate the control action (MV) based on the error."""
        pass

    @abstractmethod
    def reset(self) -> None:
        """Reset internal states (e.g., integral accumulation)."""
        pass

    @abstractmethod
    def get_params(self) -> List[Dict[str, Any]]:
        """Return the parameter schema for dynamic UI rendering."""
        pass

    @property
    @abstractmethod
    def setpoint(self) -> float:
        """Access the target setpoint."""
        pass

    @setpoint.setter
    @abstractmethod
    def setpoint(self, value: float):
        """Update the target setpoint."""
        pass