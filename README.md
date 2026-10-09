<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>The Birthday Brew</title>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800&family=Caveat:wght@600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="wrap">
  <div class="awning"></div>
  <div class="sign"><h1>☕ The Birthday Brew</h1><p>never forget a roommate again</p></div>

  <section class="card stage">
    <button id="big" aria-label="Find the next birthday">Who's<br>next?!</button>
    <div class="result" id="result" aria-live="polite"><span class="hint">Push the big red button to find out.</span></div>
  </section>

  <section class="card">
    <h2>Add a roommate</h2>
    <form id="f">
      <input type="text" id="name" placeholder="Name" required maxlength="40">
      <input type="date" id="date" required aria-label="Birthday">
      <button class="add" type="submit">Add</button>
    </form>
  </section>

  <section class="card">
    <h2>The house menu</h2>
    <ul id="list"></ul>
  </section>
  <footer>Saved on this device only. Open the page on a shared screen for the whole house!</footer>
</div>
<script src="app.js"></script>
</body>
</html>
