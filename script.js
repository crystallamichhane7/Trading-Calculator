let lastTrade = "";

function toggleMode() {
  let mode = document.getElementById("mode").value;
  document.getElementById("manualSL").style.display =
    mode === "manual" ? "block" : "none";
  document.getElementById("priceSL").style.display =
    mode === "price" ? "block" : "none";
}

function calculate() {
  let account = +document.getElementById("account").value;
  let risk = +document.getElementById("risk").value;
  let value = +document.getElementById("pair").value;
  let tp = +document.getElementById("tp").value;
  let mode = document.getElementById("mode").value;

  let sl;

  if (mode === "manual") {
    sl = +document.getElementById("sl").value;
  } else {
    let entry = +document.getElementById("entry").value;
    let slprice = +document.getElementById("slprice").value;
    sl = Math.abs(entry - slprice);
  }

  if (!account || !risk || !sl || !tp) return;

  let riskAmount = (account * risk) / 100;
  let lot = riskAmount / (sl * value);
  let profit = lot * tp * value;
  let rr = tp / sl;

  lastTrade = `
  Lot: ${lot.toFixed(2)}<br>
  Risk: $${riskAmount.toFixed(2)}<br>
  Profit: $${profit.toFixed(2)}<br>
  RR: 1:${rr.toFixed(2)}
  `;

  document.getElementById("summaryBox").innerHTML = lastTrade;

  // Funded warning
  let daily = +document.getElementById("dailyLoss").value;
  let max = +document.getElementById("maxDD").value;

  let warn = "";
  if (daily && riskAmount > daily) warn += "⚠️ Daily limit exceeded<br>";
  if (max && riskAmount > max) warn += "⚠️ Max drawdown risk<br>";

  document.getElementById("fundedWarning").innerHTML = warn;
}

function saveTrade() {
  let history = JSON.parse(localStorage.getItem("trades") || "[]");
  history.push(lastTrade);
  localStorage.setItem("trades", JSON.stringify(history));
  loadHistory();
}

function loadHistory() {
  let history = JSON.parse(localStorage.getItem("trades") || "[]");
  document.getElementById("history").innerHTML =
    history.map(t => `<div class="card">${t}</div>`).join("");
}

function simulate() {
  let balance = +document.getElementById("account").value;
  let risk = +document.getElementById("risk").value;
  let winrate = +document.getElementById("winrate").value;
  let trades = +document.getElementById("trades").value;

  if (!balance || !risk || !winrate || !trades) return;

  for (let i = 0; i < trades; i++) {
    let rand = Math.random() * 100;
    let r = (balance * risk) / 100;

    if (rand < winrate) balance += r * 2;
    else balance -= r;
  }

  document.getElementById("simulationResult").innerHTML =
    "Estimated Balance: $" + balance.toFixed(2);
}

function downloadImage() {
  html2canvas(document.getElementById("app")).then(canvas => {
    let link = document.createElement("a");
    link.download = "trade.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}

loadHistory();