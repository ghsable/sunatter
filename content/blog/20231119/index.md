---
title: NisOSのVSCodeにCopilotを導入する
date: "2023-11-19"
---
イマドキ は [Visual Studio Code](https://code.visualstudio.com/) で [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) を動かすのだそうです。（本当？）[Vim](https://www.vim.org/) に引き篭もるばかりでは健康にも悪そうです。

というわけでちょっと外の空気でも・・むむ、大きな壁が。導入の段階において [Windows](https://www.microsoft.com/en-us/windows) や [macOS](https://www.apple.com/jp/macos/) であればスムーズに構築できるのですが、悲しいかな [NixOS](https://nixos.org/) だとそうもいきません。

[NixOS](https://nixos.org/) 以外のユーザから見たら「なんでこんなに長いのｗ」と笑っていただけるような内容になったかもしれません。（基本的に私に向けた記録です。）

さて本当かどうか、さっそく [Visual Studio Code](https://github.com/microsoft/vscode)（以下OSS版）を入れてみましょう。
```shell
$ nix-shell -p vscode
error:
       … while calling the 'derivationStrict' builtin

         at /builtin/derivation.nix:9:12: (source not available)

       …

       a) To temporarily allow unfree packages, you can use an environment variable
          for a single invocation of the nix tools.

            $ export NIXPKGS_ALLOW_UNFREE=1

        Note: For `nix shell`, `nix build`, `nix develop` or any other Nix 2.4+
        (Flake) command, `--impure` must be passed in order to read this
        environment variable.

       b) For `nixos-rebuild` you can set
         { nixpkgs.config.allowUnfree = true; }
       in configuration.nix to override this.

       Alternatively you can configure a predicate to allow specific packages:
         { nixpkgs.config.allowUnfreePredicate = pkg: builtins.elem (lib.getName pkg) [
             "vscode"
           ];
         }

       c) For `nix-env`, `nix-build`, `nix-shell` or any other Nix command you can add
         { allowUnfree = true; }
       to ~/.config/nixpkgs/config.nix.
```

いきなり面を食らったかと思います。[NixOS](https://nixos.org/) には「Unfreeなパッケージは事前の許可が必要」という仕組みが存在するためです。

とりあえず「`NIXPKGS_ALLOW_UNFREE`」を利用してみます。`shell.nix`を用意しておけば以下で成立すると思います。（`shellHook`に`code`を入れておくと起動の手間を省けます。）
```shell
$ NIXPKGS_ALLOW_UNFREE=1 nix-shell
```

`code`で起動できたと思います。さてここでユーザ空間に正式に導入するか考えてみます。

ユーザ空間に導入するメリットを列挙してみます。
- [nix-shell](https://nixos.org/manual/nix/stable/command-ref/nix-shell) を起動する必要が無い。
- 事前に「`NIXPKGS_ALLOW_UNFREE`」を考慮しなくて良い。
- `Extensions`をNix側で管理できる。（有効なパッケージが存在する場合に限る。）

書いた手前、最後はあまりオススメできません。理由は以下の通りです。
- 欲しい`Extension`のパッケージが存在しない場合がある。
- 機能の一部が正常に動作しない場合がある。（`github.copilot.suggest.terminal.command`など。）

また [Visual Studio Code](https://github.com/microsoft/vscode) 内の`Extensions`から管理する場合は素直に`vscode`（パッケージ）を利用した方が良いです。（同期は「`Settings Sync`」に任せるのが手かもしれません。）私の環境では以下の結果になりました。
- `vscode`: `Extension`をインストールでき、正常に動作する。
- `vscode-with-Extensions`: `Extension`をインストールできない。
- `vscodium`: `Extension`をインストールできるが、機能の一部が正常に動作しない。（またログイン状態を維持できないかも。）

まあ折角なのでユーザ空間に導入しましょう。最初のエラーを回避するには、`flake.nix`などに以下の宣言を加えます。
```nix
nixpkgs.config.allowUnfree = true;
```
- 参考: [How to use unfree software declaratively with nixos module? #463](https://github.com/nix-community/home-manager/issues/463)

Unfreeなパッケージが`vscode`だけの場合、ここは口惜しいポイント（デメリット）かと思います。しかしトレードオフだと考えるしかなさそうです。

この残念な気持ちを少し緩和するために「Unfreeという目印」が欲しいところです。方法はいくつか考えられます。

私の場合は`vscode`を宣言しているディレクトリの名称を`unfree-vscode`としました。`unfree`を先頭にしたのはソートを考慮してのことです。

`vscode-extensions.github.copilot`を宣言すれば`Extensions`に追加されますが、先の理由から実施しません。[Visual Studio Code](https://github.com/microsoft/vscode) を開いて「`Sign in to GitHub`」を押下します。

ウェブブラウザに遷移して [GitHub](https://github.com/) の認証画面が表示されれば問題ありません。が、何の反応も無い（ウェブブラウザに遷移しない）パターンもあると思います。

この問題は環境によって様々なため、可能性が高そうな解決策をご紹介します。デスクトップ環境に [Freedesktop.org](https://www.freedesktop.org/wiki/) が絡んでいる場合「`xdg`」が関係している可能性が高いです。

というのも [Visual Studio Code](https://github.com/microsoft/vscode) は [Freedesktop.org](https://www.freedesktop.org/wiki/) による [XDG Base Directory](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html) に沿っているようです。したがって [xdg-utils](https://www.freedesktop.org/wiki/Software/xdg-utils/) によって解決されるという道理です。
- 参考: [Revisit VS Code folder structure for app data, settings, extensions #3884](https://github.com/Microsoft/vscode/issues/3884)

`xdg-utils`を導入し「デフォルトのブラウザ」を表示してみます。
```shell
$ xdg-settings get default-web-browser
chromium-browser.desktop
```

正しく表示されない場合、ウェブブラウザから設定しますが、コマンドも用意されています。
```shell
$ xdg-settings set default-web-browser brave-browser.desktop
```
参考: [Linuxでブラウザ環境変数を設定する方法](https://ja.linux-console.net/?p=10194)

「なぜ [Firefox](https://www.mozilla.org/en-US/firefox/new/)（`firefox.desktop`）を例に出さないのか」と思われたかもしれません。どうやら [Visual Studio Code](https://github.com/microsoft/vscode) は [Chromium](https://www.chromium.org/Home/) の [OS Crypt](https://chromium.googlesource.com/chromium/src/+/lkgr/components/os_crypt/)（モジュール）を使っているからだそうです。
- 参考: [Settings Sync#Linux](https://code.visualstudio.com/docs/editor/settings-sync#_linux)

これで「`Sign in to GitHub`」からウェブブラウザ（[GitHub](https://github.com/) の認証画面）に遷移できるようになったかと思います。

[GitHub](https://github.com/) へログイン後、[Visual Studio Code](https://github.com/microsoft/vscode) に戻るとエラーが出るかもしれません。
```text
An OS keyring couldn't be identified for storing the
encryption related data in your current desktop
environment.

Open the troubleshooting guide to address this or you can use weaker
encryption that doesn't use the OS keyring.
```

キーリング（例: [GNOME Keyring](https://wiki.gnome.org/Projects/GnomeKeyring)）が機能していないからのようです。以下がヒントになると思います。
- [Linux: An OS keyring couldn't be identified for storing the encryption related data in your current desktop environment #187338](https://github.com/microsoft/vscode/issues/187338)
- [Settings Sync#Troubleshooting keychain issues](https://code.visualstudio.com/docs/editor/settings-sync#_troubleshooting-keychain-issues)
- [Settings Sync#(recommended) Configure the keyring to use with VS Code](https://code.visualstudio.com/docs/editor/settings-sync#_recommended-configure-the-keyring-to-use-with-vs-code)

キーリング周りをスタートラインから詳解すると大変なことになりますので簡単（詳細な設定内容は省略）に。ミニマルな例として [pass](https://www.passwordstore.org/)（`password-store`）および [libsecret](https://wiki.gnome.org/Projects/Libsecret)（`pass-secret-service`）を有効にし、`~/.vscode/argv.json`（[VSCodium](https://vscodium.com/) の場合は`~/.vscode-oss/argv.json`）に`"password-store": "gnome"`（`code --password-store="gnome"`の永続化）を加えると良さそうです。`argv.json`への適用は以下が参考になると思います。
- [Linux: An OS keyring couldn't be identified for storing the encryption related data in your current desktop environment#187338#issuecomment-1714813468](https://github.com/microsoft/vscode/issues/187338#issuecomment-1714813468)

「`Use weaker encryption`」で先に進むことはできますが「キーリングが使えていない状態」ということに留意しておく必要があります。

[GitHub Copilot](https://github.com/features/copilot) のアクセス権が無い場合はエラーが出ます。
```text
No access to GitHub Copilot found. You are currently logged in as <username>.
```

これは「`Signup for GitHub Copilot`」から画面（ウェブブラウザ）の案内に従えば [GitHub Copilot](https://github.com/features/copilot) のアクセス権を取得できると思います。それでも失敗する場合は再ログインで解消するかもしれません。
- 参考: [Your GitHub token is invalid. Please sign out from your GitHub account using VSCode UI and try again. #28455](https://github.com/orgs/community/discussions/28455)

お疲れ様でした。これでようやく「イマドキ」に到達ですね。

ちょっと試すだけのつもりが、なんだか長旅になってしまいました。しばらく動かしてみて、フリートライアル終了後の対応を考えたいと思います。

ということで、よっこらしょっと。
- [Copilot.vim](https://github.com/github/copilot.vim)
