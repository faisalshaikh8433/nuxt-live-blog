<!-- pages/posts.vue -->
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
                        Posts
                    </h2>
                    <NuxtLink
                        class="inline-flex items-center px-4 py-2 bg-red-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 ml-5 no-underline"
                        :to="`/`"
                    >
                        Back
                    </NuxtLink>
                </div>
                <div v-if="posts.length">
                    <div class="posts-list">
                        <div
                            v-for="post in posts"
                            :key="post.id"
                            class="post-item"
                        >
                            <NuxtLink :to="`/blogs/${blogId}/posts/${post.id}`">
                                <div
                                    class="flex items-center hover:bg-gray-300 rounded-lg p-2"
                                >
                                    {{ post.title }}
                                </div>
                            </NuxtLink>
                        </div>
                    </div>
                </div>
                <p v-else>Blog has no post</p>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from "vue";
    const route = useRoute();
    const posts = ref([]);
    const blogId = route.params.id;
    const config = useRuntimeConfig().public;
    const { data, pending, error, refresh } = await useFetch(
        `${config.baseApiUrl}/blogs/${blogId}/posts`,
        {
            headers: { "Content-Type": "application/json" },
            onResponse({ request, response, options }) {
                // Process the response data
                // posts.value = response._data.posts ?? [];
            },
            onResponseError(error) {
                console.log(error);
            },
        }
    );
    posts.value = data.value.posts ?? [];
</script>
