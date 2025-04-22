export interface WeatherData {
	currentTemp: CurrentWeather['temp'];
	minTemp: DayTemp['min'];
	maxTemp: DayTemp['max'];
	city: string;
	dateString: string;
	weatherIcon: string;
	weatherClasses?: {
		weather:
			| 'Thunderstorm'
			| 'Drizzle'
			| 'Rain'
			| 'Snow'
			| 'Atmosphere'
			| 'Clear'
			| 'Clouds';
		backgroundClass: string;
		textClass: string;
		switchClass: string;
		iconColor: string;
	};
}
