const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");




const scriptURL = 'https://script.google.com/macros/s/AKfycbwDC4aCVbzXoAJ4XrZtEIuN8XeSpylErbAOEKuHvNLM_cX6YZDj79RL7-2zhNHL2BmF/exec'
        const form = document.forms['submit-to-google-sheet']
        const msg = document.getElementById("msg")
        form.addEventListener('submit', e => {
          e.preventDefault()
          fetch(scriptURL, { method: 'POST', body: new FormData(form)})
            .then(response => {
                msg.innerHTML="Thank you for Subscribing!"
                setTimeout(function(){
                    msg.innerHTML=""
                }, 5000)
                form.reset()

            }
            )
            .catch(error => console.error('Error!', error.message))
        })


























let userMessage=null;
const API_KEY = "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";
const inputInitHeight = chatInput.scrollHeight;


const createChatLi = (message, className) => {
    const chatLi =document.createElement("Li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">></span><p></p>`;

    chatLi.innerHTML=chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}


const generateResponse = (chatElement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = chatElement.querySelector("p");

    const requestOptions = {
        method: "POST", 
        headers: {
            "Content-Type" : "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: userMessage}],
        })
    }
    fetch(API_URL, requestOptions).then(res => res.json()).then(data =>{
        messageElement.textContent = data.choices[0].message.content.trim();
    }).catch(() => {
        messageElement.classList.add("error");
        messageElement.textContent="Oops! Something went wrong. Please Try again later";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}


chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftkey && window.innerWidth > 800){
        e.preventDefault();
        handleChat ();
    }
});

sendChatBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));