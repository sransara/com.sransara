```sh
nix-shell -p bundler -p bundix --run 'bundler update; bundler lock; bundler package --no-install --path vendor; bundix; rm -rf vendor'
```

```
nix-shell -E '
let
    sources = import ../sources.nix;
in
    with import sources.nixunstable {};
    mkShell {
      buildInputs = [
          bundler
          bundix
      ];
    }
' --run 'bundler update; bundler lock; bundler package --no-install --path vendor; bundix; rm -rf vendor'
```
References:
https://nixos.org/manual/nixpkgs/stable/#sec-language-ruby
https://nathan.gs/2019/04/19/using-jekyll-and-nix-to-blog/
https://github.com/NixOS/nixpkgs/blob/master/pkgs/tools/typesetting/asciidoctor/default.nix
