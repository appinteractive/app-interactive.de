const fs = require('fs')
const format = require('date-fns/format')
const slugify = require('@sindresorhus/slugify')

const title = process.argv[2]
const blogdir = './content/posts'
const postDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss')

if (!title) {
  console.log('❌  Please specify a post title.')
  return
}

const basename = `${format(new Date(), 'yyyy-MM-dd')}-${slugify(title)}`

const contents = `---
title: "${title}"
slug:
description: ""
date: ${postDate}
author: bleda-gridsome
tags:
cover:
fullscreen: false
---
`

fs.writeFile(`${blogdir}/${basename}.md`, contents, () => console.log(`✔ Created ${blogdir}/${basename}.md`))
