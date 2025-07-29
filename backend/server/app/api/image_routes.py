from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.api.auth_routes import admin_required
from app.models.image import Image
from app.schemas.image_schema import ImageSchema
from app import db

image_bp = Blueprint('image_bp', __name__)
image_schema = ImageSchema()
images_schema = ImageSchema(many=True)

@image_bp.route('/admin/images', methods=['POST'])
@jwt_required()
@admin_required
def create_image():
    data = request.get_json()
    image = Image(url=data['url'], product_id=data.get('product_id'))
    db.session.add(image)
    db.session.commit()
    return image_schema.dump(image), 201

@image_bp.route('/admin/images', methods=['GET'])
@jwt_required()
@admin_required
def get_images():
    images = Image.query.all()
    return jsonify(images_schema.dump(images))

@image_bp.route('/admin/images/<int:image_id>', methods=['GET'])
@jwt_required()
@admin_required
def get_image(image_id):
    image = Image.query.get_or_404(image_id)
    return image_schema.dump(image)

@image_bp.route('/admin/images/<int:image_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_image(image_id):
    image = Image.query.get_or_404(image_id)
    data = request.get_json()
    if 'url' in data:
        image.url = data['url']
    if 'product_id' in data:
        image.product_id = data['product_id']
    db.session.commit()
    return image_schema.dump(image)

@image_bp.route('/admin/images/<int:image_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_image(image_id):
    image = Image.query.get_or_404(image_id)
    db.session.delete(image)
    db.session.commit()
    return jsonify({"message": "Image deleted"})
