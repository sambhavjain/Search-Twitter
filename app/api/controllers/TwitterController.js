var client = require('../../elasticSearch.js')
var twitter = require('twit')
// var map = require('hashmap')
var config = {
  consumer_key: 'e2cTI9aM8LPzFOW5iaiCDSPyp',
  consumer_secret: 'EliSDbE4j6RI4auyJEKeTnPv58NIFnhMlR7IdlJxvuhJd7SnJS',
  access_token: '2464889670-rzHFqKFo8SyUVtcF1RG6Rbe6ydFnvjlLAzyqyVm',
  access_token_secret: 'eiexqg6VzGV6eYK5IkXcqjMSsz1dBjuVLAWiv1GLI7cE6'
}
var T = new twitter(config);
module.exports = {
	search :function(req, res){
		// var options = { count: 100};
		var search = encodeURI(req.params.query)
		//console.log(q)
	
		T.get('search/tweets', {q:search}, function(err, data){
			//data = data
			var noOfTweets = data.statuses.length
			if(err)
				console.error(err)
			
			// console.log(noOfTweets)
			Analytics.create({name: req.params.query, count: noOfTweets}).exec(function createCB(err,created){ 
				if(err)
					console.error(err)
				console.log(created)
				//return res.json({ notice: 'Created with name ' + created.name }); 
			}); 
			// console.log(data.statuses[0].id_str)
			//return res.json(data)
			index_tweets(data,res);
		})
		
	},
	searches : function(req, res){
		var q = req.params.q;
		// console.log(q)
		// console.log(encodeURI(q))
		client.search({  
		  index: 'tweets',
		  type: 'tweet',
		  body: {
		    query: {
		      match: { "text": encodeURI(q) }
		    },
		  }
		},function (error, response,status) {
		    if (error){
		      console.log("search error: "+error)
		    }
		    else {
		      console.log(response);
		      var data = []
		      response.hits.hits.forEach(function(hit){
		        console.log(hit);
		      	data.push(hit)
		      })
		      res.json(data)
		    }
		});
	}
	
}
var index_tweets = function(data,res){
		var tweets = data.statuses
		var bulk = []
		for(var tweet in tweets){

			bulk.push({index: {_index: 'tweets', _type: 'tweet', _id: tweets[tweet].id_str }})
			bulk.push(tweets[tweet])
		}

		// client.index({
		//     index:'tweets',
		//     type: 'tweet',
		//     id: data.statuses[0].id_str,
		//     body: data.statuses[0]
		//   }, function (err, resp) {
		//     console.info(err);
		//     console.info(resp);
		//  //    if(!err){
		// 	// callback(aTweet);
		//  //    }
		//  });
		client.bulk({
		    maxRetries: 5,
		    index: 'tweets',
		    type: 'tweet',
		    body: bulk
		  },function(err,resp,status) {
		      if (err) {
		        console.log(err);
		      }
		      else {
		      	//console.log(bulk)
		        console.log(resp);
		      	res.json({state: 'success', message: 'successfully indexed all tweets', tweets: bulk})
		      }
		      console.log(status)
		  })
	    
	}
