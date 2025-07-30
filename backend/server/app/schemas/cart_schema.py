from app import ma
from app.models.cart import Cart, CartItem
from .product_schema import ProductSchema

class CartItemSchema(ma.SQLAlchemyAutoSchema):
    product = ma.Nested(ProductSchema) # Nest product details
    class Meta:
        model = CartItem
        include_fk = True
        load_instance = True

from .user_schema import UserSchema

class CartSchema(ma.SQLAlchemyAutoSchema):
    items = ma.List(ma.Nested(CartItemSchema))
    user = ma.Nested(UserSchema, only=("id", "first_name", "last_name"))
    class Meta:
        model = Cart
        include_fk = True
        load_instance = True