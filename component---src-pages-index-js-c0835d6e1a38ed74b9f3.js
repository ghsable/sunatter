"use strict";(self.webpackChunkgatsby_starter_blog=self.webpackChunkgatsby_starter_blog||[]).push([[678],{8771:function(e,t,n){var a=n(7294);t.Z=()=>a.createElement("div",{className:"mybio"},a.createElement("p",null,a.createElement("a",{href:"/sunainfo"},"😪"),"😴 😪 😴 😪 …"))},8678:function(e,t,n){var a=n(7294),l=n(1883);t.Z=e=>{let{location:t,title:n,children:r}=e;const i="/sunainfo/"===t.pathname;let o;return o=i?a.createElement("h1",{className:"main-heading"},a.createElement(l.Link,{to:"/"},n)):a.createElement(l.Link,{className:"header-link-home",to:"/"},n),a.createElement("div",{className:"global-wrapper","data-is-root-path":i},a.createElement("header",{className:"global-header"},o),a.createElement("main",null,r),a.createElement("footer",null,"© ",(new Date).getFullYear(),", Built with"," ",a.createElement("a",{href:"https://www.gatsbyjs.com"},"Gatsby")))}},9357:function(e,t,n){var a=n(7294),l=n(1883);t.Z=e=>{var t,n,r;let{description:i,title:o,children:c}=e;const{site:m}=(0,l.useStaticQuery)("2841359383"),s=i||m.siteMetadata.description,d=null===(t=m.siteMetadata)||void 0===t?void 0:t.title;return a.createElement(a.Fragment,null,a.createElement("title",null,d?`${o} | ${d}`:o),a.createElement("meta",{name:"description",content:s}),a.createElement("meta",{property:"og:title",content:o}),a.createElement("meta",{property:"og:description",content:s}),a.createElement("meta",{property:"og:type",content:"website"}),a.createElement("meta",{name:"twitter:card",content:"summary"}),a.createElement("meta",{name:"twitter:creator",content:(null===(n=m.siteMetadata)||void 0===n||null===(r=n.social)||void 0===r?void 0:r.twitter)||""}),a.createElement("meta",{name:"twitter:title",content:o}),a.createElement("meta",{name:"twitter:description",content:s}),c)}},6558:function(e,t,n){n.r(t),n.d(t,{Head:function(){return c}});var a=n(7294),l=n(1883),r=n(8771),i=n(8678),o=n(9357);t.default=e=>{var t;let{data:n,location:o}=e;const c=(null===(t=n.site.siteMetadata)||void 0===t?void 0:t.title)||"Title",m=n.allMarkdownRemark.nodes;return 0===m.length?a.createElement(i.Z,{location:o,title:c},a.createElement(r.Z,null),a.createElement("p",null,'No blog posts found. Add markdown posts to "content/blog" (or the directory you specified for the "gatsby-source-filesystem" plugin in gatsby-config.js).')):a.createElement(i.Z,{location:o,title:c},a.createElement(r.Z,null),a.createElement("ol",{style:{listStyle:"none"}},m.map((e=>{const t=e.frontmatter.title||e.fields.slug;return a.createElement("li",{key:e.fields.slug},a.createElement("article",{className:"post-list-item",itemScope:!0,itemType:"http://schema.org/Article"},a.createElement("header",null,a.createElement("h2",null,a.createElement(l.Link,{to:e.fields.slug,itemProp:"url"},a.createElement("span",{itemProp:"headline"},t))),a.createElement("small",null,e.frontmatter.date)),a.createElement("section",null,a.createElement("p",{dangerouslySetInnerHTML:{__html:e.frontmatter.description||e.excerpt},itemProp:"description"}))))}))))};const c=()=>a.createElement(o.Z,{title:"All posts"})}}]);
//# sourceMappingURL=component---src-pages-index-js-c0835d6e1a38ed74b9f3.js.map