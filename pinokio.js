module.exports = {
  version: "3.7",
  title: "GLM-TTS",
  description: "🎙️ Controllable & Emotion-Expressive Zero-shot TTS with Multi-Reward Reinforcement Learning. High-quality text-to-speech synthesis supporting zero-shot voice cloning and streaming inference with natural emotional expression.",
  icon: "icon.jpg",
  menu: async (kernel, info) => {
    let installed = info.exists("GLM-TTS/conda_env") && info.exists("GLM-TTS/.installed")
    let running = {
      install: info.running("install.js"),
      start: info.running("start.js"),
      update: info.running("update.js"),
      reset: info.running("reset.js"),
      link: info.running("link.js")
    }
    // Maintenance must remain visible even after reset removes the environment.
    const maintenance = [
      ["update", "Updating"], ["reset", "Resetting"], ["link", "Deduplicating"]
    ].find(([script]) => running[script])
    if (maintenance) {
      return [{
        default: true,
        icon: "fa-solid fa-terminal",
        text: maintenance[1],
        href: `${maintenance[0]}.js`
      }]
    }
    if (running.install) {
      return [{
        default: true,
        icon: "fa-solid fa-plug",
        text: "Installing",
        href: "install.js",
      }]
    } else if (installed) {
      if (running.start) {
        let local = info.local("start.js")
        if (local && local.url) {
          return [{
            default: true,
            icon: "fa-solid fa-rocket",
            text: "Open Web UI",
            href: local.url,
          }, {
            icon: 'fa-solid fa-terminal',
            text: "Terminal",
            href: "start.js",
          }]
        } else {
          return [{
            default: true,
            icon: 'fa-solid fa-terminal',
            text: "Terminal",
            href: "start.js",
          }]
        }
      } else {
        return [{
          default: true,
          icon: "fa-solid fa-power-off",
          text: "Start",
          href: "start.js",
        }, {
          icon: "fa-solid fa-plug",
          text: "Update",
          href: "update.js",
        }, {
          icon: "fa-solid fa-plug",
          text: "Install",
          href: "install.js",
        }, {
          icon: "fa-solid fa-file-zipper",
          text: "<div><strong>Save Disk Space</strong><div>Deduplicates redundant library files</div></div>",
          href: "link.js",
        }, {
          icon: "fa-regular fa-circle-xmark",
          text: "<div><strong>Reset</strong><div>Revert to pre-install state</div></div>",
          href: "reset.js",
          confirm: "Are you sure you wish to reset the app?"

        }]
      }
    } else {
      const items = [{
        default: true,
        icon: "fa-solid fa-plug",
        text: "Install",
        href: "install.js",
      }]
      if (info.exists("GLM-TTS")) {
        items.push({
          icon: "fa-regular fa-circle-xmark",
          text: "Reset incomplete installation",
          href: "reset.js",
          confirm: "Delete GLM-TTS, including its environment, checkpoints, and any files saved inside it?"
        })
      }
      return items
    }
  }
}
