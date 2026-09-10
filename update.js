module.exports = {
  run: [
    {
      method: "shell.run",
      params: {
        message: "git pull --ff-only"
      }
    },
    {
      when: "{{exists('GLM-TTS/.installed')}}",
      method: "fs.rm",
      params: { path: "GLM-TTS/.installed" }
    },
    {
      when: "{{exists('GLM-TTS/.git')}}",
      method: "shell.run",
      params: {
        path: "GLM-TTS",
        message: "git pull --ff-only"
      }
    },
    {
      method: "script.start",
      params: { uri: "install.js" }
    }
  ]
}
