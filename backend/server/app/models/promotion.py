from app import db

class Promotion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    discount = db.Column(db.String(50))
    image_url = db.Column(db.String(255))
    description = db.Column(db.Text)
