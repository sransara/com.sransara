{
  asciidoctor = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1gjk9v83vw0pz4x0xqqnw231z9sgscm6vnacjw7hy5njkw8fskj9";
      type = "gem";
    };
    version = "2.0.12";
  };
  asciidoctor-bibtex = {
    dependencies = ["asciidoctor" "bibtex-ruby" "citeproc-ruby" "csl-styles" "latex-decode"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0fx80bpykixvnlscyz2c4dnjr1063r5ar7j1zn2977vsr8fi8ial";
      type = "gem";
    };
    version = "0.8.0";
  };
  asciidoctor-diagram = {
    dependencies = ["asciidoctor"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1yl4p0gxijmqfzs4nfwygkgcnnv7mjgkf206adcs1gi70h55maha";
      type = "gem";
    };
    version = "2.0.5";
  };
  asciidoctor-mathematical = {
    dependencies = ["asciidoctor" "asciimath" "mathematical"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1lxfq7qn3ql642pva6jh3h1abm9j9daxg5icfn1h73k6cjsmcisp";
      type = "gem";
    };
    version = "0.3.5";
  };
  asciimath = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1aapydwwkydbwgz07n7ma3a5jy9n3v0shy6q6j8mi4wr3crhx45a";
      type = "gem";
    };
    version = "2.0.1";
  };
  bibtex-ruby = {
    dependencies = ["latex-decode"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0fm5gndi76wwxshspyvaw4jilxf8c28hq2fk7py943jnw7zgn23n";
      type = "gem";
    };
    version = "5.1.5";
  };
  citeproc = {
    dependencies = ["namae"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "13vl5sjmksk5a8kjcqnjxh7kn9gn1n4f9p1rvqfgsfhs54p0m6l2";
      type = "gem";
    };
    version = "1.0.10";
  };
  citeproc-ruby = {
    dependencies = ["citeproc" "csl"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0wdwjb367g5pb2mmji25ixcspklcrfgrsgniixh4qgyczh1i1lin";
      type = "gem";
    };
    version = "1.1.13";
  };
  concurrent-ruby = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1vnxrbhi7cq3p4y2v9iwd10v1c7l15is4var14hwnb2jip4fyjzz";
      type = "gem";
    };
    version = "1.1.7";
  };
  csl = {
    dependencies = ["namae"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0rd3r9vmvfk2xri96swdpmi0kir40rbvymgipqg14y9px3vvv22v";
      type = "gem";
    };
    version = "1.5.2";
  };
  csl-styles = {
    dependencies = ["csl"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1z0vr5w3ammzwcb054ydj3dvi30zj12k5rh5ad5p593xjqn1pa7i";
      type = "gem";
    };
    version = "1.0.1.10";
  };
  i18n = {
    dependencies = ["concurrent-ruby"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "153sx77p16vawrs4qpkv7qlzf9v5fks4g7xqcj1dwk40i6g7rfzk";
      type = "gem";
    };
    version = "1.8.5";
  };
  latex-decode = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1wnxg82lfkb8bl5la9nmg1434rpkcygygm0ckixjn6ah2dy6i53m";
      type = "gem";
    };
    version = "0.3.2";
  };
  mathematical = {
    dependencies = ["ruby-enum"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0d9kif71n8sj8najnc1mnykgqyqivj3mfhq5722a8vi07x5b2jb7";
      type = "gem";
    };
    version = "1.6.13";
  };
  namae = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "00w0dgvmdy8lw2b5q9zvhqd5k98a192vdmka96qngi9cvnsh5snw";
      type = "gem";
    };
    version = "1.0.1";
  };
  ruby-enum = {
    dependencies = ["i18n"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0d3dyx2z41zd6va9dwn3q8caf710vzdaf57xspc0y17aqmnprwnw";
      type = "gem";
    };
    version = "0.8.0";
  };
}