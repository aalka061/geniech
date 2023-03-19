function GenieChatBot(options) {
  default_options = {
    elementId: "app",
    chatTitle: "Chat with us!",
    chatBackgroundColor: "#5297ff",
    chatTextColor: "white",
    chatIconColor: "#fff",
    resource_url: "/api/basic_cbt/",
    base_url: "",
    client_token: "",
    firstBotMessage: "Let me know how can I help you",
  };
  let chatData = [];
  options = { ...default_options, ...options };
  let _this = this;
  let loadInterval;
  let isSessionStorageTimout = false;
  this.init = function () {
    this.appendContent();
    this.toggleChat();
    this.firstBotMessage();
    this.sendWhenEnterKeyisPressed();
    this.sendButtonWhenPressed();
    this.loadChatHistoryToWindow();
  };

  this.appendContent = function () {
    document.querySelector(`#${options.elementId}`).innerHTML = `
        <div class="chat-bar-collapsible">
            <button id="chat-button" type="button" class="collapsible" style="background-color: ${options.chatBackgroundColor}; color: ${options.chatTextColor}">
                ${options.chatTitle}
                <i
                id="chat-icon"
                style="color: white"
                class="fa-regular fa-comments"
                ></i>
          </button>
          <div class="content">
            <div class="full-chat-block">
              <div class="outer-container">
                <div class="chat-container">
                  <div class="chat-messages" id="chatbox">
                    <h5 id="chat-timestamp"></h5>
                    <p id="botStarterMessage" class="botText">
                      <span>Loading...</span>
                    </p>
                  </div>
    
                  <div class="chat-bar-input-block">
                    <div id="userInput">
                      <input
                        id="textInput"
                        class="input-box"
                        type="text"
                        name="msg"
                        placeholder="Tap 'Enter' to send a message"
                      />
                      <p></p>
                    </div>
    
                    
                    <div id="chat-icon-send" >
                      <a id="chat-icon-send" href="#">
                        <img src="https://img.icons8.com/fluency/30/null/filled-sent.png"/>
                     </a>
                    </div>
                  </div>
    
                  <div id="chat-bar-bottom">
                    <p></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
         </div>
        `;
  };

  this.scrollToBottom = function () {
    let chatContainer = document.getElementById("chatbox");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  };
  this.toggleChat = function () {
    let coll = document.getElementsByClassName("collapsible");

    for (let i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function () {
        this.classList.toggle("active");

        var content = this.nextElementSibling;

        if (content.style.maxHeight) {
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
        }
      });
    }
  };
  this.firstBotMessage = function () {
    // Gets the first message
    let firstMessage = options.firstBotMessage;
    document.getElementById("botStarterMessage").innerHTML =
      '<p class="botText"><span>' + firstMessage + "</span></p>";
    let time = this.getTime();
    let timeElement = document.getElementById("chat-timestamp");
    let timeSpan = document.createElement("span");
    timeSpan.textContent = time;
    timeElement.appendChild(timeSpan);
    document.getElementById("userInput").scrollIntoView(false);
  };

  this.getTime = function () {
    let today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();

    if (hours < 10) {
      hours = "0" + hours;
    }

    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    let time = hours + ":" + minutes;
    return time;
  };

  this.sendWhenEnterKeyisPressed = function () {
    let textInput = document.getElementById("textInput");
    textInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        _this.getResponse();
      }
    });
  };

  this.getResponse = function () {
    const textInput = document.getElementById("textInput");
    const userText = textInput.value;
    this.addMessageToHistory(userText, "user");
    let userHtml = '<p class="userText"><span>' + userText + "</span></p>";

    textInput.value = "";
    let chatbox = document.getElementById("chatbox");
    let userElement = document.createElement("div");
    userElement.innerHTML = userHtml;
    chatbox.appendChild(userElement);
    // document.getElementById("chat-bar-bottom").scrollIntoView(true);
    this.scrollToBottom();
    setTimeout(() => {
      _this.getHardResponse(userText);
    }, 1000);
  };

  this.loader = function (element_id) {
    let element = document.getElementById(element_id);
    // element.innerHTML = "<span></span>";
    _this.scrollToBottom();
    loadInterval = setInterval(() => {
      // Update the text content of the loading indicator
      element.textContent += ".";

      // If the loading indicator has reached three dots, reset it
      if (element.textContent === "....") {
        element.textContent = ".";
      }
    }, 300);
  };

  this.typeText = function (element, text) {
    let index = 0;
    let chatContainer = document.getElementById("chatbox");
    if (/<a\b[^>]*>/i.test(text)) {
      element.innerHTML = text;
      chatContainer.scrollTop = chatContainer.scrollHeight;
    } else {
      let interval = setInterval(() => {
        if (index < text.length) {
          element.innerHTML += text.charAt(index);
          index++;
          chatContainer.scrollTop = chatContainer.scrollHeight;
        } else {
          clearInterval(interval);
        }
      }, 20);
    }
  };
  // generate unique ID for each message div of bot
  this.generateUniqueId = function () {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
  };

  this.getHardResponse = async function (userText) {
    let uniqueId = _this.generateUniqueId();
    let botHtml = `<p class='botText'><span id=${uniqueId}></span></p>`;
    let chatbox = document.getElementById("chatbox");
    let userElement = document.createElement("div");
    userElement.innerHTML = botHtml;
    chatbox.appendChild(userElement);
    document.getElementById("chat-bar-bottom").scrollIntoView(true);
    _this.loader(uniqueId, ".");

    let botResponse = await _this.getBotResponse(userText);
    let element = document.getElementById(uniqueId);
    element.textContent = "";

    if (!botResponse) {
      clearInterval(loadInterval);
      element.textContent =
        "Sorry, something went wrong. Please contact us to fix it ";
    } else {
      let text = botResponse;

      const urlRegex = /(https?:\/\/[^\s.]+\.[^\s.]+(?:\.[^\s.]+)*)(\.?)/g;
      botResponse = botResponse.replace(
        urlRegex,
        '<a target="_blank" href="$1">click here</a>'
      );
      this.addMessageToHistory(botResponse, "bot");

      _this.typeText(element, botResponse);
    }
  };

  this.getBotResponse = async function (input) {
    const url = options.base_url + options.resource_url;
    let response;
    const params = {
      token: options.client_token,
      prompt: input,
    };
    // url: http://gptbot-dev.ca-central-1.elasticbeanstalk.com/api/home_chatbot/
    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify(params),
      });
      clearInterval(loadInterval);
      if (response?.ok) {
        return response.text();
      } else {
        console.log(response);
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  this.sendButton = function () {
    let sendButtonElement = document.getElementById("chat-icon");
    sendButtonElement.addEventListener("click", function () {});
  };

  this.sendButtonWhenPressed = function (e) {
    let sendButtonElement = document.getElementById("chat-icon-send");
    sendButtonElement.addEventListener("click", function (event) {
      _this.getResponse();
    });
  };

  this.loadChatHistoryToWindow = function () {
    // Load chat history on page load
    let history = _this.loadChatHistory();
    let chatbox = document.getElementById("chatbox");

    history.forEach((item) => {
      let messageHtml = "";
      if (item.sender === "bot") {
        messageHtml =
          '<p class="botText"><span>' + item.message + "</span></p>";
      } else {
        messageHtml =
          '<p class="userText"><span>' + item.message + "</span></p>";
      }

      let messageElement = document.createElement("div");
      messageElement.innerHTML = messageHtml;
      chatbox.appendChild(messageElement);
      _this.scrollToBottom();
    });
  };

  // Store chat history in local storage
  this.storeChatHistory = function (history) {
    sessionStorage.setItem("chatHistory", JSON.stringify(history));
    if (!isSessionStorageTimout) {
      setTimeout(function () {
        sessionStorage.removeItem("chatHistory");
        isSessionStorageTimout = true;
      }, 30 * 60 * 1000); // 30 minutes in milliseconds
    }
  };
  // Load chat history from local storage
  this.loadChatHistory = function () {
    let chatHistory;
    if (sessionStorage.getItem("chatHistory")) {
      chatHistory = JSON.parse(sessionStorage.getItem("chatHistory"));
    }

    return chatHistory ? chatHistory : [];
  };
  // Add a message to the chat history
  this.addMessageToHistory = function (message, sender) {
    const timestamp = new Date().getTime();
    const history = _this.loadChatHistory();
    history.push({ message, sender, timestamp });
    _this.storeChatHistory(history);
  };

  this.init();
}
