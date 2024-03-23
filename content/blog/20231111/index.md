---
title: NixOSにImmersedを導入する
date: "2023-11-11"
---
しばらく先の私に向けた戦記を残しておきます。[NixOS](https://nixos.org/) で [Immersed](https://immersed.com/) を完動させることが最終目的です。（[NixOS](https://nixos.org/) 以外のユーザが読まれてもあまり意味が無いかもしれません。）

[Immersed](https://immersed.com/) のLinux版（例: `Immersed-x86_64.AppImage`）を実行するには、`appimage-run`（[AppImage](https://appimage.org/) を実行）が要ります。
```shell
$ nix-shell -p appimage-run
```

取得した [AppImage](https://appimage.org/) にユーザの実行権限を付与します。
```shell
$ chmod --verbose u+x Immersed-x86_64.AppImag
mode of 'Immersed-x86_64.AppImage' changed from 0644 (rw-r--r--) to 0744 (rwxr--r--)
```

実行するとエラー（`libthai.so.0`が見つからない）が出ると思います。
```shell
$ appimage-run Immersed-x86_64.AppImage
Immersed: error while loading shared libraries: libthai.so.0: cannot open shared object file: No such file or directory
```

そのため、環境変数「`LD_LIBRARY_PATH`」に`libthai.so.0`（[libthai Library](https://linux.thai.net/projects/libthai/)）のあるパスを通します。（以下、バージョンは読み替えてください。）
```shell
$ export LD_LIBRARY_PATH=/nix/store/hashcode-libthai-0.1.29/lib
```

リラン。先ほどのエラーは解消されましたが、新たなエラー（`GLIBC_2.38`が見つからない）が出ると思います。
```shell
$ appimage-run Immersed-x86_64.AppImage
ps: /usr/lib/libc.so.6: version `GLIBC_2.38' not found (required by ps)
ps: /usr/lib/libc.so.6: version `GLIBC_2.38' not found (required by /nix/store/hashcode-procps-3.3.17/lib/libprocps.so.8
```

[glibc](https://www.gnu.org/software/libc/) のバージョン`2.38`が見つからないようです。現時点においてnix packagesのstable版（`23.05`）は「Version: `2.37-45`」に対し、unstable版は「Version: `2.38-23`」です。

ということで`channel`を`nixpkgs-unstable`に向ければ良さそうです。`pkgs.glibc`を宣言したいところですが、実は [nix-shell](https://nixos.org/manual/nix/stable/command-ref/nix-shell) で`channel:nixpkgs-unstable`の環境に入れば`pkgs.glibc`の宣言は不要になります。（デフォルトの環境に含まれている様子。）

したがって、このエラーは`shell.nix`（[nix-shell](https://nixos.org/manual/nix/stable/command-ref/nix-shell)）を経由することで解決します。であれば、初回のエラーをもう少しスマートに解消（組込）してみます。
```nix
# pkgs.appimage-runの宣言を忘れずに。

shellHook = ''
  export LD_LIBRARY_PATH=${pkgs.libthai}/lib
''
```

これでめでたく [Immersed](https://immersed.com/) のウィンドウ（GUI）を起動できると思います。
```shell
$ appimage-run Immersed-x86_64.AppImage
Immersed-x86_64.AppImage installed in /home/username/.cache/appimage-run/hashcode
```

あとは画面の案内通りに接続先情報を入力すれば、接続先側にコンピュータがホスト名で追加されると思います。

[X11](https://www.x.org/releases/current/doc/man/man7/X.7.xhtml) ユーザは恐らくこれで完了かと思います。お疲れ様でした。

[Wayland](https://wayland.freedesktop.org/index.html) ユーザは居残りです。不穏なメッセージが表示されたかと思います。
```text
Wayland Window System is detected. Currently we only support
X11. Please consider to use X Window System for now.
```

結論、[Immersed](https://immersed.com/) は [Wayland](https://wayland.freedesktop.org/index.html) に対応していません！（ﾄﾞﾝ!!）

コンポジタで [Xwayland](https://wayland.freedesktop.org/xserver.html)（`pkgs.xwayland`の宣言は不要）を有効（例: `disable`を解除）にし、[xwininfo](https://manpages.org/xwininfo)（`xorg.xwininfo`）を起動してから [Immersed](https://immersed.com/) のウィンドウをマウスホバーしてみます。するとマウスポインタが「＋」に変化したと思います。

その意味は [Xwayland](https://wayland.freedesktop.org/xserver.html) 経由で（期待通りに）起動されているということになります（泣）残念ながらチェックメイトです。

ちなみに [Wine](https://www.winehq.org/)（`wineWowPackages.waylandFull`）+ [Winetricks](https://wiki.winehq.org/Winetricks)（`winetricks`）では、アプリケーションの実行段階から雲行きが怪しい雰囲気です。よく忘れてしまうので、ついでに頻出のコマンドを控えておきます。
```shell
# .exe形式の実行
$ wine プログラム名.exe

# .msi形式の実行
$ wine msiexec /i プログラム名.msi

# Wine本体の設定（Windowsのバージョンなど）
$ winecfg

# Wineからインストールしたアプリケーション（~/.wine/drive_c/）をアンインストール
$ wine uninstaller
```

一筋の光が公式より「[Wayland](https://wayland.freedesktop.org/index.html) は将来的にサポート予定」とのことです。いつになるのか分かりませんが、そのときが来たらこの続きから着手しようかなと思います。
- [Supported Computers & Headsets](https://immersed.zendesk.com/hc/en-us/articles/14226089686157-Supported-Computers-Headsets)
