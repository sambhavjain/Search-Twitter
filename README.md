# Search-Twitter
#search using twitter live search api
Nodejs application (on the Sails framework) to connect with the Twitter Search API.

Functionality : 
1. The user is be able to enter a phrase/keyword etc and retrieve tweets containing the same. 
2.For the given keyword User can find : 
a. Number of Tweets 
b. People who tweeted the most (Top 10)

Storage : 
1. All tweets-specific data returned are first be stored in an Elastic Search data store, within the cluster and then can be queried again to retrieve them.
2. All the basic analytics are stored in a MongoDB collection before being retrieved.

Routes are in app/config/routes.js

'get /api/search/:query'   : 'TwitterController.searchAndIndex',     // indexing tweets to elastic search and returning he result obtained from twiter search api
'get /api/searches/:q'     : 'TwitterController.searches',          //quering from elasic search database
'get /api/tweetCount/:key' : 'AnalyticsController.getNoOfTweets',   //return no of tweets for the given keyword
'get /api/topPeople/:key'  : 'AnalyticsController.topPeople',       //return top10 people who tweeted for the given keyword

