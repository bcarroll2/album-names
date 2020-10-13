require('dotenv').config()

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
    /*
     * Gatsby's data processing layer begins with “source” plugins. Here we
     * setup the site to pull data from the "documents" collection in a local
     * MongoDB instance
     */
    {
      resolve: `gatsby-source-mongodb`,
      options: { 
        dbName: `album-names-real?retryWrites=true&w=majority`,
        collection: `albums` ,
        connectionString: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`,
      },
    },
    {
      resolve: `gatsby-source-twitter`,
      options: {
        credentials: {
          consumer_key: process.env.TWITTER_CONSUMER_KEY,
          consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
          bearer_token: process.env.TWITTER_BEARER_TOKEN,
          
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
