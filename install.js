module.exports = {
  requires: {
    bundle: "ai",
  },
  run: [
    // Clone GLM-TTS repository
    {
      when: "{{!exists('GLM-TTS')}}",
      method: "shell.run",
      params: {
        message: [
          "git clone https://github.com/zai-org/GLM-TTS.git"
        ],
      }
    },
    {
      when: "{{exists('GLM-TTS/.installed')}}",
      method: "fs.rm",
      params: { path: "GLM-TTS/.installed" }
    },
    {
      method: "shell.run",
      params: {
        conda: {
          path: "conda_env",
          python: "python=3.10.16"
        },
        path: "GLM-TTS",
        message: "conda install -y -c conda-forge pynini ffmpeg"
      }
    },
    // Select the backend before packages that transitively require torch.
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
    // ROCm supplies its own Triton distribution; do not overwrite it with CUDA Triton.
    // Whisper's remaining dependencies are explicitly included in requirements.txt.
    {
      method: "shell.run",
      params: {
        conda: "conda_env",
        path: "GLM-TTS",
        message: "uv pip install openai-whisper==20240930 --no-build-isolation -c ../requirements.txt {{gpu === 'amd' && platform === 'linux' ? '--no-deps' : ''}}"
      }
    },
    // Install WeTextProcessing without pynini (pynini has no Windows pip wheel)
    {
      method: "shell.run",
      params: {
        conda: "conda_env",
        path: "GLM-TTS",
        message: [
          "uv pip install WeTextProcessing==1.0.3 --no-deps"
        ],
      }
    },
    // Pre-download GLM-TTS model from HuggingFace
    {
      method: "shell.run",
      params: {
        conda: "conda_env",
        path: "GLM-TTS",
        message: [
          "hf download zai-org/GLM-TTS --local-dir=./ckpt"
        ],
      }
    },
    // Check critical imports before marking an installation usable.
    {
      method: "shell.run",
      params: {
        conda: "conda_env",
        path: "GLM-TTS",
        message: "python -c \"import torch, torchaudio, torchvision, whisper, pynini, tn, gradio, onnxruntime\""
      }
    },
    {
      method: "fs.write",
      params: { path: "GLM-TTS/.installed", text: "Installation completed\n" }
    },
    {
      method: "notify",
      params: {
        html: "Installation complete! Click 'Start' to launch GLM-TTS."
      }
    }
  ]
}
