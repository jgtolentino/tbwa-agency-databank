from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import httpx
import os
import logging
from supabase import create_client, Client
import asyncio

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="CES Gateway",
    description="Creative Excellence System Gateway - Orchestrates palette analysis and creative intelligence",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
PALETTE_SERVICE_URL = os.getenv("PALETTE_SERVICE_URL", "http://palette-svc:8000")
API_TOKEN = os.getenv("CES_API_TOKEN")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Request/Response models
class AskRequest(BaseModel):
    prompt: str
    limit: Optional[int] = 10
    include_embeddings: Optional[bool] = False

class AskResponse(BaseModel):
    prompt: str
    answers: List[Dict[str, Any]]
    sources: List[str]
    metadata: Optional[Dict[str, Any]] = None

class HealthResponse(BaseModel):
    status: str
    services: Dict[str, str]

# Dependency for API key auth
async def verify_api_key(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = authorization.split(" ")[1]
    if token != API_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid API token")
    return token

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Check health of gateway and upstream services"""
    services_status = {}
    
    # Check Palette Service
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{PALETTE_SERVICE_URL}/health", timeout=5.0)
            services_status["palette_service"] = "healthy" if response.status_code == 200 else "unhealthy"
    except Exception as e:
        services_status["palette_service"] = f"error: {str(e)}"
    
    # Check Supabase
    try:
        result = supabase.table("creative_ops.assets").select("id").limit(1).execute()
        services_status["supabase"] = "healthy"
    except Exception as e:
        services_status["supabase"] = f"error: {str(e)}"
    
    overall_status = "healthy" if all(v == "healthy" for v in services_status.values()) else "degraded"
    
    return HealthResponse(
        status=overall_status,
        services=services_status
    )

@app.post("/ask", response_model=AskResponse, dependencies=[Depends(verify_api_key)])
async def ask_ces(request: AskRequest):
    """Main endpoint for creative intelligence queries"""
    try:
        logger.info(f"Processing query: {request.prompt}")
        
        # Parse the prompt to understand intent
        # TODO: Add NLP processing here
        
        # Example: If prompt mentions colors or palettes, query palette service
        if any(word in request.prompt.lower() for word in ["color", "palette", "pink", "peach", "pantone"]):
            # Query Supabase for relevant assets
            assets_query = supabase.table("creative_ops.assets").select("*")
            
            # If specific campaign mentioned, filter
            if "2024" in request.prompt:
                assets_query = assets_query.filter("created_at", "gte", "2024-01-01")
            
            assets_result = assets_query.limit(request.limit).execute()
            
            # Score each asset with palette service
            scored_assets = []
            for asset in assets_result.data:
                try:
                    async with httpx.AsyncClient() as client:
                        score_response = await client.post(
                            f"{PALETTE_SERVICE_URL}/score",
                            json={"image_url": asset["storage_url"]},
                            headers={"Authorization": f"Bearer {API_TOKEN}"},
                            timeout=10.0
                        )
                        if score_response.status_code == 200:
                            score_data = score_response.json()
                            asset["palette_scores"] = score_data["palette_scores"]
                            asset["dominant_colors"] = score_data["dominant_colors"]
                            scored_assets.append(asset)
                except Exception as e:
                    logger.error(f"Error scoring asset {asset['id']}: {str(e)}")
            
            # Sort by relevance (mock scoring for now)
            scored_assets.sort(key=lambda x: x.get("palette_scores", {}).get("warmth", 0), reverse=True)
            
            return AskResponse(
                prompt=request.prompt,
                answers=scored_assets[:request.limit],
                sources=["creative_ops.assets", "palette_forge_model"],
                metadata={
                    "total_results": len(scored_assets),
                    "query_type": "palette_analysis"
                }
            )
        
        # Default response for other queries
        return AskResponse(
            prompt=request.prompt,
            answers=[{
                "message": "Query type not yet implemented. Supported queries include color/palette analysis."
            }],
            sources=[],
            metadata={"query_type": "unsupported"}
        )
        
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/score", dependencies=[Depends(verify_api_key)])
async def proxy_score(request: Dict[str, Any]):
    """Proxy endpoint to palette service for internal use"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{PALETTE_SERVICE_URL}/score",
                json=request,
                headers={"Authorization": f"Bearer {API_TOKEN}"},
                timeout=30.0
            )
            response.raise_for_status()
            return response.json()
    except Exception as e:
        logger.error(f"Error proxying to palette service: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)