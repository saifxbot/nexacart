from app import db
from app.models.cart import Cart, CartItem
from app.models.product import Product

def get_user_cart(user_id):
    cart = Cart.query.filter_by(user_id=user_id).first()
    if not cart:
        cart = Cart(user_id=user_id)
        db.session.add(cart)
        db.session.commit()
    return cart

def add_to_cart(user_id, product_id, quantity):
    cart = get_user_cart(user_id)
    product = Product.query.get(product_id)

    if not product:
        return None, "Product not found"
    if product.stock_quantity < quantity:
        return None, "Not enough stock"
    
    cart_item = cart.items.filter_by(product_id=product_id).first()

    if cart_item:
        # Item already in cart, update quantity
        cart_item.quantity += quantity
    else:
        # Add new item to cart
        cart_item = CartItem(cart_id=cart.id, product_id=product_id, quantity=quantity)
        db.session.add(cart_item)
    
    db.session.commit()
    return cart, "Item added to cart"

def update_cart_item(user_id, product_id, new_quantity):
    cart = get_user_cart(user_id)
    cart_item = cart.items.filter_by(product_id=product_id).first()

    if not cart_item:
        return None, "Item not in cart"
    
    if new_quantity > 0:
        cart_item.quantity = new_quantity
    else: # If quantity is 0 or less, remove it
        db.session.delete(cart_item)
    
    db.session.commit()
    return cart, "Cart updated"

def remove_from_cart(user_id, product_id):
    cart = get_user_cart(user_id)
    cart_item = cart.items.filter_by(product_id=product_id).first()

    if cart_item:
        db.session.delete(cart_item)
        db.session.commit()
        return cart, "Item removed"
    
    return None, "Item not in cart"

# Admin: Get all carts
def get_all_carts():
    from app.models.cart import Cart
    return Cart.query.all()