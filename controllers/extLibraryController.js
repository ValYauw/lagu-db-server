const axios = require('axios');

class Controller {

  static async getArtistUploadsFromYouTube(uploadsPlaylistId) {
    try {

      let { data } = await axios.get(
        `https://youtube.googleapis.com/youtube/v3/playlistItems` + 
        `?part=snippet%2CcontentDetails` + 
        `&playlistId=${uploadsPlaylistId}` + 
        `&key=${process.env.GOOGLE_API_KEY}`
      );
        
      let uploads = data.items;
      uploads = uploads.map(upload => {
        const { snippet, contentDetails } = upload;
        let { title, thumbnails } = snippet;
        let imageUrl;
        for (let k of ['high', 'medium', 'default']) {
          imageUrl = thumbnails[k];
          if (imageUrl) break;
        }
        let { videoId, videoPublishedAt: publishedAt } = contentDetails;
        return { title, imageUrl, videoId, publishedAt };
      })

      return uploads;

    } catch(err) {
      throw { name: 'NotSuccessful' }
    }
  } 

  static async getArtistYouTubeData(req, res, next) {
    try {
      const { channelUrl } = req.body;
      const match = /^https?:\/\/www\.youtube\.com\/channel\/([a-zA-Z0-9]+)/.exec(channelUrl);
      if (!match) throw { name: 'BadCredentials' };
      const channelId = match[1];
      const { data } = await axios.get(
        `https://youtube.googleapis.com/youtube/v3/channels` + 
        `?part=snippet%2CcontentDetails%2Cstatistics` + 
        `&id=${channelId}` + 
        `&key=${process.env.GOOGLE_API_KEY}`
      );
      const query = data.items[0];
      if (!query) throw { name: 'NotSuccessful' };
      const { id, statistics, contentDetails, snippet } = query;

      let { title, description, customUrl, publishedAt, thumbnails } = snippet;
      let imageUrl;
      for (let k of ['high', 'medium', 'default']) {
        imageUrl = thumbnails[k];
        if (imageUrl) break;
      }
      let uploadsPlaylistId = contentDetails.relatedPlaylists.uploads;
      let uploads = await Controller.getArtistUploadsFromYouTube(uploadsPlaylistId);
      res.status(200).json({
        channelId: id, 
        title, description, customUrl, publishedAt, imageUrl,
        uploads,
        statistics
      });

    } catch(err) {
      next(err);
    }
  }

  static async getPopularSongsFromVocaDB(req, res, next) {
    try {
      const { vocadbUrl } = req.body;
      const match = /^https?:\/\/vocadb\.net\/Ar\/([0-9]+)/.exec(vocadbUrl);
      if (!match) throw { name: 'BadCredentials' };
      const artistId = match[1];
      const { data } = await axios.get(
        `https://vocadb.net/api/artists/${artistId}?relations=PopularSongs&lang=Default`
      );
      let popularSongs = data.relations.popularSongs;
      popularSongs = popularSongs.map(entry => {
        const { defaultName, additionalNames, artistString, mainPicture, ratingScore } = entry;
        const { urlThumb: imgUrl } = mainPicture;
        return { name: defaultName, aliases: additionalNames, artistString, ratingScore };
      })
      res.status(200).json(popularSongs);
    } catch(err) {
      next(err);
    }
  }

}

module.exports = Controller;