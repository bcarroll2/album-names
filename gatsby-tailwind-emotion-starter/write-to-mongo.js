// Set up mongoose connection
const mongoose = require('mongoose');
// const tweets = require('./tweet')
require('dotenv').config()
let dev_db_url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/album-names-real?retryWrites=true&w=majority`;
let mongoDB = dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
const Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  bearer_token: process.env.TWITTER_BEARER_TOKEN,
});

// console.log(db)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('open')
  const Schema = mongoose.Schema;
  // console.log(db)
  let AlbumSchema = new Schema({
      title: {type: String, required: true, max: 100},
      retweets: {type: Number, required: true},
      likes: {type: Number, required: true},
      date: {type: Date, required: true},
      tweetId: {type: String, required: true},
  });
  
  
  const Album = mongoose.model('Album', AlbumSchema);
  
  function createAlbum (tweet) {
    const { full_text, created_at, id, retweet_count, favorite_count } = tweet.tweet
    Album.findOne({tweetId: id}, (err, album) => {
      if (err) {
        console.log(err)
      }
      if (album) {
        console.log('album exists already!', album.title)
      } else {
        // console.log(tweet.tweet)
        let album = new Album(
            {
                title: full_text,
                retweets: retweet_count,
                likes: favorite_count,
                date: created_at,
                tweetId: id,
            }
        );

        album.save(function (err, album) {
            if (err) {
              console.log(err)
                return err
            }
            // res.send('Album Created successfully')
            console.log('album created!', album)
        })        
      }
    })

  };
  client.get('statuses/user_timeline', {screen_name: 'albumideas'}, (error, tweets, response) => {
    if(error) throw error;
    console.log(tweets);  // Tweet body.
    // console.log(response);  // Raw response object.
    tweets.forEach((tweet) => {
      createAlbum({
        // matches the shape of tweet.js file
        tweet: {
          full_text: tweet.text,
          retweet_count: tweet.retweet_count,
          favorite_count: tweet.favorite_count,
          created_at: tweet.created_at,
          id: tweet.id.toString()
        }
      })
    })
  })
  
  // This was for manually populating the DB with exported tweet data
  // for (let i = 0;  i < tweets.length; i++) {
  //   createAlbum(tweets[i])
  // }
})

