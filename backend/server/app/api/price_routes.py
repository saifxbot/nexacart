from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.api.auth_routes import admin_required
from app.models.price import Price
from app.schemas.price_schema import PriceSchema
from app import db

price_bp = Blueprint('price_bp', __name__)
price_schema = PriceSchema()
prices_schema = PriceSchema(many=True)

@price_bp.route('/admin/prices', methods=['POST'])
@jwt_required()
@admin_required
def create_price():
    data = request.get_json()
    price = Price(product_id=data['product_id'], value=data['value'], valid_from=data.get('valid_from'), valid_to=data.get('valid_to'))
    db.session.add(price)
    db.session.commit()
    return price_schema.dump(price), 201

@price_bp.route('/admin/prices', methods=['GET'])
@jwt_required()
@admin_required
def get_prices():
    prices = Price.query.all()
    return jsonify(prices_schema.dump(prices))

@price_bp.route('/admin/prices/<int:price_id>', methods=['GET'])
@jwt_required()
@admin_required
def get_price(price_id):
    price = Price.query.get_or_404(price_id)
    return price_schema.dump(price)

@price_bp.route('/admin/prices/<int:price_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_price(price_id):
    price = Price.query.get_or_404(price_id)
    data = request.get_json()
    if 'value' in data:
        price.value = data['value']
    if 'valid_from' in data:
        price.valid_from = data['valid_from']
    if 'valid_to' in data:
        price.valid_to = data['valid_to']
    db.session.commit()
    return price_schema.dump(price)

@price_bp.route('/admin/prices/<int:price_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_price(price_id):
    price = Price.query.get_or_404(price_id)
    db.session.delete(price)
    db.session.commit()
    return jsonify({"message": "Price deleted"})
