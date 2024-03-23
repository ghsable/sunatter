---
title: Rustの出力だけから言えそうなことを並べてみる
date: "2023-11-26"
---
# はじめに
こんにちは。技術書を眺めていると先に概念の説明がありますよね。

なんとなく実際の動作（詳細）を先にもってきてみました。という思いつきです。

このネタには [Rust](https://www.rust-lang.org/) が丁度良さそうなので題材にしてみようと思います。

題して「出力**だけ**から言えそうなことを並べてみる」です。内容は「[参照先のアドレスを確認してみる](#参照先のアドレスを確認してみる)」とします。

```text
⚠️
- 基本的な内容だけを取り扱います。
- あくまで出力だけから言えそうなことを並べる試みです。
- 本筋から逸れる内容はラベル「脱線」を付与します。
```

# 参照先のアドレスを確認してみる
## 複数回実行してみる
```rust
fn main() {
    let x = 1;

    println!("{:p}", &x);
}
```
```text
1回目: 0x7ffd06da7efc
2回目: 0x7ffe55b8093c
3回目: 0x7fff544f9ddc
4回目: 0x7ffd67085b9c
...
N回目: 0x7ff........c
```
- アドレスは16進数（`0x...`）で出力される。
- 実行ごとにアドレスが変化している。
  - アドレスは実行時に決まる。
- アドレスの前半（`7ff`）と末尾（例: `c`）は常に同じ。
  - 脱線: 変数（`x`）の型を変更すると末尾が変化する。

## ブロック（`{}`）で囲ってみる
```rust
fn main() {
    let x = 1;

    {
        let x = 1;

        println!("1: {:p}", &x);
    }

    println!("2: {:p}", &x);
}
```
```text
1回目:
  1: 0x7ffc98e4d1b4
  2: 0x7ffc98e4d1b0
2回目:
  1: 0x7ffc358c56b4
  2: 0x7ffc358c56b0
3回目:
  1: 0x7ffc78ce2604
  2: 0x7ffc78ce2600
4回目:
  1: 0x7ffffd718bd4
  2: 0x7ffffd718bd0
...
N回目:
  1: 0x7ff........4
  2: 0x7ff........0
```
- アドレスの前半（`7ff`）と末尾（例: `4`,`0`）は常に同じ。
  - 脱線: 変数（`x`）の型を変更すると末尾の組み合わせが変化する。

## シャドーイングしてみる
```rust
fn main() {
    let x = 1;

    println!("1: {:p}", &x);

    let x = 1;

    println!("2: {:p}", &x);
}
```
```text
1回目:
  1: 0x7ffd7f543f3c
  2: 0x7ffd7f543f8c
2回目:
  1: 0x7fff4c8433bc
  2: 0x7fff4c84340c
3回目:
  1: 0x7ffd5a10b2ec
  2: 0x7ffd5a10b33c
4回目:
  1: 0x7ffe153097bc
  2: 0x7ffe1530980c
...
N回目:
  1: 0x7ff........c
  2: 0x7ff........c
```
- 変数を宣言（`let`）することで新たな領域（アドレス）が確保される。
- アドレスの前半（`7ff`）と末尾（例: `c`）は常に同じ。
  - 脱線: 変数（`x`）の型を変更すると末尾が変化する。

### 脱線: ミュータブルな変数に再代入してもアドレスは変化しない
変数を宣言（`let`）していないので同じアドレスになります。
```rust
fn main() {
    let mut x = 1;

    println!("1: {:p}", &x);

    x = 1;

    println!("2: {:p}", &x);
}
```
```text
1回目:
  1: 0x7ffefa40fe74
  2: 0x7ffefa40fe74
2回目:
  1: 0x7ffc1722a334
  2: 0x7ffc1722a334
```

### 脱線: シャドーイング後に1番目の変数（アドレス）を参照する
不変参照によって実現できそうです。
```rust
fn main() {
    let x = 1;
    let x_pointer = &x;  // 不変参照

    println!("1: {}, {:p}", x, &x);

    let x = 2;

    println!("2: {}, {:p}", x, &x);

    // 1番目のxを参照する
    println!("3: {}, {:p}", x_pointer, x_pointer);

    // x_pointer自体のアドレス
    println!("4: {:p}", &x_pointer);

    // 1番目のxの値を計算に使用
    println!("5: {}", x + x_pointer);
}
```
```text
1: 1, 0x7fffe12419c4
2: 2, 0x7fffe1241a2c
3: 1, 0x7fffe12419c4
4: 0x7fffe12419c8
5: 3
```
- 参考: [4.2. 参照と借用](https://doc.rust-jp.rs/book-ja/ch04-02-references-and-borrowing.html)
  - > 複数の不変参照をすることは可能です。 データを読み込んでいるだけの人に、他人がデータを読み込むことに対して影響を与える能力はないからです。

なんだか（信頼性を隠れ蓑に）難解なコードを生み出せそうな気がしてきます。
```rust
fn main() {
    let x = 1;
    let y = 2;
    let x_pointer = &y;
    let y_pointer = &x;

    println!("1: {}, {:p}", x, &x);
    println!("2: {}, {:p}", y, &y);
    println!("3: {}, {:p}", x_pointer, x_pointer);
    println!("4: {}, {:p}", y_pointer, y_pointer);

    let x = &y;
    let y = &x;
    let z = 7;

    println!("5: {}, {:p}", x, x);
    println!("6: {}, {:p}", y, *y);
    println!("7: {}, {:p}", z, &z);

    let answer = z - x - *y - x_pointer - y_pointer;

    println!("8: {}", answer);
}
```
```text
1: 1, 0x7ffecdc4d618
2: 2, 0x7ffecdc4d61c
3: 2, 0x7ffecdc4d61c
4: 1, 0x7ffecdc4d618
5: 2, 0x7ffecdc4d61c
6: 2, 0x7ffecdc4d61c
7: 7, 0x7ffecdc4d794
8: 0
```

## 関数を呼んでみる
```rust
fn main() {
    let x = 1;
    let y = String::from("Hello");

    println!("1: {}, {:p}", x, &x);
    println!("2: {}, {:p}", y, &y);

    no_return(x, y);
}

fn no_return(x: i32, y: String) -> () {
    println!("3: {}, {:p}", x, &x);
    println!("4: {}, {:p}", y, &y);
}
```
```text
1回目:
  1: 1, 0x7ffc47b6b1c4
  2: Hello, 0x7ffc47b6b1c8
  3: 1, 0x7ffc47b6b014
  4: Hello, 0x7ffc47b6b290
2回目:
  1: 1, 0x7ffcc62bdd44
  2: Hello, 0x7ffcc62bdd48
  3: 1, 0x7ffcc62bdb94
  4: Hello, 0x7ffcc62bde10
3回目:
  1: 1, 0x7fff7a97dab4
  2: Hello, 0x7fff7a97dab8
  3: 1, 0x7fff7a97d904
  4: Hello, 0x7fff7a97db80
4回目:
  1: 1, 0x7ffedee6c3b4
  2: Hello, 0x7ffedee6c3b8
  3: 1, 0x7ffedee6c204
  4: Hello, 0x7ffedee6c480
...
N回目:
  1: 1, 0x7ff........4
  2: Hello, 0x7ff........8
  3: 1, 0x7ff........4
  4: Hello, 0x7ff........0
```

```rust
fn main() {
    let x = 1;
    let y = String::from("Hello");

    println!("1: {}, {:p}", x, &x);
    println!("2: {}, {:p}", y, &y);

    no_return(&x, &y);
}

fn no_return(x: &i32, y: &String) -> () {
    println!("3: {}, {:p}", x, x);
    println!("4: {}, {:p}", y, y);
}
```
```text
1回目:
  1: 1, 0x7ffd3248d8ac
  2: Hello, 0x7ffd3248d8b0
  3: 1, 0x7ffd3248d8ac
  4: Hello, 0x7ffd3248d8b0
2回目:
  1: 1, 0x7fff8ca4a57c
  2: Hello, 0x7fff8ca4a580
  3: 1, 0x7fff8ca4a57c
  4: Hello, 0x7fff8ca4a580
```

# ・・・おっと、
きりがないですね。いくらでも「脱線」できそうなので、ここまでにしておきます。

本記事が目的としていた試みはとりあえず満たせたかと思います。それでは。
