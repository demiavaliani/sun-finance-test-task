// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	modules: [
		'@nuxt/eslint',
		'nuxt-lucide-icons',
		'@nuxtjs/tailwindcss',
		'@vueuse/nuxt',
		'@nuxtjs/google-fonts',
	],
	typescript: {
		typeCheck: true,
	},
	googleFonts: {
		families: {
			'National Park': {
				wght: [200, 400, 700],
			},
		},
	},
	imports: {
		dirs: ['./types'],
	},
	tailwindcss: {
		config: {
			theme: {
				extend: {
					fontFamily: {
						'national-park': 'National Park',
					},
				},
			},
		},
	},
});
