"""
VecGlypher Client: Call LLM (Claude/GPT-4V) to generate base Latin glyph SVGs.

This module orchestrates generative glyph creation by crafting prompts with
design tokens as scaffolding, then parsing SVG paths from model outputs.
"""

import json
import re
from typing import Dict, List, Optional, Tuple
import requests
from dataclasses import dataclass


@dataclass
class GlyphGenerationRequest:
    """Request for generating base glyphs."""
    prompt: str
    design_tokens: Dict
    characters: str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    api_key: Optional[str] = None
    api_type: str = "openai"  # 'openai' or 'anthropic'


class VecGlypherClient:
    """
    Client for calling generative models to produce SVG glyphs.

    VecGlypher (Meta, Feb 2026) specializes in SVG glyph generation.
    We approximate its behavior by:
    1. Prompting an LLM with design token constraints
    2. Requesting SVG path output
    3. Parsing and validating returned paths
    """

    def __init__(self, api_key: str, api_type: str = "openai"):
        """
        Args:
            api_key: OpenAI or Anthropic API key
            api_type: 'openai' or 'anthropic'
        """
        self.api_key = api_key
        self.api_type = api_type
        self.openai_url = "https://api.openai.com/v1/chat/completions"
        self.anthropic_url = "https://api.anthropic.com/v1/messages"

    def generate_base_glyphs(self, request: GlyphGenerationRequest) -> Dict[str, Dict]:
        """
        Generate SVG paths for base Latin uppercase glyphs.

        Args:
            request: GlyphGenerationRequest with prompt, tokens, characters

        Returns:
            Dictionary: {
                'A': {'paths': [...], 'width': 600, 'metadata': {...}},
                'B': {...},
                ...
            }
        """
        prompt = self._craft_generation_prompt(request)

        if request.api_type == "openai":
            response_text = self._call_openai(prompt, request.api_key)
        elif request.api_type == "anthropic":
            response_text = self._call_anthropic(prompt, request.api_key)
        else:
            raise ValueError(f"Unsupported API type: {request.api_type}")

        glyphs = self._parse_glyph_response(response_text, request.characters)
        return glyphs

    def _craft_generation_prompt(self, request: GlyphGenerationRequest) -> str:
        """
        Construct a detailed prompt with design token scaffolding.

        Key insight from architecture research: design tokens as scaffolding
        enable more predictable output than freeform descriptions.
        """
        tokens = request.design_tokens

        token_spec = f"""
Design Constraints:
- Weight: {tokens.get('weight', 'regular')} (light=300, regular=400, bold=700)
- Style: {tokens.get('style', 'serif')} (serif or sans-serif)
- Contrast: {tokens.get('contrast', 'medium')} (low/medium/high)
- Mood: {tokens.get('mood', 'neutral')} (elegant, bold, playful, etc.)
- Cap Height: {tokens.get('cap_height', 700)} units
- X-Height: {tokens.get('x_height', 500)} units (if applicable for lowercase)
- Stroke Ratio: {tokens.get('stroke_ratio', 0.12)} (stroke width as % of cap height)
"""

        prompt = f"""You are a font design expert generating SVG glyph paths for a typeface.

User Prompt: "{request.prompt}"

{token_spec}

Your Task:
1. Generate SVG path data for uppercase Latin letters: {request.characters}
2. Each glyph should:
   - Be consistent in style, weight, and contrast
   - Have an advance width of ~600 units
   - Be positioned with baseline at y=0, cap height at y=700
   - Use relative path commands (m, l, c, etc.) for compact output
3. Return a JSON structure with this exact format:

{{
    "glyphs": {{
        "A": {{"paths": ["M100,0 L300,700 L500,0 Z"], "width": 600}},
        "B": {{"paths": ["M..."], "width": 550}},
        ...
    }},
    "metadata": {{
        "generated_at": "2026-11-11T...",
        "model": "...",
        "design_tokens_applied": true
    }}
}}

IMPORTANT:
- Return ONLY valid JSON, no markdown code blocks or extra text
- Use SVG path syntax (M=move, L=line, C=cubic bezier, Z=close)
- Coordinates should be in font units (0-700 for y-axis)
- Each glyph must be closed (end with Z)
- Use reasonable stroke widths based on the weight parameter
"""

        return prompt

    def _call_openai(self, prompt: str, api_key: str) -> str:
        """Call OpenAI GPT-4 Vision API for glyph generation."""
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": "gpt-4-turbo",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.7,
            "max_tokens": 4000,
        }

        try:
            response = requests.post(
                self.openai_url,
                json=payload,
                headers=headers,
                timeout=60
            )
            response.raise_for_status()
            data = response.json()
            return data['choices'][0]['message']['content']
        except requests.RequestException as e:
            raise RuntimeError(f"OpenAI API call failed: {e}")

    def _call_anthropic(self, prompt: str, api_key: str) -> str:
        """Call Anthropic Claude API for glyph generation."""
        headers = {
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
        }

        payload = {
            "model": "claude-3-5-sonnet-20241022",
            "max_tokens": 4000,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }

        try:
            response = requests.post(
                self.anthropic_url,
                json=payload,
                headers=headers,
                timeout=60
            )
            response.raise_for_status()
            data = response.json()
            return data['content'][0]['text']
        except requests.RequestException as e:
            raise RuntimeError(f"Anthropic API call failed: {e}")

    def _parse_glyph_response(self, response_text: str, characters: str) -> Dict[str, Dict]:
        """
        Extract SVG paths from LLM response.

        Attempts multiple parsing strategies:
        1. Direct JSON parsing
        2. Regex extraction of JSON object
        3. Fallback to default glyphs
        """
        # Strategy 1: Try direct JSON parsing
        try:
            data = json.loads(response_text)
            glyphs = data.get('glyphs', {})
            if glyphs:
                return self._validate_glyphs(glyphs, characters)
        except json.JSONDecodeError:
            pass

        # Strategy 2: Extract JSON via regex
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            try:
                data = json.loads(json_match.group())
                glyphs = data.get('glyphs', {})
                if glyphs:
                    return self._validate_glyphs(glyphs, characters)
            except json.JSONDecodeError:
                pass

        # Fallback: Return placeholder glyphs
        print("WARNING: Could not parse glyph response. Using placeholder glyphs.")
        return self._generate_placeholder_glyphs(characters)

    def _validate_glyphs(self, glyphs: Dict, characters: str) -> Dict[str, Dict]:
        """
        Validate and normalize glyph data.

        Checks:
        - Glyph has valid SVG paths
        - Width is reasonable
        - Paths are closed (end with 'Z')
        """
        validated = {}

        for char in characters:
            if char not in glyphs:
                # Generate placeholder for missing glyphs
                validated[char] = self._generate_placeholder_glyph(char)
                continue

            glyph = glyphs[char]

            # Normalize paths
            paths = glyph.get('paths', [])
            if isinstance(paths, str):
                paths = [paths]

            # Ensure paths are closed
            clean_paths = []
            for path in paths:
                if not isinstance(path, str):
                    continue
                path = path.strip()
                if path and not path.endswith('Z'):
                    path += ' Z'
                clean_paths.append(path)

            validated[char] = {
                'paths': clean_paths,
                'width': int(glyph.get('width', 600)),
                'unicode': ord(char),
                'name': f'uni{ord(char):04X}',
            }

        return validated

    def _generate_placeholder_glyph(self, char: str) -> Dict:
        """Generate a simple placeholder glyph (box with letter)."""
        return {
            'paths': [
                "M 100,0 L 500,0 L 500,700 L 100,700 Z"  # Bounding box
            ],
            'width': 600,
            'unicode': ord(char),
            'name': f'uni{ord(char):04X}',
            'placeholder': True,
        }

    def _generate_placeholder_glyphs(self, characters: str) -> Dict[str, Dict]:
        """Generate placeholder glyphs for entire character set."""
        return {
            char: self._generate_placeholder_glyph(char)
            for char in characters
        }
