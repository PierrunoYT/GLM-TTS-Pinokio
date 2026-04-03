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
    // Patch requirements.txt: remove packages handled separately (torch, deepspeed,
    // openai_whisper) and fix non-existent fastapi version that causes pip to abort
    {
      method: "shell.run",
      params: {
        path: "GLM-TTS",
        message: [
          "powershell -Command \"(Get-Content requirements.txt) | Where-Object { $_ -notmatch '^(torch|torchaudio|torchvision|deepspeed|openai.whisper|WeTextProcessing)==' } | ForEach-Object { $_ -replace 'fastapi==0.123.9', 'fastapi==0.115.12' } | Set-Content requirements.txt\""
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
          xformers: false   // GLM-TTS doesn't require xformers
        }
      }
    },
    // Ensure setuptools is available (required to build openai-whisper and others from source)
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "GLM-TTS",
        message: [
          "pip install -U setuptools wheel Cython"
        ],
      }
    },
    // Install GLM-TTS dependencies from requirements.txt
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "GLM-TTS",
        message: [
          "pip install -r requirements.txt"
        ],
      }
    },
    // Install openai-whisper separately after setuptools is confirmed present
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "GLM-TTS",
        message: [
          "pip install openai-whisper==20231117"
        ],
      }
    },
    // Install pynini via conda-forge (no Windows pip wheel exists), then WeTextProcessing normally
    {
      method: "shell.run",
      params: {
        path: "GLM-TTS",
        message: [
          "conda install -c conda-forge pynini==2.1.5 --prefix env -y"
        ],
      }
    },
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "GLM-TTS",
        message: [
          "pip install WeTextProcessing==1.0.3"
        ],
      }
    },
    // Install deepspeed from precompiled wheel (must be after torch is installed)
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
          "pip install soxr"
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
