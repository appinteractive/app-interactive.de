class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
  }
}

module.exports = {
  siteName: 'Blog',
  siteDescription: 'Sharing some thoughts and processes',
  siteUrl: 'https://blog.app-interactive.de',
  titleTemplate: `%s | App-Interactive`,
  icon: 'src/favicon.png',

  transformers: {
    remark: {
      externalLinksTarget: '_blank',
      externalLinksRel: ['nofollow', 'noopener', 'noreferrer'],
      plugins: [
        'remark-toc',
        ['gridsome-plugin-remark-shiki', {
          theme: 'min-light'
        }]
      ]
    }
  },

  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'content/posts/**/*.md',
        typeName: 'Post',
        route: '/:slug',
        refs: {
          tags: {
            typeName: 'Tag',
            route: '/tag/:id',
            create: true
          },
          author: {
            typeName: 'Author',
            route: '/author/:id',
            create: true
          }
        }
      }
    },
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'content/pages/**/*.md',
        typeName: 'Post',
        route: '/:slug',
      }
    },
    {
      use: '@gridsome/plugin-sitemap',
      options: {
        cacheTime: 600000, // default
      }
    },
    // {
    //   use: 'gridsome-plugin-rss',
    //   options: {
    //     contentTypeName: 'Post',
    //     feedOptions: {
    //       title: 'Blog - App-Interactive',
    //       feed_url: 'https://blog.app-interactive.de/feed.xml',
    //       site_url: 'https://blog.app-interactive.de'
    //     },
    //     feedItemOptions: node => ({
    //       title: node.title,
    //       description: node.description,
    //       url: 'https://blog.app-interactive.de/' + node.slug,
    //       author: node.author,
    //       date: node.date
    //     }),
    //     output: {
    //       dir: './static',
    //       name: 'feed.xml'
    //     }
    //   }
    // },
    {
      use: 'gridsome-plugin-feed',
      options: {
        contentTypes: ['Post'],
        feedOptions: {
          title: 'Blog - App-Interactive',
          description: 'Sharing some thoughts and processes'
        },
        htmlFields: null,
        // Optional: a method that accepts a node and returns true (include) or false (exclude)
        // Example: only past-dated nodes: `filterNodes: (node) => node.date <= new Date()`
        filterNodes: (node) => {
          node.draft !== true && node.date <= new Date()
        },
        // Optional: a method that accepts a node and returns an object for `Feed.addItem()`
        // See https://www.npmjs.com/package/feed#example for available properties
        // NOTE: `date` field MUST be a Javascript `Date` object
        nodeToFeedItem: (node) => ({
          title: node.title,
          date: new Date(node.date)
        })
      }
    },
  ],

  chainWebpack: config => {
    config.module
      .rule('css')
      .oneOf('normal')
      .use('postcss-loader')
      .tap(options => {
        options.plugins.unshift(...[
          require('postcss-import'),
          require('postcss-nested'),
          require('tailwindcss'),
        ])

        if (process.env.NODE_ENV === 'production') {
          options.plugins.push(...[
            require('@fullhuman/postcss-purgecss')({
              content: [
                'src/assets/**/*.css',
                'src/**/*.vue',
                'src/**/*.js'
              ],
              extractors: [
                {
                  extractor: TailwindExtractor,
                  extensions: ['css', 'vue', 'js']
                }
              ],
              whitelistPatterns: [/shiki/]
            }),
          ])
        }

        return options
      })
  },
}





