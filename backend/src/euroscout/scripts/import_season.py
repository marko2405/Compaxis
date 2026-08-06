import argparse

from euroscout.database.session import SessionLocal
from euroscout.services.import_service import ImportService


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Import EuroLeague player statistics for one season."
    )
    parser.add_argument("season", type=int, help="Season starting year, e.g. 2024")

    return parser.parse_args()


def main() -> None:
    args = parse_args()
    db = SessionLocal()

    try:
        result = ImportService().import_player_stats_for_season(db, args.season)
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

    print(
        f"Players: {result.players_created} created, {result.players_updated} updated"
    )
    print(f"Teams: {result.teams_created} created, {result.teams_updated} updated")
    print(
        f"Stat rows: {result.stat_rows_created} created, "
        f"{result.stat_rows_updated} updated"
    )


if __name__ == "__main__":
    main()
