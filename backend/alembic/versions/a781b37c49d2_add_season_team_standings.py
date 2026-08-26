"""add season team standings

Revision ID: a781b37c49d2
Revises: f43beaeba6bb
Create Date: 2026-08-26 18:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "a781b37c49d2"
down_revision: str | Sequence[str] | None = "f43beaeba6bb"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "season_team_standings",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("season_id", sa.Integer(), nullable=False),
        sa.Column("team_id", sa.Integer(), nullable=False),
        sa.Column("rank", sa.Integer(), nullable=False),
        sa.Column("games_played", sa.Integer(), nullable=False),
        sa.Column("wins", sa.Integer(), nullable=False),
        sa.Column("losses", sa.Integer(), nullable=False),
        sa.Column("win_percentage", sa.Float(), nullable=False),
        sa.Column("points_for", sa.Integer(), nullable=False),
        sa.Column("points_against", sa.Integer(), nullable=False),
        sa.Column("point_differential", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["season_id"], ["seasons.id"]),
        sa.ForeignKeyConstraint(["team_id"], ["teams.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("season_id", "team_id", name="uq_standing_season_team"),
    )


def downgrade() -> None:
    op.drop_table("season_team_standings")
