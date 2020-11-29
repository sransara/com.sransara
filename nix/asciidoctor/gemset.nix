{
  asciidoctor = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0qld3a1pbcjvs8lbxp95iz83bfmg5scmnf8q3rklinmdmhzakslx";
      type = "gem";
    };
    version = "1.5.8";
  };
  asciidoctor-bibtex = {
    dependencies = ["asciidoctor" "bibtex-ruby" "citeproc-ruby" "csl-styles" "latex-decode"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0lw2mhlndqnjx7ai0bbpyiwfnqrlqaapbqmbfag2zvb8ixhlj4cm";
      type = "gem";
    };
    version = "0.4.1";
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
  asciidoctor-latex = {
    dependencies = ["asciidoctor" "htmlentities" "opal"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "02qvn1ngp4s9y22vk23zzssd4w1bpyk84akjwiq6nqn8im6s4awz";
      type = "gem";
    };
    version = "1.5.0.17.dev";
  };
  bibtex-ruby = {
    dependencies = ["latex-decode"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0bg6wzhqzcpx7c5s9453yqvqvll710arjwxp5w9935rcnq5mqq3i";
      type = "gem";
    };
    version = "4.4.7";
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
  htmlentities = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1nkklqsn8ir8wizzlakncfv42i32wc0w9hxp00hvdlgjr7376nhj";
      type = "gem";
    };
    version = "4.3.4";
  };
  json = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "158fawfwmv2sq4whqqaksfykkiad2xxrrj0nmpnc6vnlzi1bp7iz";
      type = "gem";
    };
    version = "2.3.1";
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
      sha256 = "00w0dgvmdy8lw2b5q9zvhqd5k98a192vdmka96qngi9cvnsh5snw";
      type = "gem";
    };
    version = "1.0.1";
  };
  opal = {
    dependencies = ["source_map" "sprockets"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0dmdxhmg43ibd4bsldssslsz8870hzknwcxiv9l1838lh6hd390k";
      type = "gem";
    };
    version = "0.6.3";
  };
  rack = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0i5vs0dph9i5jn8dfc6aqd6njcafmb20rwqngrf759c9cvmyff16";
      type = "gem";
    };
    version = "2.2.3";
  };
  rouge = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0yvcv901lrh5rfnk1h4h56hf2m6n9pd6w8n96vag74aakgz3gaxn";
      type = "gem";
    };
    version = "3.25.0";
  };
  source_map = {
    dependencies = ["json"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0fviv92glr51v2zqy4i5jzi3hzpvjrcwyrxddcfr84ki65zb7pkv";
      type = "gem";
    };
    version = "3.0.1";
  };
  sprockets = {
    dependencies = ["concurrent-ruby" "rack"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0ikgwbl6jv3frfiy3xhg5yxw9d0064rgzghar1rg391xmrc4gm38";
      type = "gem";
    };
    version = "4.0.2";
  };
}