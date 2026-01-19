
import {
    generateWeatherForecastSchema,
    generateLiveBlogPostingSchema,
    generateFAQSchema
} from '../services/seoSchemaService';
import { WeatherData } from '../types';

// Mock Data for Istanbul
const mockData: WeatherData = {
    currentTemp: 18.5,
    feelsLike: 17.0,
    condition: "Parçalı Bulutlu",
    humidity: 60,
    windSpeed: 15,
    high: 20,
    low: 15,
    daily: Array(15).fill({
        day: "Pazartesi",
        icon: "Sun",
        high: 22,
        low: 16,
        condition: "Güneşli",
        rainProb: 0
    }),
    hourly: []
};

console.log("--- LIVE BLOG SCHEMA ---");
console.log(JSON.stringify(generateLiveBlogPostingSchema("İstanbul", mockData), null, 2));

console.log("\n--- FORECAST SCHEMA (Checking Wikidata) ---");
console.log(JSON.stringify(generateWeatherForecastSchema(mockData, "İstanbul"), null, 2));
