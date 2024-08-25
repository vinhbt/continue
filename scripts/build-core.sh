#!/usr/bin/env bash
# This is used in a task in .vscode/tasks.json
# Start developing with:
# - Run Task -> Install Dependencies
# - Debug -> Extension
set -e

echo "Installing Core extension dependencies..."
pushd core
rm -rf node_modules
rm -rf dist
npm install
npm link

popd

echo "Done"