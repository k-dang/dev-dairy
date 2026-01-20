#!/bin/sh
# Dev Diary installer script
# Usage: curl -fsSL https://raw.githubusercontent.com/k-dang/dev-diary/main/install.sh | sh

set -e

REPO="k-dang/dev-diary"
INSTALL_DIR="${INSTALL_DIR:-$HOME/.local/bin}"

# Detect platform
OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
  Linux*)
    if [ "$ARCH" = "x86_64" ]; then
      PLATFORM="linux-x64"
      EXT=""
    else
      echo "Unsupported architecture: $ARCH"
      exit 1
    fi
    ;;
  Darwin*)
    if [ "$ARCH" = "arm64" ]; then
      PLATFORM="darwin-arm64"
    elif [ "$ARCH" = "x86_64" ]; then
      PLATFORM="darwin-x64"
    else
      echo "Unsupported architecture: $ARCH"
      exit 1
    fi
    EXT=""
    ;;
  *)
    echo "Unsupported OS: $OS"
    echo "Please download the appropriate binary from https://github.com/$REPO/releases"
    exit 1
    ;;
esac

echo "Detected platform: $PLATFORM"

# Get latest release version
LATEST_VERSION=$(curl -fsSL https://api.github.com/repos/$REPO/releases/latest | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')

if [ -z "$LATEST_VERSION" ]; then
  echo "Failed to get latest version"
  exit 1
fi

echo "Latest version: $LATEST_VERSION"

# Download URL
BINARY_NAME="dev-diary-$PLATFORM$EXT"
DOWNLOAD_URL="https://github.com/$REPO/releases/download/$LATEST_VERSION/$BINARY_NAME"

echo "Downloading from: $DOWNLOAD_URL"

# Create install directory if it doesn't exist
mkdir -p "$INSTALL_DIR"

# Download binary
TEMP_FILE=$(mktemp)
if ! curl -fsSL "$DOWNLOAD_URL" -o "$TEMP_FILE"; then
  echo "Failed to download binary"
  rm -f "$TEMP_FILE"
  exit 1
fi

# Install binary
mv "$TEMP_FILE" "$INSTALL_DIR/dev-diary"
chmod +x "$INSTALL_DIR/dev-diary"

echo ""
echo "✓ dev-diary installed to $INSTALL_DIR/dev-diary"
echo ""

# Check if install dir is in PATH
case ":$PATH:" in
  *":$INSTALL_DIR:"*)
    echo "Run 'dev-diary' to get started!"
    ;;
  *)
    echo "Add $INSTALL_DIR to your PATH to use 'dev-diary' from anywhere:"
    echo "  export PATH=\"\$PATH:$INSTALL_DIR\""
    echo ""
    echo "Or run directly: $INSTALL_DIR/dev-diary"
    ;;
esac
