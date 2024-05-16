<!-- pages/blogs.vue -->
<script setup>
    import { ref, computed } from "vue";
    const config = useRuntimeConfig().public;

    const blogs = ref([]);
    const { data, pending, error, refresh } = await useFetch(
        `${config.baseApiUrl}/blogs`,
        {
            headers: { "Content-Type": "application/json" },
            onResponse({ request, response, options }) {},
            onResponseError(error) {
                console.log(error);
            },
        }
    );
    blogs.value = data.value.blogs ?? [];
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
                        Blogs
                    </h2>
                </div>
                <div v-if="blogs.length > 0">
                    <div class="blogs-list">
                        <div
                            v-for="blog in blogs"
                            :key="blog.id"
                            class="blog-item"
                        >
                            <NuxtLink :to="`/blogs/${blog.id}/posts`">
                                <div
                                    class="flex items-center py-2 hover:bg-gray-300 rounded-lg p-2"
                                >
                                    {{ blog.name }}
                                </div>
                            </NuxtLink>
                        </div>
                    </div>
                </div>
                <div v-else>No blog found!</div>
            </div>
        </div>
    </div>
</template>
