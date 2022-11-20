"use strict";

{
  // html要素取得
  const timer = document.getElementById("timer");
  const start = document.getElementById("start");
  const stop = document.getElementById("stop");
  const reset = document.getElementById("reset");
  const kiroku = document.getElementById("kiroku");
  const weekly_study = document.getElementById("weekly_study");
  const w_kirou = document.getElementById("w_kiroku");
  const w_reset = document.getElementById("w_reset");
  const sand_watch = document.getElementById("sand_watch");

  // 変数の宣言
  let startTime;
  let timeoutId;
  let elapsedTime = 0;

  //週の勉強時間配列 week study time の略
  const wst = [
    Number(localStorage.getItem("Saturday")),
    Number(localStorage.getItem("Sunday")),
    Number(localStorage.getItem("Monday")),
    Number(localStorage.getItem("Tuesday")),
    Number(localStorage.getItem("Wednesday")),
    Number(localStorage.getItem("Thursday")),
    Number(localStorage.getItem("Friday")),
  ];

  //週の合計を計算して渡す関数の設定
  function weekly_sum() {
    const weekstudysum =
      wst[0] + wst[1] + wst[2] + wst[3] + wst[4] + wst[5] + wst[6];
    const h = String(Math.trunc(weekstudysum / 3600000)).padStart(2, "0");
    const m = String(Math.trunc((weekstudysum % 3600000) / 60000)).padStart(
      2,
      "0"
    );
    const s = String(
      Math.trunc(((weekstudysum % 3600000) % 60000) / 1000)
    ).padStart(2, "0");
    $("#week_hour").text(h);
    $("#week_minute").text(m);
    $("#week_second").text(s);
  }

  // load onload の際に週の勉強時間が表示される
  weekly_sum();

  //チャート作成
  const ctx = document.getElementById("week_study_chart");

  var week_study_char = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["SAT", "SUN", "MON", "TUE", "WED", "THU", "FRI"],
      datasets: [
        {
          label: "勉強時間(h)",
          data: [
            wst[0] / 3600000,
            wst[1] / 3600000,
            wst[2] / 3600000,
            wst[3] / 3600000,
            wst[4] / 3600000,
            wst[5] / 3600000,
            wst[6] / 3600000,
          ],
          // ↓テストプレイ時にはこちらでお試しください
          // data: [
          //   wst[0] / 1000,
          //   wst[1] / 1000,
          //   wst[2] / 1000,
          //   wst[3] / 1000,
          //   wst[4] / 1000,
          //   wst[5] / 1000,
          //   wst[6] / 1000,
          // ],
          backgroundColor: [
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(255, 206, 86, 0.2)",
          ],
          borderColor: [
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(255, 206, 86, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          display: true,
          suggestedMin: 0,
          suggestedMax: 16,
          beginAtZero: true,
          ticks: {
            stepSize: 2,
          },
        },
      },
    },
  });

  // ストップウォッチのカウント関数
  function countUp() {
    const d = new Date(Date.now() - startTime + elapsedTime);
    const h = String(d.getHours() - 9).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    const s = String(d.getSeconds()).padStart(2, "0");
    timer.textContent = `${h}:${m}:${s}`;
    timeoutId = setTimeout(() => {
      countUp();
    }, 1000);
  }

  // 挙動時のボタンのON/OFF
  function setbuttoninitial() {
    start.disabled = false;
    stop.disabled = true;
    reset.disabled = true;
    kiroku.disabled = true;
    w_kirou.disabled = false;
    w_reset.disabled = false;
  }
  function setbuttonrunning() {
    start.disabled = true;
    stop.disabled = false;
    reset.disabled = true;
    kiroku.disabled = true;
    w_kirou.disabled = true;
    w_reset.disabled = true;
  }
  function setbuttonstopped() {
    start.disabled = false;
    stop.disabled = true;
    reset.disabled = false;
    kiroku.disabled = false;
    w_kirou.disabled = false;
    w_reset.disabled = false;
  }

  setbuttoninitial();

  start.addEventListener("click", () => {
    setbuttonrunning();
    startTime = Date.now();
    countUp();
    sand_watch.classList.add("show"); // 砂時計関連
  });

  stop.addEventListener("click", () => {
    setbuttonstopped();
    clearTimeout(timeoutId);
    elapsedTime += Date.now() - startTime;
    sand_watch.classList.remove("show"); // 砂時計関連
  });

  reset.addEventListener("click", () => {
    setbuttoninitial();
    timer.textContent = "00:00:00";
    elapsedTime = 0;
  });

  // 上部SAVEボタン押してからの挙動
  kiroku.addEventListener("click", () => {
    const weekday = document.getElementById("weekday").value;

    if (localStorage.getItem(`${weekday}`)) {
      const sum = Number(localStorage.getItem(`${weekday}`)) + elapsedTime;
      localStorage.setItem(`${weekday}`, sum);
    } else {
      localStorage.setItem(`${weekday}`, elapsedTime);
    }

    location.reload();
    weekly_sum();
    let sum = 0;
    for (let i = 0; i < 7; i++) {
      sum += wst[i];
    }
    const h = String(sum / 3600000).padStart(2, "0");
    const m = String((sum % 3600000) / 60000).padStart(2, "0");
    const s = String(((sum % 3600000) % 60000) / 1000).padStart(2, "0");
    weekly_study.textContent = `${h}:${m}:${s}`;
    timer.textContent = "00:00:00";
    elapsedTime = 0;
  });

  // 週の勉強時間をすべて削除する関数
  function delete_weektime() {
    $("#week_hour").text("00");
    $("#week_minute").text("00");
    $("#week_second").text("00");
    localStorage.removeItem("Saturday");
    localStorage.removeItem("Sunday");
    localStorage.removeItem("Monday");
    localStorage.removeItem("Tuesday");
    localStorage.removeItem("Wednesday");
    localStorage.removeItem("Thursday");
    localStorage.removeItem("Friday");
  }

  // ムシキングで使えるコードの配布ガチャ
  function gacha(){
  }

  // 週の勉強時間を記録orリセット
  w_kirou.addEventListener("click", () => {
    const weekstudysum =
      wst[0] + wst[1] + wst[2] + wst[3] + wst[4] + wst[5] + wst[6];
    const sum = weekstudysum + Number(localStorage.getItem("all_study_time"));
    localStorage.setItem("all_study_time", sum);
    delete_weektime();
    location.reload();
  });

  w_reset.addEventListener("click", () => {
    delete_weektime();
    location.reload();
  });

  // 総勉強時間確認ボタン
  const open = document.getElementById("open");
  const overlay = document.querySelector(".overlay");
  const close = document.getElementById("close");
  const all_study_record = document.getElementById("all_study_record");

  open.addEventListener("click", () => {
    overlay.classList.add("show");
    open.classList.add("hide");
    const weekstudysum =
      wst[0] + wst[1] + wst[2] + wst[3] + wst[4] + wst[5] + wst[6];
    const sum = weekstudysum + Number(localStorage.getItem("all_study_time"));
    const h = String(Math.floor(sum / 3600000)).padStart(3, "0");
    const m = String(Math.floor((sum % 3600000) / 60000)).padStart(2, "0");
    const s = String(Math.floor(((sum % 3600000) % 60000) / 1000)).padStart(
      2,
      "0"
    );
    all_study_record.textContent = `${h}:${m}:${s}`;
  });
  close.addEventListener("click", () => {
    overlay.classList.remove("show");
    open.classList.remove("hide");
  });
}
