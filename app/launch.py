"""Launch the upstream UI without changing its tracked source files."""

import os
from pathlib import Path
import sys


def main():
    # Upstream resolves checkpoints and example audio relative to its repository.
    repository = Path(__file__).resolve().parents[1] / "GLM-TTS"
    os.chdir(repository)
    sys.path.insert(0, str(repository))

    from tools.gradio_app import app
    import gradio as gr

    app.queue().launch(server_name="127.0.0.1", theme=gr.themes.Soft(), share=False)


if __name__ == "__main__":
    main()
