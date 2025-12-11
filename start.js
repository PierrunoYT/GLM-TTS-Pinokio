module.exports = {
  daemon: true,
  run: [
    // Launch GLM-TTS Gradio Web UI
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "GLM-TTS",
        env: { },
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
    {
      method: "local.set",
      params: {
        url: "{{input.event[0]}}"
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

