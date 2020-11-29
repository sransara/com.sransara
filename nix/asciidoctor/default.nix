{ lib, bundlerApp }:

let
  app = bundlerApp {
    pname = "asciidoctor";
    gemdir = ./.;

    exes = [
      "asciidoctor"
    ];

    meta = with lib; {
      description = "A faster Asciidoc processor written in Ruby";
      homepage = "https://asciidoctor.org/";
      license = licenses.mit;
      maintainers = with maintainers; [ gpyh nicknovitski ];
      platforms = platforms.unix;
    };
  };
in
  app
