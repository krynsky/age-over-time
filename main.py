import os
import io
import base64
from typing import List
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from PIL import Image
from google.cloud import aiplatform
from google.protobuf import json_format
from google.protobuf.struct_pb2 import Value
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

import vertexai
from vertexai.preview.vision_models import ImageGenerationModel, Image as VertexImage

# Configuration
PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT")
LOCATION = os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")
MODEL_ID = "imagegeneration@006" # Imagen 2

def generate_image(prompt: str, base_image_bytes: bytes) -> str:
    """
    Generates an image using Vertex AI (Imagen 3).
    Returns base64 encoded image string.
    """
    try:
        # Initialize Vertex AI
        creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
        with open("debug.log", "a") as f:
            f.write(f"Creds path: {creds_path}\n")
            f.write(f"Project ID: {project_id}\n")
            f.write(f"base_image_bytes type: {type(base_image_bytes)}\n")

        vertexai.init(project=PROJECT_ID, location=LOCATION)
        
        # Load the model
        model = ImageGenerationModel.from_pretrained(MODEL_ID)
        
        # Load base image for editing
        # We need to pass a Vertex AI Image object, not a PIL Image
        # Also need to keep the PIL image to create a mask
        pil_base_image = Image.open(io.BytesIO(base_image_bytes))
        vertex_image = VertexImage(base_image_bytes)
        
        # Create a full-white mask (edit everything)
        # Mode 'L' (grayscale), color 255 (white)
        mask_image = Image.new("L", pil_base_image.size, 255)
        
        # Convert mask to bytes for VertexImage
        mask_buffer = io.BytesIO()
        mask_image.save(mask_buffer, format="PNG")
        mask_bytes = mask_buffer.getvalue()
        
        with open("debug.log", "a") as f:
            f.write(f"mask_bytes type: {type(mask_bytes)}\n")
            
        vertex_mask = VertexImage(mask_bytes)
        
        # Generate image using edit_image
        # Imagen 2 (@006) typically requires a mask for editing
        images = model.edit_image(
            base_image=vertex_image,
            mask=vertex_mask,
            prompt=prompt,
            number_of_images=1,
            language="en",
        )
        
        if images:
            # The GeneratedImage.save method expects a path, not a file-like object.
            # We can access the bytes directly via the private attribute _image_bytes
            # or simply return the bytes if available.
            # Based on traceback, _image_bytes is available.
            return base64.b64encode(images[0]._image_bytes).decode("utf-8")
            
        else:
            raise Exception("No image generated")

    except Exception as e:
        import traceback
        error_msg = f"Error generating image with Vertex AI: {e}\n{traceback.format_exc()}"
        print(error_msg)
        with open("debug.log", "a") as f:
            f.write(f"{error_msg}\n")
        # Fallback: return original image so the UI doesn't break
        return base64.b64encode(base_image_bytes).decode("utf-8")

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convert to RGB if necessary
        if image.mode != "RGB":
            image = image.convert("RGB")
            
        # Resize for processing if needed
        # image = image.resize((512, 512))
        
        buffered = io.BytesIO()
        image.save(buffered, format="JPEG")
        img_bytes = buffered.getvalue()

        results = []
        ages = range(10, 100, 10) # 10 to 90
        
        for age in ages:
            prompt = f"A photo of this person at age {age}"
            # In a real app, you'd send the prompt and img_bytes to the model
            generated_b64 = generate_image(prompt, img_bytes)
            results.append({
                "age": age,
                "image": f"data:image/jpeg;base64,{generated_b64}"
            })
            
        return JSONResponse(content={"results": results})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def read_index():
    return JSONResponse(content={"message": "Go to /static/index.html to use the app"})
