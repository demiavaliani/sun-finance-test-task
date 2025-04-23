<template>
	<div class="absolute top-[35%]">
		<div class="relative flex items-center max-w-fit">
			<input
				type="text"
				:class="[
					'w-[300px] h-[50px] px-[20px] py-[10px] bg-[#E6DFDF] rounded-[4px] focus-visible:outline-0 font-national-park text-[18px] font-[400]',
					{ 'rounded-b-none': cityList.length },
				]"
				v-model="cityInput"
				@input="getCityListByName"
			/>

			<button
				v-if="geolocationAvailable"
				class="absolute right-[10px]"
				title="Locate me"
				@click="getCityListByCoords"
			>
				<LocateFixed color="#322727" />
			</button>
		</div>

		<ul
			v-if="cityList.length"
			class="absolute w-full max-h-[50vh] px-[10px] py-[10px] overflow-auto border border-[#BCBCBC] rounded-b-[4px]"
		>
			<li
				v-for="city in cityList"
				class="px-[10px] py-[15px] rounded-[2px] hover:bg-[#F7F5F5] cursor-[pointer]"
				@click="onCityClick(city)"
			>
				<!-- avoid showing comma if no state -->
				{{ city.name }}, {{ city.state ? `${city.state},` : '' }}
				{{ city.country }}
			</li>
		</ul>
	</div>
</template>

<script lang="ts" setup>
	import { LocateFixed } from 'lucide-vue-next';

	const cityInput = ref('');
	const cityList = ref<Array<CityResponse>>([]);
	const geolocationAvailable = ref(true);

	const fetchCitiesByName = async () => {
		const response = await fetch(
			`https://api.openweathermap.org/geo/1.0/direct?q=${cityInput.value}&limit=5&appid=5796abbde9106b7da4febfae8c44c232`
		);

		return response.json();
	};

	const fetchCitiesByCoords = async (lat: number, lon: number) => {
		const response = await fetch(
			`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=5796abbde9106b7da4febfae8c44c232`
		);

		return response.json();
	};

	const populateCityList = async (apiResponse: Promise<any>) => {
		cityList.value = await apiResponse;
	};

	const getCityListByName = () => {
		// when deleting last letter, don't submit empty value to API
		if (!cityInput.value.length) {
			cityList.value = [];
			return;
		}

		populateCityList(fetchCitiesByName());
	};

	const onCityClick = async (city: CityResponse) => {
		return navigateTo({
			path: '/WeatherPage',
			query: {
				lat: city.lat,
				lon: city.lon,
				city: city.name,
				country: city.country,
			},
		});
	};

	const getCityListByCoords = () => {
		navigator.geolocation.getCurrentPosition((pos) => {
			populateCityList(
				fetchCitiesByCoords(pos.coords.latitude, pos.coords.longitude)
			);
		});
	};

	onMounted(() => {
		if (!navigator.geolocation) {
			geolocationAvailable.value = false;
		}
	});
</script>

<style></style>
