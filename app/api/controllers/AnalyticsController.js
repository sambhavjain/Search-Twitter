module.exports = {
	getNoOfTweets : function(req, res){
		console.log(req.params.key)
		Analytics.findOne({name:req.params.key}).exec(function (err, tweetsNamedKey){
		  if (err) {
		   	console.error(err)
		    return res.serverError(err);
		  }
		  sails.log('Wow, there are %d tweets containing keyword %s.  Check it out:', tweetsNamedKey.length, req.params.key, tweetsNamedKey);
		  return res.json(tweetsNamedKey.count);
		});
	},
	topPeople : function(req, res){
		//console.log(req.params.key)
		Analytics.findOne({name:req.params.key}).exec(function (err, tweetsNamedKey){
		  if (err) {
		   	console.error(err)
		    return res.serverError(err);
		  }
		  sails.log('People who tweeted most are:', tweetsNamedKey.topPeople);
		  return res.json(tweetsNamedKey.topPeople);
		});
	}
}