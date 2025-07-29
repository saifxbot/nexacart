from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.api.auth_routes import admin_required
from app.models.promotion import Promotion
from app.schemas.promotion_schema import PromotionSchema
from app import db

promotion_bp = Blueprint('promotion_bp', __name__)
promotion_schema = PromotionSchema()
promotions_schema = PromotionSchema(many=True)

@promotion_bp.route('/admin/promotions', methods=['POST'])
@jwt_required()
@admin_required
def create_promotion():
    data = request.get_json()
    promotion = Promotion(title=data['title'], image_url=data.get('image_url'), description=data.get('description'))
    db.session.add(promotion)
    db.session.commit()
    return promotion_schema.dump(promotion), 201

@promotion_bp.route('/admin/promotions', methods=['GET'])
@jwt_required()
@admin_required
def get_promotions():
    promotions = Promotion.query.all()
    return jsonify(promotions_schema.dump(promotions))

@promotion_bp.route('/admin/promotions/<int:promotion_id>', methods=['GET'])
@jwt_required()
@admin_required
def get_promotion(promotion_id):
    promotion = Promotion.query.get_or_404(promotion_id)
    return promotion_schema.dump(promotion)

@promotion_bp.route('/admin/promotions/<int:promotion_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_promotion(promotion_id):
    promotion = Promotion.query.get_or_404(promotion_id)
    data = request.get_json()
    if 'title' in data:
        promotion.title = data['title']
    if 'image_url' in data:
        promotion.image_url = data['image_url']
    if 'description' in data:
        promotion.description = data['description']
    db.session.commit()
    return promotion_schema.dump(promotion)

@promotion_bp.route('/admin/promotions/<int:promotion_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_promotion(promotion_id):
    promotion = Promotion.query.get_or_404(promotion_id)
    db.session.delete(promotion)
    db.session.commit()
    return jsonify({"message": "Promotion deleted"})
