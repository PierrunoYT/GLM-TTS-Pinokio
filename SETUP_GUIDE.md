# GLM-TTS Setup Guide

This repository launches [GLM-TTS](https://github.com/zai-org/GLM-TTS) through
[Pinokio](https://pinokio.computer). Upstream code is downloaded into `GLM-TTS/`;
the launcher's `app/launch.py` configures the local server.

## Install and run

1. Open this repository in Pinokio and click **Install**.
2. Installation clones the application if needed, creates `GLM-TTS/conda_env`
   with Python 3.10.16, and installs Pynini and FFmpeg through Conda.
3. It installs the selected PyTorch backend, launcher requirements, Whisper
   20240930, and WeTextProcessing 1.0.3, then downloads models to `GLM-TTS/ckpt`.
4. Critical Python imports are checked before `GLM-TTS/.installed` is written.
5. Click **Start**, then **Open Web UI**. Upload reference speech, enter its
   transcript and the text to synthesize, then generate audio.

The server binds to `127.0.0.1`. Gradio selects an available port; use the URL
shown in Pinokio. The launcher imports the upstream UI without modifying it.

## Platform behavior

| Platform | Selected backend |
| --- | --- |
| Windows/Linux with NVIDIA | PyTorch 2.7.0, CUDA 12.8; CPU ONNX Runtime on Linux ARM64 |
| Linux with AMD | PyTorch 2.7.0, ROCm 6.3; CPU ONNX Runtime |
| Windows with AMD | CPU; upstream does not select DirectML devices |
| Apple Silicon | PyTorch 2.7.0 from PyPI; upstream currently selects CPU |
| Intel Mac | Legacy PyTorch 2.2.2 from PyPI |
| Other Windows/Linux systems | PyTorch 2.7.0 CPU |

NVIDIA is the primary deployment path. Dependency resolution is not an inference
test: GPU drivers, supported ROCm hardware, and model compatibility still matter.
Intel Mac uses an older PyTorch because newer wheels are unavailable; compatibility
with current upstream checkpoint loading is not guaranteed. This launcher does
not disable checkpoint-loading security checks.

## Maintenance and recovery

- **Install** resumes dependencies and model downloads when the clone exists.
  Existing installations without the completion marker need one Install run.
- **Update** fast-forwards both repositories and reruns installation. Local changes
  or diverged branches may prevent a pull; inspect the Git diff before resolving.
- **Save Disk Space** invokes Pinokio's environment deduplication.
- **Reset** deletes all of `GLM-TTS/`, including checkpoints, the environment,
  local edits, and outputs saved there. Back up needed files.
- An interrupted clone can be removed with **Reset incomplete installation**.

Older versions patched `GLM-TTS/tools/gradio_app.py` on Windows. If that change
blocks Update, inspect `git -C GLM-TTS diff -- tools/gradio_app.py` and revert only
the obsolete binding edit, preserving your own changes.

## Manual setup

Run from a checkout of **this launcher repository**, with Git, Conda, and uv
available. Keep using the same shell after activating the environment.

```sh
git clone https://github.com/zai-org/GLM-TTS.git
conda create -y -p ./GLM-TTS/conda_env python=3.10.16
conda activate ./GLM-TTS/conda_env
conda install -y -c conda-forge pynini ffmpeg
cd GLM-TTS
```

Run the commands in the matching branch of `../torch.js` first. They select the
backend and install ONNX Runtime and, for NVIDIA, DeepSpeed. Omit the optional
Pinokio xformers template expression when copying a command into a shell.
Then run:

```sh
uv pip install setuptools==69.5.1 wheel
uv pip install -r ../requirements.txt
uv pip install openai-whisper==20240930 --no-build-isolation -c ../requirements.txt
uv pip install WeTextProcessing==1.0.3 --no-deps
hf download zai-org/GLM-TTS --local-dir=./ckpt
python ../app/launch.py
```

On Linux with AMD, append `--no-deps` to the Whisper command to preserve ROCm's
Triton. Its other dependencies are in `requirements.txt`. WeTextProcessing uses
Conda's Pynini instead of its older pip pin; `importlib-resources` is explicit.
`pip check` may report that intentional Pynini version difference, or Whisper's
Triton distribution name on ROCm.

Manual setup does not create Pinokio's completion marker. Run **Install** in
Pinokio to validate and register an existing manual installation.

## Troubleshooting

Check `logs/api/install.js/latest` or `logs/api/start.js/latest` first.

- Missing packages: rerun Install; manual commands must use the Conda environment.
- Model download failure: rerun Install to resume. Preserve the downloaded
  repository layout under `ckpt` instead of creating guessed model subdirectories.
- Browser connection failure: use the URL reported by the current Start session.
- Update conflict: inspect local Git changes; Update does not discard them.

## Development checks

```sh
node --test tests/launcher.test.js
python -m unittest discover -s tests -p "test_*.py"
```

These cover menu transitions, readiness URL capture, and the Python entry point
with a mocked UI. They do not load models or exercise real inference.
