var client = require('./elasticSearch.js');

client.cluster.health({},function(err,resp,status) {  
  console.log("-- Client Health --",resp);
});