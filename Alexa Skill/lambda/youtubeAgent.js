

const ytdl  = require('ytdl-core');
const Youtube = require('youtube-api');
Youtube.authenticate({
    type: "key"
  , key: "YOUTUBE-API-KEY"
});
class youtubeAgent{

     getVideoId(query){
        return new Promise((resolve, reject) => {
            Youtube.search.list({
            part: 'snippet',
            maxResults: 1,
            q:query,
            type: 'video'
        }, (err, results) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                results.items.forEach(function(item)
                {
                    resolve(item.id.videoId);
                })

            });


        });

    }
    getYoutubeUrl(videoId){
        return new Promise((resolve, reject) => {
            ytdl.getInfo(videoId, (err, info) => {
                if (err) reject(err);
                let audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
                if (audioFormat) {
                     resolve(audioFormat.url);
                }else{
                    reject("no url");
                }
            });
        });
    }
}

module.exports = youtubeAgent;
