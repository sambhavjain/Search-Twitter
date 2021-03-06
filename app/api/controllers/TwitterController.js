var client = require('../../elasticSearch.js')
var twitter = require('twit')
var config = require('./config.js')
var secret = {
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token: config.access_token,
  access_token_secret: config.access_token_secret
}
var T = new twitter(secret);
module.exports = {
	searchAndIndex :function(req, res){
		// var options = { count: 100};
		var search = encodeURI(req.params.query)
		//console.log(q)
	
		T.get('search/tweets', {q:search, count: 50}, function(err, data){
			//data = data
			var noOfTweets = data.statuses.length
			if(err)
				console.error(err)
			
			// console.log(noOfTweets)
			 
			var tweets = data.statuses
			//console.log(tweets[0].user.name)
			var tuples = []
			var user = {}                                            //using hashmap storing name of person with their count
			for(tweet in tweets){
				//console.log(tweets[tweet].user.name)
				if(tweets[tweet].user.name in user){
					//console.log(user[tweets[tweet].user.name])	
					user[tweets[tweet].user.name].count +=1 ;
					//console.log('value = '+user[tweets[tweet].user.name].count)
				} else
					user[tweets[tweet].user.name] = {count: 1};
				if(tweet == tweets.length-1){
					for(x in user){
						tuples.push([x, user[x]])
					}
					// tuples = JSON.parse(tuples);
					var top10 = tuples.sort(function(a, b) { return a[1].count > b[1].count ? -1 : 1; }).slice(0, 10);
					
					// for(x in user){
					// 	if(max < user[x].count){
					// 		max = user[x].count	
					// 		top[x] = {count: max}
					// 	}
					// }
					// console.log(top10)
				}
			}
			Analytics.findOne({name:req.params.query}).exec(function (err, done){
			  if (err) {
			   	console.error(err)
			    // return res.serverError(err);
			  }
			    else if(done != null){
			    	Analytics.update({name: req.params.query},{count: noOfTweets, topPeople: top10}).exec(function createCB(err,created){ 
						if(err)
							console.error(err)
						console.log(created)
						//return res.json({ notice: 'Created with name ' + created.name }); 
					});		
				} else {
					Analytics.create({name: req.params.query, count: noOfTweets, topPeople: top10}).exec(function createCB(err,created){ 
						if(err)
							console.error(err)
						console.log(created)
						//return res.json({ notice: 'Created with name ' + created.name }); 
					});
				}
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
		    query: {                                 //search all docs with given keyword from elastic search db
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
		for(var tweet in tweets){                         //Making bulk array for indexing

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
		client.bulk({                             //Indexing all tweets and storing in ES db
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
		        //console.log(resp);
		      	res.json({state: 'success', message: 'successfully indexed all tweets', tweets: bulk})
		      }
		      console.log(status)
		  })
	    
	}
