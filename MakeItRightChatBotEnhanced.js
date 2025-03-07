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
                        
                        // Update chat history
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
           model: "ft:gpt-4o-2024-08-06:learningmavens:makeitright:B7t1K9hh",
           messages: [
                { role: "system", content: systemContent }, // System message
                { role: "user", content: userContent }       // User message
            ],
            functions: [
                {
                name: "identity",
                description: "Who is the assistant",
                parameters: {
                    type: "object",
                    required: [
                        "prompt",
                        "completion"
                    ],
                    properties: {
                        prompt: {
                            type: "string",
                            description: "Who are you?"
                        },
                        completion: {
                            type: "string",
                            description: "The response provided by the function"
                        }
                    }
                }
            }
        ],
            function_call: { 
                "name": "identity", 
                 arguments: { 
                    prompt: "Who are you?",
                    completion: "",
                } 
            }
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

    downloadLink.click(); // Trigger the download

    document.body.removeChild(downloadLink); // Clean up
}