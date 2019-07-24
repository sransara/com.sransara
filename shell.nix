with import <nixpkgs> {};

pkgs.mkShell {
  name = "node";
  buildInputs = [
      nodejs
      hugo
      (texlive.combine { 
	inherit (texlive) scheme-medium enumitem;
      })
  ];
  shellHook = ''
    export PATH="$PWD/node_modules/.bin/:$PATH"
  '';
}
