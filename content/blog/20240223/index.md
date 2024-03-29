---
title: 自宅のネットワーク環境を改善しました
date: "2024-02-23"
---
こんにちは。自宅のネットワーク環境の改善に成功したので記録しておこうと思います。

コンピュータ周辺で手を加えられるところが無くなってきたためネットワーク環境の方に手を伸ばしてみた次第です。困っている領域では無い（既に通信できている）ため後回しになっていました。

当初の目的は満たせたので「成功」と言って問題無いかなと振り返っています。
- 通信を安定させる。（謎に途中で途切れないこと。）
- （あわよくば）通信速度を向上させる。

オンラインでの打合せやリモート接続などが特に不安定でしたが、明らかに安定するようになりました。実施された内容は以下の通りです。
- 屋外LAN配線
- ONU（ルーター機能内蔵）交換

「屋外LAN配線」は有線LAN接続に向けた話です。「ONU（ルーター機能内蔵）」から有線LAN接続するために壁に穴を空けて屋外を経由して配線する工事になります。
```
✍余談 其の壱
LANケーブル1本で対処しようとすると壁の穴とLANケーブルの間から隙間風が入ってくる可能性があります。費用がかさみますが「LANジャック（埋込型）の取付け」は全箇所で施工しておいた方が良いです。
「接続先との間に3本のLANケーブルがあるより1本の方が通信品質が上がるのでは？」という印象がありましたが実測では変わりませんでした。屋外のLANケーブルのカテゴリ（例: 5e）に屋内も合わせておけば問題無さそうです。
よって「LANジャック（埋込型）の取付け」のデメリットは費用面以外にはあまり無さそうです。ちなみに後から「LANジャック（埋込型）の取付け」だけの追加工事もできますが作業員派遣費用が再度掛かるので最初の施工に含めておいた方がお得です。
```
```
✍余談 其の弐
「屋外LAN配線」の施工後に全ポートで「接続の確認」および「通信速度の確認」をしておいた方が良いです。接触不良などで不良ポートが見つかる場合があります。
私はこれらを怠ったばかりに再訪（業者側の不履行なので作業員派遣費用は免除）していただくことになりました。「接続はできているが通信速度が著しく遅い」は見落とされがちなので面倒でも全ポートで確認しておいた方が良いです。
```

3本（`a1`, `a2`, `a3`）配線していただき、それぞれで計測してみました。「`a1`, `a2`」と「`a3`」の屋外LANケーブルの種類は異なりますが（カテゴリは同じ）どれも「誤差の範囲」な結果となりました。
| LAN | ダウンロード（Mbps） | アップロード（Mbps） | レイテンシ: アンロード済み（ms） | レイテンシ: ロード済み（ms） |
| :--- | :--- | :--- | :--- | :--- |
| `a1` | 1000 | 270 | 9 | 30 |
| `a2` | 1200 | 270 | 9 | 30 |
| `a3` | 990 | 310 | 9 | 27 |

計測には以下のサービスを利用しました。（約5回計測した平均値を載せています。）
- [Fast.com](https://fast.com/)

レイテンシについては以下の解説が参考になります。
- [FAST.comでレイテンシとアップロード速度の計測が可能に](https://about.netflix.com/ja/news/fast-com-now-measures-latency-and-upload-speed)

続いて「ONU（ルーター機能内蔵）交換」は無線LAN接続に向けた話です。正当な理由があれば上位版に交換対応（無償）していただけるようで以下の恩恵を受けることができます。
- 同時接続台数の上限値が上がる。（例: 10台 → 32台）
- Wi-Fi規格が上がる。（例: Wi-Fi 5 → Wi-Fi 6）
- 新しい暗号化タイプを使用できる。（例: WPA2-PSK(AES)/**WPA3-SAE(AES)**）

新旧で比較してみるとそこそこの改善が見られました。
- 新

| 周波数帯 | ダウンロード（Mbps） | アップロード（Mbps） | レイテンシ: アンロード済み（ms） | レイテンシ: ロード済み（ms） |
| :--- | :--- | :--- | :--- | :--- |
| 2.4GHz | 112 | 112 | 13 | 117 |
| 5GHz | 314 | 364 | 13 | 78 |

- 旧

| 周波数帯 | ダウンロード（Mbps） | アップロード（Mbps） | レイテンシ: アンロード済み（ms） | レイテンシ: ロード済み（ms） |
| :--- | :--- | :--- | :--- | :--- |
| 2.4GHz | 66 | 103 | 12 | 99 |
| 5GHz | 136 | 91 | 11 | 91 |

これで以上になります。ネットワーク環境（有線LAN接続・無線LAN接続）の改善は「成功」と言って良さそうです。

サービスデスクの方・作業員の方、ご対応いただきありがとうございました。
