var eventsModule = (function (dModule, uModule, cModule, wModule) {
  var addEventListeners = function () {
    // enter click event
    uModule
      .getDOMElements()
      .textInput.addEventListener("keydown", function (event) {
        // console.log(event);
        if (dModule.testEnded()) {
          return;
        }
        // checked if user pressed enter
        var key = event.key;
        if (key == "Enter") {
          uModule.getDOMElements().textInput.value +=
            dModule.getLineReturn() + " ";
          // create new input event
          var inputEvent = new Event("input");

          // dispatch
          uModule.getDOMElements().textInput.dispatchEvent(inputEvent);
        }
      });

    //character typing event listener
    uModule
      .getDOMElements()
      .textInput.addEventListener("input", function (event) {
        // if test ended do nothing
        if (dModule.testEnded()) {
          return;
        }

        // if test has not started
        if (!dModule.testStarted()) {
          // start the test
          dModule.startTest();

          var b = setInterval(function () {
            // calculate results :data module
            var results = {};
            [results.wpm, results.wpmChange] = dModule.calculateWpm();

            [results.cpm, results.cpmChange] = dModule.calculateCpm();

            [
              results.accuracy,
              results.accuracyChange,
            ] = dModule.calculateAccuracy();

            uModule.updateResults(results);
            if (dModule.timeLeft()) {
              var timeLeft = dModule.reduceTime();

              uModule.updateTimeLeft(timeLeft);
            } else {
              clearInterval(b);
              dModule.endTest();
              uModule.fillModal(results.wpm);

              uModule.showModal();
            }
          }, 1000);
        }

        // get typed word:UI module
        var typedWord = uModule.getTypedWord();

        // update current word:data module
        dModule.updateCurrentWord(typedWord);

        // format active word
        var currentWord = dModule.getCurrentWord();
        uModule.formatWord(currentWord);

        // check if user pressed space or enter
        if (
          uModule.spacePressed(event) ||
          uModule.enterPressed(dModule.getLineReturn())
        ) {
          // empty the input
          uModule.emptyInput();

          // deactivate current word
          uModule.deactivateCurrentWord();

          //move to new Word data module
          dModule.moveToNewWord();

          // set active word UI module
          var index = dModule.getCurrentWordIndex();
          uModule.setActiveWord(index);

          // format the active word UI module
          var currentWord = dModule.getCurrentWord();
          uModule.formatWord(currentWord);

          // scroll
          uModule.scroll();
        }
      });
    //click on download button event listener
    uModule.getDOMElements().download.addEventListener("click", function () {
      if (uModule.isNameEmpty()) {
        uModule.flagNameInput();
      } else {
        var data = dModule.getCertificateData();
        cModule.generateCertificate(data);
      }
    });
  };

  // scroll active word into middle view on window resize
  window.addEventListener("resize", uModule.scroll);

  return {
    //init function, initializes the test before start
    init: function (duration, textNumber) {
      // fill list of test words data module
      var words = wModule.getWords(textNumber);

      dModule.fillListOfTestWords(textNumber, words);

      var lineReturn = dModule.getLineReturn();
      var testWords = dModule.getListofTestWords();
      uModule.fillContent(testWords, lineReturn);

      // set total test time data module
      dModule.setTestTime(duration);

      // set timeleft in data module
      dModule.initializeTimeLeft();

      // update timeleft in UI module
      var timeLeft = dModule.getTimeLeft();
      uModule.updateTimeLeft(timeLeft);

      //move to new Word data module
      dModule.moveToNewWord();

      // set active word UI module
      var index = dModule.getCurrentWordIndex();
      uModule.setActiveWord(index);

      // format the active word UI module
      var currentWord = dModule.getCurrentWord();
      uModule.formatWord(currentWord);

      // input focus
      uModule.inputFocus();

      addEventListeners();
    },
  };
})(dataModule, UIModule, certificateModule, wordsModule);
