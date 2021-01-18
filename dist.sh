#!/usr/bin/env sh
rm -R build 2>/dev/null
mkdir "build"
cp -R ./src/*.* ./build/
cp -R ./src/icons/ ./build/icons/
cd ./build/
zip -r ../build/build.zip ./
cd ../
rm -R dist 2>/dev/null
mkdir "dist"
cp ./build/build.zip ./dist/ann-better-experience-chrome-X.XX.zip
