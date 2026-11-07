"""Launch the Lunar Radiation Mission game from this repository.

Run ``python Radiation1.py`` and open http://127.0.0.1:8000.
"""

from __future__ import annotations

import argparse
import http.server
import socketserver
import webbrowser
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent


class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


def main() -> None:
    parser = argparse.ArgumentParser(description="Serve Lunar Radiation Mission.")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--no-browser", action="store_true")
    args = parser.parse_args()

    if not (PROJECT_ROOT / "index.html").is_file():
        raise SystemExit(f"Game files were not found at {PROJECT_ROOT}")

    handler = lambda *a, **kw: http.server.SimpleHTTPRequestHandler(
        *a, directory=str(PROJECT_ROOT), **kw
    )
    url = f"http://127.0.0.1:{args.port}"
    with ReusableTCPServer(("127.0.0.1", args.port), handler) as server:
        print(f"Lunar Radiation Mission is running at {url}")
        print("Press Ctrl+C to stop the server.")
        if not args.no_browser:
            webbrowser.open(url)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")


if __name__ == "__main__":
    main()
