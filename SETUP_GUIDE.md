# GLM-TTS Setup Guide

## Recommended: Install via Pinokio

This repo is a [Pinokio](https://pinokio.computer) launcher for [GLM-TTS](https://github.com/zai-org/GLM-TTS). The easiest way to set it up is through Pinokio itself:

1. Open this app in Pinokio and click **Install**.
2. `install.js` will automatically:
   - Clone `zai-org/GLM-TTS`
   - Create a conda environment (`GLM-TTS/conda_env`, Python 3.10.16)
   - Install `pynini` via conda (not available as a Windows pip wheel)
   - Install the pre-patched `requirements.txt` from this repo's root
   - Install `openai-whisper` with `--no-build-isolation`
   - Install `WeTextProcessing` (without its `pynini` dependency, since it was installed via conda)
   - Install PyTorch/CUDA (or ROCm/DirectML/CPU, depending on your GPU) via `torch.js`
   - Download the GLM-TTS model checkpoints from HuggingFace into `GLM-TTS/ckpt`
   - On Windows, patch `tools/gradio_app.py` to bind to `127.0.0.1` instead of `0.0.0.0` (required for the browser to open the UI)
3. Click **Start** to launch the Gradio web UI.

Once installed, the menu also gives you **Update** (git pull), **Save Disk Space** (dedupe the conda env), and **Reset** (revert to a pre-install state).

## Manual Setup (without Pinokio)

If you want to reproduce the same environment by hand:

### Prerequisites

- Conda (Miniconda/Anaconda)
- Git
- `uv` (`pip install uv`)

### Step 1: Clone the Repository

```bash
git clone https://github.com/zai-org/GLM-TTS.git
cd GLM-TTS
```

### Step 2: Create the Conda Environment

```bash
conda create -y -p ./conda_env python=3.10.16
conda run -p ./conda_env conda install -y -c conda-forge pynini
```

### Step 3: Install Dependencies

```bash
conda run -p ./conda_env uv pip install setuptools==69.5.1 wheel
conda run -p ./conda_env uv pip install -r ../requirements.txt
conda run -p ./conda_env uv pip install openai-whisper==20231117 --no-build-isolation
conda run -p ./conda_env uv pip install soxr
conda run -p ./conda_env uv pip install WeTextProcessing==1.0.3 --no-deps
```

**Note:** `requirements.txt` (in this repo's root, not `GLM-TTS/requirements.txt`) already excludes PyTorch, `deepspeed`, `onnxruntime_gpu`, and `openai-whisper`, since those are installed separately with platform-specific settings (see `torch.js`).

### Step 4: Install PyTorch

Pick the command matching your platform/GPU — see `torch.js` for the full matrix (NVIDIA/AMD/CPU on Windows/Linux/macOS). Example for Windows + NVIDIA:

```bash
conda run -p ./conda_env uv pip install torch==2.7.0 torchvision==0.22.0 torchaudio==2.7.0 --index-url https://download.pytorch.org/whl/cu128 --force-reinstall --no-deps
conda run -p ./conda_env uv pip install triton-windows==3.3.1.post19
conda run -p ./conda_env uv pip install onnxruntime_gpu==1.19.0
```

### Step 5: Download Model Checkpoints

```bash
conda run -p ./conda_env hf download zai-org/GLM-TTS --local-dir=./ckpt
```

(Older `huggingface_hub` versions use `huggingface-cli download` instead of `hf download`.)

### Step 6: Run Inference / Web UI

```bash
conda run -p ./conda_env python glmtts_inference.py --data=example_zh --exp_name=_test --use_cache
conda run -p ./conda_env python tools/gradio_app.py
```

On Windows, `tools/gradio_app.py` launches with `server_name="0.0.0.0"`, which browsers can't open directly — either patch it to `127.0.0.1` (as `install.js` does automatically) or connect to the printed local URL shown in the console output.

## Troubleshooting

### Issue: "No module named 'soxr'"

**Solution:** `uv pip install soxr`

### Issue: "pynini" installation fails via pip

**Solution:** This is expected on Windows — `pynini` has no Windows pip wheel. Install it via conda instead: `conda install -y -c conda-forge pynini`, then install `WeTextProcessing` with `--no-deps` so it doesn't try to pull in `pynini` again.

### Issue: Models not found (404 error from HuggingFace)

**Solution:** Download the models first (see Step 5). The `ckpt` directory must contain:
- speech_tokenizer
- llm (language model)
- flow (flow model)
- vocoder
- frontend resources

### Issue: Gradio UI won't open in the browser on Windows

**Solution:** `tools/gradio_app.py` binds to `0.0.0.0` by default, which some Windows browsers can't open directly. Patch it to `127.0.0.1`, or use the Pinokio install flow, which does this automatically.

## Directory Structure

After setup, your directory should look like:

```
GLM-TTS-Pinokio/
├── GLM-TTS/                # Main code (cloned by install.js)
│   ├── conda_env/          # Conda environment
│   ├── ckpt/                # Model checkpoints (downloaded)
│   │   ├── speech_tokenizer/
│   │   ├── llm/
│   │   ├── flow/
│   │   ├── vocoder/
│   │   └── ...
│   ├── glmtts_inference.py
│   └── tools/gradio_app.py
├── requirements.txt         # Pre-patched requirements installed by install.js
└── SETUP_GUIDE.md           # This file
```
