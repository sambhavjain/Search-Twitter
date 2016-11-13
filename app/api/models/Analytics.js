/**
 * Analytics.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	name: {               //name of searched string
  		type: 'string',
  		required: true
  	},
  	count : {           //total no of tweets with the searched string
  		type: 'string'
  	},
  	topPeople: {       //person name who has maximum no of tweets
  		type: 'object'
  	}
  }
};

