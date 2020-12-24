var UIModule = (function () {
  //classes used to select HTML elements
  var DOMElements = {
    //indicators - test control
    timeLeft: document.getElementById("time_left"), //HTML element displaying time left
    //test results
    wpm: document.getElementById("wpm"),
    wpmChange: document.getElementById("wpm_change"),
    cpm: document.getElementById("cpm"),
    cpmChange: document.getElementById("cpm_change"),
    accuracy: document.getElementById("accuracy"),
    accuracyChange: document.getElementById("accuracy_change"),
    //user input
    textInput: document.getElementById("input"),
    nameInput: document.querySelector(".form-group"),
    nameField: document.getElementById("name_field"),
    //test words
    content: document.getElementById("content"),
    activeWord: "",
    //modal
    modal: $("#my_modal"),
    download: document.getElementById("download"),
  };

  var splitArray = function (string) {
    return string.split("");
  };

  var addSpaces = function (array) {
    array.push(" ");
    return array;
  };

  var addSpanTags = function (array) {
    return array.map(function (currentChar) {
      return "<span>" + currentChar + "</span>";
    });
  };

  var addWordSpanTags = function (array) {
    array.unshift("<span>");
    array.push("</span>");
    return array;
  };

  var joinEachWord = function (array) {
    return array.join("");
  };
  var userValue;
  var returnCharClass = function (currentCharacter, index) {
    // console.log(userValue);
    return index < userValue.length
      ? currentCharacter == userValue[index]
        ? "correctCharacter"
        : "wrongCharacter"
      : 0;
  };

  var fadeElement = function (changeElement) {
    changeElement.style.opacity = 1;
    setTimeout(function () {
      changeElement.style.opacity = 0.8;
    }, 100);
  };

  var updateChange = function (value, changeElement) {
    //  determine class to add
    var classToAdd, html;
    [classToAdd, html] =
      value >= 0 ? ["scoreup", "+" + value] : ["scoredown", value];

    if (changeElement == DOMElements.accuracyChange) {
      html += " %";
    }

    // update changeElement
    changeElement.innerHTML = html;

    // style
    changeElement.removeAttribute("class");
    changeElement.className = classToAdd;

    fadeElement(changeElement);
  };

  return {
    //get DOM elements

    getDOMElements: function () {
      return {
        textInput: DOMElements.textInput,
        download: DOMElements.download,
      };
    },

    //Indicators - Test Control

    updateTimeLeft: function (x) {
      DOMElements.timeLeft.innerHTML = x;
    },

    //results

    updateResults: function (results) {
      // update values
      DOMElements.wpm.innerHTML = results.wpm;
      DOMElements.cpm.innerHTML = results.cpm;
      DOMElements.accuracy.innerHTML = results.accuracy + " %";

      // update changes
      updateChange(results.wpmChange, DOMElements.wpmChange);
      updateChange(results.cpmChange, DOMElements.cpmChange);
      updateChange(results.accuracyChange, DOMElements.accuracyChange);
    },

    fillModal: function (wpm) {
      var results;
      if (wpm < 30) {
        results = {
          image: "turtle.jpg",
          level: "Beginner",
        };
      } else if (wpm < 45) {
        results = {
          image: "ostrich.jpg",
          level: "Average",
        };
      } else if (wpm < 70) {
        results = {
          image: "horse.jpg",
          level: "Intermediate",
        };
      } else {
        results = {
          image: "cheetah.jpg",
          level: "Expert",
        };
      }

      var html =
        '<div class="modal_content"><p>You are at %level% Level</p><p>You type at a speed of %wpm% words per minute</p><img style="margin-bottom:10px" src="Images/%image%" alt="%alt%" width="300" height="200" class="rounded-circle"></div>';

      html = html.replace("%level%", results.level);
      html = html.replace("%wpm%", wpm);
      html = html.replace("%image%", results.image);
      html = html.replace("%alt%", results.level);

      DOMElements.nameInput.insertAdjacentHTML("beforebegin", html);

      DOMElements.download.setAttribute("level", results.level);
    },

    showModal: function () {
      DOMElements.modal.modal("show");
    },

    //user input

    inputFocus: function () {
      DOMElements.textInput.focus();
    },

    isNameEmpty: function () {
      return DOMElements.nameField.value == "";
    },

    flagNameInput: function () {
      DOMElements.nameField.style.borderColor = "red";
    },

    spacePressed: function (e) {
      return e.data == " ";
    },

    enterPressed: function (lineReturn) {
      return DOMElements.textInput.value.includes(lineReturn + " ");
    },

    emptyInput: function () {
      DOMElements.textInput.value = "";
    },

    getTypedWord: function () {
      return DOMElements.textInput.value;
    },

    //test words

    fillContent: function (array, lineReturn) {
      var content = array.map(splitArray);

      content = content.map(addSpaces);

      content = content.map(addSpanTags);

      content = content.map(addWordSpanTags);

      content = content.map(joinEachWord);

      content = content.join("");
      content = content
        .split("<span>" + lineReturn + "</span>")
        .join("<span>&crarr;</span>");

      DOMElements.content.innerHTML = content;
    },

    formatWord: function (wordObject) {
      var activeWord = DOMElements.activeWord;
      // hightlight active word
      activeWord.className = "activeWord";

      // format individual characters
      var correctValue = wordObject.value.correct;
      userValue = wordObject.value.user;

      var classes = Array.prototype.map.call(correctValue, returnCharClass);
      var activeWord = DOMElements.activeWord;
      var characters = activeWord.children;
      // add classes to children
      for (var i = 0; i < characters.length; i++) {
        characters[i].removeAttribute("class");
        characters[i].className = classes[i];
      }
    },

    setActiveWord: function (index) {
      DOMElements.activeWord = DOMElements.content.children[index];
    },

    deactivateCurrentWord: function () {
      DOMElements.activeWord.removeAttribute("class");
    },

    scroll: function () {
      var activeWord = DOMElements.activeWord;
      var top1 = activeWord.offsetTop;
      var top2 = DOMElements.content.offsetTop;
      var diff = top1 - top2;
      // scroll the content of content box
      DOMElements.content.scrollTop = diff - 46;
    },
  };
})();
