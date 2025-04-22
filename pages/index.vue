<template>
	<div class="flex justify-center items-center h-screen">
		<WeatherModal :weatherData="weatherData" @unit-changed="onUnitChanged" />
	</div>
</template>

<script lang="ts" setup>
	const weatherData = ref<WeatherData>({
		currentTemp: 0,
		minTemp: 0,
		maxTemp: 0,
		city: 'Riga, LV',
		dateString: '',
		weatherIcon: '',
		weatherClasses: undefined,
	});

	const tempUnit = ref('metric');

	const weatherClassesMap: Array<WeatherData['weatherClasses']> = [
		{
			weather: 'Thunderstorm',
			backgroundClass: 'from-[#708090] to-[#483D8B]',
			textClass: 'text-white',
			switchClass: 'before:bg-[#B0E0E6]',
			iconColor: 'white',
		},
		{
			weather: 'Drizzle',
			backgroundClass: 'from-[#87CEFA] to-[#B0C4DE]',
			textClass: 'text-white',
			switchClass: 'before:bg-[#B0E0E6]',
			iconColor: 'white',
		},
		{
			weather: 'Rain',
			backgroundClass: 'from-[#87CEFA] to-[#B0C4DE]',
			textClass: 'text-white',
			switchClass: 'before:bg-[#B0E0E6]',
			iconColor: 'white',
		},
		{
			weather: 'Snow',
			backgroundClass: 'from-[#F5F5F5] to-[#B0C4DE]',
			textClass: 'text-[#B0C4DE]',
			switchClass: 'before:bg-[#B0C4DE]',
			iconColor: '#B0C4DE',
		},
		{
			weather: 'Atmosphere',
			backgroundClass: 'from-[#B0E0E6] to-[#D3D3D3]',
			textClass: 'text-white',
			switchClass: 'before:bg-[#B0C4DE]',
			iconColor: 'white',
		},
		{
			weather: 'Clear',
			backgroundClass: 'from-[#FFF9B0] to-[#F5A691]',
			textClass: 'text-[#F7A668]',
			switchClass: 'before:bg-[#F7A668]',
			iconColor: '#F7A668',
		},
		{
			weather: 'Clouds',
			backgroundClass: 'from-[#F5F5F5] to-[#B0C4DE]',
			textClass: 'text-[#B0C4DE]',
			switchClass: 'before:bg-[#B0C4DE]',
			iconColor: '#B0C4DE',
		},
	];

	const dataExistsInSession = () => {
		const storage = sessionStorage.getItem(`weather-data-${tempUnit.value}`);

		return Boolean(storage);
	};

	const updateSessionStorage = () => {
		sessionStorage.setItem(
			`weather-data-${tempUnit.value}`,
			JSON.stringify(weatherData.value)
		);
	};

	const getDateString = (currentDate: number) => {
		const options: Intl.DateTimeFormatOptions = {
			weekday: 'long',
			month: '2-digit',
			day: '2-digit',
		};

		const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(
			currentDate * 1000
		);

		const weekday = parts.find((item) => item.type == 'weekday')?.value;
		const day = parts.find((item) => item.type == 'day')?.value;
		const month = parts.find((item) => item.type == 'month')?.value;

		return `${weekday}, ${day}.${month}`;
	};

	const updateWeatherDataFromSession = () => {
		const storage = sessionStorage.getItem(`weather-data-${tempUnit.value}`);

		if (storage) {
			weatherData.value = JSON.parse(storage);
		}
	};

	const updateWeatherDataFromApi = (weatherObject: OneCallResponse) => {
		weatherData.value.currentTemp = weatherObject.current.temp;
		weatherData.value.minTemp = weatherObject.daily[0].temp.min;
		weatherData.value.maxTemp = weatherObject.daily[0].temp.max;
		weatherData.value.dateString = getDateString(weatherObject.current.dt);
		weatherData.value.weatherIcon = weatherObject.current.weather[0].icon;
		weatherData.value.weatherClasses = weatherClassesMap.find(
			(item) => item?.weather === weatherObject.current.weather[0].main
		);
	};

	const weatherApiResponse = async () => {
		const response = await fetch(
			`https://api.openweathermap.org/data/3.0/onecall?lat=56.9727164&lon=23.7886979&units=${tempUnit.value}&exclude=minutely,hourly,alerts&appid=5796abbde9106b7da4febfae8c44c232`
		);

		return response.json();
	};

	const checkWeather = async () => {
		if (dataExistsInSession()) {
			updateWeatherDataFromSession();
			return;
		}

		updateWeatherDataFromApi(await weatherApiResponse());

		updateSessionStorage();
	};

	const onUnitChanged = (unit: string) => {
		tempUnit.value = unit;

		checkWeather();
	};

	onMounted(() => {
		sessionStorage.clear();
		checkWeather();
	});
</script>
