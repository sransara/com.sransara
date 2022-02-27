{
  asciidoctor = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0g8gn3g6qy4bzjv1b14sj283kqynjgwq62bgq569jr4dkqwmwnzd";
      type = "gem";
    };
    version = "2.0.17";
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
    dependencies = ["asciidoctor" "asciidoctor-diagram-ditaamini" "asciidoctor-diagram-plantuml" "rexml"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1z1ilpczjaydhcwpz3yygn03yrx2ljjj55xczwkrlb8rzgh03br3";
      type = "gem";
    };
    version = "2.2.1";
  };
  asciidoctor-diagram-ditaamini = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1nva5n6nyns0xp77d1dxng1rjhc8ma6gyd8hczjq3h9qqxcw2q4h";
      type = "gem";
    };
    version = "1.0.1";
  };
  asciidoctor-diagram-plantuml = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1s9fk75rhcvic7x5bsllfxdhkhrdwlcmmd2iii1p3y262k019pcz";
      type = "gem";
    };
    version = "1.2022.1";
  };
  bibtex-ruby = {
    dependencies = ["latex-decode"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0adh2x935r69nm8qmns5fjsjw034xlyaqddzza2jr2npvf41g34r";
      type = "gem";
    };
    version = "5.1.6";
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
      sha256 = "0a8ahyhhmdinl4kcyv51r74ipnclmfyz4zjv366dns8v49n5vkk3";
      type = "gem";
    };
    version = "1.1.14";
  };
  csl = {
    dependencies = ["namae" "rexml"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0n8iqmzvvqy2b1wfr4c7yj28x4z3zgm36628y8ybl49dgnmjycrk";
      type = "gem";
    };
    version = "1.6.0";
  };
  csl-styles = {
    dependencies = ["csl"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0l29qlk7i74088fpba5iqhhgiqkj7glcmc42nbmvgqysx577nag8";
      type = "gem";
    };
    version = "1.0.1.11";
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
  namae = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1j3nl1klkx3gymrdxfc1hlq4a8qlvhhl9aj5v1v08b9fz27sky0l";
      type = "gem";
    };
    version = "1.1.1";
  };
  rexml = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "08ximcyfjy94pm1rhcx04ny1vx2sk0x4y185gzn86yfsbzwkng53";
      type = "gem";
    };
    version = "3.2.5";
  };
  rouge = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "080fswzii68wnbsg7pgq55ba7p289sqjlxwp4vch0h32qy1f8v8d";
      type = "gem";
    };
    version = "3.28.0";
  };
}
