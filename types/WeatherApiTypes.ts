export interface WeatherData {
	currentTemp: CurrentWeather['temp'];
	minTemp: DayTemp['min'];
	maxTemp: DayTemp['max'];
	city: string;
	country: string;
	dateString: string;
	weatherIcon: string;
	weatherType?:
		| 'Thunderstorm'
		| 'Drizzle'
		| 'Rain'
		| 'Snow'
		| 'Atmosphere'
		| 'Clear'
		| 'Clouds';
}

export interface CityResponse {
	name: string;
	lat: number;
	lon: number;
	country: string;
	state: string;
}
