from fastapi import FastAPI
   
app = FastAPI(
        title="EuroScout AI API",
        description="AI-powered EuroLeague scouting platform.",
        version="0.1.0",
    )
    
    
@app.get("/")
def root():
        return {
            "message": "Welcome to EuroScout AI 🚀"
        }