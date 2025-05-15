<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Typing Study Game</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      padding: 2em;
      background-color: #f4f4f4;
    }
    #question {
      font-size: 1.5em;
      margin-bottom: 1em;
    }
    input {
      font-size: 1.2em;
      padding: 0.5em;
      width: 80%;
      max-width: 400px;
    }
    #feedback {
      margin-top: 1em;
      font-size: 1.2em;
    }
    #nextBtn {
      margin-top: 1em;
      padding: 0.5em 1em;
      font-size: 1em;
      display: none;
    }
    #score {
      margin-top: 2em;
      font-weight: bold;
    }
  </style>
</head>
<body>

  <h1>Typing Study Game</h1>
  <div id="question">Loading question...</div>
  <input type="text" id="answerInput" placeholder="Type the English answer here" autocomplete="off"/>
  <div id="feedback"></div>
  <button id="nextBtn">Next</button>
  <div id="score">Score: 0</div>

  <!-- PapaParse (CSV reader) -->
  <script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>

  <!-- Your game logic (make sure script.js includes the full JS logic) -->
  <script src="script.js"></script>

</body>
</html>
