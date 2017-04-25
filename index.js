var express = require('express');
var assert = require('assert');
var router = express.Router();
var str="",strJSON ="";
var mongo = require('mongodb').MongoClient;
var mongoObjectID = require('mongodb').ObjectID;
var URL = 'mongodb://localhost:27017/Customer';


/* GET home page. 
router.get('/', function(req, res) {
db.connect(URL,function(err,data){
	var reply = db.collection('customers').find();
	reply.each(function(err,doc){
		console.log(doc.age);

	});
	res.send(doc.age);
});
});*/



/* GET Userlist page. */
router.get('/', function(req, res) {
  mongo.connect(URL, function(err, db) {
            var cursor = db.collection('customers').find();
			//res.writeHead(200, { 'Content-Type': 'application/json' });  
console.log(cursor);
            cursor.each(function(err, item) {
 if (item != null) {
//strJSON = "",str ="";

 //console.log(item.age);
				 	 str += "{" + 
				 	 "\"_id\""+":\""+item._id+"\","+
				 	 "\"firstName\""+":\""+item.firstName+"\","+
				 	 "\"age\""+":"+item.age+
				 	 "},"
				    }
            });
            strJSON = "\"customers\":[" + str.substring(0, str.length - 1 )+"]" ;//= str.substring(0, str.length - 1 );
//console.log("{"+strJSON+"}");
strJSON = "{"+strJSON+"}";
//console.log(JSON.parse(strJSON));
            //var ons = JSON.parse(str);
           // res.render('index');
	     db.close();
	     res.send(strJSON);
         strJSON = "",str ="";
        });

  });


/* POST Userlist page. */
router.post('/Post',function(req,res,next){
console.log(req.body.id);
 console.log(JSON.stringify(req.body));
 var config = JSON.parse(JSON.stringify(req.body));

   		mongo.connect(URL,function(err,db){
		 var collection = db.collection('customers');

		 collection.insertOne({firstName:config.firstName,age:config.age});
		 db.close();
		 res.redirect('/');
	});
});



router.post('/Delete', function(req, res,next){
	var myId = JSON.parse(JSON.stringify(req.body));

	mongo.connect(URL,function(err,db){
		 db.collection('customers').remove({"_id": mongoObjectID(myId._id)},function(err,result){
		 	assert.equal(null,err);
		 	console.log("record deleted");
		 	db.close(); 
		 });
});
	res.send(200);
	});


router.post('/Put', function(req, res,next){
	var item = {
		firstName : req.body.firstName,
		age:req.body.age
	};
var myId = JSON.parse(JSON.stringify(req.body));
	mongo.connect(URL,function(err,db){
		 db.collection('customers').updateOne({"_id": mongoObjectID(myId._id)},{$set:item},function(err,result){
		 	assert.equal(null,err);
		 	console.log(mongoObjectID(req.body.id));
		 	console.log("record updated");
		 	db.close();
		 });
});
	res.send(200);
	});


module.exports = router;
