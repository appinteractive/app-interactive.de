<template>
  <article class="p-3 flex">
    <div class="px-6 bg-white rounded-lg border border-gray-300 w-full relative">
      <div class="py-8 sm:py-12">
        <header class="px-3 mb-8">
          <time
            :datetime="post.datetime"
            class="text-gray-700 text-xs mb-2"
          >{{ formatPublishDate(post.datetime) }}</time>
          <h2 class="text-3xl leading-none font-sans mb-1 truncate pb-px">
            <g-link :to="`${post.path}/`" class="text-black font-black">{{ post.title }}</g-link>
          </h2>
          <p class="text-gray-700 leading-normal text-xs">
            <span v-if="post.author">
              by
              <g-link
                :to="`${post.author.path}/`"
                class="text-gray-700 capitalize border-b border-transparent hover:border-gray-400 transition-border-color"
                v-if="post.author"
              >{{ titleCase(post.author.title) }}</g-link>
            </span>
            <span v-if="post.tags && post.tags.length > 0">
              in
              <g-link
                :to="`${post.tags[0].path}/`"
                class="text-gray-700 capitalize border-b border-transparent hover:border-gray-400 transition-border-color"
              >{{ titleCase(post.tags[0].title) }}</g-link>
            </span>
            <span v-if="post.author || (post.tags && post.tags.length > 0)">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
            <span>{{ post.timeToRead }} min read</span>
          </p>
        </header>
        <p
          class="leading-normal text-gray-700 text-md px-2 pb-16"
          v-html="excerpt(post, 280, ' …')"
        ></p>
      </div>
      <div class="w-full bottom-0 left-0 p-8 absolute font-sans">
        <g-link
          :to="`${post.path}/`"
          class="pointer border border-gray-300 rounded w-full block py-3 text-center hover:bg-green-600 hover:text-white"
        >Read more</g-link>
      </div>
    </div>
  </article>
</template>

<script>
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";

export default {
  props: ["post"],
  computed: {
    formattedPublishDate() {
      return format(parseISO(this.post.datetime), "dd. MMMM yyyy", {
        locale: de
      });
    }
  },
  methods: {
    formatPublishDate(date) {
      return format(parseISO(date), "dd. MMMM yyyy", { locale: de });
    },
    excerpt(post, length, clamp) {
      if (post.excerpt) {
        return post.excerpt;
      }

      length = length || 280;
      clamp = clamp || " ...";
      let text = post.content
        .replace(/<pre(.|\n)*?<\/pre>/gm, "")
        .replace(/<[^>]+>/gm, "");

      return text.length > length ? `${text.slice(0, length)}${clamp}` : text;
    },
    titleCase(str) {
      return str
        .replace("-", " ")
        .split(" ")
        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
        .join(" ");
    }
  }
};
</script>
