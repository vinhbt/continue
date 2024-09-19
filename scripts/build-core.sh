#!/usr/bin/env bash
# This is used in a task in .vscode/tasks.json
# Start developing with:
# - Run Task -> Install Dependencies
# - Debug -> Extension
set -e

echo "Installing Core extension dependencies..."
pushd core
## This flag is set because we pull down Chromium at runtime
export PUPPETEER_SKIP_DOWNLOAD='true'
rm -rf "./node_modules",
rm -rf "./dist",
rm -rf  "./node_modules",
rm -rf  "./bin",
rm -rf  "./dist",
rm -rf  "./out",
npm install
npm link
npm run build
popd

echo "Installing binary..."
pushd binary
npm install
npm run build
popd

pushd extensions/intellij
./gradlew buildPlugin
popd

echo "Done"