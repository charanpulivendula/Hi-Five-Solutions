
# Inventory App – Python & Node.js Microservices with gRPC

This project demonstrates a cross-platform Inventory Management system using gRPC and Protocol Buffers (Protobuf) between:
- Python-based InventoryService (server)
- Node.js-based OrderService (client CLI)

It showcases how to add, deduct, and check stock through efficient, real-time communication between microservices in different languages using gRPC and Protobuf.

---

## Features
- Bi-directional gRPC communication between Python and Node.js
- Command-line interface for users to manage stock (Add / Deduct / Check)
- Fast, compact data exchange via Protobuf
- Easily extensible (add REST, DB, or UI if needed)

---

## Folder Structure

```
inventory_app/
|
├── inventory_service/         # Python gRPC server
│   ├── inventory_order.proto  # Shared Protobuf schema
│   ├── inventory_service.py   # Python gRPC server
│   ├── inventory_order_pb2.py         # Generated Python protobuf
│   └── inventory_order_pb2_grpc.py    # Generated gRPC service
|
├── order_service/             # Node.js gRPC client
│   ├── order_client.js        # Interactive CLI for managing inventory
│   └── inventory_order.proto  # Same .proto file
```

---

## 1. Install Dependencies

### Python (in `inventory_service/`)
```bash
pip install grpcio grpcio-tools
```

### Node.js (in `order_service/`)
```bash
npm install @grpc/grpc-js @grpc/proto-loader readline
```

---

## 2. Compile the Protobuf File

Make sure both services share the same `.proto` file.

### Generate Python code:
```bash
# From inventory_service/
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. inventory_order.proto
```

Node.js uses dynamic loading, so no code generation needed.

---

## 3. Run the Services

### Start the Python InventoryService:
```bash
cd inventory_service/
python inventory_service.py
```

The service will initialize with pre-defined stock:
```
Initialized stock: item1 (Widget) - 10 units
Initialized stock: item2 (Gadget) - 15 units
...
```

### Start the Node.js OrderService (CLI):
```bash
cd order_service/
node order_client.js
```

You’ll get an interactive CLI:

```
--- Inventory Management ---
1. Add Stock
2. Deduct Stock
3. Check Stock
4. Exit
Choose an option (1-4):
```

---

## Example Usage

1. Add Stock
   - Enter item ID: item100
   - Enter name: Monitor
   - Enter quantity: 25

2. Check Stock
   - Enter item ID: item100
   - Enter quantity: 10
   - Output: Available: true - In stock

3. Deduct Stock
   - Enter item ID: item100
   - Enter quantity: 10
   - Output: Order Placed: Stock deducted

---

## Protobuf Schema (`inventory_order.proto`)

```proto
syntax = "proto3";

package inventoryorder;

message Item {
  string id = 1;
  string name = 2;
  int32 quantity = 3;
}

message StockRequest {
  string item_id = 1;
  int32 quantity = 2;
}

message StockResponse {
  bool available = 1;
  string message = 2;
}

message Ack {
  string status = 1;
  string message = 2;
}

message OrderRequest {
  string order_id = 1;
  string item_id = 2;
  int32 quantity = 3;
}

message OrderResponse {
  string status = 1;
  string message = 2;
}

service InventoryService {
  rpc AddItem (Item) returns (Ack);
  rpc CheckStock (StockRequest) returns (StockResponse);
  rpc DeductStock (StockRequest) returns (Ack);
}
```

---

## Tradeoffs and Benefits

### Why gRPC + Protobuf?
- Efficient binary format = Low latency
- Language-neutral (Python ↔ Node.js)
- Schema-driven = Self-documenting APIs
- Built-in streaming and error handling

### Considerations
- Binary format = Not human-readable
- Requires `.proto` management
- gRPC not natively supported in browsers (needs gateway for UI)

---

## Future Improvements

- Add persistent DB support (e.g., SQLite, PostgreSQL)
- REST or GraphQL gateway for frontend integration
- Web dashboard (React/Next.js)
- Dockerize for deployment

---

## Conclusion

This project shows how you can build cross-language microservices using gRPC and Protobuf, making it ideal for real-time, scalable, and efficient systems like inventory and order management.
