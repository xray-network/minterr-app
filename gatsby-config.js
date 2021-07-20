module.exports = {
  flags: {
    DEV_SSR: false,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Mint Cardano Tokens | Minterr`,
        icon: `static/resources/favicon.svg`,
      },
    },
    {
      resolve: `gatsby-plugin-alias-imports`,
      options: {
        alias: {
          "@": require("path").resolve(__dirname, "src"),
        },
        extensions: ["js", "scss", "sass"],
      },
    },
    {
      resolve: `gatsby-plugin-web-font-loader`,
      options: {
        custom: {
          families: ["Circular Local"],
          urls: ["/resources/font/circular.css"],
        },
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-41062113-23",
      },
    },
    {
      resolve: `gatsby-plugin-yandex-metrika`,
      options: {
        trackingId: "83032947",
        webvisor: true,
        trackHash: true,
      },
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /\.*\.svg$/
        }
      }
    },
    {
      resolve: 'gatsby-plugin-html-attributes',
      options: {
        'data-theme': 'default'
      }
    },
  ],
}
