# Remove previous build
rm -rf build
# Run build
yarn build

cd build
cp index.html 200.html
surge . tictactoe-1712534.surge.sh