let
  unstable = import <nixpkgs-unstable> {};
in
with import <nixpkgs> {};

pkgs.mkShell {
  buildInputs = [
    unstable.hugo
    image_optim
  ];
  shellHook = ''
    export NODEBIN="$HOME/Wenv/node/bin"
    export PATH="$NODEBIN:$PATH"
  '';
}
