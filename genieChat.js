function GenieChatBot(t){t={...default_options={elementId:"app",chatTitle:"Chat with us!",chatBackgroundColor:"#5297ff",chatTextColor:"white",chatIconColor:"#fff",resource_url:"/api/basic_cbt/",base_url:"",client_token:""},...t};let e=this,n;this.init=function(){this.appendContent(),this.toggleChat(),this.firstBotMessage(),this.sendWhenEnterKeyisPressed(),this.sendButtonWhenPressed()},this.appendContent=function(){document.querySelector(`#${t.elementId}`).innerHTML=`
        <div class="chat-bar-collapsible">
            <button id="chat-button" type="button" class="collapsible" style="background-color: ${t.chatBackgroundColor}; color: ${t.chatTextColor}">
                ${t.chatTitle}
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
                  <div id="chatbox">
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
    
                    <div class="chat-bar-icons">
                      <i
                        id="chat-icon-send"
                        style="color: #333"
                        class="fa-solid fa-paper-plane"
                       
                      ></i>
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
        `},this.toggleChat=function(){let t=document.getElementsByClassName("collapsible");for(let e=0;e<t.length;e++)t[e].addEventListener("click",function(){this.classList.toggle("active");var t=this.nextElementSibling;t.style.maxHeight?t.style.maxHeight=null:t.style.maxHeight=t.scrollHeight+"px"})},this.firstBotMessage=function(){document.getElementById("botStarterMessage").innerHTML='<p class="botText"><span>Let me know how can I help you</span></p>';let t=this.getTime(),e=document.getElementById("chat-timestamp"),n=document.createElement("span");n.textContent=t,e.appendChild(n),document.getElementById("userInput").scrollIntoView(!1)},this.getTime=function(){let t=new Date,e=t.getHours(),n=t.getMinutes();return e<10&&(e="0"+e),n<10&&(n="0"+n),e+":"+n},this.sendWhenEnterKeyisPressed=function(){document.getElementById("textInput").addEventListener("keypress",function(t){"Enter"===t.key&&e.getResponse()})},this.getResponse=function(){let t=document.getElementById("textInput"),n=t.value;t.value="";let i=document.getElementById("chatbox"),s=document.createElement("div");s.innerHTML='<p class="userText"><span>'+n+"</span></p>",i.appendChild(s),document.getElementById("chat-bar-bottom").scrollIntoView(!0),setTimeout(()=>{e.getHardResponse(n)},1e3)},this.loader=function(t){let e=document.getElementById(t);n=setInterval(()=>{e.textContent+=".","...."===e.textContent&&(e.textContent=".")},300)},this.typeText=function(t,e){let n=0,i=setInterval(()=>{n<e.length?(t.innerHTML+=e.charAt(n),n++):clearInterval(i)},20)},this.generateUniqueId=function(){let t=Date.now(),e=Math.random().toString(16);return`id-${t}-${e}`},this.getHardResponse=async function(t){let n=e.generateUniqueId(),i=`<p class='botText'><span id=${n}></span></p>`,s=document.getElementById("chatbox"),o=document.createElement("div");o.innerHTML=i,s.appendChild(o),document.getElementById("chat-bar-bottom").scrollIntoView(!0),e.loader(n,".");let a=await e.getBotResponse(t),l=document.getElementById(n);l.textContent="",a?e.typeText(l,a):l.textContent="Sorry, something went wrong :( contact us to fix it  "},this.getBotResponse=async function(e){let i=t.base_url+t.resource_url,s,o={token:t.client_token,prompt:e};try{if(s=await fetch(i,{method:"POST",headers:{"Content-type":"application/x-www-form-urlencoded"},body:JSON.stringify(o)}),clearInterval(n),s?.ok)return s.text();return console.log(s),!1}catch(a){return console.log(a),!1}},this.sendButton=function(){document.getElementById("chat-icon").addEventListener("click",function(){alert()})},this.sendButtonWhenPressed=function(){document.getElementById("chat-icon-send").addEventListener("click",function(t){e.getResponse()})},this.init()}
