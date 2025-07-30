"""Add discount column to promotion table.

Revision ID: add_discount_to_promotion
Revises: 5dd0fbc9f915
Create Date: 2025-07-30 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_discount_to_promotion'
down_revision = '5dd0fbc9f915'
branch_labels = None
depends_on = None
"""
Add discount column to promotion table.
"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    with op.batch_alter_table('promotion') as batch_op:
        batch_op.add_column(sa.Column('discount', sa.String(length=50)))

def downgrade():
    with op.batch_alter_table('promotion') as batch_op:
        batch_op.drop_column('discount')
