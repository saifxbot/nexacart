from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.api.auth_routes import admin_required
from app.models.inventory import Inventory
from app.schemas.inventory_schema import InventorySchema
from app import db

inventory_bp = Blueprint('inventory_bp', __name__)
inventory_schema = InventorySchema()
inventories_schema = InventorySchema(many=True)

@inventory_bp.route('/admin/inventory', methods=['POST'])
@jwt_required()
@admin_required
def create_inventory():
    data = request.get_json()
    # Prevent duplicate inventory for the same product_id
    existing = Inventory.query.filter_by(product_id=data['product_id']).first()
    if existing:
        return jsonify({'error': 'Inventory for this product already exists.'}), 400
    inventory = Inventory(product_id=data['product_id'], quantity=data['quantity'])
    db.session.add(inventory)
    db.session.commit()
    return inventory_schema.dump(inventory), 201

@inventory_bp.route('/admin/inventory', methods=['GET'])
@jwt_required()
@admin_required
def get_inventories():
    inventories = Inventory.query.all()
    return jsonify(inventories_schema.dump(inventories))

@inventory_bp.route('/admin/inventory/<int:inventory_id>', methods=['GET'])
@jwt_required()
@admin_required
def get_inventory(inventory_id):
    inventory = Inventory.query.get_or_404(inventory_id)
    return inventory_schema.dump(inventory)

@inventory_bp.route('/admin/inventory/<int:inventory_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_inventory(inventory_id):
    inventory = Inventory.query.get_or_404(inventory_id)
    data = request.get_json()
    if 'quantity' in data:
        inventory.quantity = data['quantity']
    if 'product_id' in data:
        inventory.product_id = data['product_id']
    db.session.commit()
    return inventory_schema.dump(inventory)

@inventory_bp.route('/admin/inventory/<int:inventory_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_inventory(inventory_id):
    inventory = Inventory.query.get_or_404(inventory_id)
    db.session.delete(inventory)
    db.session.commit()
    return jsonify({"message": "Inventory deleted"})
