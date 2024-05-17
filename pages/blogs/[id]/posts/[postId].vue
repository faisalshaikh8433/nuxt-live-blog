<script setup>
    import { ref, onMounted } from "vue";
    const config = useRuntimeConfig().public;
    const route = useRoute();
    const post = ref({});
    const blogId = route.params.id;
    const postId = route.params.postId;
    const allLinkMetaDetails = ref([]);

    const { data, pending, error, refresh } = await useFetch(
        `${config.baseApiUrl}/blogs/${blogId}/posts/${postId}`,
        {
            headers: { "Content-Type": "application/json" },
            onResponse({ request, response, options }) {
                // Process the response data
            },
            onResponseError(error) {
                console.log(error);
            },
        }
    );
    post.value = data.value.post ?? {};

    const extractUrlsFromStringWithHtml = (html) => {
        const extractedUrls = new Set();
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const tempElement = document.createElement("div");
        tempElement.innerHTML = html;

        // Get all anchor elements
        const anchorElements = tempElement.getElementsByTagName("a");

        // Filter out external links from anchor elements
        Array.from(anchorElements).forEach((element) => {
            const href = element.getAttribute("href");
            if (href && href.match(urlRegex)) {
                extractedUrls.add(href);
            }
        });

        // Get text content of the html string
        const textContent = tempElement.textContent || tempElement.innerText;

        // Match URLs in the text content using the regex
        const matches = textContent.match(urlRegex);

        if (matches) {
            extractedUrls.add(...matches);
        }

        return Array.from(extractedUrls);
    };
    const fetchAndDisplayMetadata = async (url) => {
        // Below call can be implemented on server side for scraping meta data of links but for demo purpose and getting job done using https://meta.mehari.workers.dev
        const dataFetch = await $fetch(
            `https://meta.mehari.workers.dev?url=${url}`
        );
        return dataFetch ?? { url };
    };

    const setMetaLinkDetails = async (content) => {
        const newMetaDetails = [];
        const urls = extractUrlsFromStringWithHtml(content);
        // Use Promise.all to wait for all fetchAndDisplayMetadata calls to resolve
        await Promise.all(
            urls.map(async (url) => {
                let metaDetails = allLinkMetaDetails.value.find(
                    (detail) => detail.url === url
                );

                if (metaDetails) {
                    newMetaDetails.push(metaDetails);
                } else {
                    let metaDetail = await fetchAndDisplayMetadata(url);
                    newMetaDetails.push(metaDetail);
                }
            })
        );
        // After all promises are resolved, update the reactive property
        allLinkMetaDetails.value = newMetaDetails;
    };
    onMounted(() => {
        setMetaLinkDetails(post.value.description);
    });
</script>
<template>
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div
                class="bg-gray-100 overflow-hidden shadow-sm sm:rounded-lg p-4"
            >
                <div class="flex items-center m-2 ml-auto justify-between">
                    <h2
                        class="font-semibold text-xl text-gray-800 leading-tight"
                    >
                        {{ post.title }}
                    </h2>
                    <div>
                        <NuxtLink
                            class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 ml-5 no-underline"
                            :to="`/`"
                        >
                            Blogs
                        </NuxtLink>
                        <NuxtLink
                            class="inline-flex items-center px-4 py-2 bg-red-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 ml-5 no-underline"
                            :to="`/blogs/${blogId}/posts`"
                        >
                            Back
                        </NuxtLink>
                    </div>
                </div>
                <div v-html="post.description"></div>
                <div class="mt-4" v-if="allLinkMetaDetails.length > 0">
                    <label
                        class="block text-sm font-medium text-gray-700 mt-2"
                        for="externalLink"
                        >External links</label
                    >
                    <div class="url-preview text-xs flex flex-wrap">
                        <div
                            v-for="(detail, index) in allLinkMetaDetails"
                            :key="index"
                            class="url-card border border-gray-300 rounded-lg m-4 p-4 flex flex-col"
                        >
                            <div class="url-info mb-2">
                                <div class="url-title font-bold">
                                    {{ detail.title }}
                                </div>
                                <div class="url-site text-gray-600">
                                    {{ detail.siteName }}
                                </div>
                                <div class="url-description">
                                    {{ detail.description }}
                                </div>
                            </div>
                            <div
                                class="url-image flex justify-center"
                                v-if="detail.image"
                            >
                                <img
                                    :src="detail.image"
                                    alt="URL Preview"
                                    class="max-w-40 h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
