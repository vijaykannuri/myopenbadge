var fs = require('fs');
//var bakery=require('openbadges-bakery');
var request = require('request');

function getBadges(listOfEarners, badge, organization, issuedon){

	for(earner in listOfEarners){
		
		assertion = createAssertion(earner, badge, organization, issuedon);
		
		verify(assertion);
		
		var bakedBadge = generateBadge(badgeLocation, assertion);
	
		//If badge is baked, save assertion in the server.
		//If assertion is saved successfully then return bakedBadge.
	
	}

}

function createAssertion(earner, badge, organization, issuedon){
	var assertion = {
		"uid": earner.uid,
		"recipient": {
			"identity": earner.email,
			"type": "email",
			"hashed": true
		},
		"badge": "http://issuersite.com/openbadges/"+organization+"/badges/"+badge+"/"+badge+".json",
		"verify": {
			"url": "http://issuersite.com/openbadges/"+organization+"/badges/"+badge+"/assertion/"+earner.uid+".json",
			"type": "hosted"
		},
		"issuedOn": issuedon
	} 
}

function generateBadge(badge, earner){

//Baking code
//prepare the assertion and image
	var img=fs.readFileSync('badge1.png');
	console.log("file read!!");
	console.log(img.length);
	var theAssertion ={
  "uid": "a1b2c3d4e5",
  "recipient": {
    "type": "email",
    "identity": "vinayrsattur@gmail.com",
    "hashed": false
  }
};
	var options = {
		image: img,
		assertion: theAssertion,
	};
	//bake assertion into image
	bakery.bake(options, function(err, data){
		//give the baked badge a file name
		var fileName = 'newbake.png';
		var imagePath = __dirname+"/baked/"+fileName;//"baked" directory
		//write the returned baked badge data to file
		console.log("Image Baked!!!");
		fs.writeFile(imagePath, data, function (err) {
			console.log("Inside write file.")
			if(err) console.log(err);
			else console.log("<img src='"+imagePath+"' alt='badge'/>");
		});
	});


}

function verify(earner){



}

function generateBadgeRestAPI(){
	/*request.get('http://backpack.openbadges.org/baker?assertion=https://raw.githubusercontent.com/vinay-sattur/myopenbadge/master/tricon-badge-award.json',function(req, res){
		//console.log(res);
		var imagePath = __dirname+"/bakedbadge.png";//"baked" directory
		fs.writeFile(imagePath, res.body, function (err) {
			console.log("Inside write file callback.")
			if(err) console.log(err);
			else console.log("<img src='"+imagePath+"' alt='badge'/>");
		});
	});*/

	var imagePath = __dirname+"/bakedbadge.png";//"baked" directory
	request('http://backpack.openbadges.org/baker?assertion=https://raw.githubusercontent.com/vinay-sattur/myopenbadge/master/tricon-badge-award.json').pipe(fs.createWriteStream(imagePath)).on('close', function(){
		console.log('imagesaved at '+imagePath);
	});
	console.log('request ended');
}

//generateBadge();

generateBadgeRestAPI();