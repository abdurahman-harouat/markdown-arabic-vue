<script setup>
import { marked } from 'marked'
import { debounce } from 'lodash-es'
import DOMPurify from 'isomorphic-dompurify';
import { ref, computed, watch } from 'vue'
import { useLocalStorage } from "vue-composable";

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
let input = ref('# بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ')

// localstorage
const key = ref("__SavedArabicMarkdown");
const tabSync = ref(false);
const { supported, storage, setSync, remove } = useLocalStorage(key, input.value);

// watch
watch(tabSync, setSync);

// output input using computed function in vue
const output = computed(() => DOMPurify.sanitize(marked.parse(storage.value)))

// debounce input for 100 milisec to reduce overhead
const update = debounce((e) => {
  storage.value = e.target.value;
}, 100)

prism.highlightAll();
</script>


<template>
	<main class="h-screen flex float-right w-screen m-0">
    <!-- Input -->
      <textarea class="input overflow-auto border-none border-l-2 border-gray-500 bg-gray-100 resize-none outline-none text-lg p-8 box-border h-full w-1/2 scrollbar-thin scrollbar-thumb-rose-700 scrollbar-track-rose-300 overflow-y-scroll language-markdown" :value="storage" @input="update" name="storage" type="text" dir="auto"></textarea>

    <!-- Output -->
    <div class="output overflow-auto font-tajawal prose max-w-none prose-lg prose-h1:font-blakaink prose-h1:text-yellow-900 prose-h1:text-7xl prose-h2:font-reemkufiink prose-h2:font-light prose-h2:text-6xl prose-h3:text-5xl prose-h4:text-4xl prose-h5:text-3xl prose-h6:text-2xl prose-p:text-xl prose-code:float-left line-numbers language-javascript p-4 box-border h-full w-1/2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-300 overflow-y-scroll" v-html="output" dir="rtl"></div>
  </main>
</template>


<style>
  code {
    direction: ltr;
  }
</style>
