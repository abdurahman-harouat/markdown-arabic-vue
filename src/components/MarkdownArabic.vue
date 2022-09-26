<script setup>
import { marked } from "marked";
import { debounce } from "lodash-es";
import DOMPurify from "isomorphic-dompurify";
import { computed, watch } from "vue";
import { useLocalStorage } from "vue-composable";
import { useDark, useToggle } from '@vueuse/core'
import { animate } from "motion";

import prism from "prismjs";
import "prismjs/themes/prism-duotone-space.css";
// ترقيم السطور
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

import "prismjs/plugins/toolbar/prism-toolbar.js"; // required for the following plugins
import "prismjs/plugins/toolbar/prism-toolbar.css"; // required for the following plugins
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js"; // اظهار زر النسخ

// This is needed if you have a conflict with other loaded CSS imports (i.e. tailwind).
import "prismjs/plugins/custom-class/prism-custom-class";
prism.plugins.customClass.map({ number: "prism-number", tag: "prism-tag" });

// importing icons
import {
   PencilSquareIcon,
   EyeIcon,
   BookOpenIcon,
   XMarkIcon,
   MoonIcon,
   SunIcon
} from "@heroicons/vue/24/outline";

//marked Options => https://marked.js.org/using_advanced#options
marked.use({
   highlight: (code, lang) => {
      if (prism.languages[lang]) {
         return prism.highlight(code, prism.languages[lang], lang);
      } else {
         return code;
      }
   },
});

// اول شيء يطبع في الصفحة
let input = $ref("# بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ");
// switch between Editing and viewing
let switchType = $ref("Editor");
// localstorage
const key = $ref("__SavedArabicMarkdown");
// i dont know yet what is this
const tabSync = $ref(false);
// dark mode
const isDark = useDark()
const toggleDark = useToggle(isDark)



const { supported, storage, setSync, remove } = $(useLocalStorage(
   key,
   input
))

// watch
watch(tabSync, setSync);

// output input using computed function in vue
const output = computed(() => DOMPurify.sanitize(marked.parse(storage)));

// debounce input for 100 milisec to reduce overhead
const update = debounce((e) => {
   storage = e.target.value;
}, 100);

prism.highlightAll();



// function that switch
const switcher = () => {
   switchType = switchType === "Editor" ? "Viewer" : "Editor";
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

/*const modalOpen = ref(false);*/

</script>

<template>
   <main
      class="h-screen flex float-right w-screen m-0 bg-gray-200 box-border p-4 gap-4"
   >
      <!-- Toolbar -->
      <aside class="w-20 bg-white dark:bg-slate-800 h-full justify-center text-center shadow-2xl">
         <button
            class="bg-slate-800 dark:bg-white dark:text-slate-800 p-3 shadow-xl m-2 mt-5 text-white scaleAnimation dark:shadow-sm dark:shadow-white"
            @click="
               switcher();
               Animation();
            "
         >
            <PencilSquareIcon v-if="switchType == 'Viewer'" class="h-6 w-6" />
            <EyeIcon v-if="switchType == 'Editor'" class="h-6 w-6" />
         </button>
<!--     <button
            class="bg-slate-800 p-3 shadow-xl m-2 mt-5 text-white scaleAnimation"
            @click="modalOpen = true"
         >
            <BookOpenIcon class="h-6 w-6" />
         </button> -->

         <button
            class="bg-slate-800 dark:bg-white dark:text-slate-800 p-3 shadow-xl m-2 mt-5 text-white dark:shadow-sm dark:shadow-white"
            @click="toggleDark()"
         >
         <MoonIcon v-if="isDark" class="h-6 w-6" />
         <SunIcon v-else class="h-6 w-6" />
         </button>

      </aside>

      <!-- Input -->
      <textarea
         v-if="switchType == 'Editor'"
         class="bg-white dark:bg-slate-800 dark:text-white input overflow-auto border-none border-l-2 border-gray-500 bg-gray-100 resize-none outline-none text-lg p-8 box-border h-full w-full scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300 overflow-y-scroll shadow-2xl"
         :value="storage"
         @input="update"
         type="text"
         dir="auto"
      ></textarea>

      <!-- Output -->
      <div
         v-if="switchType == 'Viewer'"
         class="output overflow-auto font-tajawal prose max-w-none prose-lg prose-h1:font-blakaink prose-h1:text-yellow-900 prose-h1:text-7xl prose-h2:font-reemkufiink prose-h2:font-light prose-h2:text-6xl prose-h3:text-5xl prose-h4:text-4xl prose-h5:text-3xl prose-h6:text-2xl prose-p:text-xl prose-code:float-left line-numbers language-javascript p-4 box-border h-full w-full scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-300 overflow-y-scroll bg-white dark:bg-slate-800 shadow-2xl pl-5 dark:text-white"
         v-html="output"
         dir="rtl"
      ></div>

      <!-- Modal -->
<!--       <Teleport to="body">
         <div
            class="fixed top-0 right-0 left-0 flex justify-center"
            v-if="modalOpen"
         >
            <div class="bg-white p-12 rounded-lg">
               <button @click="modalOpen = false">
                  <XMarkIcon class="h-6 w-6" />
               </button>
            </div>
         </div>
      </Teleport> -->
   </main>
</template>

<style>
code {
   direction: ltr;
}
</style>
