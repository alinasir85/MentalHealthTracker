export interface User {
    id: string;
    email: string;
    name: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface AuthContextType extends AuthState {
    login: (response: any) => Promise<void>;
    logout: () => void;
}

export interface ChartDataPoint {
    date: string;
    mood: number;
    anxiety: number;
    stress: number;
    sleep: number;
}

export interface WebSocketMessage {
    type: 'NEW_LOG';
    data: {
        id: number;
        userId: string;
        date: string;
        moodRating: number[];
        anxietyLevel: string;
        stressLevel: string;
        sleepHours: string;
    };
}

export enum SleepQuality {
    Poor = "poor",
    Fair = "fair",
    Good = "good",
    Excellent = "excellent",
}

export enum ActivityType {
    Gym = "gym",
    Running = "running",
    Cycling = "cycling",
    Swimming = "swimming",
    Walking = "walking",
    Yoga = "yoga",
    Other = "other",
}

export interface MentalHealthFormData {
    moodRating: number
    anxietyLevel: string
    sleepHours: string
    sleepQuality: SleepQuality | ""
    sleepDisturbances: string[]
    physicalActivityType: ActivityType | ""
    physicalActivityDuration: string
    socialInteractions: string
    stressLevel: string
    symptoms: string
}

export interface ChartDataPoint {
    date: string
    mood: number
    anxiety: number
    stress: number
    sleep: number
}

export const ANXIETY_LEVELS = [
    {value: "1", label: "Low"},
    {value: "2", label: "Mild"},
    {value: "3", label: "Moderate"},
    {value: "4", label: "High"},
    {value: "5", label: "Severe"},
]

export const SOCIAL_LEVELS = [
    {value: "1", label: "None"},
    {value: "2", label: "Limited"},
    {value: "3", label: "Moderate"},
    {value: "4", label: "Active"},
    {value: "5", label: "Very Active"},
]

export const STRESS_LEVELS = [
    {value: "1", label: "Low"},
    {value: "2", label: "Mild"},
    {value: "3", label: "Moderate"},
    {value: "4", label: "High"},
    {value: "5", label: "Severe"},
]

export const SLEEP_DISTURBANCES = [
    "Difficulty falling asleep",
    "Waking up during night",
    "Early morning awakening",
    "Nightmares",
    "Sleep talking/walking",
]

export type TimeRange = "week" | "month" | "3months"

export const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001';
export const WS_URL = import.meta.env.VITE_REACT_APP_WS_URL || 'ws://localhost:3001';
