module.exports = {
  daemon: true,
  run: [
    // Launch GLM-TTS Gradio Web UI
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "GLM-TTS",
        env: { "PYTHONPATH": "." },
        message: [
          "python tools/gradio_app.py"
        ],
        on: [{
          // Monitor for Gradio's HTTP URL output
          "event": "/http:\\/\\/[^\\s\\/]+:\\d{2,5}(?=[^\\w]|$)/",
          "done": true
        }]
      }
    },
    // Set the local URL variable for the "Open Web UI" button
    // Replace 0.0.0.0 with 127.0.0.1 for Windows compatibility
    {
      method: "local.set",
      params: {
        url: "http://127.0.0.1:7860"
      }
    },
    {
      method: "notify",
      params: {
        html: "GLM-TTS is running! Click 'Open Web UI' to start generating speech."
      }
    }
  ]
}

