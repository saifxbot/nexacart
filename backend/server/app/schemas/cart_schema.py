from app import ma
from app.models.cart import Cart, CartItem
from .product_schema import ProductSchema

class CartItemSchema(ma.SQLAlchemyAutoSchema):
    product = ma.Nested(ProductSchema) # Nest product details
    class Meta:
        model = CartItem
        include_fk = True
        load_instance = True

class CartSchema(ma.SQLAlchemyAutoSchema):
    items = ma.List(ma.Nested(CartItemSchema))
    class Meta:
        model = Cart
        include_fk = True
        load_instance = True