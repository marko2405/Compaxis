from euroscout.clients.euroleague_client import EuroLeagueClient


def main() -> None:
    client = EuroLeagueClient()

    players = client.get_player_stats_for_season(2024)

    print(f"Rows: {len(players)}")
    print()
    print("First player:")
    print(players[0])


if __name__ == "__main__":
    main()
