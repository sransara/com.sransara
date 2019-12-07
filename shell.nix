let
  unstable = import <nixpkgs-unstable> {};
in
with import <nixpkgs> {};

pkgs.mkShell {
  buildInputs = [
      unstable.hugo
  ];
  shellHook = ''
  '';
}
