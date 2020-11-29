let
  sources = import ./nix/sources.nix;
  unstable = import sources.nixunstable {};
in

unstable.mkShell {
  buildInputs = [
    unstable.hugo

    (unstable.callPackage ./nix/asciidoctor/default.nix {})
    # asciidoctor-diagram dependencies
    unstable.graphviz
    unstable.nodePackages.mermaid-cli

    unstable.image_optim
    unstable.nodePackages.svgo
  ];
  shellHook = ''
  '';
}
