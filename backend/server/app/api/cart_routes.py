from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services import cart_service
from app.schemas.cart_schema import CartSchema

cart_bp = Blueprint('cart_bp', __name__)
cart_schema = CartSchema()

@cart_bp.route('/', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    cart = cart_service.get_user_cart(user_id)
    return jsonify(cart_schema.dump(cart))

@cart_bp.route('/add', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    data = request.get_json()
    product_id = data.get('productId')
    quantity = data.get('quantity', 1)

    cart, message = cart_service.add_to_cart(user_id, product_id, quantity)
    if not cart:
        return jsonify({"message": message}), 400
    return jsonify(cart_schema.dump(cart))

@cart_bp.route('/update', methods=['PUT'])
@jwt_required()
def update_cart():
    user_id = get_jwt_identity()
    data = request.get_json()
    product_id = data.get('productId')
    quantity = data.get('quantity')

    cart, message = cart_service.update_cart_item(user_id, product_id, quantity)
    if not cart:
        return jsonify({"message": message}), 400
    return jsonify(cart_schema.dump(cart))


@cart_bp.route('/remove', methods=['DELETE'])
@jwt_required()
def remove_from_cart():
    user_id = get_jwt_identity()
    data = request.get_json()
    product_id = data.get('productId')
    
    cart, message = cart_service.remove_from_cart(user_id, product_id)
    if not cart:
        return jsonify({"message": message}), 404
    return jsonify(cart_schema.dump(cart))

# CLEAR cart
@cart_bp.route('/clear', methods=['DELETE'])
@jwt_required()
def clear_cart():
    user_id = get_jwt_identity()
    cart = cart_service.get_user_cart(user_id)
    if not cart:
        return jsonify({"message": "Cart not found"}), 404
    # Remove all items from cart
    for item in list(cart.items):
        cart_service.remove_from_cart(user_id, item.product_id)
    return jsonify({"message": "Cart cleared"})