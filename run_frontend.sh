#!/bin/bash
cd ./frontend

git fetch
git reset origin/main --hard

npm run dev