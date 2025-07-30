"""Add product_ids field to blog table for shoppable blog association.

Revision ID: add_product_ids_to_blog
Revises: add_discount_to_promotion
Create Date: 2025-07-30 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_product_ids_to_blog'
down_revision = 'add_discount_to_promotion'
branch_labels = None
depends_on = None
"""
Add product_ids field to blog table for shoppable blog association.
"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    with op.batch_alter_table('blog') as batch_op:
        batch_op.add_column(sa.Column('product_ids', sa.String(length=255)))

def downgrade():
    with op.batch_alter_table('blog') as batch_op:
        batch_op.drop_column('product_ids')
