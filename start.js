module.exports = {
  daemon: true,
  run: [
    {
      method: "shell.run",
      params: {
        conda: "conda_env",
        path: "GLM-TTS",
        message: [
          "python ../app/launch.py"
        ],
        on: [{
          "event": "/running on .+(http:\/\/\\S+)/i",
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

