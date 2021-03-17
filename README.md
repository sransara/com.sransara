## Develop build
https://develop-build--sransara-com.netlify.app/

## Update dependencies
```sh
# update nix sources in nix/sources.nix
niv update

# update asciidoctor gems in nix/asciidoctor
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

## Optimize images
```sh
image_optim -r content/ static/ assets/
```