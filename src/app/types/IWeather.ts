export interface WeatherCondition {
  text: string;
  icon: string;
}

export interface HourlyWeather {
  time: string;
  temp_c: number;
  condition: WeatherCondition;
}

export interface DailyWeather {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    condition: WeatherCondition;
  };
  hour: HourlyWeather[];
}

export interface WeatherData {
    location: {
        name: string;
      };
  current: {
    temp_c: number;
    condition: WeatherCondition;
  };
  forecast: {
    forecastday: DailyWeather[];
  };
}

export interface Position {
    coords: {
      latitude: number;
      longitude: number;
    };
  }
