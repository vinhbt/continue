#!/usr/bin/env bash
# This is used in a task in .vscode/tasks.json
# Start developing with:
# - Run Task -> Install Dependencies
# - Debug -> Extension
set -e

echo "Installing GUI extension dependencies..."
pushd gui
npm link @continuedev/core
npm run build
popd

rm -rf ./extensions/intellij/src/main/resources/webview/assets/*
cp -r ./gui/dist/assets/ ./extensions/intellij/src/main/resources/webview/assets/



pushd extensions/intellij
./gradlew buildPlugin
popd

echo "Done"