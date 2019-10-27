<template>
  <Layout>
    <main>
      <article class="max-w-xl md:max-w-2xl xl:max-w-3xl mx-auto px-6 sm:px-12 pt-16 border-b border-grey-lighter pb-10 mb-16">
        <div class="markdown text-lg leading-normal text-gray-700" v-html="$page.page.content" />
      </article>

      <site-footer class="pb-8 sm:pb-10" />
    </main>
  </Layout>
</template>

<script>
import { format, parseISO, differenceInYears } from 'date-fns'
import { de } from 'date-fns/locale'
import config from '~/.temp/config.js'
import slugify from '@sindresorhus/slugify'
import SiteFooter from '@/components/Footer'
import PostHeader from '~/components/PostHeader'

export default {
  components: {
    PostHeader,
    SiteFooter,
  },
  metaInfo () {
    return {
      title: `${this.$page.page.title} ${this.$page.page.tag ? '- '+this.$page.page.tag.name : ''}`,
      meta: [
        {
          key: 'description',
          name: 'description',
          content: this.description(this.$page.page)
        },

        { property: "og:type", content: 'article' },
        { property: "og:title", content: this.$page.page.title },
        { property: "og:description", content: this.description(this.$page.page) },
        { property: "og:url", content: this.postUrl },
        { property: "article:published_time", content: format(parseISO(this.$page.page.datetime), 'yyyy-MM-dd', { locale: de }) },
        { property: "og:image", content: this.ogImageUrl },

        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: this.$page.page.title },
        { name: "twitter:description", content: this.description(this.$page.page) },
        { name: "twitter:site", content: "@cossssmin" },
        { name: "twitter:creator", content: "@cossssmin" },
        { name: "twitter:image", content: this.ogImageUrl },
      ],
    }
  },
  mounted () {
    import('medium-zoom').then(mediumZoom => {
      this.zoom = mediumZoom.default('.markdown p > img')
    })
  },
  methods: {
    description(post, length, clamp) {
      if (post.description) {
        return post.description
      }

      length = length || 280
      clamp = clamp || ' ...'
      let text = post.content.replace(/<pre(.|\n)*?<\/pre>/gm, '').replace(/<[^>]+>/gm, '')

      return text.length > length ? `${ text.slice(0, length)}${clamp}` : text
    },
    titleCase(str) {
      return str.replace('-', ' ')
                .split(' ')
                .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ')
    },

  },
  computed: {
    config () {
      return config
    },
    postUrl () {
      let siteUrl = this.config.siteUrl
      let postSlug = this.$page.page.slug

      return postSlug ? `${siteUrl}/page/${postSlug}/` : `${siteUrl}/page/${slugify(this.$page.page.title)}/`
    },
    ogImageUrl () {
      return this.$page.page.cover || `${this.config.siteUrl}/images/bleda-card.png`
    }
  },
}
</script>

<page-query>
query Page ($path: String) {
  page (path: $path) {
    title
    slug
    datetime: date (format: "YYYY-MM-DD HH:mm:ss")
    content
    description
    timeToRead
    cover
  }
}
</page-query>
