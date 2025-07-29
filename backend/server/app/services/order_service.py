from app import db
from app.models.order import Order, OrderItem
from app.models.product import Product
from .cart_service import get_user_cart

def create_order_from_cart(user_id):
    cart = get_user_cart(user_id)

    if not cart.items.first():
        return None, "Cart is empty"

    total_price = 0
    # Check stock for all items before creating order
    for item in cart.items:
        if item.product.stock_quantity < item.quantity:
            return None, f"Not enough stock for {item.product.name}"
        total_price += item.product.price * item.quantity

    # Create the order
    new_order = Order(user_id=user_id, total_price=total_price)
    db.session.add(new_order)
    
    # Move items from cart to order and update stock
    for item in cart.items:
        order_item = OrderItem(
            order=new_order,
            product_id=item.product_id,
            quantity=item.quantity,
            price_at_purchase=item.product.price
        )
        db.session.add(order_item)
        
        # Decrement stock
        item.product.stock_quantity -= item.quantity
        
        # Delete cart item
        db.session.delete(item)

    db.session.commit()
    return new_order, "Order created successfully"