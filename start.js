module.exports = {
  daemon: true,
  run: [
    {
      method: "shell.run",
      params: {
        conda: "conda_env",
        path: "GLM-TTS",
        env: { 
          "PYTHONPATH": ".",
          "GRADIO_SERVER_NAME": "127.0.0.1"
        },
        message: [
          "python tools/gradio_app.py"
        ],
        on: [{
          "event": "/(http:\\/\\/\\S+)/",
          "done": true
        }]
      }
    },
    {
      method: "local.set",
      params: {
        url: "{{input.event[1]}}"
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

