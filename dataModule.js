var dataModule = (function () {
  var lineReturn = "|";
  // shuffle function
  var shuffle = function (array) {
    var newArray = [];
    var randomIndex;
    var randomElement;
    while (array.length > 0) {
      randomIndex = Math.floor(Math.random() * array.length);
      randomElement = array[randomIndex];
      newArray.push(randomElement);
      array.splice(randomIndex, 1);
    }
    return newArray;
  };

  // capitalize the first letter of string
  String.prototype.capitalize = function () {
    var newString = "";
    var firstCharCap = this.charAt(0).toUpperCase();
    var remainingChar = this.slice(1);
    newString = firstCharCap + remainingChar;
    return newString;
  };

  // capitalize random word
  var capitalizeRandom = function (array) {
    return array.map(function (currentWord) {
      var x = Math.floor(4 * Math.random());
      return x == 3 ? currentWord.capitalize() : currentWord;
    });
  };

  var addRandomPunctuation = function (array) {
    return array.map(function (currentWord) {
      var randomPunctuation;
      var items = [
        lineReturn,
        "?",
        ",",
        ",",
        ",",
        ",",
        "",
        "",
        "",
        "",
        ",",
        ",",
        ",",
        ".",
        ".",
        ".",
        ".",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "!",
      ];
      var randomIndex = Math.floor(Math.random() * items.length);
      randomPunctuation = items[randomIndex];
      return currentWord + randomPunctuation;
    });
  };

  var nbCorrectChar;
  var charCallback = function (currentElement, index) {
    nbCorrectChar += currentElement == this.characters.user[index] ? 1 : 0;
  };

  var appData = {
    indicators: {
      testStarted: false,
      testEnded: false,
      totalTestTime: 0,
      timeLeft: 0,
    },
    results: {
      wpm: 0,
      wpmChange: 0,
      cpm: 0,
      cpmChange: 0,
      accuracy: 0,
      accuracyChange: 0,
      numOfCorrectWords: 0,
      numOfCorrectCharacters: 0,
      numOfTestCharacters: 0,
    },
    words: {
      currentWordIndex: -1,
      testWords: [],
      currentWord: {},
    },
  };

  //word constructor
  //    {
  //      value: {correct: '', user: '' , isCorrect: false },
  //      characters: {correct: [], user: [], totalCorrect: 0, totalTest: 0 }
  //    }

  var word = function (index) {
    // word values
    this.value = {
      correct: appData.words.testWords[index] + " ",
      user: "",
      isCorrect: false,
    };
    this.characters = {
      correct: this.value.correct.split(""),
      user: [],
      totalCorrect: 0,
      totalTest: this.value.correct.length,
    };
  };

  //update method
  word.prototype.update = function (value) {
    // update user input
    this.value.user = value;

    // update word status
    this.value.isCorrect = this.value.correct == this.value.user;

    // update user chracters
    this.characters.user = this.value.user.split("");

    // calculate no of correct characters
    nbCorrectChar = 0;
    var charCallback2 = charCallback.bind(this);
    this.characters.correct.forEach(charCallback2);
    this.characters.totalCorrect = nbCorrectChar;
  };

  return {
    //indicators - test Control

    setTestTime: function (x) {
      appData.indicators.totalTestTime = x;
    }, //sets the total test time to x

    initializeTimeLeft() {
      appData.indicators.timeLeft = appData.indicators.totalTestTime;
    }, //initializes time left to the total test time

    startTest: function () {
      appData.indicators.testStarted = true;
    }, //starts the test

    endTest: function () {
      appData.indicators.testEnded = true;
    }, //ends the test

    getTimeLeft: function () {
      return appData.indicators.timeLeft;
    }, //return the remaining test time

    reduceTime: function () {
      appData.indicators.timeLeft--;
      return appData.indicators.timeLeft;
    }, // reduces the time by one sec

    timeLeft() {
      return appData.indicators.timeLeft != 0;
    }, //checks if there is time left to continue the test

    testEnded() {
      return appData.indicators.testEnded;
    }, //checks if the test has already ended

    testStarted() {
      return appData.indicators.testStarted;
    }, //checks if the test has started

    //results

    getCertificateData: function () {
      return {
        wpm: appData.results.wpm,
        accuracy: appData.results.accuracy,
      };
    },

    calculateWpm: function () {
      var wpmOld = appData.results.wpm;
      var numCorrectWords = appData.results.numOfCorrectWords;
      if (appData.indicators.timeLeft != appData.indicators.totalTestTime) {
        appData.results.wpm = Math.round(
          (60 * numCorrectWords) /
            (appData.indicators.totalTestTime - appData.indicators.timeLeft)
        );
      } else {
        appData.results.wpm = 0;
      }
      appData.results.wpmChange = appData.results.wpm - wpmOld;
      return [appData.results.wpm, appData.results.wpmChange];
    }, //calculates wpm and wpmChange and updates them in appData

    calculateCpm: function () {
      var cpmOld = appData.results.cpm;
      var numCorrectChar = appData.results.numOfCorrectCharacters;
      if (appData.indicators.timeLeft != appData.indicators.totalTestTime) {
        appData.results.cpm = Math.round(
          (60 * numCorrectChar) /
            (appData.indicators.totalTestTime - appData.indicators.timeLeft)
        );
      } else {
        appData.results.cpm = 0;
      }
      appData.results.cpmChange = appData.results.cpm - cpmOld;

      return [appData.results.cpm, appData.results.cpmChange];
    }, //calculates cpm and cpmChange and updates them in appData

    calculateAccuracy: function () {
      var accuracyOld = appData.results.accuracy;
      var numCorrectChar = appData.results.numOfCorrectCharacters;
      var numTestChar = appData.results.numOfTestCharacters;
      if (appData.indicators.timeLeft != appData.indicators.totalTestTime) {
        if (numTestChar != 0) {
          appData.results.accuracy = Math.round(
            (100 * numCorrectChar) / numTestChar
          );
        } else {
          appData.results.accuracy = 0;
        }
      } else {
        appData.results.accuracy = 0;
      }
      appData.results.accuracyChange = appData.results.accuracy - accuracyOld;

      return [appData.results.accuracy, appData.results.accuracyChange];
    }, //calculates accuracy and accuracyChange and updates them in appData

    //test words

    fillListOfTestWords(textNumber, words) {
      var result = words.split(" ");
      if (textNumber == 0) {
        // shuffle array
        result = shuffle(result);
        // random capitalisation
        result = capitalizeRandom(result);
        // random punctutaion
        result = addRandomPunctuation(result);
      }

      appData.words.testWords = result;
    }, // fills words.testWords

    getListofTestWords() {
      return appData.words.testWords;
    }, // get list of test words: words.testWords

    moveToNewWord: function () {
      if (appData.words.currentWordIndex > -1) {
        // update no of correct words
        if (appData.words.currentWord.value.isCorrect == true) {
          appData.results.numOfCorrectWords++;
        }

        // update no of correct char
        appData.results.numOfCorrectCharacters +=
          appData.words.currentWord.characters.totalCorrect;

        // update no of test char
        appData.results.numOfTestCharacters +=
          appData.words.currentWord.characters.totalTest;
      }
      appData.words.currentWordIndex++;
      var currentIndex = appData.words.currentWordIndex;
      var newWord = new word(currentIndex);
      appData.words.currentWord = newWord;
    }, // increments the currentWordIndex - updates the current word (appData.words.currentWord) by creating a new instance of the word class - updates numOfCorrectWords, numOfCorrectCharacters and numOfTestCharacters

    // get current word index
    getCurrentWordIndex() {
      return appData.words.currentWordIndex;
    },

    // get current word
    getCurrentWord() {
      var currentWord = appData.words.currentWord;
      return {
        value: {
          correct: currentWord.value.correct,
          user: currentWord.value.user,
        },
      };
    },

    updateCurrentWord: function (value) {
      appData.words.currentWord.update(value);
    }, // updates current word using user input

    getLineReturn: function () {
      return lineReturn;
    },

    getData: function () {
      return appData;
    },
  };
})();
