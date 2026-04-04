module.exports = {
  requires: {
    bundle: "ai",
  },
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
    {
      method: "shell.run",
      params: {
      conda: {
        path: "conda_env",
        python: "python=3.10.16"
        },
        path: "GLM-TTS",
        message: "conda install -y -c conda-forge pynini"
      }
    },
    // Install dependencies from pre-patched requirements.txt in repo root
    {
      method: "shell.run",
      params: {
        conda: "conda_env",
        path: "GLM-TTS",
        message: [
          "uv pip install setuptools==69.5.1 wheel",
          "uv pip install -r ../requirements.txt"
        ],
      }
    },
    // Install OpenAI Whisper with --no-build-isolation
    {
      method: "shell.run",
      params: {
        conda: "conda_env",
        path: "GLM-TTS",
        message: "uv pip install openai-whisper==20231117 --no-build-isolation"
      }
    },
    // Install WeTextProcessing without pynini (pynini has no Windows pip wheel)
    {
      method: "shell.run",
      params: {
        conda: "conda_env",
        path: "GLM-TTS",
        message: [
          "uv pip install soxr",
          "uv pip install WeTextProcessing==1.0.3 --no-deps"
        ],
      }
    },
    // Install PyTorch with CUDA support
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          conda: "conda_env",
          path: "GLM-TTS"
        }
      }
    },
    // Pre-download GLM-TTS model from HuggingFace
    {
      method: "shell.run",
      params: {
        conda: "conda_env",
        path: "GLM-TTS",
        message: [
          "hf download zai-org/GLM-TTS --local-dir=./ckpt && dir"
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
