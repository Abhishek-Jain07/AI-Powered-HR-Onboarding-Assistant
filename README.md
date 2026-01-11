# AI-Powered HR Onboarding Assistant

A full-stack RAG (Retrieval-Augmented Generation) application that allows to query HR documents using natural language. Built with Next.js (Frontend), FastAPI (Backend), ChromaDB (Vector Store), and Google Gemini (LLM).

## Features
- **Document Management**: Upload PDF, DOCX, and TXT policy documents.
- **AI Chat**: Ask questions about policies and get accurate answers with citations.
- **RAG Pipeline**: Uses vector search to retrieve relevant context before answering.
- **Modern UI**: Clean, responsive interface built with Tailwind CSS.

## Tech Stack
- **Frontend**: Next.js 15, Tailwind CSS, Lucide React
- **Backend**: Python FastAPI
- **AI/ML**: Google Gemini 2.5 Flash, ChromaDB, PyPDF, Python-Docx

## Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- Google Gemini API Key

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd AI-Powered-HR-Onboarding-Assistant
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

**Configuration**:
1. Copy `.env.example` to `.env`.
2. Add your Gemini API Key to `.env`:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

## Running the Application

You can use the provided PowerShell script (Windows) to run both servers:
```powershell
.\run_app.ps1
```

Or run them manually:

**Backend**:
```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Frontend**:
```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
