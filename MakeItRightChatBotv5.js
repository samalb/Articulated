
function SendMessage() {
    var player = GetPlayer();
    var message = player.GetVar("message");
    var response = player.GetVar("response");
    var chatHistory = player.GetVar("chatHistory");
    var role = player.GetVar("role");
    var apiKey = player.GetVar("apiKey");
    
    var systemContent = `Act as a ${role} Assistant. Provide a concise answer to the user's question in a maximum of 500 characters.`;
    var userContent = `Question: ${message}`;
    apiKey = `Bearer ${apiKey}`;
    
    function sendMessage() {
        player.SetVar("response", "Please wait...");
        player.SetVar("message", "");

        var xhr = new XMLHttpRequest();
        var url = 'https://api.openai.com/v1/chat/completions'; // Endpoint URL

        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', apiKey); 
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) { // When the request is complete
                if (xhr.status === 200) {
                   
                    var apiResponse = JSON.parse(xhr.responseText);
                    if (apiResponse.choices && apiResponse.choices[0] && apiResponse.choices[0].message && apiResponse.choices[0].message.content) {
                        
                        var generatedResponse = apiResponse.choices[0].message.content.trim();
                        player.SetVar("response", generatedResponse);
                        
                        player.SetVar("chatHistory", `${chatHistory}\nUser: ${message}\nResponse: ${generatedResponse}\n`);
                    } else {
                         player.SetVar("response", `Error: Unexpected response format ${JSON.stringify(apiResponse)}`);
                    }
                } else {
                     player.SetVar("response", `Error: ${xhr.status} - ${xhr.statusText}`);
                }
            }
        };
        var data = JSON.stringify({
           model: "ft:gpt-3.5-turbo-0125:learningmavens:refactoringmakingitright:At0egDvZ",
           messages: [
                { role: "system", content: systemContent }, // System message
                { role: "assistant", content: systemContent }, // Assistant message
                { role: "user", content: userContent }      // User message
            ]
        });
        
        xhr.send(data); // Send the request
    }

    sendMessage(); // Execute the sendMessage function
}


function ExportChat() {
    var player = GetPlayer();
    var chatHistory = player.GetVar("chatHistory");

   
    var blob = new Blob([chatHistory], { type: 'application/msword' });
    var downloadLink = document.createElement("a"); // Create an anchor element
    downloadLink.download = "Chat History.doc"; // Set the download filename
    downloadLink.href = window.URL.createObjectURL(blob); // Create a URL for the blob
    document.body.appendChild(downloadLink); // Append the download link to the body

    
    downloadLink.click();

    
    document.body.removeChild(downloadLink);
}
