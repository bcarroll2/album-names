module.exports = {
  siteMetadata: {
    title: `Gatsby Tailwind CSS + Emotion Starter`,
    description: `A bare-bones Tailwind CSS + Emotion starter to kickoff your project. `,
    author: `@pauloelias`,
  },
  plugins: [
    `gatsby-plugin-emotion`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `Raleway`,
        ],
        display: 'swap'
      }
    },
    {
      resolve: `gatsby-source-reddit`,
      options: {
        subredditName:`fakealbumcovers`,
      }
    },
    {
      resolve: `gatsby-source-twitter`,
      options: {
        credentials: {
          consumer_key: "ZdoQkKqXU0o4SJ7kOo1z4H6TY",
          consumer_secret: "nk0MI9gPEF9iBL879J9SjBLkdaRGxinnLyY8e7QaBSb5blTDfQ",
          bearer_token: "AAAAAAAAAAAAAAAAAAAAAL1XEgEAAAAAT17oHKyNlf5rkYGFHvXhPRcsX4w%3D59U3DSHE94VElgWchaOy7hBD6GIQ0TZczevppRuDWrPPM30q9H",
        },
        queries: {
          albumNames: {
            endpoint: "statuses/user_timeline",
            params: {
              screen_name: "albumideas",
              count: 200,
              include_rts: false,
              exclude_replies: true,
              tweet_mode: "extended",
            },
          },
        },
      },
    },
  ],
}
