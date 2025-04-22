<template>
	<div
		:class="[
			'relative flex flex-col justify-between items-center w-[300px] h-[520px] p-[20px] rounded-[20px] shadow-[0_0_15px_-5px_rgba(245,166,145,1)] bg-gradient-to-b font-national-park text-[18px] font-[400] text-white',
			weatherClasses?.backgroundClass,
		]"
	>
		<div class="flex">
			<span :class="weatherClasses?.textClass">
				{{ weatherData.city }}
			</span>

			<span
				:class="[
					'absolute right-[20px] flex items-center gap-[5px]',
					weatherClasses?.textClass,
				]"
			>
				<span>C</span>
				<input
					@change="tempUnitChanged"
					type="checkbox"
					role="switch"
					:class="[
						'appearance-none relative w-[40px] h-[21px] m-0 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-[11px] after:absolute after:top-[3px] after:left-[3px] after:w-[15px] after:h-[15px] after:bg-white after:rounded-full after:transition-[left] after:duration-100 checked:after:left-[22px]',
						weatherClasses?.switchClass,
					]"
				/>
				<span>F</span>
			</span>
		</div>

		<div class="flex flex-col items-center gap-[5px]">
			<component
				:is="weatherIconComponent"
				:size="145"
				:color="weatherClasses?.iconColor"
			/>

			<p class="text-[75px] font-[700]">
				{{ weatherData.currentTemp }}

				<!-- keep icon separate and absolute for better center positioning of the text -->
				<span class="absolute">°</span>
			</p>

			<p class="text-[24px] font-[200]">
				{{ weatherData.minTemp }}° | {{ weatherData.maxTemp }}°
			</p>
		</div>

		<p>{{ weatherData.dateString }}</p>
	</div>
</template>

<script lang="ts" setup>
	import {
		Sun,
		Moon,
		CloudSun,
		CloudMoon,
		Cloud,
		Cloudy,
		CloudRain,
		CloudSunRain,
		CloudMoonRain,
		CloudLightning,
		Snowflake,
		CloudFog,
	} from 'lucide-vue-next';
	import type { FunctionalComponent } from 'vue';

	const props = defineProps<{
		weatherData: WeatherData;
	}>();

	const emit = defineEmits<{
		(ev: 'unitChanged', unit: 'imperial' | 'metric'): void;
	}>();

	interface WeatherClasses {
		weather: WeatherData['weatherType'];
		backgroundClass: string;
		textClass: string;
		switchClass: string;
		iconColor: string;
	}

	const weatherIconCodeMap: Array<{
		code: string;
		icon: FunctionalComponent;
	}> = [
		{ code: '01d', icon: Sun },
		{ code: '01n', icon: Moon },
		{ code: '02d', icon: CloudSun },
		{ code: '02n', icon: CloudMoon },
		{ code: '03d', icon: Cloud },
		{ code: '03n', icon: Cloud },
		{ code: '04d', icon: Cloudy },
		{ code: '04n', icon: Cloudy },
		{ code: '09d', icon: CloudRain },
		{ code: '09n', icon: CloudRain },
		{ code: '10d', icon: CloudSunRain },
		{ code: '10n', icon: CloudMoonRain },
		{ code: '11d', icon: CloudLightning },
		{ code: '11n', icon: CloudLightning },
		{ code: '13d', icon: Snowflake },
		{ code: '13n', icon: Snowflake },
		{ code: '50d', icon: CloudFog },
		{ code: '50n', icon: CloudFog },
	];

	const weatherClassesMap: Array<WeatherClasses> = [
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

	const weatherClasses = computed(() =>
		weatherClassesMap.find(
			(item) => item?.weather === props.weatherData.weatherType
		)
	);

	const weatherIconComponent = computed(
		() =>
			weatherIconCodeMap.find(
				({ code }) => code === props.weatherData.weatherIcon
			)?.icon
	);

	const tempUnitChanged = (ev: Event) => {
		const elem = ev.target as HTMLInputElement;

		emit('unitChanged', elem.checked ? 'imperial' : 'metric');
	};
</script>
