# GLM-TTS for Pinokio

A one-click launcher for [GLM-TTS](https://github.com/zai-org/GLM-TTS), a
text-to-speech application with reference-audio voice cloning.

Open this repository in Pinokio, choose **Install**, then **Start**. Upload
reference audio, provide its transcript, and synthesize new speech in the UI.
See [the setup guide](SETUP_GUIDE.md) for platforms, manual setup, and recovery.

The server binds to localhost on an available port. **Update** refreshes code
and dependencies. **Reset** deletes the downloaded application, environment,
checkpoints, and any files stored inside its directory.

## Programmatic access

Start the app first. Replace the example URL with the URL shown in Pinokio.
The upstream Gradio app exposes `run_inference`; its API page lists the current
endpoint names and schema. Upload reference audio through the client rather than
passing a client-local path directly to the server.

Python (`pip install gradio_client` in your client environment):

```python
from gradio_client import Client, handle_file

client = Client("http://127.0.0.1:7860")
client.view_api()
audio = client.predict(
    "The words spoken in the reference recording.",
    handle_file("reference.wav"),
    "Hello from GLM-TTS.",
    42, 24000, True,
    api_name="/run_inference",
)
print(audio)
```

JavaScript (`npm install @gradio/client`, in an ES module):

```javascript
import { Client, handle_file } from "@gradio/client";
import { readFile } from "node:fs/promises";

const client = await Client.connect("http://127.0.0.1:7860");
const result = await client.predict("/run_inference", [
  "The words spoken in the reference recording.",
  handle_file(new Blob([await readFile("reference.wav")], { type: "audio/wav" })),
  "Hello from GLM-TTS.", 42, 24000, true
]);
console.log(result.data);
```

Curl (POSIX shell; use `curl.exe` instead of the PowerShell alias on Windows):

```sh
# Inspect the schema and upload the reference recording.
curl http://127.0.0.1:7860/gradio_api/info
curl -F "files=@reference.wav" http://127.0.0.1:7860/gradio_api/upload

# Replace UPLOADED_PATH with the server path from the upload response.
curl -X POST http://127.0.0.1:7860/gradio_api/call/run_inference \
  -H "Content-Type: application/json" \
  -d '{"data":["Reference transcript",{"path":"UPLOADED_PATH","meta":{"_type":"gradio.FileData"}},"Hello from GLM-TTS.",42,24000,true]}'

# Replace EVENT_ID with the event_id returned by the POST.
curl -N http://127.0.0.1:7860/gradio_api/call/run_inference/EVENT_ID
```

The final event supplies the output audio file information. Check endpoint names
against the running app's API page after upstream updates.
