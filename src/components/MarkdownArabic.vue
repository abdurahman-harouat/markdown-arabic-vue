<script setup>
import { marked } from 'marked'
import { debounce } from 'lodash-es'
import DOMPurify from 'isomorphic-dompurify';
import { ref, computed } from 'vue'

// input word at start
const input = ref('# بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ')

// output input using computed function in vue
const output = computed(() => DOMPurify.sanitize(marked.parse(input.value)))


// debounce input for 100 milisec to reduce overhead
const update = debounce((e) => {
  input.value = e.target.value
}, 100)

</script>


<template>
	<main class="h-screen flex float-right w-screen m-0">
    <!-- Input -->
    <textarea class="input overflow-auto border-none border-l-2 border-solid border-gray-500 bg-gray-100 resize-none outline-none text-lg p-8 box-border h-full w-1/2 scrollbar-thin scrollbar-thumb-rose-700 scrollbar-track-rose-300 overflow-y-scroll" :value="input" @input="update" type="text" dir="auto"></textarea>

    <!-- Output -->
    <div class="output overflow-auto font-cairoplay prose max-w-none prose-lg prose-code:float-left p-4 box-border h-full w-1/2 scrollbar-thin scrollbar-thumb-red-700 scrollbar-track-red-300 overflow-y-scroll" v-html="output" dir="rtl"></div>
  </main>
</template>


<style lang="css">
  code {
    direction: ltr;
  }
</style>