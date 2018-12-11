const express = require('express');
const app = express();
const port = 3000;
var bodyParser = require('body-parser');
var fs = require('fs');
var request = require('request');


//app.get('/', (req, res) => res.send('Hello World!'));
app.use(express.static('./'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/check', (req, res) => res.send('Hello World!'));

app.post('/generatebadge', function(req, res){

 console.log(req.body.earner);

 var earner = req.body.earner;
 var badge = req.body.badge;

 var imagePath = __dirname+"/openbadge/"+badge+"/assertions/"+earner.id+".png";
 var imagePathURL = "openbadge/"+badge+"/assertions/"+earner.id+".png";
 console.log(imagePath);
//check whether badge is already issued or not by finding the badge image file.
// It would be better if we check for the JSON file also is there or not.
if(fs.existsSync(imagePath)){
	console.log("Inside file found");
	res.send({
		status: 'issued', 
		image: imagePathURL
	});
}else{
	try{
		var issuedOn = Math.floor(new Date().getTime()/1000);
		var assertions = {
				"uid": badge+"_"+earner.id,
				"recipient": {
					"type": "email",
					"identity": earner.email,
					"hashed": false
				},
				"issuedOn":  issuedOn,
				"badge": "http://badges.epizy.com/openbadge/"+badge+"_badge_class.json",
				"verify": {
					"type": "hosted",
					"url": "http://badges.epizy.com/openbadge/"+badge+"/assertions/"+earner.id+".json"
				}
			};
			
			//Save this assertion in the verify.url path.
			//This file would be verified by the mozilla backpack rest API used below.
			//In case rest API results in error, remove the assertion file saved in the verify.url path.


			//Call mozilla backpack rest API to generate baked badge, and save the file in the imagePath.
			//(Also you can save the imagePath in the database related to student information)
			//And return the image saved path in the response.
		  request('http://backpack.openbadges.org/baker?assertion=https://raw.githubusercontent.com/vinay-sattur/myopenbadge/master/openbadge/'+badge+'/assertions/'+earner.id+'.json')
		  .pipe(fs.createWriteStream(imagePath)).on('close', function(){
				console.log('imagesaved at '+imagePath);
				res.send({
					status: 'success', 
					image: imagePathURL
				});
			}).on('error',function(err){
				
				//In case rest API results in error, remove the assertion file saved in the verify.url path.
				res.send({status: 'error'});
			});

		  
	}catch(e){
		
		//In case rest API results in error, remove the assertion file saved in the verify.url path.
		res.send({status: 'error'});
	}
	
}

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


