import grpc
from concurrent import futures
import inventory_order_pb2 as pb2
import inventory_order_pb2_grpc as pb2_grpc

class InventoryService(pb2_grpc.InventoryServiceServicer):
    def __init__(self):
        self.stock = {}

    def AddItem(self, request, context):
        if request.id in self.stock:
            self.stock[request.id].quantity += request.quantity
            return pb2.Ack(status="SUCCESS", message=f"Updated stock for {request.name}.")
        else:
            self.stock[request.id] = request
            return pb2.Ack(status="SUCCESS", message=f"Item {request.name} added.")

    def CheckStock(self, request, context):
        item = self.stock.get(request.item_id)
        if item and item.quantity >= request.quantity:
            return pb2.StockResponse(available=True, message="In stock")
        return pb2.StockResponse(available=False, message="Insufficient stock")

    def DeductStock(self, request, context):
        item = self.stock.get(request.item_id)
        if item and item.quantity >= request.quantity:
            item.quantity -= request.quantity
            return pb2.Ack(status="SUCCESS", message="Stock deducted")
        return pb2.Ack(status="FAIL", message="Stock deduction failed")

def serve():
    try:
        server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
        pb2_grpc.add_InventoryServiceServicer_to_server(InventoryService(), server)
        server.add_insecure_port('[::]:50052')
        server.start()
        print("InventoryService running on port 50052")
        server.wait_for_termination()
    except Exception as e:
        print("Server failed to start:", e)

if __name__ == '__main__':
    serve()
