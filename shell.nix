with import <nixpkgs> {};

stdenv.mkDerivation {
  name = "node";
  buildInputs = [
      nodejs
      hugo
      texlive.combined.scheme-medium
  ];
  shellHook = ''
    export PATH="$PWD/node_modules/.bin/:$PATH"
  '';
}
