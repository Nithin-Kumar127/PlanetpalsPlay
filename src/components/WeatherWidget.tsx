import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cloud, Sun, CloudRain, CloudSnow, MapPin, Thermometer, Droplets, Wind, Eye, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  feelsLike: number;
  description: string;
}

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock weather data for demo purposes
  const mockWeatherData: WeatherData[] = [
    {
      location: "New York City, NY, USA",
      temperature: 22,
      condition: "Partly Cloudy",
      humidity: 65,
      windSpeed: 12,
      visibility: 10,
      feelsLike: 24,
      description: "A pleasant day with some clouds"
    },
    {
      location: "London, England, UK",
      temperature: 15,
      condition: "Rainy",
      humidity: 85,
      windSpeed: 8,
      visibility: 6,
      feelsLike: 13,
      description: "Light rain throughout the day"
    },
    {
      location: "Tokyo, Kanto, Japan",
      temperature: 28,
      condition: "Sunny",
      humidity: 55,
      windSpeed: 5,
      visibility: 15,
      feelsLike: 31,
      description: "Clear skies and warm weather"
    },
    {
      location: "Sydney, NSW, Australia",
      temperature: 18,
      condition: "Cloudy",
      humidity: 70,
      windSpeed: 15,
      visibility: 8,
      feelsLike: 16,
      description: "Overcast with cool temperatures"
    },
    {
      location: "Mumbai, Maharashtra, India",
      temperature: 32,
      condition: "Hot",
      humidity: 78,
      windSpeed: 3,
      visibility: 12,
      feelsLike: 38,
      description: "Hot and humid conditions"
    },
    {
      location: "Chennai, Tamil Nadu, India",
      temperature: 34,
      condition: "Hot",
      humidity: 82,
      windSpeed: 6,
      visibility: 10,
      feelsLike: 39,
      description: "Hot and humid coastal weather"
    },
    {
      location: "Tambaram, Chennai, Tamil Nadu",
      temperature: 33,
      condition: "Partly Cloudy",
      humidity: 75,
      windSpeed: 8,
      visibility: 12,
      feelsLike: 37,
      description: "Warm suburban weather with some clouds"
    }
  ];

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
      case 'hot':
        return Sun;
      case 'rainy':
      case 'rain':
        return CloudRain;
      case 'snowy':
      case 'snow':
        return CloudSnow;
      case 'cloudy':
      case 'partly cloudy':
      case 'overcast':
      default:
        return Cloud;
    }
  };

  const getWeatherColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
      case 'hot':
        return 'text-yellow-500';
      case 'rainy':
      case 'rain':
        return 'text-blue-500';
      case 'snowy':
      case 'snow':
        return 'text-blue-200';
      case 'cloudy':
      case 'partly cloudy':
      case 'overcast':
      default:
        return 'text-gray-500';
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp >= 30) return 'text-red-500';
    if (temp >= 20) return 'text-orange-500';
    if (temp >= 10) return 'text-green-500';
    return 'text-blue-500';
  };

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call with random mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      const randomWeather = mockWeatherData[Math.floor(Math.random() * mockWeatherData.length)];
      setWeather(randomWeather);
      
      toast({
        title: "Weather Updated!",
        description: `Current weather for ${randomWeather.location}`,
      });
    } catch (err) {
      setError('Failed to fetch weather data');
      toast({
        title: "Weather Error",
        description: "Could not fetch current weather data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // In a real app, you would use the coordinates to fetch weather
        // For demo, we'll just use mock data
        await fetchWeather();
      },
      (error) => {
        setError('Location access denied. Showing sample weather data.');
        fetchWeather(); // Show mock data anyway
      }
    );
  };

  useEffect(() => {
    // Auto-fetch weather on component mount
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Fetching weather data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error && !weather) {
    return (
      <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
        <CardContent className="p-6 text-center">
          <Cloud className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-red-600 mb-3">{error}</p>
          <Button size="sm" onClick={requestLocation} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  const WeatherIcon = getWeatherIcon(weather.condition);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-blue-600" />
            Current Weather
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={fetchWeather}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Weather Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-full bg-white/50 ${getWeatherColor(weather.condition)}`}>
              <WeatherIcon className="h-8 w-8" />
            </div>
            <div>
              <div className={`text-3xl font-bold ${getTemperatureColor(weather.temperature)}`}>
                {weather.temperature}°C
              </div>
              <p className="text-sm text-muted-foreground">{weather.condition}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium text-blue-800">{weather.location}</p>
            <p className="text-xs text-muted-foreground">Feels like {weather.feelsLike}°C</p>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-white/30 rounded-lg">
            <Droplets className="h-4 w-4 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Humidity</p>
            <p className="font-semibold text-sm">{weather.humidity}%</p>
          </div>
          <div className="text-center p-2 bg-white/30 rounded-lg">
            <Wind className="h-4 w-4 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Wind</p>
            <p className="font-semibold text-sm">{weather.windSpeed} km/h</p>
          </div>
          <div className="text-center p-2 bg-white/30 rounded-lg">
            <Eye className="h-4 w-4 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Visibility</p>
            <p className="font-semibold text-sm">{weather.visibility} km</p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white/30 rounded-lg p-3">
          <p className="text-sm text-center text-blue-800">{weather.description}</p>
        </div>

        {/* Climate Connection */}
        <div className="bg-gradient-to-r from-nature-primary/10 to-nature-secondary/10 rounded-lg p-3 border border-nature-primary/20">
          <div className="flex items-center mb-2">
            <Thermometer className="h-4 w-4 text-nature-primary mr-2" />
            <span className="text-sm font-medium text-nature-primary">Climate Impact</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Weather patterns are changing due to climate change. Learn how to help protect our planet!
          </p>
        </div>

        {/* Location Button */}
        <Button 
          size="sm" 
          variant="outline" 
          onClick={requestLocation}
          className="w-full"
        >
          <MapPin className="h-4 w-4 mr-2" />
          Update Location
        </Button>
      </CardContent>
    </Card>
  );
};