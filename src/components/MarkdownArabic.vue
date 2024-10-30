<script setup lang="ts">
import { ref, computed } from "vue";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import { useLocalStorage } from "@vueuse/core";
import { animate } from "motion";
import {
   PencilSquareIcon,
   EyeIcon,
   SunIcon,
   MoonIcon,
} from "@heroicons/vue/24/outline";

interface EditorState {
   mode: "edit" | "preview";
   content: string;
   isDark: boolean;
}

// Constants
const DEFAULT_CONTENT = "# بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ";
const STORAGE_KEY = "arabic-markdown-content";

// State management using composition API
const state = useLocalStorage<EditorState>(STORAGE_KEY, {
   mode: "edit",
   content: DEFAULT_CONTENT,
   isDark: window.matchMedia("(prefers-color-scheme: dark)").matches,
});

// Initialize dark mode on page load
if (state.value.isDark) {
   document.documentElement.classList.add("dark");
} else {
   document.documentElement.classList.remove("dark");
}

// Computed properties
const parsedContent = computed(() =>
   DOMPurify.sanitize(marked.parse(state.value.content))
);

const isPreviewMode = computed(() => state.value.mode === "preview");

// Methods
const toggleMode = () => {
   state.value.mode = state.value.mode === "edit" ? "preview" : "edit";
   animateTransition();
};

const toggleDarkMode = () => {
   state.value.isDark = !state.value.isDark;
   if (state.value.isDark) {
      document.documentElement.classList.add("dark");
   } else {
      document.documentElement.classList.remove("dark");
   }
   animateTransition();
};

const updateContent = (event: Event) => {
   const target = event.target as HTMLTextAreaElement;
   state.value.content = target.value;
};

const animateTransition = () => {
   animate(
      ".scale-animation",
      { scale: [0.9, 1] },
      {
         duration: 0.3,
         easing: "ease-out",
      }
   );
};
</script>

<template>
   <main
      class="min-h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
   >
      <!-- Toolbar -->
      <aside
         class="w-16 bg-white dark:bg-gray-800 shadow-lg flex flex-col items-center py-4 transition-colors duration-300"
      >
         <!-- Edit/Preview Toggle -->
         <button
            @click="toggleMode"
            class="p-3 rounded-lg bg-lime-100 hover:bg-lime-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200 scale-animation mb-4"
            :title="isPreviewMode ? 'Switch to Editor' : 'Switch to Preview'"
         >
            <component
               :is="isPreviewMode ? PencilSquareIcon : EyeIcon"
               class="h-5 w-5 text-lime-700 dark:text-gray-200"
            />
         </button>

         <!-- Dark Mode Toggle -->
         <button
            @click="toggleDarkMode"
            class="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200 scale-animation"
            :title="
               state.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'
            "
         >
            <component
               :is="state.isDark ? SunIcon : MoonIcon"
               class="h-5 w-5 text-gray-700 dark:text-yellow-300"
            />
         </button>
      </aside>

      <!-- Main Content Area -->
      <div class="flex-1 p-4">
         <!-- Editor -->
         <textarea
            v-if="!isPreviewMode"
            v-model="state.content"
            @input="updateContent"
            class="w-full h-full min-h-[calc(100vh-2rem)] p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg outline-none resize-none text-lg dark:text-gray-200 font-tajawal scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 transition-colors duration-300"
            dir="auto"
            spellcheck="false"
         />

         <!-- Preview -->
         <div
            v-else
            class="w-full h-full min-h-[calc(100vh-2rem)] p-6 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg prose dark:prose-invert prose-lg max-w-none overflow-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 transition-colors duration-300 font-tajawal"
            v-html="parsedContent"
            dir="rtl"
         />
      </div>
   </main>
</template>

<style>
/* Base styles for markdown content */
.prose h1 {
   @apply text-4xl font-bold mb-4 mt-6;
}

.prose h2 {
   @apply text-3xl font-bold mb-3 mt-8;
}

.prose h3 {
   @apply text-2xl font-bold mb-3 mt-6;
}

.prose pre {
   @apply bg-gray-800 dark:bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto;
}

.prose code {
   @apply font-mono text-sm px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded;
}

.prose pre code {
   @apply block p-0 bg-transparent text-gray-200;
}

.prose strong {
   @apply px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900 rounded text-gray-900 dark:text-gray-100;
}

/* Custom scrollbar */
.scrollbar-thin {
   scrollbar-width: thin;
}

.scrollbar-thumb-gray-400::-webkit-scrollbar-thumb {
   background-color: #9ca3af;
   border-radius: 0.25rem;
}

.scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
   background-color: #4b5563;
   border-radius: 0.25rem;
}
</style>
