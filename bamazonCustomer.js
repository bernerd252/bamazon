var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'uoa25ublaow4obx5.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    port: 3306,
    user: 'yy19wvxy69bmrg05', 
    password:'l5r6kct65dw3vryi', //Your password
    database: 'dnt5ficdzslyvla5'
});

connection.connect(function(err){

	if(err){
		throw err;
	}

})

console.log("Welcome to Bamazon! Here are our products:")
connection.query('SELECT * FROM products', function(err, res) {
    for (var i = 0; i < res.length; i++) {
        console.log(res[i].id + " | " + res[i].name + " | " + res[i].price);
    }
    console.log("-----------------------------------");
    runSearch();
})
var product;
var inStock;
var price;
var runSearch = function() {
    inquirer.prompt({
        name: "name",
        type: "input",
        message: "What would you like to buy?"
 }).then(function(answer) {
 	var query = 'SELECT id, name, price, inStock FROM products WHERE ?'

        connection.query(query, {name: answer.name}, function(err, res) {
            for (var i = 0; i < res.length; i++) {
                console.log("name: " + res[i].name + " || Price: " + res[i].price);
                product = res[i].name
                inStock = res[i].inStock
                price = res[i].price
            }
   //          console.log(product)
			// console.log(inStock)
            howMany();


        })
    })
};

// console.log(product)
var howMany = function() {
	inquirer.prompt({
        name: "howMany",
        type: "input",
        message: "How many " + product + "s would you like?"
 }).then(function(answer) {
 	console.log(answer.howMany)
 	if (inStock < answer.howMany) {
 		console.log("Sorry we don't have that many, we only have " + inStock)
 		runSearch()
 	}

 	if (inStock >= answer.howMany) {
 		console.log("That's great!! We have that, it'll cost you $" + (price * answer.howMany))
 		connection.query("UPDATE products SET ? WHERE ?", [{
    	inStock: (inStock-answer.howMany)
		}, {
    	name: product
		}], function(err, res) {});
		runSearch()
 	}

});
            
        }

    



