//svar request = require('request')
var twitter = require('twit')
var config = {
  consumer_key: 'e2cTI9aM8LPzFOW5iaiCDSPyp',
  consumer_secret: 'EliSDbE4j6RI4auyJEKeTnPv58NIFnhMlR7IdlJxvuhJd7SnJS',
  access_token: '2464889670-rzHFqKFo8SyUVtcF1RG6Rbe6ydFnvjlLAzyqyVm',
  access_token_secret: 'eiexqg6VzGV6eYK5IkXcqjMSsz1dBjuVLAWiv1GLI7cE6'
}
var T = new twitter(config);
module.exports = {
	search :function(req, res){
		var options = {  count: 1};
		var search = req.params.query
		//console.log(q)
		var data;
		// twitterClient.search(search,options,function(data){
		// // iterate over data.statuses and do stuff with the returned JSON
		// 	data = data.statuses;
		// 	console.log(data)
		// 	return res.json({tweets : data})
		// })
		T.get('search/tweets', {q:search, count:1}, function(err, data){
			//data = data
			if(err)
				console.error(err)
			console.log(data)
			return res.json({tweets : data})
		})
		
	}
}