module.exports = {
  run: [
    // windows nvidia
    {
      "when": "{{gpu === 'nvidia' && platform === 'win32'}}",
      "method": "shell.run",
      "params": {
        "conda": "{{args && args.conda ? args.conda : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": [
          "uv pip install torch==2.7.0 torchvision==0.22.0 torchaudio==2.7.0 {{args && args.xformers ? 'xformers==0.0.30' : ''}} --index-url https://download.pytorch.org/whl/cu128 --force-reinstall --no-deps",
          "uv pip install triton-windows==3.3.1.post19",
          "uv pip install onnxruntime_gpu==1.19.0",
          "uv pip install https://github.com/6Morpheus6/deepspeed-windows-wheels/releases/download/v0.17.5/deepspeed-0.17.5+e1560d84-2.7torch+cu128-cp310-cp310-win_amd64.whl"
        ]
      },
      "next": null
    },
    // linux nvidia
    {
      "when": "{{gpu === 'nvidia' && platform === 'linux'}}",
      "method": "shell.run",
      "params": {
        "bluefairy": "off",
        "conda": "{{args && args.conda ? args.conda : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": [
          "uv pip install torch==2.7.0 torchvision==0.22.0 torchaudio==2.7.0 {{args && args.xformers ? 'xformers==0.0.30' : ''}} --index-url https://download.pytorch.org/whl/cu128 --force-reinstall",
          "uv pip install numpy==1.26.4",
          "uv pip install triton",
          "uv pip install onnxruntime_gpu==1.19.0",
          "uv pip install ninja",
          "uv pip install deepspeed==0.17.5"
        ]
      },
      "next": null
    },
    // arm64 mac
    {
      "when": "{{platform === 'darwin' && arch === 'arm64'}}",
      "method": "shell.run",
      "params": {
        "conda": "{{args && args.conda ? args.conda : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": [
          "uv pip install torch==2.7.0 torchvision==0.22.0 torchaudio==2.7.0 --index-url https://download.pytorch.org/whl/cpu --force-reinstall --no-deps",
          "uv pip install onnxruntime==1.19.0"
        ]
      },
      "next": null
    },
    // windows cpu
    {
      "method": "shell.run",
      "params": {
        "conda": "{{args && args.conda ? args.conda : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": [
          "uv pip install torch==2.7.0 torchvision==0.22.0 torchaudio==2.7.0 --index-url https://download.pytorch.org/whl/cpu --force-reinstall --no-deps",
          "uv pip install onnxruntime==1.19.0"
        ]
      }
    }
  ]
}
