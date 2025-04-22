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
	});

	const tempUnit = ref('metric');

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
