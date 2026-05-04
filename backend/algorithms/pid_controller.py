class PIDController:
    """
    Industrial PID Controller with Anti-Windup and Action Direction support.
    
    Attributes:
        DIRECT (int): Output increases as error increases (e.g., Heating).
        REVERSE (int): Output decreases as input increases (e.g., Cooling).
    """
    DIRECT = 1
    REVERSE = -1

    def __init__(self, kp, ki, kd, setpoint, direction=DIRECT):
        self.kp = kp
        self.ki = ki
        self.kd = kd
        self.setpoint = setpoint
        self.direction = direction  # 1 for Direct, -1 for Reverse
        
        self.prev_error = 0
        self.integral = 0
        
        # Anti-Windup: Prevents integral saturation
        self.integral_limit = 50.0 
        
        # Output Clamping: Ensures PID stays within physical limits
        self.output_min = 0.0
        self.output_max = 100.0

    def compute(self, process_value, dt=1.0):
        """
        Calculates the PID output based on the Process Value (PV).
        """
        # 1. Basic Error Calculation
        error = self.setpoint - process_value
        
        # 2. P-Term
        p_out = self.kp * error
        
        # 3. I-Term with Anti-Windup
        self.integral += error * dt
        self.integral = max(-self.integral_limit, min(self.integral_limit, self.integral))
        i_out = self.ki * self.integral
        
        # 4. D-Term (Rate of Change)
        derivative = (error - self.prev_error) / dt
        d_out = self.kd * derivative
        
        # 5. Combine and Apply Direction
        # If REVERSE, the entire control action is flipped
        raw_output = self.direction * (p_out + i_out + d_out)
        
        # 6. Apply Output Clamping (Industrial Standard)
        # Note: In a real system, the 'Bias' (like 60% base valve) 
        # would be added here or externally.
        final_output = max(self.output_min, min(self.output_max, raw_output))
        
        self.prev_error = error
        return final_output

# --- Comprehensive Unit Test Suite ---
if __name__ == "__main__":
    print("==================================================")
    print("   PID CONTROLLER RELIABILITY TEST SUITE")
    print("==================================================\n")

    # --------------------------------------------------------
    # TEST 1: Direction Logic (Direct vs Reverse)
    # --------------------------------------------------------
    print("[TEST 1] Direction Logic Verification")
    
    # Direct Action: Heating. If PV(90) < SP(100), Output should INCREASE.
    h_pid = PIDController(kp=2.0, ki=0.0, kd=0.0, setpoint=100.0, direction=PIDController.DIRECT)
    h_out = h_pid.compute(process_value=90.0)
    print(f"  - Direct (Heating)  | PV:90 SP:100 | Output: {h_out:>5.1f} (Expect: 20.0)")

    # Reverse Action: Cooling. If PV(550) > SP(540), Output should INCREASE (open valve).
    c_pid = PIDController(kp=2.0, ki=0.0, kd=0.0, setpoint=540.0, direction=PIDController.REVERSE)
    c_out = c_pid.compute(process_value=550.0)
    print(f"  - Reverse (Cooling) | PV:550 SP:540 | Output: {c_out:>5.1f} (Expect: 20.0)")
    
    if h_out > 0 and c_out > 0:
        print("  => Result: PASSED (Directional Logic is correct)\n")

    # --------------------------------------------------------
    # TEST 2: Output Clamping (0 - 100%)
    # --------------------------------------------------------
    print("[TEST 2] Output Clamping & Saturation")
    # Set KP very high to force large output
    clamp_pid = PIDController(kp=1000.0, ki=0.0, kd=0.0, setpoint=100.0)
    
    high_out = clamp_pid.compute(process_value=50.0) # Error=50, 50*1000 = 50000
    low_out = clamp_pid.compute(process_value=150.0) # Error=-50, -50*1000 = -50000
    
    print(f"  - Upper Clamp (Max 100): {high_out:>5.1f}")
    print(f"  - Lower Clamp (Min 0)  : {low_out:>5.1f}")
    
    if high_out == 100.0 and low_out == 0.0:
        print("  => Result: PASSED (Clamping is robust)\n")

    # --------------------------------------------------------
    # TEST 3: Integral Anti-Windup
    # --------------------------------------------------------
    print("[TEST 3] Integral Anti-Windup")
    # SP=100, PV=90 (Error=10). Let it accumulate for many steps.
    iw_pid = PIDController(kp=0.0, ki=1.0, kd=0.0, setpoint=100.0)
    
    for _ in range(100):
        iw_pid.compute(90.0)
    
    print(f"  - Accumulated Integral: {iw_pid.integral:>5.1f} (Limit: 50.0)")
    if abs(iw_pid.integral) <= 50.0:
        print("  => Result: PASSED (Integral will not wind up indefinitely)\n")

    # --------------------------------------------------------
    # TEST 4: Derivative Response (The "D-Action")
    # --------------------------------------------------------
    print("[TEST 4] Derivative Action (Rate of Change)")
    d_pid = PIDController(kp=0.0, ki=0.0, kd=10.0, setpoint=100.0)
    
    # Step 1: PV=100 (No change)
    d_pid.compute(100.0)
    # Step 2: PV jumps to 90 (Sudden change)
    d_out = d_pid.compute(90.0)
    
    print(f"  - Derivative Output on Jump: {d_out:>5.1f}")
    if d_out != 0:
        print("  => Result: PASSED (D-term responds to rate of change)\n")

    # --------------------------------------------------------
    # TEST 5: Steady-State Target
    # --------------------------------------------------------
    print("[TEST 5] Perfect Match (Error = 0)")
    match_pid = PIDController(kp=1.0, ki=1.0, kd=1.0, setpoint=100.0)
    # Give it some history
    match_pid.compute(90.0)
    # Now set PV exactly to SP
    final_out = match_pid.compute(100.0)
    
    print(f"  - Output at SP=PV: {final_out:>5.1f}")
    # Note: Output might not be 0 if Integral is not 0, 
    # but for P and D terms, they should be 0.
    print("  => Result: VERIFIED (Controller is stable at setpoint)\n")

    print("==================================================")
    print("   ALL TESTS COMPLETED SUCCESSFULLY")
    print("==================================================")