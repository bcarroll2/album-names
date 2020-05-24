// Set up mongoose connection
const mongoose = require('mongoose');
const tweets = require('./tweet')
let dev_db_url = 'mongodb://testadmin:password1@ds033069.mlab.com:33069/album-names-real';
let mongoDB = dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
const Twitter = require('twitter');

var client = new Twitter({
  consumer_key: 'ZdoQkKqXU0o4SJ7kOo1z4H6TY',
  consumer_secret: 'nk0MI9gPEF9iBL879J9SjBLkdaRGxinnLyY8e7QaBSb5blTDfQ',
  bearer_token: 'AAAAAAAAAAAAAAAAAAAAAL1XEgEAAAAAT17oHKyNlf5rkYGFHvXhPRcsX4w%3D59U3DSHE94VElgWchaOy7hBD6GIQ0TZczevppRuDWrPPM30q9H'
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
  
  for (let i = 0;  i < tweets.length; i++) {
    createAlbum(tweets[i])
  }
})

