---
title: 楽天のAPIに思うところ
date: "2023-11-07"
---
こんにちは。[Rakuten Web Service](https://webservice.rakuten.co.jp/) の [API一覧](https://webservice.rakuten.co.jp/documentation) を眺めていて少し気になりました。（巷で話題のネタです。）

エンドポイントの共通部分「`https://app.rakuten.co.jp/services/api`」が少し冗長に見えます。なぜなら同じような意味のワード（`app`, `services`, `api`）が並んでいるからです。

仮にこれらのワードによって内部処理を分けていたとしても「APIを利用する側」からはあまり関係がありません。ホスト名で表現できるのであれば、エンドポイントはなるべく短くした方が良い気がします。

つまりこう「`https://api.rakuten.co.jp`」です。更にバージョン（例: `/v1`）を付与するのも良さそうです。

日本を代表する企業でもあるので、あえてこうしているのだとしたら理由をこっそり知りたいところです。はて、どんなもんなんでしょう。
