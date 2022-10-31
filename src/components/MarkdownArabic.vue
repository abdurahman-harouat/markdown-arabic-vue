<script setup lang="ts">
import { marked } from "marked";
import { debounce } from "lodash-es";
import DOMPurify from "isomorphic-dompurify";
import { computed, watch, ref } from "vue";
import { useLocalStorage } from "vue-composable";
import { animate } from "motion";

// importing icons
import {
   PencilSquareIcon,
   EyeIcon,
   BookOpenIcon,
   XMarkIcon,
   MoonIcon,
   SunIcon
} from "@heroicons/vue/24/outline";


// اول شيء يطبع في الصفحة
let input = ref<string>("# بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ");
// switch between Editing and viewing
let switchType = ref<string>("Editor");
// localstorage
const key = ref<string>("__SavedArabicMarkdown");
// i dont know yet what is this
const tabSync = ref<boolean>(false);

const { supported, storage, setSync, remove } = useLocalStorage(
   key.value,
   input.value
)

// watch
watch(tabSync, setSync);

// output input using computed function in vue
const output = computed<string>(() => DOMPurify.sanitize(marked.parse(storage.value)));

// debounce input for 100 milisec to reduce overhead
const update = debounce((e) => {
   storage.value = e.target.value;
}, 100);

// function that switch
const switcher = () => {
   switchType.value = switchType.value === "Editor" ? "Viewer" : "Editor";
};

const Animation = () => {
   animate(
      ".scaleAnimation",
      { scale: [0.9, 1] },
      {
         duration: 0.5,
         easing: "ease-out",
      }
   );
};


</script>

<template>
   <main
      class="h-screen flex float-right w-screen m-0 box-border p-4 gap-4 font-tajawal"
   >
      <!-- Toolbar -->
      <aside class="w-16 bg-white/80 dark:bg-slate-800 h-full justify-center text-center shadow-2xl">
         
         <!-- Switch between view/edit -->
         <button
            class="bg-lime-200 dark:bg-white dark:text-slate-800 p-2 shadow-xl m-2 mt-5 text-white scaleAnimation dark:shadow-sm dark:shadow-white"
            @click="
               switcher();
               Animation();
            "
         >
            <PencilSquareIcon v-if="switchType == 'Viewer'" class="h-5 w-5 text-lime-900" />
            <EyeIcon v-if="switchType == 'Editor'" class="h-5 w-5 text-lime-900" />
         </button>

      </aside>

      <!-- Input -->
      <textarea
         v-if="switchType == 'Editor'"
         class="bg-white/80 dark:bg-slate-800 dark:text-white input overflow-auto border-none border-l-2 border-gray-500 bg-gray-100 resize-none outline-none text-lg p-8 box-border h-full w-full scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300 overflow-y-scroll shadow-2xl"
         :value="storage"
         @input="update"
         type="text"
         dir="auto"
      ></textarea>

      <!-- Output -->
      <div
         v-if="switchType == 'Viewer'"
         class="output overflow-auto p-4 box-border h-full w-full scrollbar-thin scrollbar-thumb-lime-700 scrollbar-track-lime-300 overflow-y-scroll bg-white/90 dark:bg-slate-800 shadow-2xl pl-5 dark:text-white"
         v-html="output"
         dir="rtl"
      ></div>

   </main>
</template>

<style scoped>
main :deep(h1) {
  @apply text-4xl mb-2 mt-5 ;
}

main :deep(h2) {
  @apply text-2xl mb-2 mt-7;
}

main :deep(h3) {
  @apply text-xl mb-2 mt-7;
}

main :deep(pre) {
  @apply bg-lime-900 shadow-lg rounded overflow-auto my-2 w-full text-white; 
}

main :deep(code) {
  @apply float-left p-2 my-2 w-full whitespace-pre;
  direction: ltr;
  overflow-x: auto;
}
main :deep(strong) {
  @apply px-2 py-1 bg-yellow-700 text-zinc-900 rounded;
}
</style>
