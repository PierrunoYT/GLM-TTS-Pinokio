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
          "uv pip install torch==2.7.0 torchvision==0.22.0 torchaudio==2.7.0 {{args && args.xformers ? 'xformers==0.0.30' : ''}} --index https://download.pytorch.org/whl/cu128 --index-strategy unsafe-first-match --reinstall-package torch --reinstall-package torchvision --reinstall-package torchaudio -c ../requirements.txt",
          "uv pip install triton-windows==3.3.1.post19",
          "uv pip install onnxruntime_gpu==1.19.0 -c ../requirements.txt",
          "uv pip install https://github.com/6Morpheus6/deepspeed-windows-wheels/releases/download/v0.17.5/deepspeed-0.17.5+e1560d84-2.7torch_cu128-cp310-cp310-win_amd64.whl -c ../requirements.txt"
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
          "uv pip install torch==2.7.0 torchvision==0.22.0 torchaudio==2.7.0 {{args && args.xformers ? 'xformers==0.0.30' : ''}} --index https://download.pytorch.org/whl/cu128 --index-strategy unsafe-first-match --reinstall-package torch --reinstall-package torchvision --reinstall-package torchaudio -c ../requirements.txt",
          "uv pip install onnxruntime_gpu==1.19.0 -c ../requirements.txt",
          "uv pip install ninja",
          "uv pip install deepspeed==0.17.5 -c ../requirements.txt"
        ]
      },
      "next": null
    },
    // AMD Windows uses CPU: upstream does not select a DirectML device.
    {
      "when": "{{gpu === 'amd' && platform === 'win32'}}",
      "method": "shell.run",
      "params": {
        "conda": "{{args && args.conda ? args.conda : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": [
          "uv pip install torch==2.7.0 torchvision==0.22.0 torchaudio==2.7.0 --index https://download.pytorch.org/whl/cpu --index-strategy unsafe-first-match --reinstall-package torch --reinstall-package torchvision --reinstall-package torchaudio -c ../requirements.txt",
          "uv pip install onnxruntime==1.19.0 -c ../requirements.txt"
        ]
      },
      "next": null
    },
    // amd linux (rocm)
    {
      "when": "{{gpu === 'amd' && platform === 'linux'}}",
      "method": "shell.run",
      "params": {
        "conda": "{{args && args.conda ? args.conda : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": [
          "uv pip install torch==2.7.0 torchvision==0.22.0 torchaudio==2.7.0 --index https://download.pytorch.org/whl/rocm6.3 --index-strategy unsafe-first-match --reinstall-package torch --reinstall-package torchvision --reinstall-package torchaudio -c ../requirements.txt",
          "uv pip install onnxruntime==1.19.0 -c ../requirements.txt"
        ]
      },
      "next": null
    },
    // apple silicon mac
    {
      "when": "{{platform === 'darwin' && arch === 'arm64'}}",
      "method": "shell.run",
      "params": {
        "conda": "{{args && args.conda ? args.conda : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": [
          "uv pip install torch==2.7.0 torchvision==0.22.0 torchaudio==2.7.0 -c ../requirements.txt",
          "uv pip install onnxruntime==1.19.0 -c ../requirements.txt"
        ]
      },
      "next": null
    },
    // intel mac
    {
      "when": "{{platform === 'darwin' && arch !== 'arm64'}}",
      "method": "shell.run",
      "params": {
        "conda": "{{args && args.conda ? args.conda : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": [
          "uv pip install torch==2.2.2 torchvision==0.17.2 torchaudio==2.2.2 -c ../requirements.txt",
          "uv pip install onnxruntime==1.19.0 -c ../requirements.txt"
        ]
      },
      "next": null
    },
    // cpu fallback
    {
      "method": "shell.run",
      "params": {
        "conda": "{{args && args.conda ? args.conda : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": [
          "uv pip install torch==2.7.0 torchvision==0.22.0 torchaudio==2.7.0 --index https://download.pytorch.org/whl/cpu --index-strategy unsafe-first-match --reinstall-package torch --reinstall-package torchvision --reinstall-package torchaudio -c ../requirements.txt",
          "uv pip install onnxruntime==1.19.0 -c ../requirements.txt"
        ]
      }
    }
  ]
}
