const express = require ('express');
const router = express.Router();
const Article = require('../models/article');
const Video = require('../models/video');
const youtube = require('youtube-metadata-from-url');

// START article routes

router.get('/articles', function(req, res) {
  Article.find(function(err, articles) {
    res.json(articles);
  });
});

router.get('/articles/:id', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    if (!article) {
      res.status(404).send('No result found');
    } else {
      res.json(article);
    }
  });
});

router.post('/articles', function(req, res) {
  let article = new Article(req.body);
  article.save()
    .then(article => {
      res.send(article);
    })
    .catch(function(err) {
      res.status(422).send('Article add failed');
    });
});

router.patch('/articles/:id', function(req, res){
  Article.findByIdAndUpdate(req.params.id, req.body)
    .then(function() {
      res.json('Article updated');
    })
    .catch(function(err) {
      res.status(422).send("Article update failed.");
    });
});

router.delete('/articles/:id', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    if (!article) {
      res.status(404).send('Article not found');
    } else {
      Article.findByIdAndRemove(req.params.id)
        .then(function() { res.status(200).json("Article deleted") })
        .catch(function(err) {
          res.status(400).send("Article delete failed.");
        })
    }
  });
})

// END article routes

// START video routes

// GET all videos
router.get('/videos', function(req, res) {
  Video.find({}).sort({date:-1}).exec((err, docs) => {
    res.json(docs);
  })
});


// GET all unpopulated videos
// router.get('/videos/queue/populate', function(req, res) {
//   Video.find({ 'isPopulated' : false }, function(err, videos) {
//     res.json(videos)
//   });
// });

// GET all undownloaded populated & valid videos
// router.get('/videos/queue/download', function(req, res) {
//   Video.find({ 'isDownloaded' : false, 'isPopulated' : true, 'isValid' : true }, function(err, videos) {
//     res.json(videos);
//   });
// });

// GET all downloaded unwatched videos
// router.get('/videos/queue/watch', function(req, res) {
//   Video.find({ 'isDownloaded' : true, 'isWatched' : false }, function(err, videos) {
//     res.json(videos);
//   });
// });

// CREATE new video
router.post('/videos', function(req, res) {
  console.log("new request", req.body)
  let video = new Video(req.body);

  //makes request about metadata of video
  youtube.metadata(req.body.url).then( json => {
    console.log("hello")
    // metadata request completed. must be a valid video
    // populate video data to video object
    video.title = json.title;
    video.author = json.author_name;
    video.thumbnailUrl = json.thumbnail_url;
    video.authorUrl = json.author_url;
    video.URL = req.body.url;
    
    //save to db
    video.save()
    .then(video => {
      res.send(video);
    })
    //save to db failed
    .catch(function (err) {
      res.status(422).send('Video add failed', err);
    })
    //request for metadata failed. bad url most likely
  }, err => {
    console.log("error",err)
    res.status(422).send('Bad URL supplied', err);
  })
});

// PATCH video
// router.patch('/videos/:id', function(req, res) {
//   Video.findByIdAndUpdate(req.params.id, req.body)
//     .then(function() {
//       res.json('Video updated');
//     })
//     .catch(function(err) {
//       res.status(422).send('Video add failed');
//     });
// });

//END video routes





module.exports = router;
