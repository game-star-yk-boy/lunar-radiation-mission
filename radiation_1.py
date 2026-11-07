"""hello, Local launcher for the Lunar Radiation Mission Phaser 4 game.

Run with: python radiation_1.py
Then open: http://127.0.0.1:8000
"""

from __future__ import annotations

import argparse
import http.server
import socketserver
import webbrowser
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent / "lunar-radiation-mission" / "dist"


class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


def main() -> None:
    parser = argparse.ArgumentParser(description="Serve the Lunar Radiation Mission game.")
    parser.add_argument("--port", type=int, default=8000, help="Local port (default: 8000)")
    parser.add_argument("--no-browser", action="store_true", help="Do not open a browser automatically")
    args = parser.parse_args()

    if not PROJECT_ROOT.exists():
        raise SystemExit(f"Game files were not found at {PROJECT_ROOT}")

    handler = lambda *handler_args, **handler_kwargs: http.server.SimpleHTTPRequestHandler(
        *handler_args, directory=str(PROJECT_ROOT), **handler_kwargs
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
"""Local launcher for the Lunar Radiation Mission Phaser 4 game.

Run with: python radiation_1.py
Then open: http://127.0.0.1:8000
"""

from __future__ import annotations

import argparse
import http.server
import socketserver
import webbrowser
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent / "lunar-radiation-mission" / "dist"


class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


def main() -> None:
    parser = argparse.ArgumentParser(description="Serve the Lunar Radiation Mission game.")
    parser.add_argument("--port", type=int, default=8000, help="Local port (default: 8000)")
    parser.add_argument("--no-browser", action="store_true", help="Do not open a browser automatically")
    args = parser.parse_args()

    if not PROJECT_ROOT.exists():
        raise SystemExit(f"Game files were not found at {PROJECT_ROOT}")

    handler = lambda *handler_args, **handler_kwargs: http.server.SimpleHTTPRequestHandler(
        *handler_args, directory=str(PROJECT_ROOT), **handler_kwargs
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
