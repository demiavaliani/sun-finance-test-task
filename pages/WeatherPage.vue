<template>
	<div class="flex justify-center items-center h-screen">
		<WeatherCard :weatherData="weatherData" @unit-changed="onUnitChanged" />
	</div>
</template>

<script lang="ts" setup>
	import type { LocationQuery } from 'vue-router';

	definePageMeta({
		validate: async (route) => {
			return validateQueryParams(route.query);
		},
	});

	const routeParams = useRoute().query;

	const weatherData = ref<WeatherData>({
		currentTemp: 0,
		minTemp: 0,
		maxTemp: 0,
		city: typeof routeParams.city === 'string' ? routeParams.city : '',
		country: typeof routeParams.country === 'string' ? routeParams.country : '',
		dateString: '',
		weatherIcon: '',
		weatherType: undefined,
	});

	const tempUnit = ref('metric');

	const validateQueryParams = (query: LocationQuery) => {
		const lat = parseFloat(typeof query.lat === 'string' ? query.lat : '');
		const lon = parseFloat(typeof query.lon === 'string' ? query.lon : '');

		const isLatValid = lat >= -90 && lat <= 90;
		const isLonValid = lon >= -180 && lon <= 180;
		const isCityValid = Boolean(query.city?.length);
		const isCountryValid = Boolean(query.country?.length);

		return isLatValid && isLonValid && isCityValid && isCountryValid;
	};

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

	const weatherApiResponse = async () => {
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/onecall?lat=${routeParams.lat}&lon=${routeParams.lon}&units=${tempUnit.value}&exclude=minutely,hourly,alerts&appid=5796abbde9106b7da4febfae8c44c232`
		);

		return response.json();
	};

	const updateWeatherDataFromApi = async () => {
		const weatherObject: OneCallResponse = await weatherApiResponse();

		weatherData.value.currentTemp = weatherObject.current.temp;
		weatherData.value.minTemp = weatherObject.daily[0].temp.min;
		weatherData.value.maxTemp = weatherObject.daily[0].temp.max;
		weatherData.value.dateString = getDateString(weatherObject.current.dt);
		weatherData.value.weatherIcon = weatherObject.current.weather[0].icon;
		weatherData.value.weatherType = weatherObject.current.weather[0]
			.main as WeatherData['weatherType'];
	};

	const checkWeather = async () => {
		if (dataExistsInSession()) {
			updateWeatherDataFromSession();
			return;
		}

		await updateWeatherDataFromApi();

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
