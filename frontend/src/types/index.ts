export interface TelemetryData {
  pv: number;
  sp: number;
  mv: number;
  error: number;
  timestamp: string;
}

export interface ControlMetrics {
  // 时域
  overshoot: number;      // %
  settlingTime: number;   // s
  riseTime: number;       // s
  steadyStateError: number;
  // 频域 (预留)
  phaseMargin: number;    // deg
  bandwidth: number;      // Hz
  dampingRatio: number;   // ζ
}

export interface ModelConfig {
  id: string;
  name: string;
  unit: string;
  min: number;
  max: number;
}

export interface UIParam {
  id: string;
  label: string;
  type: 'slider' | 'number' | 'select' | 'text' | 'switch';
  value: any;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: { label: string; value: any }[]; // For the select type
  description?: string;
}

export interface FullSchema {
  model_params: UIParam[];
  controller_params: UIParam[];
  active_model: string;
}