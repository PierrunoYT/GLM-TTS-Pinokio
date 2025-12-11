# GLM-TTS Setup Guide for Windows

Complete step-by-step guide to set up and run GLM-TTS on Windows.

## Prerequisites

- Python 3.10 - 3.12
- Git
- Windows 10/11

## Step 1: Clone the Repository

```bash
git clone https://github.com/zai-org/GLM-TTS.git
cd GLM-TTS-Pinokio
```

## Step 2: Create Virtual Environment with uv

```bash
# Create virtual environment
uv venv env --python 3.11

# Activate the environment
env\Scripts\activate
```

## Step 3: Install Dependencies

```bash
# Install all requirements
uv pip install -r GLM-TTS/requirements.txt

# Install ttsfrd (better text processing than WeTextProcessing)
uv pip install ttsfrd

# Install soxr (required by transformers)
uv pip install soxr
```

**Note:** `WeTextProcessing` has been commented out in `requirements.txt` because it requires `pynini` which is difficult to install on Windows. We use `ttsfrd` instead, which works perfectly on Windows.

## Step 4: Download Model Checkpoints

You need to download the pre-trained models before running inference.

### Option A: From HuggingFace (Recommended)

```bash
# Create model directory
mkdir ckpt

# Download models
huggingface-cli download zai-org/GLM-TTS --local-dir ckpt
```

### Option B: From ModelScope

```bash
# Create model directory
mkdir ckpt

# Install modelscope
uv pip install modelscope

# Download models
modelscope download --model ZhipuAI/GLM-TTS --local_dir ckpt
```

## Step 5: Run Inference

Make sure your virtual environment is activated (you should see `(env)` in your prompt).

### Basic Inference

```bash
python GLM-TTS/glmtts_inference.py --data=example_zh --exp_name=_test --use_cache
```

### With Phoneme Support

```bash
python GLM-TTS/glmtts_inference.py --data=example_zh --exp_name=_test --use_cache --phoneme
```

### Web Interface (Gradio)

```bash
python GLM-TTS/tools/gradio_app.py
```

## Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'torch'"

**Solution:** Make sure you activated the virtual environment properly:
```bash
deactivate
env\Scripts\Activate.ps1
```

Then verify Python is from the venv:
```bash
python -c "import sys; print(sys.executable)"
# Should show: D:\Github\GLM-TTS-Pinokio\env\Scripts\python.exe
```

### Issue: "No module named 'soxr'"

**Solution:** Install soxr:
```bash
uv pip install soxr
```

### Issue: "pynini" installation fails

**Solution:** This is expected on Windows. We've already commented out `WeTextProcessing` in the requirements and use `ttsfrd` instead. Make sure `ttsfrd` is installed:
```bash
uv pip install ttsfrd
```

### Issue: Models not found (404 error from HuggingFace)

**Solution:** You need to download the models first (see Step 4 above). The `ckpt` directory must contain:
- speech_tokenizer
- llm (language model)
- flow (flow model)
- vocoder
- frontend resources

## Directory Structure

After setup, your directory should look like:

```
GLM-TTS-Pinokio/
├── env/                    # Virtual environment
├── GLM-TTS/               # Main code
│   ├── glmtts_inference.py
│   ├── requirements.txt
│   └── ...
├── ckpt/                  # Model checkpoints (downloaded)
│   ├── speech_tokenizer/
│   ├── llm/
│   ├── flow/
│   ├── vocoder/
│   └── ...
└── SETUP_GUIDE.md        # This file
```

## Notes

- Always activate the virtual environment before running any scripts
- The first run may take longer as models are loaded into memory
- For GPU acceleration, make sure you have CUDA-compatible PyTorch installed
- Model downloads are large (several GB), ensure you have sufficient disk space and bandwidth

## Quick Reference

```bash
# Activate environment
env\Scripts\activate

# Run inference
python GLM-TTS/glmtts_inference.py --data=example_zh --exp_name=_test --use_cache

# Start web UI
python GLM-TTS/tools/gradio_app.py
```
