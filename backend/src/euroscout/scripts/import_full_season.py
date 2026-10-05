import argparse

from euroscout.database.session import SessionLocal
from euroscout.services.import_service import ImportService
from euroscout.services.standing_service import StandingService


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Import player statistics, teams, and standings for one season."
    )
    parser.add_argument("season", type=int, help="Season starting year, e.g. 2025")
    parser.add_argument("round", type=int, help="Standings round to import")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    db = SessionLocal()
    try:
        player_result = ImportService().import_player_stats_for_season(
            db, args.season
        )
        db.flush()
        standings_count = StandingService().sync(
            db,
            season=args.season,
            round_number=args.round,
        )
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

    print(f"Full season import complete: E{args.season}")
    print(
        f"Players: {player_result.players_created} created, "
        f"{player_result.players_updated} updated"
    )
    print(
        f"Teams: {player_result.teams_created} created, "
        f"{player_result.teams_updated} updated"
    )
    print(
        f"Stats: {player_result.stat_rows_created} created, "
        f"{player_result.stat_rows_updated} updated"
    )
    print(f"Standings: {standings_count} synced")


if __name__ == "__main__":
    main()
