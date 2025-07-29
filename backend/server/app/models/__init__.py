# Ensure all models are imported so SQLAlchemy relationships resolve correctly
from .user import User
from .cart import Cart, CartItem
from .order import Order
from .product_review import ProductReview
from .product import Product
