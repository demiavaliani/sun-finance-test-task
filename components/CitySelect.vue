<template>
	<div class="absolute top-[35%]">
		<input
			type="text"
			:class="[
				'w-[300px] h-[50px] px-[20px] py-[10px] bg-[#E6DFDF] rounded-[4px] focus-visible:outline-0 font-national-park text-[18px] font-[400]',
				{ 'rounded-b-none': cityList.length },
			]"
			v-model="cityInput"
			@input="getCityList"
		/>

		<ul
			v-if="cityList.length"
			class="max-h-[50vh] px-[10px] py-[15px] overflow-auto border border-[#BCBCBC] rounded-b-[4px]"
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
	const cityInput = ref('');
	const cityList = ref<Array<CityResponse>>([]);

	const weatherApiResponse = async () => {
		const response = await fetch(
			`https://api.openweathermap.org/geo/1.0/direct?q=${cityInput.value}&limit=5&appid=5796abbde9106b7da4febfae8c44c232`
		);

		return response.json();
	};

	const populateCityList = async () => {
		cityList.value = await weatherApiResponse();
	};

	const getCityList = async () => {
		// when deleting last letter, don't submit empty value to API
		if (!cityInput.value.length) {
			cityList.value = [];
			return;
		}

		await populateCityList();
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
</script>

<style></style>
