import { 
  PieChart, 
  TrendingUp, 
  Zap, 
  Gift, 
  Target, 
  BarChart4
} from 'lucide-react';

export interface GameInfo {
  id: string;
  name: string;
  desc: string;
  icon: any;
  payout: string;
  longDesc: string;
  rules: string[];
}

export const GAMES_DATA: Record<string, GameInfo> = {
  'market-spin': {
    id: 'market-spin',
    name: '🎯 Market Spin',
    desc: 'La ruleta de la fortuna de AlphaTrade',
    icon: PieChart,
    payout: '2x - 5x',
    longDesc: 'Gira la ruleta y multiplica tu capital. Selecciona Rojo o Negro para duplicar, o arriésgate al Verde para multiplicar x5 tu inversión inicial.',
    rules: ['Multiplicador x2 en Rojo/Negro', 'Multiplicador x5 en Verde', 'Animación de giro real']
  },
  'price-prediction': {
    id: 'price-prediction',
    name: '📈 Price Prediction',
    desc: 'Predice si el mercado sube o baja',
    icon: TrendingUp,
    payout: '1.3x - 2.5x',
    longDesc: 'Analiza la tendencia actual y predice si el precio subirá o bajará en el próximo intervalo de tiempo.',
    rules: ['Usa balance de juegos', 'Puede ganar o perder', 'Riesgo variable']
  },
  'trade-rush': {
    id: 'trade-rush',
    name: '🚀 Trade Rush',
    desc: 'Retírate antes del crash y gana más',
    icon: Zap,
    payout: 'Variable',
    longDesc: 'El multiplicador sube rápidamente. Debes establecer tu objetivo y retirarte antes de que el mercado sufra un colapso.',
    rules: ['Usa balance de juegos', 'Puede ganar o perder', 'Riesgo variable']
  },
  'reward-box': {
    id: 'reward-box',
    name: '🎁 Reward Box',
    desc: 'Abre una caja y descubre tu premio',
    icon: Gift,
    payout: 'Hasta 5x',
    longDesc: 'Selecciona una caja misteriosa. Puedes triplicar tu inversión o encontrar una caja vacía. La suerte es el factor clave.',
    rules: ['Usa balance de juegos', 'Puede ganar o perder', 'Riesgo variable']
  },
  'quick-trade': {
    id: 'quick-trade',
    name: '⚡ Quick Trade',
    desc: 'Elige el nivel de riesgo y gana',
    icon: Target,
    payout: '1.3x - 2.5x',
    longDesc: 'Selecciona tu nivel de exposición al riesgo. A mayor riesgo, mayor es la recompensa potencial en cada operación.',
    rules: ['Usa balance de juegos', 'Puede ganar o perder', 'Riesgo variable']
  },
  'candle-challenge': {
    id: 'candle-challenge',
    name: '📊 Candle Challenge',
    desc: 'Predice el comportamiento de la vela',
    icon: BarChart4,
    payout: '1.3x - 2.5x',
    longDesc: 'Observa la formación de la vela japonesa actual y predice si cerrará en verde (alcista) o rojo (bajista).',
    rules: ['Usa balance de juegos', 'Puede ganar o perder', 'Riesgo variable']
  }
};
