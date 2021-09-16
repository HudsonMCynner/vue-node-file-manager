#!/bin/bash
echo "What is the new version of the system?"
# shellcheck disable=SC2162
read versionSystem

# shellcheck disable=SC2002
CURRENT_VERSION=$(cat package.json |
  grep version |
  head -1 |
  awk -F: '{ print $2 }' |
  sed 's/[",]//g')
# shellcheck disable=SC2107
# shellcheck disable=SC2086
if [ "$versionSystem" != "" ] && [ $versionSystem != $CURRENT_VERSION ]; then
  npm version "$versionSystem"
fi

echo "Update the project."
# Atualiza a branch
git pull

# Gera a versão
node --max_old_space_size=4096 node_modules/@quasar/app/bin/quasar-build

# shellcheck disable=SC2164
cd ./dist/spa

echo "Zippin the files."

# Zipa a pasta com a versão
# shellcheck disable=SC2035
zip -r "$versionSystem.zip" *

# Nomeia a TAG
TAG="v$versionSystem-ADM"

# Cria a tag para versionamento
git tag "$TAG"
# Sobe as tags
git push origin --tags

echo "Committing files."

# Commita os arquivos modificados na build
git add .

git commit -m "$TAG"

git push

echo "Build completed successfully!"
