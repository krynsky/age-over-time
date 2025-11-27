import os
import io
import base64
import requests
from typing import List
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from PIL import Image
from dotenv import load_dotenv
import fal_client

# Load environment variables
load_dotenv()

app = FastAPI()

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Configure fal.ai
fal_client.api_key = os.getenv("FAL_KEY")

def generate_image_nano_banana(prompt: str, base_image_bytes: bytes) -> str:
    """
    Generate image using fal.ai's Nano Banana Pro EDIT endpoint with reference image.
    Returns base64 encoded image string.
    """
    try:
        # Encode reference image as data URI
        ref_image_b64 = base64.b64encode(base_image_bytes).decode('utf-8')
        image_data_uri = f"data:image/jpeg;base64,{ref_image_b64}"
        
        with open("debug.log", "a") as f:
            f.write(f"Calling Nano Banana Pro EDIT endpoint via fal.ai\n")
            f.write(f"Prompt: {prompt[:100]}...\n")
            f.write(f"Reference image size: {len(ref_image_b64)} bytes\n")
        
        # Call Nano Banana Pro EDIT endpoint (image-to-image)
        result = fal_client.subscribe(
            "fal-ai/nano-banana-pro/edit",
            arguments={
                "prompt": prompt,
                "image_urls": [image_data_uri],  # Reference image for editing
                "resolution": "2K",  # 2K costs same as 1K ($0.15), 4K costs double ($0.30)
            },
        )
        
        with open("debug.log", "a") as f:
            f.write(f"fal.ai response received\n")
            f.write(f"Result keys: {result.keys() if result else None}\n")
        
        # Extract generated image URL
        if result and "images" in result and len(result["images"]) > 0:
            image_url = result["images"][0]["url"]
            
            with open("debug.log", "a") as f:
                f.write(f"Downloading generated image from: {image_url}\n")
            
            # Download the generated image
            response = requests.get(image_url, timeout=30)
            response.raise_for_status()
            
            with open("debug.log", "a") as f:
                f.write(f"Successfully generated image with Nano Banana Pro EDIT\n")
            
            return base64.b64encode(response.content).decode("utf-8")
        
        # Fallback
        with open("debug.log", "a") as f:
            f.write(f"No images in response, returning original\n")
        return base64.b64encode(base_image_bytes).decode("utf-8")
        
    except Exception as e:
        import traceback
        error_msg = f"Nano Banana Pro error: {e}\n{traceback.format_exc()}"
        with open("debug.log", "a") as f:
            f.write(f"{error_msg}\n")
        # Fallback to original
        return base64.b64encode(base_image_bytes).decode("utf-8")

def generate_image(prompt: str, base_image_bytes: bytes) -> str:
    """
    Main image generation function using Nano Banana Pro EDIT.
    Returns base64 encoded image string.
    """
    return generate_image_nano_banana(prompt, base_image_bytes)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convert to RGB if necessary
        if image.mode != "RGB":
            image = image.convert("RGB")
            
        # Resize for processing
        image = image.resize((1024, 1024))
        
        buffered = io.BytesIO()
        image.save(buffered, format="JPEG")
        img_bytes = buffered.getvalue()

        # All 16 decades for the 4×4 grid
        all_decades = [
            "1880s", "1890s", "1900s", "1910s",
            "1920s", "1930s", "1940s", "1950s",
            "1960s", "1970s", "1980s", "1990s",
            "2000s", "2010s", "2020s", "2030s"
        ]
        
        # Generate prompt for 4×4 grid with all decades
        prompt = """Make a 4×4 grid starting with the 1880s in the top-left, going chronologically left to right, top to bottom, ending with 2030s in bottom-right.

Grid layout (4×4):
Row 1: 1880s, 1890s, 1900s, 1910s
Row 2: 1920s, 1930s, 1940s, 1950s  
Row 3: 1960s, 1970s, 1980s, 1990s
Row 4: 2000s, 2010s, 2020s, 2030s

In each section, show this person styled according to that specific decade:
- Period-accurate clothing, fashion, and accessories for each decade
- Era-appropriate hairstyle and grooming typical of that decade
- Photography style matching each decade (sepia for 1880s-1920s, black and white for 1930s-1950s, color for 1960s onwards)
- Period-correct background, props, and lighting for each era
- Authentic film grain and color treatment appropriate to each decade

Keep the person's facial features, bone structure, and identity clearly recognizable across all 16 sections while applying the decade-specific styling."""
        
        # Generate the 4×4 grid image
        generated_b64 = generate_image(prompt, img_bytes)
        
        # Return the grid with all decades
        return JSONResponse(content={
            "grid_image": f"data:image/jpeg;base64,{generated_b64}",
            "decades": all_decades  # All 16 decades
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def read_index():
    return JSONResponse(content={"message": "Go to /static/index.html to use the app"})
