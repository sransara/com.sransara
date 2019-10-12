with import <nixpkgs> {};

pkgs.mkShell {
  buildInputs = [
      hugo
  ];
  shellHook = ''
  '';
}
