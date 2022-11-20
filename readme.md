# 週の勉強時間管理ツール

## DEMO

  https://kokekokko0116.github.io/localstorage/

## 紹介と使い方

  - 上のストップウォッチを使って勉強時間計測
  - 曜日を選択して保存すれば、下のグラフに曜日ごとの勉強時間が表示される
  - 週の合計時間はグラフの下に表示
  - 週の終わりに勉強時間をツイートしてリセットすれば、次の週の勉強が始まります
  - テストプレイの際にはjsコード50行目のコメントアウト解除して、48行目をコメントアウトして下さい
  

## 工夫した点

  - chart.jsを使って曜日ごとの勉強時間をわかりやすくしたこと
  - 勉強時間表示の際に、それぞれ計算式が変わるのでその部分をどう表示するか工夫した

## 苦戦した点

  - 時間の計測は1000ミリ秒ごとに行われるため、通常の時間の計算式と違っていたこと
  - ローカルストレージに保存されている数値をリアルタイムに反映させる挙動

## 参考にした web サイトなど

  - http://www.kogures.com/hitoshi/javascript/chartjs/scale-label.html
