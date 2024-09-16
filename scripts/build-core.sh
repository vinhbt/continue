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
npm install
npm link
npm run build:npm
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