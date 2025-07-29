from app import ma
from app.models.order import Order, OrderItem
from .product_schema import ProductSchema

class OrderItemSchema(ma.SQLAlchemyAutoSchema):
    product = ma.Nested(ProductSchema, only=("id", "name", "image_url"))
    class Meta:
        model = OrderItem
        include_fk = True
        load_instance = True

class OrderSchema(ma.SQLAlchemyAutoSchema):
    items = ma.List(ma.Nested(OrderItemSchema))
    class Meta:
        model = Order
        include_fk = True
        load_instance = True