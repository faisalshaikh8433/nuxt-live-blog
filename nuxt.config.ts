// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    runtimeConfig: {
        public: {
            baseApiUrl: process.env.NUXT_API_URL || "http://localhost:3333",
        },
    },
    app: {
        head: {
            script: [{ src: "https://cdn.tailwindcss.com" }],
        },
    },
});
