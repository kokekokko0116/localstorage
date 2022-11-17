"use strict"

{
  const timer = document.getElementById('timer');
  const start = document.getElementById('start');
  const stop = document.getElementById('stop');
  const reset = document.getElementById('reset');
  const kiroku = document.getElementById('kiroku');
  const weekly_study = document.getElementById('weekly_study');

  let startTime;
  let timeoutId;
  let elapsedTime = 0;

  //週の勉強時間 week study time の略
  const wst = [
    Number(localStorage.getItem("Saturday")),
    Number(localStorage.getItem("Sunday")),
    Number(localStorage.getItem("Monday")),
    Number(localStorage.getItem("Tuesday")),
    Number(localStorage.getItem("Wednesday")),
    Number(localStorage.getItem("Thursday")),
    Number(localStorage.getItem("Friday")),
  ];

  //週の合計を計算して渡す
  function weekly_sum() {
    const weekstudysum = wst[0] + wst[1] + wst[2] + wst[3] + wst[4] + wst[5] + wst[6];
    const h = String(Math.trunc(weekstudysum / 3600000)).padStart(2, '0');
    const m = String(Math.trunc((weekstudysum % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.trunc(((weekstudysum % 3600000) % 60000) / 1000)).padStart(2, '0');
    $("#week_hour").text(h);
    $("#week_minute").text(m);
    $("#week_second").text(s);
  }

  weekly_sum();


  //ちゃーと作成
  const ctx = document.getElementById('week_study_chart');

  var week_study_char = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI'],
      datasets: [{
        label: '勉強時間(h)',
        data: [wst[0] / 3600000, wst[1] / 3600000, wst[2] / 3600000, wst[3] / 3600000, wst[4] / 3600000, wst[5] / 3600000, wst[6] / 3600000],
        // ↓テストプレイ時にはこちらでお試しください
        // data: [wst[0] / 1000, wst[1] / 1000, wst[2] / 1000, wst[3] / 1000, wst[4] / 1000, wst[5] / 1000, wst[6] / 1000],
        borderWidth: 0
      }]
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
          }
        }
      }
    }
  });

  function countUp() {
    const d = new Date(Date.now() - startTime + elapsedTime);
    const h = String(d.getHours() - 9).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');
    const ms = String(d.getMilliseconds()).padStart(3, '0');
    timer.textContent = `${h}:${m}:${s}`;

    timeoutId = setTimeout(() => {
      countUp();
    }, 1000);
  }

  function setbuttoninitial() {
    start.disabled = false;
    stop.disabled = true;
    reset.disabled = true;
    kiroku.disabled = true;
  }
  function setbuttonrunning() {
    start.disabled = true;
    stop.disabled = false;
    reset.disabled = true;
    kiroku.disabled = true;
  }
  function setbuttonstopped() {
    start.disabled = false;
    stop.disabled = true;
    reset.disabled = false;
    kiroku.disabled = false;
  }

  setbuttoninitial();

  start.addEventListener('click', () => {
    setbuttonrunning();
    startTime = Date.now();
    countUp();
  });

  stop.addEventListener('click', () => {
    setbuttonstopped();
    clearTimeout(timeoutId);
    elapsedTime += Date.now() - startTime;
  });

  reset.addEventListener('click', () => {
    setbuttoninitial();
    timer.textContent = '00:00:00';
    elapsedTime = 0;
  });


  // 保存ボタン押してからの挙動
  kiroku.addEventListener('click', () => {
    const weekday = document.getElementById('weekday').value;

    if (localStorage.getItem(`${weekday}`)) {
      const sum = Number(localStorage.getItem(`${weekday}`)) + elapsedTime;
      localStorage.setItem(`${weekday}`, sum);
    }
    else {
      localStorage.setItem(`${weekday}`, elapsedTime);
    }


    location.reload();
    weekly_sum();
    let sum = 0;
    for (let i = 0; i < 7; i++) {
      sum += wst[i];
    }
    const h = String(sum / 3600000).padStart(2, '0');
    const m = String((sum % 3600000) / 60000).padStart(2, '0');
    const s = String(((sum % 3600000) % 60000) / 60000).padStart(2, '0');
    weekly_study.textContent = `${h}:${m}:${s}`;
    timer.textContent = '00:00:00';
    elapsedTime = 0;

    // const hdata = Number(localStorage.getItem("hour"));
    // const mdata = Number(localStorage.getItem("minute"));
    // const sdata = Number(localStorage.getItem("second"));
    // if(localStorage.getItem("hour")){
    //   const study_h= hdata + Math.trunc(elapsedTime / 3600000);

    //   localStorage.setItem("hour", study_h);
    // } else{
    //   const study_h= Math.trunc(elapsedTime / 3600000);

    //   localStorage.setItem("hour", study_h);
    // }
    // if(localStorage.getItem("minute")){
    //   const study_m= mdata + Math.trunc((elapsedTime % 3600000)/60000);;

    //   localStorage.setItem("minute", study_m);
    // } else{
    //   const study_m= Math.trunc((elapsedTime % 3600000)/60000);;

    //   localStorage.setItem("minute", study_m);
    // }
    // if(localStorage.getItem("second")){
    //   const study_s= sdata + Math.trunc(((elapsedTime % 3600000)%60000)/1000);

    //   localStorage.setItem("second", study_s);
    // } else{
    //   const study_s= Math.trunc(((elapsedTime % 3600000)%60000)/1000);

    //   localStorage.setItem("second", study_s);
    // }

  });

  const w_reset = document.getElementById('w_reset');
  w_reset.addEventListener('click', () => {
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
    location.reload();
  });

}