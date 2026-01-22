export type RouteType = 'fastest' | 'scenic' | 'efficient' | 'accessible';
export type CommunicationStyle = 'concise' | 'detailed' | 'casual';
export type AccessibilityNeed = 'visual' | 'hearing' | 'mobility';

export interface AIPreferences {
  preferredRouteType: RouteType;
  communicationStyle: CommunicationStyle;
  accessibilityNeeds: AccessibilityNeed[];
}

export interface RouteSuggestion {
  id: string;
  name: string;
  distance: number;
  duration: number;
  polyline: string;
  type: RouteType;
  accessibilityScore: number;
  trafficConditions: {
    level: 'low' | 'moderate' | 'high';
    delayInMinutes: number;
  };
  waypoints: Array<{
    location: {
      lat: number;
      lng: number;
    };
    name: string;
    type: 'pickup' | 'dropoff' | 'waypoint';
  }>;
}

export interface AIContextType {
  aiPreferences: AIPreferences;
  setAIPreferences: (prefs: AIPreferences) => void;
  suggestedRoutes: RouteSuggestion[] | undefined;
  isLoading: boolean;
  error: Error | null;
}
