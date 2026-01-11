import os
import shutil
from typing import List
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import chromadb
from chromadb.utils import embedding_functions
import google.generativeai as genai
from dotenv import load_dotenv
from pypdf import PdfReader
from docx import Document

# Load environment variables
load_dotenv()

app = FastAPI()

# Enable CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Gemini Setup
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("Warning: GEMINI_API_KEY not found in .env")
else:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-2.5-flash')

# ChromaDB Setup
chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection(name="hr_docs")

# Models
class QueryRequest(BaseModel):
    question: str

class QueryResponse(BaseModel):
    answer: str
    sources: List[str]

# Helper Functions
def extract_text(file_path: str, filename: str) -> str:
    ext = filename.split('.')[-1].lower()
    text = ""
    try:
        if ext == "pdf":
            reader = PdfReader(file_path)
            for page in reader.pages:
                text += page.extract_text() + "\n"
        elif ext == "docx":
            doc = Document(file_path)
            for para in doc.paragraphs:
                text += para.text + "\n"
        elif ext == "txt":
            with open(file_path, "r", encoding="utf-8") as f:
                text = f.read()
    except Exception as e:
        print(f"Error reading {filename}: {e}")
    return text

def add_to_vector_db(text: str, filename: str):
    # Simple chunking by splitting on newlines or fixed size
    # For a fresher level, let's keep it simple: Split by paragraphs roughly
    chunks = [chunk for chunk in text.split('\n\n') if chunk.strip()]
    if not chunks:
        return
    
    ids = [f"{filename}_{i}" for i in range(len(chunks))]
    metadatas = [{"source": filename} for _ in range(len(chunks))]
    
    # Chroma uses default embedding (all-MiniLM-L6-v2) if none provided
    collection.upsert(
        documents=chunks,
        metadatas=metadatas,
        ids=ids
    )

# API Endpoints
@app.get("/")
def read_root():
    return {"message": "HR Assistant Backend Running"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_location = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Process file
    text = extract_text(file_location, file.filename)
    add_to_vector_db(text, file.filename)
    
    return {"filename": file.filename, "status": "Uploaded and processed"}

@app.get("/documents")
def list_documents():
    files = os.listdir(UPLOAD_DIR)
    return {"documents": files}

@app.post("/query", response_model=QueryResponse)
def query_knowledge_base(request: QueryRequest):
    # Retrieve relevant docs
    results = collection.query(
        query_texts=[request.question],
        n_results=3
    )
    
    if not results['documents'][0]:
        return QueryResponse(answer="I couldn't find any relevant information in the uploaded documents.", sources=[])
    
    context_chunks = results['documents'][0]
    sources = [m['source'] for m in results['metadatas'][0]]
    
    context_text = "\n\n".join(context_chunks)
    
    # Generate Answer
    prompt = f"""You are an HR Assistant. Answer the question based ONLY on the following context.
    If the answer is not in the context, say "I don't know based on the provided documents."
    
    Context:
    {context_text}
    
    Question: {request.question}
    """
    
    try:
        response = model.generate_content(prompt)
        answer = response.text
    except Exception as e:
        print(f"Gemini API Error: {e}")
        answer = "I encountered an error trying to generate an answer. Please check the backend logs."
    
    return QueryResponse(answer=answer, sources=list(set(sources)))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
