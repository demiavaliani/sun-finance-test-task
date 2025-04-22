export interface WeatherData {
	currentTemp: CurrentWeather['temp'];
	minTemp: DayTemp['min'];
	maxTemp: DayTemp['max'];
	city: string;
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
