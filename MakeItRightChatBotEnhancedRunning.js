const axios = require('axios');

async function sendMessage() {
    const player = GetPlayer();
    const message = player.GetVar("message");
    const chatHistory = player.GetVar("chatHistory");
    const role = player.GetVar("role");
    
    const apiKey = 'Bearer YOUR_API_KEY'; // Replace with your actual API key
    const assistantId = 'asst_hBvmQQXAqHtkUek96uA83qse'; // Replace with your assistant ID
    const threadId = 'thread_8tmc23QVDMkhcS9FrTnsZ8hZ'; // Replace with your thread ID

    const systemContent = `Act as a ${role} Assistant. Provide a concise answer to the user's question in a maximum of 500 characters.`;
    const userContent = `Question: ${message}`;

    player.SetVar("response", "Please wait...");
    player.SetVar("message", "");

    const data = {
        assistant_id: assistantId,
        thread_id: threadId,
        messages: [
            { role: "system", content: systemContent }, // System message
            { role: "user", content: userContent }       // User message
        ]
    };
    
    try {
        const response = await axios.post('https://api.openai.com/v1/assistants/runs', data, {
            headers: {
                'Authorization': apiKey,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].message && response.data.choices[0].message.content) {
            const generatedResponse = response.data.choices[0].message.content.trim();
            player.SetVar("response", generatedResponse);
            // Update chat history
            player.SetVar("chatHistory", `${chatHistory}\nUser: ${message}\nResponse: ${generatedResponse}\n`);
        } else {
            player.SetVar("response", `Error: Unexpected response format ${JSON.stringify(response.data)}`);
        }
    } catch (error) {
        player.SetVar("response", `Error: ${error.response ? error.response.data : error.message}`);
    }
}

 var data = JSON.stringify({
           model: "ft:gpt-4o-2024-08-06:learningmavens:makeitright:B7t1K9hh",
           messages: [
                { role: "system", content: systemContent }, // System message
                { role: "user", content: userContent }      // User message
            ]
        });
        
        xhr.send(data); // Send the request
    }

    sendMessage(); // Execute the sendMessage function
}

// Function to export chat history
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
