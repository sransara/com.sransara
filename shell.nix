let
  sources = import ./nix/sources.nix;
  stable = import sources.nixpkgs {};
  unstable = import sources.nixunstable {};
in

unstable.mkShell {
  buildInputs = [
    unstable.nodejs
    unstable.netlify-cli
    unstable.hugo

    # (unstable.callPackage ./nix/asciidoctor/default.nix {})
    # asciidoctor-diagram dependencies
    unstable.graphviz

    stable.image_optim
    unstable.nodePackages.svgo
  ];
  shellHook = ''
  '';
}
