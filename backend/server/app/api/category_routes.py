from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.api.auth_routes import admin_required
from app.models.category import Category
from app.schemas.category_schema import CategorySchema
from app import db

category_bp = Blueprint('category_bp', __name__)
category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)

@category_bp.route('/admin/categories', methods=['POST'])
@jwt_required()
@admin_required
def create_category():
    data = request.get_json()
    category = Category(name=data['name'], description=data.get('description'))
    db.session.add(category)
    db.session.commit()
    return category_schema.dump(category), 201

@category_bp.route('/admin/categories', methods=['GET'])
@jwt_required()
@admin_required
def get_categories():
    categories = Category.query.all()
    return jsonify(categories_schema.dump(categories))

@category_bp.route('/admin/categories/<int:category_id>', methods=['GET'])
@jwt_required()
@admin_required
def get_category(category_id):
    category = Category.query.get_or_404(category_id)
    return category_schema.dump(category)

@category_bp.route('/admin/categories/<int:category_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_category(category_id):
    category = Category.query.get_or_404(category_id)
    data = request.get_json()
    if 'name' in data:
        category.name = data['name']
    if 'description' in data:
        category.description = data['description']
    db.session.commit()
    return category_schema.dump(category)

@category_bp.route('/admin/categories/<int:category_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_category(category_id):
    category = Category.query.get_or_404(category_id)
    db.session.delete(category)
    db.session.commit()
    return jsonify({"message": "Category deleted"})
