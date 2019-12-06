let
  unstable = import (fetchTarball https://nixos.org/channels/nixos-unstable/nixexprs.tar.xz) {};
in
with import <nixpkgs> {};

pkgs.mkShell {
  buildInputs = [
      unstable.hugo
  ];
  shellHook = ''
  '';
}
