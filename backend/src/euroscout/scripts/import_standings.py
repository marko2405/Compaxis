import argparse

from euroscout.database.session import SessionLocal
from euroscout.services.standing_service import StandingService


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Import official EuroLeague standings."
    )
    parser.add_argument("season", type=int, help="Season starting year, e.g. 2024")
    parser.add_argument("round", type=int, help="Official standings round, e.g. 34")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    db = SessionLocal()
    try:
        synced = StandingService().sync(db, season=args.season, round_number=args.round)
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

    print(f"Standings rows synced: {synced}")


if __name__ == "__main__":
    main()
