var mysql = require('mysql');
var inquirer = require('inquirer');
var product;
var inStock;
var price;
var newProduct;
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
	manager()
})

var manager = function() {
    inquirer.prompt({
        name: "action",
        type: "input",
        message: "Yo you're the Man!! ager...What would you like to do?(type a number), 1) View Produts, 2) View Low Inventory, 3) Add to Inventory, 4)Add a new procduct?  "
    }).then(function(answer) {
        switch(answer.action) {
            case '1':
                viewProducts();
            break;
            
            case '2':
                viewLowInventory();
            break;
            
            case '3':
                addToInventory();
            break;
            
            case '4':
                addNewProduct();
            break;
        }
    })
};

var viewProducts = function() {
	connection.query('SELECT * FROM products', function(err, res) {
    for (var i = 0; i < res.length; i++) {
        console.log(res[i].id + " | " + res[i].name + " | " + res[i].price + " | " + res[i].inStock);
    }
    console.log("-----------------------------------");
    manager();
})
}

var viewLowInventory = function () {
connection.query('SELECT * FROM products', function(err, res) {
    for (var i = 0; i < res.length; i++) {
    	// console.log(res[i].inStock)
    	if (res[i].inStock <= 5){
        console.log(res[i].id + " | " + res[i].name + " | " + res[i].price + " | " + res[i].inStock);
    }
}
    console.log("-----------------------------------");
    manager();
})
}

var addToInventory = function() {
    inquirer.prompt({
        name: "name",
        type: "input",
        message: "What would you like to add inventory to?"
 }).then(function(answer) {
 	var query = 'SELECT id, name, price, inStock FROM products WHERE ?'

        connection.query(query, {name: answer.name}, function(err, res) {
            for (var i = 0; i < res.length; i++) {
                console.log("name: " + res[i].name + " || Price: " + res[i].price);
                product = res[i].name
                inStock = res[i].inStock
                price = res[i].price
            }
            console.log(product)
			console.log(inStock)
            howMany();


        })
    })
};

// console.log(product)
var howMany = function() {
	inquirer.prompt({
        name: "howMany",
        type: "input",
        message: "How many " + product + "s would you like to add?"
 }).then(function(answer) {
 	console.log(answer.howMany)
 	connection.query("UPDATE products SET ? WHERE ?", [{
    	inStock: (+inStock + +answer.howMany)
		}, {
    	name: product
		}], function(err, res) {});
		manager()
 	});

}
            
var addNewProduct = function() {
	inquirer.prompt({
        name: "what",
        type: "input",
        message: "What would you like to add to the inventory?",
    }).then(function(answer) {
    	newProduct = answer.what
    	console.log(newProduct)
    	connection.query("INSERT INTO products SET ?", {
    name: newProduct,
    
}, function(err, res) {});
    	howManyNew()
    });
    
}

var howManyNew = function() {
	inquirer.prompt({
        name: "howManyNew",
        type: "input",
        message: "How many " + newProduct + "s would you like to add?"
 }).then(function(answer) {
 	console.log(answer.howManyNew)
 	connection.query("UPDATE products SET ? WHERE ?", [{
    	inStock: answer.howManyNew
		}, {
    	name: newProduct
		}], function(err, res) {});
		whatPrice()
 	});

}

var whatPrice = function() {
	inquirer.prompt({
        name: "whatPrice",
        type: "input",
        message: "How much will the " + newProduct + "s cost?"
 }).then(function(answer) {
 	
 	connection.query("UPDATE products SET ? WHERE ?", [{
    	price: answer.whatPrice
		}, {
    	name: newProduct
		}], function(err, res) {});
		whichDept()
 	});

}

var whichDept = function() {
	inquirer.prompt({
        name: "whichDept",
        type: "input",
        message: "Which Department should the " + newProduct + "s go into?"
 }).then(function(answer) {
 	
 	connection.query("UPDATE products SET ? WHERE ?", [{
    	deptName: answer.whichDept
		}, {
    	name: newProduct
		}], function(err, res) {});
 		console.log("Inventory Updated!")
		viewProducts()
 	});

}



//         name: "howMany",
//         type: "input",
//        message: "How may of those are you adding?",
//        name: "dept",
//        type: "input",
//        message: "which Department do those belong in?",
//        name: "price",
//        type: "input",
//        message: "How much are you goint to sell those for?"
//    });
// }
        
