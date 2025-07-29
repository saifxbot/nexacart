
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services import order_service
from app.schemas.order_schema import OrderSchema
from app.models.order import Order
from app.api.auth_routes import admin_required
from app import db

order_bp = Blueprint('order_bp', __name__)
order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)

@order_bp.route('/create', methods=['POST'])
@jwt_required()
def create_order():
    user_id = get_jwt_identity()
    order, message = order_service.create_order_from_cart(user_id)
    if not order:
        return jsonify({"message": message}), 400
    return jsonify(order_schema.dump(order)), 201


@order_bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()
    user_orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    return jsonify(orders_schema.dump(user_orders))

# ADMIN: Update order status
@order_bp.route('/admin/orders/<int:order_id>/status', methods=['PUT'])
@admin_required
def update_order_status(order_id):
    data = request.get_json()
    status = data.get('status')
    if not status:
        return jsonify({"message": "Status is required"}), 400
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"message": "Order not found"}), 404
    order.status = status
    db.session.commit()
    return jsonify({"message": "Order status updated"})