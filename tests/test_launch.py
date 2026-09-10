"""Exercise launch behavior without downloading the model or importing torch."""

import importlib.util
from pathlib import Path
import sys
import types
import unittest
from unittest.mock import Mock, patch


class LaunchTests(unittest.TestCase):
    def test_local_launch_preserves_upstream_files_and_automatic_port(self):
        root = Path(__file__).resolve().parents[1]
        spec = importlib.util.spec_from_file_location("launcher", root / "app/launch.py")
        launcher = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(launcher)
        app = Mock()
        gradio = types.SimpleNamespace(themes=types.SimpleNamespace(Soft=lambda: "theme"))
        modules = {"tools": types.ModuleType("tools"),
                   "tools.gradio_app": types.SimpleNamespace(app=app), "gradio": gradio}
        with patch.dict(sys.modules, modules), patch.object(sys, "path", sys.path.copy()), \
                patch.object(launcher.os, "chdir") as chdir:
            launcher.main()
            chdir.assert_called_once_with(root / "GLM-TTS")
            self.assertEqual(sys.path[0], str(root / "GLM-TTS"))
        app.queue.assert_called_once_with()
        app.queue.return_value.launch.assert_called_once_with(
            server_name="127.0.0.1", theme="theme", share=False)


if __name__ == "__main__":
    unittest.main()
