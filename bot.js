var Twit = require('twit');
var fs = require('fs');
var printf = require('sprintf');

//config files
var keys = require('./keys');
var filepath = ''; //enter your file path here

/*
*TO-DO:
* -find a way to update daily (npm install node-schedule ?)
* -description with bots name
*
*/

//initialize twitter bot
var T = new Twit(keys);
console.log("Bot succesfully loaded.");

//load file for memes
var files = fs.readdirSync(filepath);
console.log("Meme DB loaded and index selected");

// Picture object to post to twitter, generated randomly
postPic();
setInterval(postPic, 86400000) // 24 hours

//first you need to upload the image
function postPic (){
  var randNum = Math.floor(Math.random() * files.length);

  console.log(files[randNum]);

  var picture = fs.readFileSync(filepath + files[randNum], { encoding: 'base64'});

  T.post('media/upload', { media_data: picture }, function (err, data, response) {

  //screen reader alt text and such
  var mediaIdStr = data.media_id_string;
  var altText = "A picture generated randomly!";
  var meta_params = { media_id: mediaIdStr, alt_text: { text: altText }};

//delete picture from folder to avoid reposting
fs.unlink(filepath + files[randNum], (err) => {
  if (err) { throw err; console.log("error deleting file :(")};
  console.log(files[randNum] + " was deleted :)");
});
//now we use the image we uploaded and add a description to it
  T.post('media/metadata/create', meta_params, function (err, data, response) {
    if (!err) {
      // now we can reference the media and post a tweet (media will attach to the tweet)
      var params = { status: 'i post bad memes at 7 am PST every day, thanks jacob!', media_ids: [mediaIdStr] };

      //final post to page
      T.post('statuses/update', params, function (err, data, response) {
        return;
      });
    }
  });
});
};
