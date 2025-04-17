const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const readline = require('readline');

// Load proto
const packageDefinition = protoLoader.loadSync('inventory_order.proto', {});
const proto = grpc.loadPackageDefinition(packageDefinition).inventoryorder;

// Connect to InventoryService
const inventoryClient = new proto.InventoryService('localhost:50052', grpc.credentials.createInsecure());

// Create readline interface for CLI input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Menu loop
function mainMenu() {
  console.log('\n--- Inventory Management ---1. Add Stock---2. Deduct Stock---3. Check Stock---4. Exit');

  rl.question('Choose an option (1-4): ', choice => {
    switch (choice) {
      case '1':
        handleAddStock();
        break;
      case '2':
        handleDeductStock();
        break;
      case '3':
        handleCheckStock();
        break;
      case '4':
        console.log('Goodbye!');
        rl.close();
        process.exit(0);
      default:
        console.log('Invalid choice. Try again.');
        mainMenu();
    }
  });
}

// Handler: Add Stock
function handleAddStock() {
  rl.question('Item ID: ', item_id => {
    rl.question('Item Name: ', name => {
      rl.question('Quantity to Add: ', qty => {
        const item = { item_id, name, quantity: parseInt(qty) };
        inventoryClient.AddItem(item, (err, response) => {
          if (err) console.error('Error:', err);
          else console.log('Response:', response.message);
          mainMenu();
        });
      });
    });
  });
}

// Handler: Deduct Stock
function handleDeductStock() {
  rl.question('Item ID: ', id => {
    rl.question('Quantity to Deduct: ', qty => {
      const req = { item_id: id, quantity: parseInt(qty) };
      inventoryClient.DeductStock(req, (err, response) => {
        if (err) console.error('Error:', err);
        else console.log('Response:', response.message);
        mainMenu();
      });
    });
  });
}

// Handler: Check Stock
function handleCheckStock() {
  rl.question('Item ID: ', id => {
    rl.question('Quantity to Check: ', qty => {
      const req = { item_id: id, quantity: parseInt(qty) };
      inventoryClient.CheckStock(req, (err, response) => {
        if (err) console.error('Error:', err);
        else console.log(`Available: ${response.available} - ${response.message}`);
        mainMenu();
      });
    });
  });
}

// Start the app
mainMenu();
