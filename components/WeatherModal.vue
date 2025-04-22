<template>
	<div
		class="relative flex flex-col justify-between items-center w-[300px] h-[520px] p-[20px] rounded-[20px] shadow-[0_0_15px_-5px_rgba(245,166,145,1)] bg-gradient-to-b from-[#fff9b0] to-[#f5a691] font-national-park text-[18px] font-[400] text-white"
	>
		<div class="flex">
			<span class="text-[#f7a668]">{{ weatherData.city }}</span>

			<span
				class="absolute right-[20px] flex items-center gap-[5px] text-[#f7a668]"
			>
				<span>C</span>
				<input
					@change="tempUnitChanged"
					type="checkbox"
					role="switch"
					class="appearance-none relative w-[40px] h-[21px] m-0 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[#f7a668] before:rounded-[11px] after:absolute after:top-[3px] after:left-[3px] after:w-[15px] after:h-[15px] after:bg-white after:rounded-full after:transition-[left] after:duration-100 checked:after:left-[22px]"
				/>
				<span>F</span>
			</span>
		</div>

		<div class="flex flex-col items-center gap-[5px]">
			<Sun :size="145" color="#f7a668" />

			<p class="text-[75px] font-[700]">
				{{ weatherData.currentTemp }}
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
	import { Sun } from 'lucide-vue-next';

	defineProps<{
		weatherData: WeatherData;
	}>();

	const emit = defineEmits<{
		(ev: 'unitChanged', unit: string): void;
	}>();

	const tempUnitChanged = (ev: Event) => {
		const elem = ev.target as HTMLInputElement;

		emit('unitChanged', elem.checked ? 'imperial' : 'metric');
	};
</script>
