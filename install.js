module.exports = {
  run: [
    // Clone GLM-TTS repository
    {
      method: "shell.run",
      params: {
        message: [
          "git clone https://github.com/zai-org/GLM-TTS.git"
        ],
      }
    },
    // Install PyTorch with CUDA support first
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          path: "GLM-TTS",
          venv: "env",
          xformers: false
        }
      }
    },
    // Install dependencies from pre-patched requirements.txt in repo root:
    // - torch/torchaudio/torchvision excluded (handled by torch.js with CUDA)
    // - deepspeed excluded (handled by Windows wheel below)
    // - openai-whisper excluded (installed separately below)
    // - WeTextProcessing excluded (installed with --no-deps below to avoid pynini)
    // - fastapi version fixed (0.123.9 does not exist on PyPI)
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "GLM-TTS",
        message: [
          "uv pip install -r ../requirements.txt"
        ],
      }
    },
    // Install openai-whisper separately
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "GLM-TTS",
        message: [
          "uv pip install openai-whisper==20231117"
        ],
      }
    },
    // Install WeTextProcessing without pynini (pynini has no Windows pip wheel)
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "GLM-TTS",
        message: [
          "uv pip install WeTextProcessing==1.0.3 --no-deps"
        ],
      }
    },
    // Install deepspeed from precompiled Windows wheel (must be after torch)
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "GLM-TTS",
        message: [
          "uv pip install https://github.com/6Morpheus6/deepspeed-windows-wheels/releases/download/v0.17.5/deepspeed-0.17.5+e1560d84-2.7torch+cu128-cp310-cp310-win_amd64.whl"
        ],
      }
    },
    // Install soxr (required by transformers)
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "GLM-TTS",
        message: [
          "uv pip install soxr"
        ],
      }
    },
    // Create checkpoint directory
    {
      method: "shell.run",
      params: {
        path: "GLM-TTS",
        message: [
          "mkdir ckpt"
        ],
      }
    },
    // Pre-download GLM-TTS model from HuggingFace
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "GLM-TTS",
        message: [
          "hf download zai-org/GLM-TTS --local-dir ckpt"
        ],
      }
    },
    // Patch gradio_app.py to use 127.0.0.1 instead of 0.0.0.0 for Windows compatibility
    {
      method: "shell.run",
      params: {
        path: "GLM-TTS",
        message: [
          "powershell -Command \"(Get-Content tools/gradio_app.py) -replace 'server_name=\\\"0.0.0.0\\\"', 'server_name=\\\"127.0.0.1\\\"' | Set-Content tools/gradio_app.py\""
        ],
      }
    },
    {
      method: "notify",
      params: {
        html: "Installation complete! Click 'Start' to launch GLM-TTS."
      }
    }
  ]
}
